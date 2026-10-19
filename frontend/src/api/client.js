import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s and token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');

      // If no refresh token or call was to refresh endpoint, fail immediately
      if (!refreshToken || originalRequest.url.includes('/auth/refresh-token')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post('/api/auth/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefresh, user } = res.data.data;

        localStorage.setItem('accessToken', accessToken);
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
        if (user) localStorage.setItem('user', JSON.stringify(user));

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// API Service Methods
export const authApi = {
  sendOtp: (data) => api.post('/auth/send-otp', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refreshToken: (data) => api.post('/auth/refresh-token', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const metaApi = {
  getStates: () => api.get('/meta/states'),
  getCities: (stateId) => api.get(`/meta/states/${stateId}/cities`),
  getCategories: (group) => api.get('/meta/categories', { params: { group } }),
};

export const reportApi = {
  createReport: (formData) =>
    api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getPublicReports: (params) => api.get('/reports', { params }),
  getMyReports: (params) => api.get('/reports/me', { params }),
  getReport: (id) => api.get(`/reports/${id}`),
  updateStatus: (id, data) => api.put(`/reports/${id}/status`, data),
  toggleLike: (id) => api.post(`/reports/${id}/like`),
  addComment: (id, data) => api.post(`/reports/${id}/comments`, data),
  getComments: (id) => api.get(`/reports/${id}/comments`),
};

export const adminApi = {
  getAnalytics: () => api.get('/admin/analytics'),
  getReports: (params) => api.get('/admin/reports', { params }),
  getReportLogs: (reportId) => api.get(`/admin/reports/${reportId}/logs`),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (userId) => api.put(`/admin/users/${userId}/toggle-status`),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, null, { params: { role } }),
  getContentReports: (params) => api.get('/admin/content-reports', { params }),
  resolveContentReport: (id, params) => api.put(`/admin/content-reports/${id}/resolve`, null, { params }),
};

export const notificationApi = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const contentReportApi = {
  reportContent: (data) => api.post('/content-reports', data),
};

export default api;
