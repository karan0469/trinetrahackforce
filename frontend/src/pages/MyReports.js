import React, { useState, useEffect } from 'react';
import { reportAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FileText, Clock, CheckCircle, XCircle, MapPin, Trash2, Eye } from 'lucide-react';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Verified: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Resolved: 'bg-blue-100 text-blue-800'
};

const STATUS_ICONS = {
  Pending: Clock,
  Verified: CheckCircle,
  Rejected: XCircle,
  Resolved: CheckCircle
};

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await reportAPI.getMyReports(params);
      setReports(response.data.reports);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await reportAPI.delete(id);
      toast.success('Report deleted successfully');
      fetchReports();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete report');
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <FileText className="h-8 w-8 text-primary-600" />
          <span>My Reports</span>
        </h1>
        <p className="mt-2 text-gray-600">View and manage all your submitted reports</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'Pending', 'Verified', 'Rejected', 'Resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'All Reports' : status}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      {reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-900">No reports found</p>
          <p className="text-gray-600 mt-2">Create your first report to get started</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => {
            const StatusIcon = STATUS_ICONS[report.status];
            return (
              <div
                key={report._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
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
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-2">
                          {report.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 mt-2">
                          {report.description}
                        </h3>
                      </div>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[report.status]}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span>{report.status}</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {report.location.address || `${report.location.coordinates[1]}, ${report.location.coordinates[0]}`}
                        </span>
                      </div>
                      <p>
                        <span className="font-medium">Submitted:</span>{' '}
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {report.status === 'Verified' && report.pointsAwarded > 0 && (
                        <p className="text-primary-600 font-semibold">
                          ✨ Earned {report.pointsAwarded} points
                        </p>
                      )}
                      {report.status === 'Rejected' && report.rejectionReason && (
                        <p className="text-red-600">
                          <span className="font-medium">Reason:</span> {report.rejectionReason}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="flex items-center space-x-1 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      {report.status === 'Pending' && (
                        <button
                          onClick={() => handleDelete(report._id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">Report Details</h3>
              <img
                src={selectedReport.photoUrl}
                alt="Report"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <p><span className="font-semibold">Category:</span> {selectedReport.category}</p>
                <p><span className="font-semibold">Description:</span> {selectedReport.description}</p>
                <p><span className="font-semibold">Status:</span> {selectedReport.status}</p>
                <p><span className="font-semibold">Location:</span> {selectedReport.location.address || `${selectedReport.location.coordinates[1]}, ${selectedReport.location.coordinates[0]}`}</p>
                <p><span className="font-semibold">Submitted:</span> {new Date(selectedReport.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="mt-6 w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;
