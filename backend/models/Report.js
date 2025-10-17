const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['Helmet Violation', 'Littering', 'Illegal Parking', 'Traffic Violation', 'Others'],
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description must not exceed 500 characters']
  },
  photoUrl: {
    type: String,
    required: [true, 'Photo is required']
  },
  photoPublicId: {
    type: String // For Cloudinary deletion
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Location coordinates are required']
    },
    address: {
      type: String,
      default: ''
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected', 'Resolved'],
    default: 'Pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Authority'
  },
  resolvedAt: {
    type: Date
  },
  deviceInfo: {
    userAgent: String,
    platform: String,
    browser: String
  },
  pointsAwarded: {
    type: Number,
    default: 0
  },
  peerVerifications: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verified: Boolean,
    timestamp: Date
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
reportSchema.index({ location: '2dsphere' });

// Index for efficient querying
reportSchema.index({ userId: 1, status: 1 });
reportSchema.index({ category: 1, status: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
