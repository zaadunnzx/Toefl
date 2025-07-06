const { sequelize } = require('../config/database');
const Category = require('./Category');
const PhoneNumber = require('./PhoneNumber');

// Define associations
Category.hasMany(PhoneNumber, {
  foreignKey: 'category_id',
  as: 'phoneNumbers',
  onDelete: 'CASCADE'
});

PhoneNumber.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

// Export models
module.exports = {
  sequelize,
  Category,
  PhoneNumber
};
