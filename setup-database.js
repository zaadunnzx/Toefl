const { sequelize } = require('./config/database');
const { Category, PhoneNumber } = require('./models');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    // Create tables
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database tables created/updated.');
    
    // Check if there are any categories
    const categoryCount = await Category.count();
    console.log(`📊 Current categories count: ${categoryCount}`);
    
    // Create some sample categories if none exist
    if (categoryCount === 0) {
      console.log('🔄 Creating sample categories...');
      
      const sampleCategories = [
        { name: 'Pelanggan', description: 'Nomor pelanggan aktif' },
        { name: 'Prospek', description: 'Calon pelanggan potensial' },
        { name: 'Vendor', description: 'Nomor vendor dan supplier' },
        { name: 'Tim Internal', description: 'Nomor tim internal perusahaan' }
      ];
      
      for (const category of sampleCategories) {
        await Category.create(category);
        console.log(`✅ Created category: ${category.name}`);
      }
    }
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
