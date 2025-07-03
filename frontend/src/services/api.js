// API service for WhatsApp Numbers Management
import axios from 'axios';

// Check if backend is available
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // If backend is not available, fallback to mock API
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.response?.status === 500) {
      console.warn('🔄 Backend not available, falling back to mock API');
      // Import mock API dynamically to avoid circular imports
      return import('./mockApi.js').then(mockApi => {
        return handleMockApiCall(error.config, mockApi.default);
      });
    }
    
    return Promise.reject(error);
  }
);

// Handle mock API calls when backend is unavailable
const handleMockApiCall = async (config, mockApi) => {
  const { method, url, data } = config;
  const urlParts = url.replace(API_BASE_URL, '').split('/').filter(Boolean);
  
  try {
    let result;
    
    if (urlParts[0] === 'categories') {
      if (method === 'get' && urlParts.length === 1) {
        result = await mockApi.categories.getAll();
      } else if (method === 'post') {
        result = await mockApi.categories.create(data);
      } else if (method === 'put' && urlParts[1]) {
        result = await mockApi.categories.update(urlParts[1], data);
      } else if (method === 'delete' && urlParts[1]) {
        result = await mockApi.categories.delete(urlParts[1]);
      }
    } else if (urlParts[0] === 'phone-numbers') {
      if (method === 'get' && urlParts.length === 1) {
        result = await mockApi.phoneNumbers.getAll();
      } else if (method === 'post') {
        result = await mockApi.phoneNumbers.create(data);
      } else if (method === 'delete' && urlParts[1]) {
        result = await mockApi.phoneNumbers.delete(urlParts[1]);
      } else if (method === 'get' && urlParts[1] === 'check' && urlParts[2]) {
        result = await mockApi.phoneNumbers.check(decodeURIComponent(urlParts[2]));
      }
    }
    
    return result || { data: { success: false, message: 'Mock API endpoint not found' } };
  } catch (mockError) {
    throw new Error(`Mock API Error: ${mockError.message}`);
  }
};

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await api.get('/health');
    return {
      connected: true,
      data: response.data
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

// Phone Numbers API  
export const phoneNumbersApi = {
  getAll: () => api.get('/phone-numbers'),
  create: (data) => api.post('/phone-numbers', data),
  delete: (id) => api.delete(`/phone-numbers/${id}`),
  check: (number) => api.get(`/phone-numbers/check/${encodeURIComponent(number)}`)
};

// Export the axios instance for custom requests
export default api;
