import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: { email: string; name: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Weekly Check-in API
export const weeklyCheckInAPI = {
  create: (data: any) => api.post('/weekly-checkins', data),
  update: (id: string, data: any) => api.put(`/weekly-checkins/${id}`, data),
  getAll: (limit?: number) => api.get('/weekly-checkins', { params: { limit } }),
  getCurrent: () => api.get('/weekly-checkins/current'),
  getStats: (weeks?: number) => api.get('/weekly-checkins/stats', { params: { weeks } }),
};

// Money API
export const moneyAPI = {
  createTransaction: (data: any) => api.post('/money', data),
  getTransactions: (params?: any) => api.get('/money', { params }),
  updateTransaction: (id: string, data: any) => api.put(`/money/${id}`, data),
  deleteTransaction: (id: string) => api.delete(`/money/${id}`),
  getMonthlyStats: (month?: number, year?: number) =>
    api.get('/money/stats/monthly', { params: { month, year } }),
  getYearlyOverview: (year?: number) =>
    api.get('/money/stats/yearly', { params: { year } }),
};
