import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for bulk operations
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
    return config
  },
  (error) => {
    console.error('🚨 API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })
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
  createBulk: (data) => {
    console.log('📤 Bulk import request:', data)
    return api.post('/api/phone-numbers/bulk', data)
  },
  checkDuplicate: (number) => api.post('/api/phone-numbers/check', { number }),
  update: (id, data) => api.put(`/api/phone-numbers/${id}`, data),
  delete: (id) => api.delete(`/api/phone-numbers/${id}`),
}

export default api