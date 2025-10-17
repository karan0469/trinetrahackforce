const Report = require('../models/Report');
const User = require('../models/User');
const Authority = require('../models/Authority');
const { sendReportToAuthority } = require('../utils/emailService');

// @desc    Get all reports
exports.getAllReports = async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 20, sortBy = '-createdAt' } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('userId', 'name email phone reputation')
      .populate('verifiedBy', 'name email')
      .populate('assignedTo', 'name email department')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Report.countDocuments(query);

    res.json({
      success: true,
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending reports
exports.getPendingReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ status: 'Pending' })
      .populate('userId', 'name email phone reputation')
      .sort('-createdAt')
      .exec();

    res.json({
      success: true,
      reports,
      total: reports.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify a report
exports.verifyReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Report has already been processed'
      });
    }

    // Update report status
    report.status = 'Verified';
    report.verifiedBy = req.user._id;
    report.verifiedAt = new Date();
    report.pointsAwarded = 10;

    // Find appropriate authority based on category
    const authority = await Authority.findOne({
      categories: report.category,
      isActive: true
    });

    if (authority) {
      report.assignedTo = authority._id;
      
      // Send email to authority
      const user = await User.findById(report.userId);
      await sendReportToAuthority(report, authority, user);
      
      // Update authority stats
      authority.reportsHandled += 1;
      await authority.save();
    }

    await report.save();

    // Award points to user
    const user = await User.findById(report.userId);
    user.points += 10;
    user.verifiedReportsCount += 1;
    user.reputation = Math.min(100, (user.verifiedReportsCount / user.reportsCount) * 100);
    await user.save();

    await report.populate('userId', 'name email phone');
    await report.populate('verifiedBy', 'name email');
    await report.populate('assignedTo', 'name email department');

    res.json({
      success: true,
      message: 'Report verified successfully. User awarded 10 points.',
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a report
exports.rejectReport = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Report has already been processed'
      });
    }

    report.status = 'Rejected';
    report.verifiedBy = req.user._id;
    report.verifiedAt = new Date();
    report.rejectionReason = reason || 'Does not meet verification criteria';

    await report.save();

    // Update user reputation (decrease slightly for rejected reports)
    const user = await User.findById(report.userId);
    user.reputation = Math.max(0, (user.verifiedReportsCount / user.reportsCount) * 100);
    await user.save();

    await report.populate('userId', 'name email phone');
    await report.populate('verifiedBy', 'name email');

    res.json({
      success: true,
      message: 'Report rejected',
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark report as resolved
exports.resolveReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.status !== 'Verified') {
      return res.status(400).json({
        success: false,
        message: 'Only verified reports can be resolved'
      });
    }

    report.status = 'Resolved';
    report.resolvedAt = new Date();
    await report.save();

    // Update authority stats if assigned
    if (report.assignedTo) {
      await Authority.findByIdAndUpdate(report.assignedTo, {
        $inc: { reportsResolved: 1 }
      });
    }

    res.json({
      success: true,
      message: 'Report marked as resolved',
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
exports.getStats = async (req, res, next) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });
    const verifiedReports = await Report.countDocuments({ status: 'Verified' });
    const resolvedReports = await Report.countDocuments({ status: 'Resolved' });
    const rejectedReports = await Report.countDocuments({ status: 'Rejected' });
    
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAuthorities = await Authority.countDocuments();

    // Category breakdown
    const categoryStats = await Report.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent reports
    const recentReports = await Report.find()
      .populate('userId', 'name email')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      stats: {
        reports: {
          total: totalReports,
          pending: pendingReports,
          verified: verifiedReports,
          resolved: resolvedReports,
          rejected: rejectedReports
        },
        users: totalUsers,
        authorities: totalAuthorities,
        categoryBreakdown: categoryStats,
        recentReports
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export reports to CSV
exports.exportReports = async (req, res, next) => {
  try {
    const { status, category } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const reports = await Report.find(query)
      .populate('userId', 'name email phone')
      .populate('verifiedBy', 'name email')
      .sort('-createdAt');

    // Generate CSV
    let csv = 'ID,Category,Description,Status,Reporter,Email,Location,Created At,Verified At\n';

    reports.forEach(report => {
      const row = [
        report._id,
        report.category,
        `"${report.description.replace(/"/g, '""')}"`,
        report.status,
        report.userId?.name || 'N/A',
        report.userId?.email || 'N/A',
        `"${report.location.coordinates.join(', ')}"`,
        new Date(report.createdAt).toISOString(),
        report.verifiedAt ? new Date(report.verifiedAt).toISOString() : 'N/A'
      ];
      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=reports-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
