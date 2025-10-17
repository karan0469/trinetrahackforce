import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Settings,
  FileText,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Download,
  Eye,
  Loader
} from 'lucide-react';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Verified: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Resolved: 'bg-blue-100 text-blue-800'
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getPendingReports()
      ]);
      setStats(statsRes.data.stats);
      setPendingReports(pendingRes.data.reports);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reportId) => {
    setProcessing(reportId);
    try {
      await adminAPI.verifyReport(reportId);
      toast.success('Report verified successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify report');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (reportId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessing(reportId);
    try {
      await adminAPI.rejectReport(reportId, rejectionReason);
      toast.success('Report rejected');
      setRejectionReason('');
      setSelectedReport(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject report');
    } finally {
      setProcessing(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await adminAPI.exportReports({});
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports-${Date.now()}.csv`;
      a.click();
      toast.success('Reports exported successfully');
    } catch (error) {
      toast.error('Failed to export reports');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const pieData = [
    { name: 'Verified', value: stats?.reports?.verified || 0 },
    { name: 'Pending', value: stats?.reports?.pending || 0 },
    { name: 'Rejected', value: stats?.reports?.rejected || 0 },
    { name: 'Resolved', value: stats?.reports?.resolved || 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="h-8 w-8 text-primary-600" />
            <span>Admin Dashboard</span>
          </h1>
          <p className="mt-2 text-gray-600">Manage reports and monitor platform activity</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <Download className="h-5 w-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-primary-600">{stats?.reports?.total || 0}</p>
            </div>
            <FileText className="h-12 w-12 text-primary-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.reports?.pending || 0}</p>
            </div>
            <FileText className="h-12 w-12 text-yellow-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-3xl font-bold text-green-600">{stats?.reports?.verified || 0}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.users || 0}</p>
            </div>
            <Users className="h-12 w-12 text-blue-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Reports by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Reports by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.categoryBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#16a34a" name="Reports" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Reports */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Pending Reports ({pendingReports.length})</h2>
        
        {pendingReports.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-900">All caught up!</p>
            <p className="text-gray-600 mt-2">No pending reports to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div
                key={report._id}
                className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 flex-shrink-0">
                    <img
                      src={report.photoUrl}
                      alt="Report"
                      className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(report.photoUrl, '_blank')}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-semibold rounded-full mb-2">
                        {report.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mt-2">
                        {report.description}
                      </h3>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>
                        <span className="font-medium">Reporter:</span> {report.userId?.name} ({report.userId?.email})
                      </p>
                      <p>
                        <span className="font-medium">Reputation:</span> {Math.round(report.userId?.reputation || 0)}/100
                      </p>
                      <p>
                        <span className="font-medium">Location:</span>{' '}
                        {report.location?.address || `${report.location?.coordinates[1]}, ${report.location?.coordinates[0]}`}
                      </p>
                      <p>
                        <span className="font-medium">Submitted:</span>{' '}
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleVerify(report._id)}
                        disabled={processing === report._id}
                        className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {processing === report._id ? (
                          <Loader className="animate-spin h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span>Verify & Award Points</span>
                      </button>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => window.open(report.photoUrl, '_blank')}
                        className="flex items-center space-x-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Full Image</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setSelectedReport(null);
            setRejectionReason('');
          }}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Reject Report</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this report:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Image quality is too poor, Not a valid violation..."
            ></textarea>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => handleReject(selectedReport._id)}
                disabled={processing === selectedReport._id || !rejectionReason.trim()}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {processing === selectedReport._id ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setRejectionReason('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
