const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pointsUsed: {
    type: Number,
    required: [true, 'Points used is required'],
    min: [1, 'Points must be at least 1']
  },
  rewardType: {
    type: String,
    enum: ['Coupon', 'Discount', 'Donation', 'Gift Card'],
    required: true
  },
  rewardCode: {
    type: String,
    required: true
  },
  rewardDescription: {
    type: String,
    required: true
  },
  rewardValue: {
    type: String, // e.g., "10% off", "₹100"
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Used', 'Expired'],
    default: 'Active'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  usedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
redemptionSchema.index({ userId: 1, status: 1 });
redemptionSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Redemption', redemptionSchema);
