const Mentor = require('../models/Mentor.model');
const bcrypt = require('bcryptjs');

// Get all mentors (Admin only)
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.getAll();
    
    res.json({
      success: true,
      data: mentors
    });
  } catch (error) {
    console.error('Get all mentors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors',
      error: error.message
    });
  }
};

// Get mentor by ID with assigned teams
exports.getMentorById = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const mentor = await Mentor.getById(mentorId);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }
    
    // Get assigned teams
    const assignedTeams = await Mentor.getAssignedTeams(mentorId);
    
    res.json({
      success: true,
      data: {
        ...mentor,
        assignedTeams
      }
    });
  } catch (error) {
    console.error('Get mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor',
      error: error.message
    });
  }
};

// Create new mentor (Admin only)
exports.createMentor = async (req, res) => {
  try {
    const { email, password, full_name, phone, organization, bio } = req.body;
    
    // Validate required fields
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required'
      });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    const mentorId = await Mentor.create({
      email,
      password_hash,
      full_name,
      phone,
      organization,
      bio
    });
    
    const mentor = await Mentor.getById(mentorId);
    
    res.status(201).json({
      success: true,
      message: 'Mentor created successfully',
      data: mentor
    });
  } catch (error) {
    console.error('Create mentor error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create mentor',
      error: error.message
    });
  }
};

// Update mentor (Admin only)
exports.updateMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { full_name, email, phone, organization, bio, is_active, password } = req.body;
    
    console.log('Update mentor request:', { mentorId, full_name, email, phone, organization, bio, is_active });
    
    const db = require('../config/database');
    
    // Build update query dynamically
    let updateFields = [];
    let updateValues = [];
    
    if (full_name) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (organization !== undefined) {
      updateFields.push('organization = ?');
      updateValues.push(organization);
    }
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(bio);
    }
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }
    
    // If password is being updated
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      updateFields.push('password_hash = ?');
      updateValues.push(password_hash);
    }
    
    // Execute update if there are fields to update
    if (updateFields.length > 0) {
      updateValues.push(mentorId);
      await db.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ? AND user_type = 'mentor'`,
        updateValues
      );
    }
    
    // Get updated mentor
    const mentor = await Mentor.getById(mentorId);
    
    res.json({
      success: true,
      message: 'Mentor updated successfully',
      data: mentor
    });
  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mentor',
      error: error.message
    });
  }
};

// Delete mentor (Admin only)
exports.deleteMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    
    await Mentor.delete(mentorId);
    
    res.json({
      success: true,
      message: 'Mentor deleted successfully'
    });
  } catch (error) {
    console.error('Delete mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mentor',
      error: error.message
    });
  }
};

// Assign mentor to team (Admin only)
exports.assignMentorToTeam = async (req, res) => {
  try {
    const { mentorId, teamId, notes } = req.body;
    
    if (!mentorId || !teamId) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID and Team ID are required'
      });
    }
    
    await Mentor.assignToTeam(mentorId, teamId, req.user.user_id, notes);
    
    res.json({
      success: true,
      message: 'Mentor assigned to team successfully'
    });
  } catch (error) {
    console.error('Assign mentor error:', error);
    
    // Handle specific error for team already having a mentor
    if (error.code === 'TEAM_ALREADY_HAS_MENTOR') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to assign mentor',
      error: error.message
    });
  }
};

// Remove mentor from team (Admin only)
exports.removeMentorFromTeam = async (req, res) => {
  try {
    const { mentorId, teamId } = req.body;
    
    await Mentor.removeFromTeam(mentorId, teamId);
    
    res.json({
      success: true,
      message: 'Mentor removed from team successfully'
    });
  } catch (error) {
    console.error('Remove mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove mentor',
      error: error.message
    });
  }
};

// Get mentor's assigned teams
exports.getMyTeams = async (req, res) => {
  try {
    const teams = await Mentor.getAssignedTeams(req.user.user_id);
    
    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error('Get mentor teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams',
      error: error.message
    });
  }
};

// Get mentor's hackathons
exports.getMyHackathons = async (req, res) => {
  try {
    const hackathons = await Mentor.getAssignedHackathons(req.user.user_id);
    
    res.json({
      success: true,
      data: hackathons
    });
  } catch (error) {
    console.error('Get mentor hackathons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hackathons',
      error: error.message
    });
  }
};

// Schedule meeting
exports.scheduleMeeting = async (req, res) => {
  try {
    const { team_id, meeting_title, meeting_link, meeting_date, description } = req.body;
    
    if (!team_id || !meeting_title || !meeting_link || !meeting_date) {
      return res.status(400).json({
        success: false,
        message: 'Team ID, meeting title, link, and date are required'
      });
    }
    
    const meetingId = await Mentor.scheduleMeeting({
      mentor_id: req.user.user_id,
      team_id,
      meeting_title,
      meeting_link,
      meeting_date,
      description
    });
    
    res.status(201).json({
      success: true,
      message: 'Meeting scheduled successfully',
      data: { meeting_id: meetingId }
    });
  } catch (error) {
    console.error('Schedule meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule meeting',
      error: error.message
    });
  }
};

// Get mentor's meetings
exports.getMyMeetings = async (req, res) => {
  try {
    const meetings = await Mentor.getMentorMeetings(req.user.user_id);
    
    res.json({
      success: true,
      data: meetings
    });
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meetings',
      error: error.message
    });
  }
};

// Send communication to team
exports.sendCommunication = async (req, res) => {
  try {
    const { team_id, message_text } = req.body;
    
    if (!team_id) {
      return res.status(400).json({
        success: false,
        message: 'Team ID is required'
      });
    }
    
    // Handle file upload
    const file_url = req.file ? `/uploads/communications/${req.file.filename}` : null;
    const file_name = req.file ? req.file.originalname : null;
    
    const communicationId = await Mentor.sendCommunication({
      team_id,
      mentor_id: req.user.user_id,
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

// Get communications with team
exports.getCommunications = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const communications = await Mentor.getCommunications(teamId, req.user.user_id);
    
    res.json({
      success: true,
      data: communications
    });
  } catch (error) {
    console.error('Get communications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch communications',
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

    const result = await Mentor.addReaction(communicationId, userId, emoji);
    
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

    await Mentor.deleteMessageForMe(communicationId, userId);
    
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

    await Mentor.deleteMessageForEveryone(communicationId, userId);
    
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

module.exports = exports;
