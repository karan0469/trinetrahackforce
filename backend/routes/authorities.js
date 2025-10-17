const express = require('express');
const router = express.Router();
const authorityController = require('../controllers/authorityController');
const { protect, authorize } = require('../middleware/auth');

// Get all authorities (public)
router.get('/', authorityController.getAllAuthorities);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

// @route   POST /api/authorities
// @desc    Create a new authority
// @access  Private (Admin)
router.post('/', authorityController.createAuthority);

// @route   PUT /api/authorities/:id
// @desc    Update authority
// @access  Private (Admin)
router.put('/:id', authorityController.updateAuthority);

// @route   DELETE /api/authorities/:id
// @desc    Delete authority
// @access  Private (Admin)
router.delete('/:id', authorityController.deleteAuthority);

module.exports = router;
