const Redemption = require('../models/Redemption');
const User = require('../models/User');

// Mock reward catalog
const REWARD_CATALOG = [
  {
    id: 'coupon-50',
    type: 'Coupon',
    description: '₹50 Shopping Voucher',
    pointsRequired: 50,
    value: '₹50'
  },
  {
    id: 'coupon-100',
    type: 'Coupon',
    description: '₹100 Shopping Voucher',
    pointsRequired: 100,
    value: '₹100'
  },
  {
    id: 'discount-10',
    type: 'Discount',
    description: '10% Discount on Groceries',
    pointsRequired: 30,
    value: '10%'
  },
  {
    id: 'discount-20',
    type: 'Discount',
    description: '20% Discount on Electronics',
    pointsRequired: 75,
    value: '20%'
  },
  {
    id: 'donation-100',
    type: 'Donation',
    description: 'Donate ₹100 to Environmental NGO',
    pointsRequired: 50,
    value: '₹100'
  },
  {
    id: 'donation-200',
    type: 'Donation',
    description: 'Donate ₹200 to Child Education',
    pointsRequired: 100,
    value: '₹200'
  },
  {
    id: 'giftcard-amazon-100',
    type: 'Gift Card',
    description: 'Amazon Gift Card ₹100',
    pointsRequired: 120,
    value: '₹100'
  },
  {
    id: 'giftcard-flipkart-100',
    type: 'Gift Card',
    description: 'Flipkart Gift Card ₹100',
    pointsRequired: 120,
    value: '₹100'
  }
];

// @desc    Get available rewards
exports.getAvailableRewards = async (req, res, next) => {
  try {
    const userPoints = req.user.points;

    const rewards = REWARD_CATALOG.map(reward => ({
      ...reward,
      canRedeem: userPoints >= reward.pointsRequired
    }));

    res.json({
      success: true,
      rewards,
      userPoints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Redeem points for a reward
exports.redeemReward = async (req, res, next) => {
  try {
    const { rewardId } = req.body;

    // Find reward in catalog
    const reward = REWARD_CATALOG.find(r => r.id === rewardId);

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found'
      });
    }

    // Check if user has enough points
    if (req.user.points < reward.pointsRequired) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient points',
        required: reward.pointsRequired,
        available: req.user.points
      });
    }

    // Generate reward code
    const rewardCode = `GC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create redemption record
    const redemption = await Redemption.create({
      userId: req.user._id,
      pointsUsed: reward.pointsRequired,
      rewardType: reward.type,
      rewardCode,
      rewardDescription: reward.description,
      rewardValue: reward.value,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    });

    // Deduct points from user
    req.user.points -= reward.pointsRequired;
    await req.user.save();

    res.json({
      success: true,
      message: 'Reward redeemed successfully',
      redemption: {
        id: redemption._id,
        rewardCode: redemption.rewardCode,
        description: redemption.rewardDescription,
        value: redemption.rewardValue,
        expiryDate: redemption.expiryDate,
        status: redemption.status
      },
      remainingPoints: req.user.points
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's redemption history
exports.getMyRedemptions = async (req, res, next) => {
  try {
    const redemptions = await Redemption.find({ userId: req.user._id })
      .sort('-createdAt');

    res.json({
      success: true,
      redemptions,
      total: redemptions.length
    });
  } catch (error) {
    next(error);
  }
};
