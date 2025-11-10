const db = require('../config/database');

class Team {
  // Create a new team
  static async create(teamData, memberEmails, memberNames, leaderUserId) {
    const connection = await db.getConnection();
    
    try {
      // Ensure autocommit is off for this connection
      await connection.query('SET autocommit=0');
      await connection.beginTransaction();
      console.log(`[Team.create] Starting team creation for leader ${leaderUserId}, hackathon ${teamData.hackathon_id}`);

      // Check if leader is already in a team for this hackathon
      // Don't use FOR UPDATE to avoid lock timeouts
      const [existingMembership] = await connection.query(
        `SELECT tm.team_id FROM team_members tm
         JOIN teams t ON tm.team_id = t.team_id
         WHERE tm.user_id = ? AND t.hackathon_id = ?`,
        [leaderUserId, teamData.hackathon_id]
      );

      if (existingMembership.length > 0) {
        console.log(`[Team.create] Leader ${leaderUserId} already in team ${existingMembership[0].team_id}`);
        await connection.rollback();
        connection.release();
        throw new Error('You are already in a team for this hackathon');
      }
      
      console.log(`[Team.create] No existing membership found, proceeding with team creation`);

      // Insert team
      const [teamResult] = await connection.query(
        `INSERT INTO teams (team_name, hackathon_id, team_leader_id, description) 
         VALUES (?, ?, ?, ?)`,
        [
          teamData.team_name,
          teamData.hackathon_id,
          leaderUserId,
          teamData.description || null
        ]
      );

      const teamId = teamResult.insertId;
      console.log(`[Team.create] Team created with ID: ${teamId}`);

      // Add team leader as member (using INSERT IGNORE to handle duplicates gracefully)
      console.log(`[Team.create] Adding leader ${leaderUserId} to team ${teamId}`);
      await connection.query(
        `INSERT IGNORE INTO team_members (team_id, user_id, is_leader, status) 
         VALUES (?, ?, TRUE, 'active')`,
        [teamId, leaderUserId]
      );
      console.log(`[Team.create] Leader added successfully`);

      // Add other team members
      for (let i = 0; i < memberEmails.length; i++) {
        const email = memberEmails[i];
        const name = memberNames && memberNames[i] ? memberNames[i] : email.split('@')[0];
        
        // Find or create user for each member
        const [userRows] = await connection.query(
          'SELECT user_id FROM users WHERE email = ?',
          [email]
        );

        let userId;
        if (userRows.length > 0) {
          userId = userRows[0].user_id;
        } else {
          // Create a placeholder user for team members who haven't registered yet
          // Use a random placeholder password hash (they can't login until they register)
          const placeholderHash = '$2a$10$PLACEHOLDER.HASH.FOR.INACTIVE.USER.CANNOT.LOGIN';
          const [userResult] = await connection.query(
            `INSERT INTO users (email, password_hash, full_name, user_type, is_active) 
             VALUES (?, ?, ?, 'team_member', FALSE)`,
            [email, placeholderHash, name]
          );
          userId = userResult.insertId;
        }

        // Add as team member (using INSERT IGNORE to handle duplicates gracefully)
        await connection.query(
          `INSERT IGNORE INTO team_members (team_id, user_id, is_leader, status) 
           VALUES (?, ?, FALSE, 'active')`,
          [teamId, userId]
        );
      }

      await connection.commit();
      console.log(`[Team.create] Transaction committed successfully`);

      // Fetch the created team with members
      return await this.getTeamWithMembers(teamId);
    } catch (error) {
      console.log(`[Team.create] Error occurred, rolling back transaction:`, error.message);
      await connection.rollback();
      console.log(`[Team.create] Rollback completed`);
      throw error;
    } finally {
      connection.release();
      console.log(`[Team.create] Connection released`);
    }
  }

  // Get team with members
  static async getTeamWithMembers(teamId) {
    try {
      const [teamRows] = await db.query(
        `SELECT t.*, h.title as hackathon_title, h.max_team_size, h.min_team_size,
                u.full_name as leader_name, u.email as leader_email
         FROM teams t
         JOIN hackathons h ON t.hackathon_id = h.hackathon_id
         JOIN users u ON t.team_leader_id = u.user_id
         WHERE t.team_id = ?`,
        [teamId]
      );

      if (teamRows.length === 0) {
        return null;
      }

      const team = teamRows[0];

      // Get team members
      const [members] = await db.query(
        `SELECT tm.member_id, tm.team_id, tm.user_id, tm.is_leader, tm.status, tm.joined_at,
                u.full_name, u.email, u.user_type
         FROM team_members tm
         JOIN users u ON tm.user_id = u.user_id
         WHERE tm.team_id = ?
         ORDER BY tm.is_leader DESC, tm.joined_at`,
        [teamId]
      );

      team.members = members;
      return team;
    } catch (error) {
      throw error;
    }
  }

