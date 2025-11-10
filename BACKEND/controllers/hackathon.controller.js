const Hackathon = require('../models/Hackathon.model');
const { validationResult } = require('express-validator');

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Get all hackathons
exports.getAllHackathons = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (category) filters.category = category;

    const hackathons = await Hackathon.getAll(filters);
    
    res.json({
      success: true,
      count: hackathons.length,
      data: hackathons
    });
  } catch (error) {
    console.error('Get hackathons error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hackathons',
      error: error.message
    });
  }
};

// Get single hackathon by ID
exports.getHackathonById = async (req, res) => {
  try {
    const { id } = req.params;
    const hackathon = await Hackathon.getById(id);
    
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Get statistics
    const stats = await Hackathon.getStats(id);
    
    res.json({
      success: true,
      data: {
        ...hackathon,
        stats
      }
    });
  } catch (error) {
    console.error('Get hackathon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hackathon',
      error: error.message
    });
  }
};

// Create new hackathon (Admin only)
exports.createHackathon = async (req, res) => {
  try {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const data = req.body;
    
    // Generate slug from title
    let slug = generateSlug(data.title);
    
    // Check if slug exists
    const existingHackathon = await Hackathon.getBySlug(slug);
    if (existingHackathon) {
      slug = `${slug}-${Date.now()}`;
    }
    
    data.slug = slug;
    data.created_by = req.user?.user_id || 1; // Default to admin user 1

    const hackathonId = await Hackathon.create(data);
    const newHackathon = await Hackathon.getById(hackathonId);
    
    res.status(201).json({
      success: true,
      message: 'Hackathon created successfully',
      data: newHackathon
    });
  } catch (error) {
    console.error('Create hackathon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating hackathon',
      error: error.message
    });
  }
};

// Update hackathon (Admin only)
exports.updateHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Check if hackathon exists
    const hackathon = await Hackathon.getById(id);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // If title is being updated, regenerate slug
    if (data.title && data.title !== hackathon.title) {
      data.slug = generateSlug(data.title);
      
      // Check if new slug exists
      const existingHackathon = await Hackathon.getBySlug(data.slug);
      if (existingHackathon && existingHackathon.hackathon_id !== parseInt(id)) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }

    await Hackathon.update(id, data);
    const updatedHackathon = await Hackathon.getById(id);
    
    res.json({
      success: true,
      message: 'Hackathon updated successfully',
      data: updatedHackathon
    });
  } catch (error) {
    console.error('Update hackathon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hackathon',
      error: error.message
    });
  }
};

// Delete hackathon (Admin only)
exports.deleteHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const hackathon = await Hackathon.getById(id);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    await Hackathon.delete(id);
    
    res.json({
      success: true,
      message: 'Hackathon deleted successfully'
    });
  } catch (error) {
    console.error('Delete hackathon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting hackathon',
      error: error.message
    });
  }
};

// Update team score (Admin only)
exports.updateTeamScore = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { score } = req.body;

    console.log('Update team score request - Team ID:', teamId, 'Score:', score);

    if (!score && score !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Score is required'
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: 'Score must be between 0 and 100'
      });
    }

    const result = await Hackathon.updateTeamScore(teamId, score);
    
    console.log('Score update result:', result);
    
    res.json({
      success: true,
      message: 'Team score updated successfully'
    });
  } catch (error) {
    console.error('Update team score error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating team score',
      error: error.message
    });
  }
};

// Get leaderboard for a hackathon
exports.getLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;
    
    const leaderboard = await Hackathon.getLeaderboard(id);
    const hackathon = await Hackathon.getById(id);
    
    res.json({
      success: true,
      data: {
        leaderboard,
        is_finalized: hackathon?.leaderboard_finalized || false,
        finalized_at: hackathon?.leaderboard_finalized_at || null
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};

// Finalize leaderboard (Admin only)
exports.finalizeLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Attempting to finalize leaderboard for hackathon:', id);
    await Hackathon.finalizeLeaderboard(id);
    
    res.json({
      success: true,
      message: 'Leaderboard finalized successfully'
    });
  } catch (error) {
    console.error('Finalize leaderboard error:', error);
    
    // Check if error is due to missing columns
    if (error.message && error.message.includes('Unknown column')) {
      return res.status(500).json({
        success: false,
        message: 'Database migration required. Please run: database/quick-fix-leaderboard.sql',
        error: 'Missing leaderboard_finalized columns in hackathons table'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error finalizing leaderboard',
      error: error.message
    });
  }
};
