const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   GET /api/users/leaderboard
// @desc    Get top users by points
// @access  Private
router.get('/leaderboard', userController.getLeaderboard);

// @route   GET /api/users/profile/:id
// @desc    Get user profile
// @access  Private
router.get('/profile/:id', userController.getUserProfile);

// @route   GET /api/users/stats
// @desc    Get current user statistics
// @access  Private
router.get('/stats', userController.getUserStats);

module.exports = router;
