const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const hackathonController = require('../controllers/hackathon.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Validation rules for creating hackathon
const createHackathonValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('prize_pool').trim().notEmpty().withMessage('Prize pool is required'),
  body('registration_start_date').isISO8601().withMessage('Valid registration start date is required'),
  body('registration_end_date').isISO8601().withMessage('Valid registration end date is required'),
  body('development_start_date').isISO8601().withMessage('Valid development start date is required'),
  body('development_end_date').isISO8601().withMessage('Valid development end date is required'),
  body('submission_deadline').isISO8601().withMessage('Valid submission deadline is required')
];

// Public routes
router.get('/', hackathonController.getAllHackathons);
router.get('/:id/leaderboard', hackathonController.getLeaderboard);
router.get('/:id', hackathonController.getHackathonById);

// Admin routes (protected)
router.put('/teams/:teamId/score', authenticate, isAdmin, [
  body('score').isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100')
], hackathonController.updateTeamScore);
router.post('/:id/finalize-leaderboard', authenticate, isAdmin, hackathonController.finalizeLeaderboard);
router.post('/', authenticate, isAdmin, createHackathonValidation, hackathonController.createHackathon);
router.put('/:id', authenticate, isAdmin, hackathonController.updateHackathon);
router.delete('/:id', authenticate, isAdmin, hackathonController.deleteHackathon);

module.exports = router;
