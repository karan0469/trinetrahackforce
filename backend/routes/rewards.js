const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   GET /api/rewards/available
// @desc    Get available rewards
// @access  Private
router.get('/available', rewardController.getAvailableRewards);

// @route   POST /api/rewards/redeem
// @desc    Redeem points for a reward
// @access  Private
router.post('/redeem', rewardController.redeemReward);

// @route   GET /api/rewards/my-redemptions
// @desc    Get user's redemption history
// @access  Private
router.get('/my-redemptions', rewardController.getMyRedemptions);

module.exports = router;
