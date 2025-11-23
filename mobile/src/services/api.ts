import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Change to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = ''; // Get from secure storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials).then((res) => res.data),
};

export const jobsAPI = {
  getJobs: (params?: any) => api.get('/jobs', { params }).then((res) => res.data),
  getJob: (id: string) => api.get(`/jobs/${id}`).then((res) => res.data),
  updateJobStatus: (id: string, status: string) =>
    api.patch(`/jobs/${id}/status`, { status }).then((res) => res.data),
};

export const customersAPI = {
  getCustomer: (id: string) => api.get(`/customers/${id}`).then((res) => res.data),
};

export default api;
