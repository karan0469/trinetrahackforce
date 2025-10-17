const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin/authority role
router.use(protect);
router.use(authorize('admin', 'authority'));

// @route   GET /api/admin/reports
// @desc    Get all reports for admin review
// @access  Private (Admin/Authority)
router.get('/reports', adminController.getAllReports);

// @route   GET /api/admin/reports/pending
// @desc    Get pending reports
// @access  Private (Admin/Authority)
router.get('/reports/pending', adminController.getPendingReports);

// @route   PUT /api/admin/reports/:id/verify
// @desc    Verify a report
// @access  Private (Admin)
router.put('/reports/:id/verify', authorize('admin'), adminController.verifyReport);

// @route   PUT /api/admin/reports/:id/reject
// @desc    Reject a report
// @access  Private (Admin)
router.put('/reports/:id/reject', authorize('admin'), adminController.rejectReport);

// @route   PUT /api/admin/reports/:id/resolve
// @desc    Mark report as resolved
// @access  Private (Admin/Authority)
router.put('/reports/:id/resolve', adminController.resolveReport);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/stats', authorize('admin'), adminController.getStats);

// @route   GET /api/admin/reports/export
// @desc    Export reports to CSV
// @access  Private (Admin)
router.get('/reports/export', authorize('admin'), adminController.exportReports);

module.exports = router;
