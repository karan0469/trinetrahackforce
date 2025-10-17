const mongoose = require('mongoose');

const authoritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Authority name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  department: {
    type: String,
    enum: ['Traffic Police', 'Municipal Corporation', 'Environmental Agency', 'General'],
    required: true
  },
  jurisdiction: {
    type: String,
    required: [true, 'Jurisdiction is required']
  },
  categories: [{
    type: String,
    enum: ['Helmet Violation', 'Littering', 'Illegal Parking', 'Traffic Violation', 'Others']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  reportsHandled: {
    type: Number,
    default: 0
  },
  reportsResolved: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Authority', authoritySchema);
