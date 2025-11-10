const db = require('../config/database');

class Mentor {
  // Get all mentors
  static async getAll() {
    const [mentors] = await db.query(
      `SELECT user_id, email, full_name, phone, organization, bio, 
              profile_image, is_active, created_at, last_login
       FROM users 
       WHERE user_type = 'mentor'
       ORDER BY full_name ASC`
    );
    return mentors;
  }

  // Get mentor by ID
  static async getById(mentorId) {
    const [mentors] = await db.query(
      `SELECT user_id, email, full_name, phone, organization, bio, 
              profile_image, is_active, created_at, last_login
       FROM users 
       WHERE user_id = ? AND user_type = 'mentor'`,
      [mentorId]
    );
    return mentors[0];
  }

  // Create new mentor
  static async create(mentorData) {
    const { email, password_hash, full_name, phone, organization, bio } = mentorData;
    
    const [result] = await db.query(
      `INSERT INTO users (email, password_hash, full_name, user_type, phone, organization, bio)
       VALUES (?, ?, ?, 'mentor', ?, ?, ?)`,
      [email, password_hash, full_name, phone, organization, bio]
    );
    
    return result.insertId;
  }

  // Update mentor
  static async update(mentorId, mentorData) {
    const { full_name, phone, organization, bio, is_active } = mentorData;
    
    await db.query(
      `UPDATE users 
       SET full_name = ?, phone = ?, organization = ?, bio = ?, is_active = ?
       WHERE user_id = ? AND user_type = 'mentor'`,
      [full_name, phone, organization, bio, is_active, mentorId]
    );
    
    return this.getById(mentorId);
  }

  // Delete mentor
  static async delete(mentorId) {
    await db.query(
      'DELETE FROM users WHERE user_id = ? AND user_type = ?',
      [mentorId, 'mentor']
    );
  }

  // Assign mentor to team
  static async assignToTeam(mentorId, teamId, assignedBy, notes = null) {
    // First check if team already has a mentor assigned
    const [existingAssignment] = await db.query(
      `SELECT mentor_id, m.full_name as mentor_name
       FROM mentor_team_assignments mta
       JOIN users m ON mta.mentor_id = m.user_id
       WHERE mta.team_id = ? AND mta.is_active = TRUE`,
      [teamId]
    );

    if (existingAssignment.length > 0) {
      const existing = existingAssignment[0];
      // If trying to assign a different mentor, throw error
      if (existing.mentor_id !== mentorId) {
        const error = new Error(`This team is already assigned to ${existing.mentor_name}. A team can only have one mentor.`);
        error.code = 'TEAM_ALREADY_HAS_MENTOR';
        throw error;
      }
      // If same mentor, just update the notes
    }

    const [result] = await db.query(
      `INSERT INTO mentor_team_assignments (mentor_id, team_id, assigned_by, notes)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE is_active = TRUE, notes = VALUES(notes)`,
      [mentorId, teamId, assignedBy, notes]
    );
    return result;
  }

  // Remove mentor from team
  static async removeFromTeam(mentorId, teamId) {
    await db.query(
      'DELETE FROM mentor_team_assignments WHERE mentor_id = ? AND team_id = ?',
      [mentorId, teamId]
    );
  }

  // Get teams assigned to mentor
  static async getAssignedTeams(mentorId) {
    const [teams] = await db.query(
      `SELECT 
        t.*,
        h.title as hackathon_title,
        h.submission_deadline,
        u.full_name as leader_name,
        u.email as leader_email,
        (SELECT COUNT(*) FROM team_members WHERE team_id = t.team_id) as member_count
       FROM mentor_team_assignments mta
       JOIN teams t ON mta.team_id = t.team_id
       JOIN hackathons h ON t.hackathon_id = h.hackathon_id
       JOIN users u ON t.team_leader_id = u.user_id
       WHERE mta.mentor_id = ? AND mta.is_active = TRUE
       ORDER BY t.created_at DESC`,
      [mentorId]
    );
    return teams;
  }

  // Get mentor's assigned teams with hackathon details
  static async getAssignedHackathons(mentorId) {
    const [hackathons] = await db.query(
      `SELECT DISTINCT
        h.*,
        COUNT(DISTINCT t.team_id) as assigned_teams_count
       FROM mentor_team_assignments mta
       JOIN teams t ON mta.team_id = t.team_id
       JOIN hackathons h ON t.hackathon_id = h.hackathon_id
       WHERE mta.mentor_id = ? AND mta.is_active = TRUE
       GROUP BY h.hackathon_id
       ORDER BY h.submission_deadline DESC`,
      [mentorId]
    );
    return hackathons;
  }

  // Get teams for a specific mentor-hackathon combination
  static async getTeamsByMentorAndHackathon(mentorId, hackathonId) {
    const [teams] = await db.query(
      `SELECT 
        t.*,
        u.full_name as leader_name,
        u.email as leader_email,
        (SELECT COUNT(*) FROM team_members WHERE team_id = t.team_id) as member_count
       FROM mentor_team_assignments mta
       JOIN teams t ON mta.team_id = t.team_id
       JOIN users u ON t.team_leader_id = u.user_id
       WHERE mta.mentor_id = ? AND t.hackathon_id = ? AND mta.is_active = TRUE
       ORDER BY t.team_name ASC`,
      [mentorId, hackathonId]
    );
    return teams;
  }

