const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'whatsapp_numbers',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  dialect: 'postgresql',

  // Connection pool configuration
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // Logging configuration
  logging: (msg) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🗃️ DB:', msg);
    }
  },

  // Retry configuration
  retry: {
    max: 3,
    backoffBase: 1000,
    backoffExponent: 1.5
  },

  // Timezone
  timezone: '+07:00',

  // Connection options
  dialectOptions: {
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    statement_timeout: 60000,
    idle_in_transaction_session_timeout: 60000
  }
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
};

module.exports = { sequelize, testConnection };
