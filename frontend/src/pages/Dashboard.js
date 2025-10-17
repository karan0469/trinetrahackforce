import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  Award,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Camera,
  Trophy
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await userAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
        <p className="mt-2 text-gray-600">Here's your impact on the community</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-3xl font-bold text-primary-600">{stats?.points || 0}</p>
            </div>
            <Award className="h-12 w-12 text-primary-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalReports || 0}</p>
            </div>
            <FileText className="h-12 w-12 text-blue-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-3xl font-bold text-green-600">{stats?.verifiedReports || 0}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.pendingReports || 0}</p>
            </div>
            <Clock className="h-12 w-12 text-yellow-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* Reputation & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Reputation Card */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Your Reputation</h3>
            <TrendingUp className="h-8 w-8" />
          </div>
          <div className="mb-4">
            <div className="flex items-end space-x-2">
              <span className="text-5xl font-bold">{Math.round(stats?.reputation || 0)}</span>
              <span className="text-2xl mb-2">/100</span>
            </div>
            <p className="text-primary-100 mt-2">
              {stats?.reputation >= 80 ? 'Excellent!' : stats?.reputation >= 60 ? 'Good!' : 'Keep reporting!'}
            </p>
          </div>
          <div className="w-full bg-primary-700 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats?.reputation || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/create-report"
              className="flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition"
            >
              <Camera className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-semibold text-gray-900">Create New Report</p>
                <p className="text-sm text-gray-600">Report a civic violation</p>
              </div>
            </Link>
            <Link
              to="/rewards"
              className="flex items-center space-x-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition"
            >
              <Award className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-900">Redeem Rewards</p>
                <p className="text-sm text-gray-600">Use your {stats?.points || 0} points</p>
              </div>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
            >
              <Trophy className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900">View Leaderboard</p>
                <p className="text-sm text-gray-600">See top reporters</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Reports by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.categoryBreakdown.map((cat) => (
              <div key={cat._id} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{cat.count}</p>
                <p className="text-sm text-gray-600 mt-1">{cat._id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
