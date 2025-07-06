const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
const { sequelize } = require('./config/database');

// Import routes
const apiRoutes = require('./routes/index');

// Use routes
app.use('/api', apiRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'WhatsApp Numbers Management API',
    status: 'Server is running',
    version: '1.0.0',
    endpoints: {
      categories: '/api/categories',
      phoneNumbers: '/api/phone-numbers',
      health: '/api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/categories',
      'POST /api/categories',
      'PUT /api/categories/:id',
      'DELETE /api/categories/:id',
      'GET /api/phone-numbers',
      'POST /api/phone-numbers',
      'POST /api/phone-numbers/bulk',
      'POST /api/phone-numbers/check',
      'PUT /api/phone-numbers/:id',
      'DELETE /api/phone-numbers/:id'
    ]
  });
});

// Database connection and server startup
async function startServer() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Sync database models
    console.log('🔄 Synchronizing database models...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API available at: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📋 Categories API: http://localhost:${PORT}/api/categories`);
      console.log(`📱 Phone Numbers API: http://localhost:${PORT}/api/phone-numbers`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

module.exports = app;
