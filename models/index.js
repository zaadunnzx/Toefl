const Category = require('./Category');
const PhoneNumber = require('./PhoneNumber');

// Define relationships
Category.hasMany(PhoneNumber, {
  foreignKey: 'category_id',
  as: 'phoneNumbers',
  onDelete: 'RESTRICT', // Prevent deletion of category if it has phone numbers
  onUpdate: 'CASCADE'
});

PhoneNumber.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

module.exports = {
  Category,
  PhoneNumber
};
