// Mock API service for demo purposes
const mockData = {
  categories: [
    { id: 1, name: 'Pelanggan', description: 'Nomor pelanggan aktif', created_at: '2025-01-01', updated_at: '2025-01-01' },
    { id: 2, name: 'Prospek', description: 'Calon pelanggan potensial', created_at: '2025-01-01', updated_at: '2025-01-01' },
    { id: 3, name: 'Vendor', description: 'Nomor vendor dan supplier', created_at: '2025-01-01', updated_at: '2025-01-01' },
    { id: 4, name: 'Tim Internal', description: 'Nomor tim internal perusahaan', created_at: '2025-01-01', updated_at: '2025-01-01' }
  ],
  phoneNumbers: [
    {
      id: 1,
      original_number: '+6285476387234',
      normalized_number: '+6285476387234',
      category_id: 1,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      category: { id: 1, name: 'Pelanggan', description: 'Nomor pelanggan aktif' }
    },
    {
      id: 2,
      original_number: '+ 62-865-453-765',
      normalized_number: '+62865453765',
      category_id: 2,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      category: { id: 2, name: 'Prospek', description: 'Calon pelanggan potensial' }
    },
    {
      id: 3,
      original_number: '08123456789',
      normalized_number: '+62123456789',
      category_id: 1,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      category: { id: 1, name: 'Pelanggan', description: 'Nomor pelanggan aktif' }
    },
    {
      id: 4,
      original_number: '+1234567890',
      normalized_number: '+1234567890',
      category_id: 3,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      category: { id: 3, name: 'Vendor', description: 'Nomor vendor dan supplier' }
    }
  ]
};

let nextCategoryId = 5;
let nextPhoneId = 5;

// Utility function to normalize phone numbers
const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters except the leading +
  let normalized = phoneNumber.replace(/[^\d+]/g, '');
  
  // Handle Indonesian numbers starting with 08
  if (normalized.startsWith('08')) {
    normalized = '+62' + normalized.substring(1);
  }
  
  // Ensure it starts with +
  if (!normalized.startsWith('+')) {
    if (/^\d/.test(normalized)) {
      normalized = '+' + normalized;
    }
  }
  
  return normalized;
};

// Simulate network delay
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementation
const mockApi = {
  // Categories API
  categories: {
    getAll: async () => {
      await simulateDelay();
      return {
        data: {
          success: true,
          data: mockData.categories,
          message: 'Categories retrieved successfully'
        }
      };
    },
    
    create: async (data) => {
      await simulateDelay();
      const newCategory = {
        id: nextCategoryId++,
        name: data.name,
        description: data.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockData.categories.push(newCategory);
      return {
        data: {
          success: true,
          data: newCategory,
          message: 'Category created successfully'
        }
      };
    },
    
    update: async (id, data) => {
      await simulateDelay();
      const category = mockData.categories.find(c => c.id === parseInt(id));
      if (category) {
        category.name = data.name;
        category.description = data.description || null;
        category.updated_at = new Date().toISOString();
      }
      return {
        data: {
          success: true,
          data: category,
          message: 'Category updated successfully'
        }
      };
    },
    
    delete: async (id) => {
      await simulateDelay();
      const index = mockData.categories.findIndex(c => c.id === parseInt(id));
      if (index !== -1) {
        mockData.categories.splice(index, 1);
        // Also remove associated phone numbers
        mockData.phoneNumbers = mockData.phoneNumbers.filter(p => p.category_id !== parseInt(id));
      }
      return {
        data: {
          success: true,
          message: 'Category deleted successfully'
        }
      };
    }
  },
  
  // Phone Numbers API
  phoneNumbers: {
    getAll: async () => {
      await simulateDelay();
      return {
        data: {
          success: true,
          data: mockData.phoneNumbers,
          message: 'Phone numbers retrieved successfully'
        }
      };
    },
    
    create: async (data) => {
      await simulateDelay();
      const normalized = normalizePhoneNumber(data.phone_number);
      
      // Check for duplicates
      const existingNumber = mockData.phoneNumbers.find(p => p.normalized_number === normalized);
      if (existingNumber) {
        throw new Error('This phone number already exists in the system');
      }
      
      const category = mockData.categories.find(c => c.id === parseInt(data.category_id));
      const newPhoneNumber = {
        id: nextPhoneId++,
        original_number: data.phone_number,
        normalized_number: normalized,
        category_id: parseInt(data.category_id),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: category ? { id: category.id, name: category.name, description: category.description } : null
      };
      
      mockData.phoneNumbers.push(newPhoneNumber);
      return {
        data: {
          success: true,
          data: newPhoneNumber,
          message: 'Phone number added successfully'
        }
      };
    },
    
    delete: async (id) => {
      await simulateDelay();
      const index = mockData.phoneNumbers.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        mockData.phoneNumbers.splice(index, 1);
      }
      return {
        data: {
          success: true,
          message: 'Phone number deleted successfully'
        }
      };
    },
    
    check: async (number) => {
      await simulateDelay();
      const normalized = normalizePhoneNumber(number);
      const existingNumber = mockData.phoneNumbers.find(p => p.normalized_number === normalized);
      
      return {
        data: {
          success: true,
          exists: !!existingNumber,
          data: existingNumber || null,
          normalized_number: normalized,
          message: existingNumber ? 'Phone number already exists in the system' : 'Phone number is available'
        }
      };
    }
  }
};

// Export the mock API with the same interface as the real API
export const categoriesApi = mockData.categories.length > 0 ? mockApi.categories : mockApi.categories;
export const phoneNumbersApi = mockApi.phoneNumbers;

export default mockApi;
