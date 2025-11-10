const Team = require('../models/Team.model');
const Hackathon = require('../models/Hackathon.model');

// Create a new team for a hackathon
exports.createTeam = async (req, res) => {
  try {
    const { 
      team_name, 
      hackathon_id, 
      description,
      member_emails, // Array of team member emails (excluding leader)
      member_names  // Array of team member names (excluding leader)
    } = req.body;

    // Validate required fields
    if (!team_name || !hackathon_id) {
      return res.status(400).json({
        success: false,
        message: 'Team name and hackathon ID are required'
      });
    }

    // Get hackathon details to check team size
    const hackathon = await Hackathon.getById(hackathon_id);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Check if hackathon is open for registration
    const allowedStatuses = ['open', 'ongoing', ''];
    if (!allowedStatuses.includes(hackathon.status) && hackathon.status) {
      return res.status(400).json({
        success: false,
        message: 'Hackathon registration is not open'
      });
    }

    // Validate team size
    const totalMembers = (member_emails?.length || 0) + 1; // +1 for leader
    if (totalMembers < hackathon.min_team_size) {
      return res.status(400).json({
        success: false,
        message: `Team must have at least ${hackathon.min_team_size} members`
      });
    }

    if (totalMembers > hackathon.max_team_size) {
      return res.status(400).json({
        success: false,
        message: `Team cannot exceed ${hackathon.max_team_size} members`
      });
    }

    // Check if user is already in a team for this hackathon
    const alreadyInTeam = await Team.isUserInTeamForHackathon(req.user.user_id, hackathon_id);
    if (alreadyInTeam) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered in a team for this hackathon'
      });
    }

    // Create team
    const team = await Team.create(
      { team_name, hackathon_id, description },
      member_emails || [],
      member_names || [],
      req.user.user_id
    );

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
    });
  } catch (error) {
    console.error('Create team error:', error);
    
    // Handle specific error messages
    if (error.message && error.message.includes('already in a team')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'You are already registered in a team for this hackathon'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create team',
      error: error.message
    });
  }
};

// Get all teams (Admin only)
exports.getAllTeams = async (req, res) => {
  try {
    const db = require('../config/database');
    const [teams] = await db.query(
      `SELECT 
        t.team_id,
        t.team_name,
        t.team_code,
        h.title as hackathon_title,
        h.hackathon_id,
        u.full_name as leader_name,
        COUNT(DISTINCT tm.member_id) as member_count,
        mentor.user_id as mentor_id,
        mentor.full_name as mentor_name
       FROM teams t
       JOIN hackathons h ON t.hackathon_id = h.hackathon_id
       JOIN users u ON t.team_leader_id = u.user_id
       LEFT JOIN team_members tm ON t.team_id = tm.team_id
       LEFT JOIN mentor_team_assignments mta ON t.team_id = mta.team_id AND mta.is_active = TRUE
       LEFT JOIN users mentor ON mta.mentor_id = mentor.user_id
       GROUP BY t.team_id, mentor.user_id, mentor.full_name
       ORDER BY t.created_at DESC`
    );

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Get all teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams',
      error: error.message
    });
  }
};

// Get teams for a hackathon
exports.getTeamsByHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const teams = await Team.getByHackathon(hackathonId);

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams',
      error: error.message
    });
  }
};

// Get user's teams
exports.getMyTeams = async (req, res) => {
  try {
    const teams = await Team.getByUser(req.user.user_id);

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Get my teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your teams',
      error: error.message
    });
  }
};

// Get team details
exports.getTeamDetails = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.getTeamWithMembers(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Get team details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team details',
      error: error.message
    });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const updateData = req.body;

    // Get team to verify ownership
    const team = await Team.getTeamWithMembers(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Only team leader can update
    if (team.team_leader_id !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can update team details'
      });
    }

    await Team.update(teamId, updateData);
    const updatedTeam = await Team.getTeamWithMembers(teamId);

    res.json({
      success: true,
      message: 'Team updated successfully',
      data: updatedTeam
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update team',
      error: error.message
    });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Get team to verify ownership
    const team = await Team.getTeamWithMembers(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Only team leader or admin can delete
    if (team.team_leader_id !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only team leader or admin can delete team'
      });
    }

    await Team.delete(teamId);

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team',
      error: error.message
    });
  }
};

// Get full team details including members and submission
exports.getFullTeamDetails = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Get team with members
    const team = await Team.getTeamWithMembers(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Get submission if exists
    const db = require('../config/database');
    const [submissions] = await db.query(
      `SELECT * FROM submissions 
       WHERE team_id = ? 
       ORDER BY submitted_at DESC 
       LIMIT 1`,
      [teamId]
    );

    res.json({
      success: true,
      data: {
        team,
        members: team.members || [],
        submission: submissions[0] || null
      }
    });
  } catch (error) {
    console.error('Get full team details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get team details',
      error: error.message
    });
  }
};

