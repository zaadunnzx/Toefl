const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PhoneNumber = sequelize.define('PhoneNumber', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  original_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Phone number cannot be empty'
      }
    }
  },
  normalized_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: {
      msg: 'This phone number already exists'
    },
    validate: {
      notEmpty: {
        msg: 'Normalized phone number cannot be empty'
      }
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'Category is required'
      }
    }
  }
}, {
  tableName: 'phone_numbers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = PhoneNumber;
