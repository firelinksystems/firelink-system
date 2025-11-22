import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials).then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
}

export const customersAPI = {
  getCustomers: (params?: any) => api.get('/customers', { params }).then((res) => res.data),
  getCustomer: (id: string) => api.get(`/customers/${id}`).then((res) => res.data),
  createCustomer: (data: any) => api.post('/customers', data).then((res) => res.data),
}

export const jobsAPI = {
  getJobs: (params?: any) => api.get('/jobs', { params }).then((res) => res.data),
  getJob: (id: string) => api.get(`/jobs/${id}`).then((res) => res.data),
  createJob: (data: any) => api.post('/jobs', data).then((res) => res.data),
  updateJobStatus: (id: string, status: string) =>
    api.patch(`/jobs/${id}/status`, { status }).then((res) => res.data),
  getJobProfitability: (id: string) =>
    api.get(`/jobs/${id}/profitability`).then((res) => res.data),
}

export const schedulingAPI = {
  getEngineers: (params?: any) => api.get('/scheduling/engineers', { params }).then((res) => res.data),
  assignEngineer: (data: any) => api.post('/scheduling/assign', data).then((res) => res.data),
  getCalendar: (params?: any) => api.get('/scheduling/calendar', { params }).then((res) => res.data),
}

export const financialAPI = {
  createInvoice: (data: any) => api.post('/financial/invoices', data).then((res) => res.data),
  sendInvoice: (id: string) => api.post(`/financial/invoices/${id}/send`).then((res) => res.data),
  processPayment: (data: any) => api.post('/financial/payments', data).then((res) => res.data),
  getProfitLossReport: (params?: any) =>
    api.get('/financial/reports/profit-loss', { params }).then((res) => res.data),
}

export default api
