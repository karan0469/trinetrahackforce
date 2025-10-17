import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Report APIs
export const reportAPI = {
  getAll: (params) => api.get('/api/reports', { params }),
  getMyReports: (params) => api.get('/api/reports/my-reports', { params }),
  getById: (id) => api.get(`/api/reports/${id}`),
  create: (formData) => api.post('/api/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/reports/${id}`),
  addPeerVerification: (id, verified) => api.post(`/api/reports/${id}/peer-verify`, { verified })
};

// User APIs
export const userAPI = {
  getLeaderboard: (limit) => api.get('/api/users/leaderboard', { params: { limit } }),
  getProfile: (id) => api.get(`/api/users/profile/${id}`),
  getStats: () => api.get('/api/users/stats')
};

// Reward APIs
export const rewardAPI = {
  getAvailable: () => api.get('/api/rewards/available'),
  redeem: (rewardId) => api.post('/api/rewards/redeem', { rewardId }),
  getMyRedemptions: () => api.get('/api/rewards/my-redemptions')
};

// Admin APIs
export const adminAPI = {
  getAllReports: (params) => api.get('/api/admin/reports', { params }),
  getPendingReports: () => api.get('/api/admin/reports/pending'),
  verifyReport: (id) => api.put(`/api/admin/reports/${id}/verify`),
  rejectReport: (id, reason) => api.put(`/api/admin/reports/${id}/reject`, { reason }),
  resolveReport: (id) => api.put(`/api/admin/reports/${id}/resolve`),
  getStats: () => api.get('/api/admin/stats'),
  exportReports: (params) => api.get('/api/admin/reports/export', { params })
};

// Authority APIs
export const authorityAPI = {
  getAll: () => api.get('/api/authorities'),
  create: (data) => api.post('/api/authorities', data),
  update: (id, data) => api.put(`/api/authorities/${id}`, data),
  delete: (id) => api.delete(`/api/authorities/${id}`)
};

export default api;
