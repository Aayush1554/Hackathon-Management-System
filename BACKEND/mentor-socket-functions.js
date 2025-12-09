// This file adds Socket.io event emissions to mentor controller functions
// Copy the content from mentor.controller.js and add the socket events

const Mentor = require('../models/Mentor.model');

// Add reaction with Socket.io event
exports.addReactionWithSocket = async (req, res) => {
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
    
    // Emit Socket.io event for real-time update
    if (result && result.team_id && result.mentor_id) {
      const io = req.app.get('io');
      const room = `team_${result.team_id}_mentor_${result.mentor_id}`;
      io.to(room).emit('message_reaction', {
        communication_id: communicationId,
        user_id: userId,
        emoji,
        reactions: result.reactions
      });
    }
    
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

// Delete message for me with Socket.io event
exports.deleteMessageForMeWithSocket = async (req, res) => {
  try {
    const { communicationId } = req.params;
    const userId = req.user.user_id;

    const result = await Mentor.deleteMessageForMe(communicationId, userId);
    
    // Emit Socket.io event for real-time update
    if (result && result.team_id && result.mentor_id) {
      const io = req.app.get('io');
      const room = `team_${result.team_id}_mentor_${result.mentor_id}`;
      io.to(room).emit('message_deleted_for_me', {
        communication_id: communicationId,
        user_id: userId
      });
    }
    
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

// Delete message for everyone with Socket.io event
exports.deleteMessageForEveryoneWithSocket = async (req, res) => {
  try {
    const { communicationId } = req.params;
    const userId = req.user.user_id;

    const result = await Mentor.deleteMessageForEveryone(communicationId, userId);
    
    // Emit Socket.io event for real-time update
    if (result && result.team_id && result.mentor_id) {
      const io = req.app.get('io');
      const room = `team_${result.team_id}_mentor_${result.mentor_id}`;
      io.to(room).emit('message_deleted_for_everyone', {
        communication_id: communicationId,
        deleted_by: userId
      });
    }
    
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
