const { validationResult } = require('express-validator');
const Report = require('../models/Report');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'good-citizen-reports',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// @desc    Get all reports with filters
exports.getReports = async (req, res, next) => {
  try {
    const {
      category,
      status,
      page = 1,
      limit = 10,
      sortBy = '-createdAt'
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('userId', 'name email phone reputation')
      .populate('verifiedBy', 'name email')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Report.countDocuments(query);

    res.json({
      success: true,
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's reports
exports.getMyReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId: req.user._id };
    if (status) query.status = status;

    const reports = await Report.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Report.countDocuments(query);

    res.json({
      success: true,
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single report
exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('userId', 'name email phone reputation')
      .populate('verifiedBy', 'name email')
      .populate('assignedTo', 'name email department');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new report
exports.createReport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { category, description, latitude, longitude, address, deviceInfo } = req.body;

    // Check if photo is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Photo is required'
      });
    }

    // Upload image to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(req.file.buffer);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error uploading image',
        error: error.message
      });
    }

    // Create report
    const report = await Report.create({
      userId: req.user._id,
      category,
      description,
      photoUrl: uploadResult.secure_url,
      photoPublicId: uploadResult.public_id,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address: address || ''
      },
      deviceInfo: deviceInfo ? JSON.parse(deviceInfo) : {}
    });

    // Update user's report count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { reportsCount: 1 }
    });

    // Populate the report before sending response
    await report.populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a report
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user owns the report or is admin
    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report'
      });
    }

    // Only allow deletion of pending reports
    if (report.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a report that has been verified or rejected'
      });
    }

    // Delete image from Cloudinary
    if (report.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(report.photoPublicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await report.deleteOne();

    // Update user's report count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { reportsCount: -1 }
    });

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add peer verification
exports.addPeerVerification = async (req, res, next) => {
  try {
    const { verified } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user already verified this report
    const alreadyVerified = report.peerVerifications.some(
      pv => pv.userId.toString() === req.user._id.toString()
    );

    if (alreadyVerified) {
      return res.status(400).json({
        success: false,
        message: 'You have already verified this report'
      });
    }

    // Add peer verification
    report.peerVerifications.push({
      userId: req.user._id,
      verified: verified === true || verified === 'true',
      timestamp: new Date()
    });

    await report.save();

    res.json({
      success: true,
      message: 'Peer verification added successfully',
      report
    });
  } catch (error) {
    next(error);
  }
};