  // Schedule meeting
  static async scheduleMeeting(meetingData) {
    const { mentor_id, team_id, meeting_title, meeting_link, meeting_date, description } = meetingData;
    
    const [result] = await db.query(
      `INSERT INTO scheduled_meetings (mentor_id, team_id, meeting_title, meeting_link, meeting_date, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [mentor_id, team_id, meeting_title, meeting_link, meeting_date, description]
    );
    
    return result.insertId;
  }

  // Get meetings for team
  static async getTeamMeetings(teamId) {
    const [meetings] = await db.query(
      `SELECT 
        sm.*,
        u.full_name as mentor_name,
        u.email as mentor_email
       FROM scheduled_meetings sm
       JOIN users u ON sm.mentor_id = u.user_id
       WHERE sm.team_id = ?
       ORDER BY sm.meeting_date ASC`,
      [teamId]
    );
    return meetings;
  }

  // Get meetings for mentor
  static async getMentorMeetings(mentorId) {
    const [meetings] = await db.query(
      `SELECT 
        sm.*,
        t.team_name,
        t.team_code
       FROM scheduled_meetings sm
       JOIN teams t ON sm.team_id = t.team_id
       WHERE sm.mentor_id = ?
       ORDER BY sm.meeting_date ASC`,
      [mentorId]
    );
    return meetings;
  }

  // Send communication to team
  static async sendCommunication(communicationData) {
    const { team_id, mentor_id, message_text, file_url, file_name } = communicationData;
    
    const [result] = await db.query(
      `INSERT INTO team_mentor_communications (team_id, mentor_id, sender_type, message_text, file_url, file_name)
       VALUES (?, ?, 'mentor', ?, ?, ?)`,
      [team_id, mentor_id, message_text, file_url, file_name]
    );
    
    return result.insertId;
  }

  // Get communications between team and mentor
  static async getCommunications(teamId, mentorId) {
    const [communications] = await db.query(
      `SELECT * FROM team_mentor_communications
       WHERE team_id = ? AND mentor_id = ?
       AND (
         deleted_for_everyone = FALSE 
         AND (
           (sender_type = 'mentor' AND deleted_for_sender = FALSE)
           OR (sender_type = 'team' AND deleted_for_receiver = FALSE)
         )
       )
       ORDER BY created_at DESC`,
      [teamId, mentorId]
    );
    
    // Parse reactions JSON for each communication
    return communications.map(comm => ({
      ...comm,
      reactions: comm.reactions ? (typeof comm.reactions === 'string' ? JSON.parse(comm.reactions) : comm.reactions) : {}
    }));
  }

  // Add reaction to a message
  static async addReaction(communicationId, userId, emoji) {
    // Get current reactions
    const [rows] = await db.query(
      'SELECT reactions FROM team_mentor_communications WHERE communication_id = ?',
      [communicationId]
    );

    if (rows.length === 0) {
      throw new Error('Message not found');
    }

    let reactions = rows[0].reactions || {};
    
    // If reactions is a string, parse it
    if (typeof reactions === 'string') {
      reactions = JSON.parse(reactions);
    }

    // Toggle reaction: if user already reacted with same emoji, remove it; otherwise add/update
    const userIdStr = userId.toString();
    if (reactions[userIdStr] === emoji) {
      delete reactions[userIdStr];
    } else {
      reactions[userIdStr] = emoji;
    }

    // Update in database
    await db.query(
      'UPDATE team_mentor_communications SET reactions = ? WHERE communication_id = ?',
      [JSON.stringify(reactions), communicationId]
    );

    return reactions;
  }

  // Delete message for me (mentor)
  static async deleteMessageForMe(communicationId, userId) {
    // Check if message was sent by this user
    const [rows] = await db.query(
      'SELECT sender_type FROM team_mentor_communications WHERE communication_id = ?',
      [communicationId]
    );

    if (rows.length === 0) {
      throw new Error('Message not found');
    }

    const isSender = rows[0].sender_type === 'mentor';
    const column = isSender ? 'deleted_for_sender' : 'deleted_for_receiver';

    await db.query(
      `UPDATE team_mentor_communications SET ${column} = TRUE WHERE communication_id = ?`,
      [communicationId]
    );

    return { success: true };
  }

  // Delete message for everyone
  static async deleteMessageForEveryone(communicationId, userId) {
    // Only sender can delete for everyone
    const [rows] = await db.query(
      'SELECT sender_type, mentor_id, created_at FROM team_mentor_communications WHERE communication_id = ?',
      [communicationId]
    );

    if (rows.length === 0) {
      throw new Error('Message not found');
    }

    const message = rows[0];
    
    // Check if user is the sender
    if (message.sender_type !== 'mentor' || message.mentor_id !== userId) {
      throw new Error('Only the sender can delete message for everyone');
    }

    // Check if message is older than 1 hour (optional: you can remove this check)
    const messageTime = new Date(message.created_at);
    const now = new Date();
    const hoursDiff = (now - messageTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 1) {
      throw new Error('Cannot delete messages older than 1 hour for everyone');
    }

    await db.query(
      'UPDATE team_mentor_communications SET deleted_for_everyone = TRUE, deleted_at = NOW() WHERE communication_id = ?',
      [communicationId]
    );

    return { success: true };
  }
}

module.exports = Mentor;