  // Get teams by hackathon
  static async getByHackathon(hackathonId) {
    try {
      const [teams] = await db.query(
        `SELECT t.*, u.full_name as leader_name, u.email as leader_email,
                COUNT(tm.member_id) as member_count
         FROM teams t
         JOIN users u ON t.team_leader_id = u.user_id
         LEFT JOIN team_members tm ON t.team_id = tm.team_id
         WHERE t.hackathon_id = ?
         GROUP BY t.team_id
         ORDER BY t.created_at DESC`,
        [hackathonId]
      );
      return teams;
    } catch (error) {
      throw error;
    }
  }

  // Get teams by user (as member or leader)
  static async getByUser(userId) {
    try {
      const [teams] = await db.query(
        `SELECT DISTINCT t.*, h.title as hackathon_title, h.status as hackathon_status,
                h.submission_deadline, h.leaderboard_finalized, h.leaderboard_finalized_at,
                u.full_name as leader_name,
                COUNT(DISTINCT tm.member_id) as member_count,
                COUNT(DISTINCT s.submission_id) as submission_count
         FROM teams t
         JOIN hackathons h ON t.hackathon_id = h.hackathon_id
         JOIN users u ON t.team_leader_id = u.user_id
         JOIN team_members tm2 ON t.team_id = tm2.team_id
         LEFT JOIN team_members tm ON t.team_id = tm.team_id
         LEFT JOIN submissions s ON t.team_id = s.team_id AND t.hackathon_id = s.hackathon_id
         WHERE tm2.user_id = ?
         GROUP BY t.team_id
         ORDER BY t.created_at DESC`,
        [userId]
      );
      return teams;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is already in a team for a hackathon
  static async isUserInTeamForHackathon(userId, hackathonId) {
    try {
      console.log(`[isUserInTeamForHackathon] Checking user ${userId} for hackathon ${hackathonId}`);
      const [rows] = await db.query(
        `SELECT t.team_id 
         FROM teams t
         JOIN team_members tm ON t.team_id = tm.team_id
         WHERE tm.user_id = ? AND t.hackathon_id = ?`,
        [userId, hackathonId]
      );
      console.log(`[isUserInTeamForHackathon] Found ${rows.length} teams`);
      if (rows.length > 0) {
        console.log(`[isUserInTeamForHackathon] User is in team(s):`, rows.map(r => r.team_id));
      }
      return rows.length > 0;
    } catch (error) {
      console.log(`[isUserInTeamForHackathon] Error:`, error.message);
      throw error;
    }
  }

  // Update team
  static async update(teamId, updateData) {
    try {
      const [result] = await db.query(
        `UPDATE teams SET ? WHERE team_id = ?`,
        [updateData, teamId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete team
  static async delete(teamId) {
    try {
      const [result] = await db.query(
        'DELETE FROM teams WHERE team_id = ?',
        [teamId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get team's assigned mentor
  static async getTeamMentor(teamId) {
    const [mentors] = await db.query(
      `SELECT 
        u.user_id, u.full_name, u.email, u.phone, u.organization
       FROM mentor_team_assignments mta
       JOIN users u ON mta.mentor_id = u.user_id
       WHERE mta.team_id = ? AND mta.is_active = TRUE
       LIMIT 1`,
      [teamId]
    );
    return mentors[0] || null;
  }

  // Get team's scheduled meetings
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

  // Send communication to mentor
  static async sendCommunicationToMentor(communicationData) {
    const { team_id, mentor_id, message_text, file_url, file_name } = communicationData;
    
    const [result] = await db.query(
      `INSERT INTO team_mentor_communications (team_id, mentor_id, sender_type, message_text, file_url, file_name)
       VALUES (?, ?, 'team', ?, ?, ?)`,
      [team_id, mentor_id, message_text, file_url, file_name]
    );
    
    return result.insertId;
  }

  // Get communications with mentor
  static async getCommunicationsWithMentor(teamId, mentorId) {
    const [communications] = await db.query(
      `SELECT * FROM team_mentor_communications
       WHERE team_id = ? AND mentor_id = ?
       AND (
         deleted_for_everyone = FALSE 
         AND (
           (sender_type = 'team' AND deleted_for_sender = FALSE)
           OR (sender_type = 'mentor' AND deleted_for_receiver = FALSE)
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

  // Delete message for me (team) - using userId to check if they're the sender
  static async deleteMessageForMe(communicationId, userId) {
    console.log('[deleteMessageForMe] Starting - communicationId:', communicationId, 'userId:', userId);
    
    // First, get the message details
    const [rows] = await db.query(
      'SELECT sender_type, team_id FROM team_mentor_communications WHERE communication_id = ?',
      [communicationId]
    );

    console.log('[deleteMessageForMe] Message query result:', rows);

    if (!rows || rows.length === 0) {
      console.log('[deleteMessageForMe] ERROR: Message not found');
      throw new Error('Message not found');
    }

    const messageTeamId = rows[0].team_id;
    console.log('[deleteMessageForMe] Message team_id:', messageTeamId);

    // Verify the user is a member of THIS specific team (the one in the message)
    const [userTeam] = await db.query(
      'SELECT team_id FROM team_members WHERE user_id = ? AND team_id = ?',
      [userId, messageTeamId]
    );

    console.log('[deleteMessageForMe] userTeam query result:', userTeam);

    if (!userTeam || userTeam.length === 0) {
      console.log('[deleteMessageForMe] ERROR: User is not a team member of team', messageTeamId);
      throw new Error('User is not a member of this team');
    }

    const isSender = rows[0].sender_type === 'team';
    const column = isSender ? 'deleted_for_sender' : 'deleted_for_receiver';

    console.log('[deleteMessageForMe] isSender:', isSender, 'column:', column);

    await db.query(
      `UPDATE team_mentor_communications SET ${column} = TRUE WHERE communication_id = ?`,
      [communicationId]
    );

    console.log('[deleteMessageForMe] SUCCESS: Message deleted');
    return { success: true };
  }

  // Delete message for everyone (team) - using userId
  static async deleteMessageForEveryone(communicationId, userId) {
    console.log('[deleteMessageForEveryone] Starting - communicationId:', communicationId, 'userId:', userId);
    
    // First, get the message details
    const [rows] = await db.query(
      'SELECT sender_type, team_id, created_at FROM team_mentor_communications WHERE communication_id = ?',
      [communicationId]
    );

    console.log('[deleteMessageForEveryone] Message query result:', rows);

    if (!rows || rows.length === 0) {
      console.log('[deleteMessageForEveryone] ERROR: Message not found');
      throw new Error('Message not found');
    }

    const message = rows[0];
    const messageTeamId = message.team_id;
    console.log('[deleteMessageForEveryone] Message:', message);
    
    // Verify the user is a member of THIS specific team (the one in the message)
    const [userTeam] = await db.query(
      'SELECT team_id FROM team_members WHERE user_id = ? AND team_id = ?',
      [userId, messageTeamId]
    );

    console.log('[deleteMessageForEveryone] userTeam query result:', userTeam);

    if (!userTeam || userTeam.length === 0) {
      console.log('[deleteMessageForEveryone] ERROR: User is not a member of team', messageTeamId);
      throw new Error('User is not a member of this team');
    }

    // Check if team is the sender
    if (message.sender_type !== 'team') {
      console.log('[deleteMessageForEveryone] ERROR: Not sender - sender_type:', message.sender_type);
      throw new Error('Only the sender can delete message for everyone');
    }

    // Check if message is older than 1 hour (optional: you can remove this check)
    const messageTime = new Date(message.created_at);
    const now = new Date();
    const hoursDiff = (now - messageTime) / (1000 * 60 * 60);
    
    console.log('[deleteMessageForEveryone] Message age (hours):', hoursDiff);
    
    if (hoursDiff > 1) {
      console.log('[deleteMessageForEveryone] ERROR: Message too old');
      throw new Error('Cannot delete messages older than 1 hour for everyone');
    }

    await db.query(
      'UPDATE team_mentor_communications SET deleted_for_everyone = TRUE, deleted_at = NOW() WHERE communication_id = ?',
      [communicationId]
    );

    console.log('[deleteMessageForEveryone] SUCCESS: Message deleted for everyone');
    return { success: true };
  }
}

module.exports = Team;
