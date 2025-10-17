const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters']
  },
  firebaseUid: {
    type: String,
    sparse: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  reputation: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'authority'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: ''
  },
  reportsCount: {
    type: Number,
    default: 0
  },
  verifiedReportsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add points
userSchema.methods.addPoints = function(points) {
  this.points += points;
  // Update reputation based on verified reports
  this.reputation = Math.min(100, (this.verifiedReportsCount / (this.reportsCount || 1)) * 100);
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
