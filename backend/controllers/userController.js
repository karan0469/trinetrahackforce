const User = require('../models/User');
const Report = require('../models/Report');

// @desc    Get leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const users = await User.find({ role: 'user' })
      .select('name email points reputation verifiedReportsCount profileImage')
      .sort('-points -verifiedReportsCount')
      .limit(parseInt(limit));

    res.json({
      success: true,
      leaderboard: users.map((user, index) => ({
        rank: index + 1,
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        reputation: user.reputation,
        verifiedReports: user.verifiedReportsCount,
        profileImage: user.profileImage
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -firebaseUid');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's recent reports
    const recentReports = await Report.find({ userId: user._id })
      .select('category status createdAt photoUrl')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        reputation: user.reputation,
        reportsCount: user.reportsCount,
        verifiedReportsCount: user.verifiedReportsCount,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      },
      recentReports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user statistics
exports.getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalReports = await Report.countDocuments({ userId });
    const pendingReports = await Report.countDocuments({ userId, status: 'Pending' });
    const verifiedReports = await Report.countDocuments({ userId, status: 'Verified' });
    const rejectedReports = await Report.countDocuments({ userId, status: 'Rejected' });
    const resolvedReports = await Report.countDocuments({ userId, status: 'Resolved' });

    // Category breakdown
    const categoryStats = await Report.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalReports,
        pendingReports,
        verifiedReports,
        rejectedReports,
        resolvedReports,
        categoryBreakdown: categoryStats,
        points: req.user.points,
        reputation: req.user.reputation
      }
    });
  } catch (error) {
    next(error);
  }
};
