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
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    res.json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
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
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API available at: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📋 Categories API: http://localhost:${PORT}/api/categories`);
      console.log(`📱 Phone Numbers API: http://localhost:${PORT}/api/phone-numbers`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('📤 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        sequelize.close();
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('📤 SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        sequelize.close();
        process.exit(0);
      });
    });

    // Database connection monitoring
    setInterval(async () => {
      try {
        await sequelize.authenticate();
        console.log('⏰ Database connection check: OK');
      } catch (error) {
        console.error('❌ Database connection check failed:', error.message);
      }
    }, 60000); // Check every minute
    
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    console.error('Full error:', error);
    // Don't exit process, retry connection
    console.log('⏳ Retrying connection in 5 seconds...');
    setTimeout(() => {
      startServer();
    }, 5000);
  }
}

// Handle uncaught exceptions - don't exit process
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Log error but don't exit - let server continue running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Log error but don't exit - let server continue running
});

startServer();

module.exports = app;