// Submit project
exports.submitProject = async (req, res) => {
  try {
    const {
      team_id,
      hackathon_id,
      submission_title,
      description,
      github_url,
      demo_url,
      video_url
    } = req.body;

    // Validate required fields
    if (!team_id || !hackathon_id || !submission_title || !github_url) {
      return res.status(400).json({
        success: false,
        message: 'Team ID, Hackathon ID, submission title, and GitHub URL are required'
      });
    }

    // Verify user is part of the team
    const db = require('../config/database');
    const [teamMembers] = await db.query(
      'SELECT * FROM team_members WHERE team_id = ? AND user_id = ?',
      [team_id, req.user.user_id]
    );

    if (teamMembers.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this team'
      });
    }

    // Check if submission deadline has passed
    const [hackathons] = await db.query(
      'SELECT submission_deadline FROM hackathons WHERE hackathon_id = ?',
      [hackathon_id]
    );

    if (hackathons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    const deadline = new Date(hackathons[0].submission_deadline);
    if (new Date() > deadline) {
      return res.status(400).json({
        success: false,
        message: 'Submission deadline has passed'
      });
    }

    // Handle file uploads (project_zip and project_report)
    // Store relative URLs that can be accessed via the /uploads route
    let project_zip_url = '';
    let report_url = '';
    
    if (req.files) {
      if (req.files.project_zip && req.files.project_zip[0]) {
        // Convert absolute path to relative URL
        const filename = req.files.project_zip[0].filename;
        project_zip_url = `/uploads/submissions/${filename}`;
      }
      if (req.files.project_report && req.files.project_report[0]) {
        const filename = req.files.project_report[0].filename;
        report_url = `/uploads/submissions/${filename}`;
      }
    }

    // Validate that project_zip is provided
    if (!project_zip_url) {
      return res.status(400).json({
        success: false,
        message: 'Project ZIP file is required'
      });
    }

    // Insert or update submission
    const [existingSubmissions] = await db.query(
      'SELECT submission_id FROM submissions WHERE team_id = ? AND hackathon_id = ?',
      [team_id, hackathon_id]
    );

    if (existingSubmissions.length > 0) {
      // Update existing submission
      await db.query(
        `UPDATE submissions 
         SET submission_title = ?, 
             description = ?, 
             project_zip_url = ?,
             github_url = ?, 
             demo_url = ?, 
             video_url = ?,
             documentation_url = ?,
             submitted_at = CURRENT_TIMESTAMP,
             is_final = TRUE
         WHERE submission_id = ?`,
        [
          submission_title,
          description || null,
          project_zip_url,
          github_url,
          demo_url || null,
          video_url || null,
          report_url || null,
          existingSubmissions[0].submission_id
        ]
      );
    } else {
      // Create new submission
      await db.query(
        `INSERT INTO submissions 
         (team_id, hackathon_id, submission_title, description, project_zip_url, github_url, demo_url, video_url, documentation_url, is_final)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [
          team_id,
          hackathon_id,
          submission_title,
          description || null,
          project_zip_url,
          github_url,
          demo_url || null,
          video_url || null,
          report_url || null
        ]
      );
    }

    // Update team status to 'submitted'
    await db.query(
      'UPDATE teams SET status = ? WHERE team_id = ?',
      ['submitted', team_id]
    );

    res.json({
      success: true,
      message: 'Project submitted successfully'
    });
  } catch (error) {
    console.error('Submit project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit project',
      error: error.message
    });
  }
};

// Get team's mentor
exports.getTeamMentor = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const mentor = await Team.getTeamMentor(teamId);
    
    res.json({
      success: true,
      data: mentor
    });
  } catch (error) {
    console.error('Get team mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get team mentor',
      error: error.message
    });
  }
};

// Get team's meetings
exports.getTeamMeetings = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const meetings = await Team.getTeamMeetings(teamId);
    
    res.json({
      success: true,
      data: meetings
    });
  } catch (error) {
    console.error('Get team meetings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get team meetings',
      error: error.message
    });
  }
};

// Send communication to mentor
exports.sendCommunicationToMentor = async (req, res) => {
  try {
    const { team_id, mentor_id, message_text } = req.body;
    
    if (!team_id || !mentor_id) {
      return res.status(400).json({
        success: false,
        message: 'Team ID and Mentor ID are required'
      });
    }
    
    // Handle file upload
    const file_url = req.file ? `/uploads/communications/${req.file.filename}` : null;
    const file_name = req.file ? req.file.originalname : null;
    
    const communicationId = await Team.sendCommunicationToMentor({
      team_id,
      mentor_id,
      message_text,
      file_url,
      file_name
    });
    
    res.status(201).json({
      success: true,
      message: 'Communication sent successfully',
      data: { communication_id: communicationId }
    });
  } catch (error) {
    console.error('Send communication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send communication',
      error: error.message
    });
  }
};

// Get communications with mentor
exports.getCommunicationsWithMentor = async (req, res) => {
  try {
    const { teamId, mentorId } = req.params;
    
    const communications = await Team.getCommunicationsWithMentor(teamId, mentorId);
    
    res.json({
      success: true,
      data: communications
    });
  } catch (error) {
    console.error('Get communications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get communications',
      error: error.message
    });
  }
};

// Add reaction to message
exports.addReaction = async (req, res) => {
  try {
    const { communicationId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.user_id;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }

    const result = await Team.addReaction(communicationId, userId, emoji);
    
    res.json({
      success: true,
      message: 'Reaction added successfully',
      data: result
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add reaction',
      error: error.message
    });
  }
};

// Delete message for me
exports.deleteMessageForMe = async (req, res) => {
  try {
    const { communicationId } = req.params;
    const userId = req.user.user_id;

    console.log('[Controller] deleteMessageForMe - communicationId:', communicationId, 'userId:', userId, 'user:', req.user);

    await Team.deleteMessageForMe(communicationId, userId);
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
};

// Delete message for everyone
exports.deleteMessageForEveryone = async (req, res) => {
  try {
    const { communicationId } = req.params;
    const userId = req.user.user_id;

    console.log('[Controller] deleteMessageForEveryone - communicationId:', communicationId, 'userId:', userId, 'user:', req.user);

    await Team.deleteMessageForEveryone(communicationId, userId);
    
    res.json({
      success: true,
      message: 'Message deleted for everyone'
    });
  } catch (error) {
    console.error('Delete message for everyone error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message for everyone',
      error: error.message
    });
  }
};
