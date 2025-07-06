const { sequelize } = require('./config/database');
const { Category } = require('./models');

const seedCategories = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync models
    await sequelize.sync({ force: false });
    console.log('✅ Models synchronized');
    
    // Check if categories already exist
    const existingCategories = await Category.count();
    
    if (existingCategories === 0) {
      // Create default categories
      const defaultCategories = [
        {
          name: 'Pelanggan VIP',
          description: 'Pelanggan dengan tingkat prioritas tinggi'
        },
        {
          name: 'Pelanggan VIP 2',
          description: 'Pelanggan dengan tingkat prioritas tinggi level 2'
        },
        {
          name: 'Pelanggan Regular',
          description: 'Pelanggan dengan tingkat prioritas standar'
        },
        {
          name: 'Prospek',
          description: 'Calon pelanggan yang berpotensi'
        },
        {
          name: 'Lead',
          description: 'Calon pelanggan yang sudah menunjukkan minat'
        }
      ];
      
      await Category.bulkCreate(defaultCategories);
      console.log('✅ Default categories created successfully');
    } else {
      console.log('ℹ️  Categories already exist, skipping seed');
    }
    
    // Show all categories
    const categories = await Category.findAll();
    console.log('\n📋 Current categories:');
    categories.forEach(cat => {
      console.log(`  ${cat.id}. ${cat.name} - ${cat.description}`);
    });
    
    console.log('\n🎉 Seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

// Run seeding
seedCategories();