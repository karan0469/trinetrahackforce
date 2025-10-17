const Authority = require('../models/Authority');

// @desc    Get all authorities
exports.getAllAuthorities = async (req, res, next) => {
  try {
    const authorities = await Authority.find({ isActive: true })
      .select('-__v')
      .sort('name');

    res.json({
      success: true,
      authorities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new authority
exports.createAuthority = async (req, res, next) => {
  try {
    const { name, email, contactNumber, department, jurisdiction, categories } = req.body;

    const authority = await Authority.create({
      name,
      email,
      contactNumber,
      department,
      jurisdiction,
      categories
    });

    res.status(201).json({
      success: true,
      message: 'Authority created successfully',
      authority
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Authority with this email already exists'
      });
    }
    next(error);
  }
};

// @desc    Update authority
exports.updateAuthority = async (req, res, next) => {
  try {
    const authority = await Authority.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!authority) {
      return res.status(404).json({
        success: false,
        message: 'Authority not found'
      });
    }

    res.json({
      success: true,
      message: 'Authority updated successfully',
      authority
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete authority
exports.deleteAuthority = async (req, res, next) => {
  try {
    const authority = await Authority.findByIdAndDelete(req.params.id);

    if (!authority) {
      return res.status(404).json({
        success: false,
        message: 'Authority not found'
      });
    }

    res.json({
      success: true,
      message: 'Authority deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
