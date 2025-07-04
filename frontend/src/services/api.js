import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
}

// Phone Numbers API
export const phoneNumbersAPI = {
  getAll: () => api.get('/api/phone-numbers'),
  getById: (id) => api.get(`/api/phone-numbers/${id}`),
  create: (data) => api.post('/api/phone-numbers', data),
  createBulk: (data) => api.post('/api/phone-numbers/bulk', data),
  checkDuplicate: (number) => api.post('/api/phone-numbers/check', { number }),
  update: (id, data) => api.put(`/api/phone-numbers/${id}`, data),
  delete: (id) => api.delete(`/api/phone-numbers/${id}`),
}

// Health Check API
export const healthAPI = {
  check: () => api.get('/api/health'),
}

export default api