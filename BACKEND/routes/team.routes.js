const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const teamController = require('../controllers/team.controller');
const { authenticate, isTeamMember, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Validation rules
const createTeamValidation = [
  body('team_name')
    .trim()
    .notEmpty().withMessage('Team name is required')
    .isLength({ min: 3, max: 255 }).withMessage('Team name must be between 3 and 255 characters'),
  body('hackathon_id')
    .notEmpty().withMessage('Hackathon ID is required')
    .isInt().withMessage('Hackathon ID must be a number'),
  body('member_emails')
    .optional()
    .isArray().withMessage('Member emails must be an array'),
  body('member_emails.*')
    .optional()
    .isEmail().withMessage('Each member email must be valid'),
  body('description')
    .optional()
    .trim()
];

// All routes require authentication
router.use(authenticate);

// Get all teams (admin only)
router.get('/all', authorize('admin'), teamController.getAllTeams);

// Create team (team members only)
router.post('/', isTeamMember, createTeamValidation, teamController.createTeam);

// Get user's teams
router.get('/my-teams', teamController.getMyTeams);

// Get teams for a specific hackathon (admin and team members can access)
router.get('/hackathon/:hackathonId', teamController.getTeamsByHackathon);

// Get full team details including members and submission (MUST be before /:teamId route)
router.get('/:teamId/details', teamController.getFullTeamDetails);

// Get team's mentor
router.get('/:teamId/mentor', isTeamMember, teamController.getTeamMentor);

// Get team's scheduled meetings
router.get('/:teamId/meetings', isTeamMember, teamController.getTeamMeetings);

// Send communication to mentor (with file upload)
router.post(
  '/:teamId/communications/send',
  isTeamMember,
  upload.single('communication_file'),
  teamController.sendCommunicationToMentor
);

// Get communications with mentor
router.get('/:teamId/communications/:mentorId', isTeamMember, teamController.getCommunicationsWithMentor);

// Add reaction to message
router.post('/communications/:communicationId/react', isTeamMember, teamController.addReaction);

// Delete message for me
router.delete('/communications/:communicationId/delete-for-me', isTeamMember, teamController.deleteMessageForMe);

// Delete message for everyone
router.delete('/communications/:communicationId/delete-for-everyone', isTeamMember, teamController.deleteMessageForEveryone);

// Submit project with file uploads
router.post(
  '/submit-project', 
  isTeamMember, 
  upload.fields([
    { name: 'project_zip', maxCount: 1 },
    { name: 'project_report', maxCount: 1 }
  ]),
  teamController.submitProject
);

// Get team details (admin and team members can access)
router.get('/:teamId', teamController.getTeamDetails);

// Update team (team leader only, verified in controller)
router.put('/:teamId', isTeamMember, teamController.updateTeam);

// Delete team (team leader only, verified in controller)
router.delete('/:teamId', isTeamMember, teamController.deleteTeam);

module.exports = router;
