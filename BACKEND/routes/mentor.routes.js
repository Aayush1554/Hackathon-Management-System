const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const mentorController = require('../controllers/mentor.controller');
const { authenticate, isAdmin, isMentor } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Validation rules
const createMentorValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').trim().notEmpty().withMessage('Full name is required')
];

const updateMentorValidation = [
  body('full_name').optional().trim().notEmpty().withMessage('Full name cannot be empty')
];

const assignMentorValidation = [
  body('mentorId').isInt().withMessage('Valid mentor ID is required'),
  body('teamId').isInt().withMessage('Valid team ID is required')
];

const scheduleMeetingValidation = [
  body('team_id').isInt().withMessage('Valid team ID is required'),
  body('meeting_title').trim().notEmpty().withMessage('Meeting title is required'),
  body('meeting_link').isURL().withMessage('Valid meeting link is required'),
  body('meeting_date').isISO8601().withMessage('Valid date is required')
];

// All routes require authentication
router.use(authenticate);

// ============ ADMIN ROUTES ============
// Get all mentors (Admin only)
router.get('/', isAdmin, mentorController.getAllMentors);

// Create new mentor (Admin only)
router.post('/', isAdmin, createMentorValidation, mentorController.createMentor);

// Get mentor by ID (Admin only)
router.get('/:mentorId', isAdmin, mentorController.getMentorById);

// Update mentor (Admin only)
router.put('/:mentorId', isAdmin, updateMentorValidation, mentorController.updateMentor);

// Delete mentor (Admin only)
router.delete('/:mentorId', isAdmin, mentorController.deleteMentor);

// Assign mentor to team (Admin only)
router.post('/assign', isAdmin, assignMentorValidation, mentorController.assignMentorToTeam);

// Remove mentor from team (Admin only)
router.post('/remove', isAdmin, mentorController.removeMentorFromTeam);

// ============ MENTOR ROUTES ============
// Get mentor's assigned teams
router.get('/my/teams', isMentor, mentorController.getMyTeams);

// Get mentor's hackathons
router.get('/my/hackathons', isMentor, mentorController.getMyHackathons);

// Get mentor's meetings
router.get('/my/meetings', isMentor, mentorController.getMyMeetings);

// Schedule meeting
router.post('/meetings/schedule', isMentor, scheduleMeetingValidation, mentorController.scheduleMeeting);

// Send communication to team
router.post(
  '/communications/send',
  isMentor,
  upload.single('communication_file'),
  mentorController.sendCommunication
);

// Get communications with team
router.get('/communications/:teamId', isMentor, mentorController.getCommunications);

// Add reaction to message
router.post('/communications/:communicationId/react', isMentor, mentorController.addReaction);

// Delete message for me
router.delete('/communications/:communicationId/delete-for-me', isMentor, mentorController.deleteMessageForMe);

// Delete message for everyone
router.delete('/communications/:communicationId/delete-for-everyone', isMentor, mentorController.deleteMessageForEveryone);

module.exports = router;
