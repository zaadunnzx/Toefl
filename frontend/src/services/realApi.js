import axios from 'axios';

// API base configuration
const BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please make sure the backend is running.');
    }
    
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'Server error occurred');
    } else if (error.request) {
      // Request made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create new category
  create: async (data) => {
    try {
      const response = await api.post('/categories', data);
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update category
  update: async (id, data) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

// Phone Numbers API
export const phoneNumbersApi = {
  // Get all phone numbers
  getAll: async () => {
    try {
      const response = await api.get('/phone-numbers');
      return response;
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      throw error;
    }
  },

  // Add new phone number
  create: async (data) => {
    try {
      const response = await api.post('/phone-numbers', data);
      return response;
    } catch (error) {
      console.error('Error adding phone number:', error);
      throw error;
    }
  },

  // Check if phone number exists (for duplicate detection)
  check: async (phoneNumber) => {
    try {
      const response = await api.post('/phone-numbers/check', { 
        phone_number: phoneNumber 
      });
      return response;
    } catch (error) {
      console.error('Error checking phone number:', error);
      throw error;
    }
  },

  // Delete phone number
  delete: async (id) => {
    try {
      const response = await api.delete(`/phone-numbers/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting phone number:', error);
      throw error;
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Test connection
export const testConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL.replace('/api', '')}/`);
    return response;
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
};

export default api;