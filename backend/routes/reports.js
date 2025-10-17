const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// All routes are protected
router.use(protect);

// @route   GET /api/reports
// @desc    Get all reports (with filters)
// @access  Private
router.get('/', reportController.getReports);

// @route   GET /api/reports/my-reports
// @desc    Get current user's reports
// @access  Private
router.get('/my-reports', reportController.getMyReports);

// @route   GET /api/reports/:id
// @desc    Get single report
// @access  Private
router.get('/:id', reportController.getReport);

// @route   POST /api/reports
// @desc    Create a new report
// @access  Private
router.post(
  '/',
  upload.single('photo'),
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('description').isLength({ min: 10, max: 500 }).withMessage('Description must be 10-500 characters'),
    body('latitude').isFloat().withMessage('Valid latitude is required'),
    body('longitude').isFloat().withMessage('Valid longitude is required')
  ],
  reportController.createReport
);

// @route   DELETE /api/reports/:id
// @desc    Delete a report (own reports only)
// @access  Private
router.delete('/:id', reportController.deleteReport);

// @route   POST /api/reports/:id/peer-verify
// @desc    Add peer verification to a report
// @access  Private
router.post('/:id/peer-verify', reportController.addPeerVerification);

module.exports = router;
