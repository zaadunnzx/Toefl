const express = require('express');
const router = express.Router();

// Import route modules
const categoriesRoutes = require('./categories');
const phoneNumbersRoutes = require('./phoneNumbers');

// Use routes
router.use('/categories', categoriesRoutes);
router.use('/phone-numbers', phoneNumbersRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'WhatsApp Numbers API is running',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'WhatsApp Numbers API',
    version: '1.0.0',
    endpoints: {
      categories: {
        'GET /api/categories': 'Get all categories',
        'POST /api/categories': 'Create new category',
        'PUT /api/categories/:id': 'Update category',
        'DELETE /api/categories/:id': 'Delete category'
      },
      phoneNumbers: {
        'GET /api/phone-numbers': 'Get all phone numbers',
        'POST /api/phone-numbers': 'Add new phone number',
        'PUT /api/phone-numbers/:id': 'Update phone number',
        'DELETE /api/phone-numbers/:id': 'Delete phone number',
        'GET /api/phone-numbers/check/:number': 'Check if phone number exists'
      },
      system: {
        'GET /api/health': 'Health check',
        'GET /api/': 'API documentation'
      }
    }
  });
});

module.exports = router;
