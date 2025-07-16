require('dotenv').config();
const { sequelize } = require('./config/database');

async function checkDatabaseConnection() {
  console.log('🔍 Checking database connection...');
  
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection: OK');
    
    // Test query
    const result = await sequelize.query('SELECT 1 as test', {
      type: sequelize.QueryTypes.SELECT
    });
    console.log('✅ Test query result:', result);
    
    // Check tables
    const tables = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `, {
      type: sequelize.QueryTypes.SELECT
    });
    
    console.log('📋 Database tables:', tables.map(t => t.table_name));
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
    return false;
  } finally {
    await sequelize.close();
  }
}

// Run check
checkDatabaseConnection().then((success) => {
  if (success) {
    console.log('🎉 Database check completed successfully');
    process.exit(0);
  } else {
    console.log('❌ Database check failed');
    process.exit(1);
  }
});