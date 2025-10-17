const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const admin = require('../config/firebase');
const { sendWelcomeEmail } = require('../utils/emailService');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      isVerified: true // Auto-verify for demo purposes
    });

    // Send welcome email (async, don't wait)
    sendWelcomeEmail(user).catch(err => console.error('Welcome email error:', err));

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        reputation: user.reputation,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        reputation: user.reputation,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Firebase login (OTP-based)
exports.firebaseLogin = async (req, res, next) => {
  try {
    const { idToken, name, phone } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required'
      });
    }

    // Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Firebase token'
      });
    }

    const { uid, email, phone_number } = decodedToken;

    // Find or create user
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Check if user exists with same email or phone
      user = await User.findOne({
        $or: [
          { email: email || '' },
          { phone: phone || phone_number || '' }
        ]
      });

      if (user) {
        // Update existing user with Firebase UID
        user.firebaseUid = uid;
        user.isVerified = true;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          name: name || email?.split('@')[0] || 'User',
          email: email || `${uid}@firebase.user`,
          phone: phone || phone_number || Math.random().toString().slice(2, 12),
          firebaseUid: uid,
          isVerified: true
        });

        sendWelcomeEmail(user).catch(err => console.error('Welcome email error:', err));
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        reputation: user.reputation,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
exports.getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        points: req.user.points,
        reputation: req.user.reputation,
        role: req.user.role,
        reportsCount: req.user.reportsCount,
        verifiedReportsCount: req.user.verifiedReportsCount,
        profileImage: req.user.profileImage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        reputation: user.reputation
      }
    });
  } catch (error) {
    next(error);
  }
};
