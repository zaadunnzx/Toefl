const { PhoneNumber, Category } = require('../models');
const { validatePhoneNumber, normalizePhoneNumber } = require('../utils/phoneUtils');

/**
 * Get all phone numbers with their categories
 */
const getAllPhoneNumbers = async (req, res) => {
  try {
    const phoneNumbers = await PhoneNumber.findAll({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: phoneNumbers,
      message: 'Phone numbers retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting phone numbers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve phone numbers',
      error: error.message
    });
  }
};

/**
 * Add new phone number
 */
const addPhoneNumber = async (req, res) => {
  try {
    const { phone_number, category_id } = req.body;
    
    if (!phone_number) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }
    
    // Validate phone number format
    const validation = validatePhoneNumber(phone_number);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    
    // Check if category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Create phone number
    const phoneNumberRecord = await PhoneNumber.create({
      original_number: phone_number.trim(),
      normalized_number: validation.normalized,
      category_id: category_id
    });
    
    // Fetch the created record with category info
    const createdRecord = await PhoneNumber.findByPk(phoneNumberRecord.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }]
    });
    
    res.status(201).json({
      success: true,
      data: createdRecord,
      message: 'Phone number added successfully'
    });
  } catch (error) {
    console.error('Error adding phone number:', error);
    
    // Handle unique constraint error (duplicate number)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'This phone number already exists in the system'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add phone number',
      error: error.message
    });
  }
};

/**
 * Update phone number
 */
const updatePhoneNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone_number, category_id } = req.body;
    
    const phoneNumberRecord = await PhoneNumber.findByPk(id);
    
    if (!phoneNumberRecord) {
      return res.status(404).json({
        success: false,
        message: 'Phone number not found'
      });
    }
    
    let updateData = {};
    
    // Update phone number if provided
    if (phone_number) {
      const validation = validatePhoneNumber(phone_number);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }
      
      updateData.original_number = phone_number.trim();
      updateData.normalized_number = validation.normalized;
    }
    
    // Update category if provided
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
      updateData.category_id = category_id;
    }
    
    await phoneNumberRecord.update(updateData);
    
    // Fetch updated record with category info
    const updatedRecord = await PhoneNumber.findByPk(id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }]
    });
    
    res.json({
      success: true,
      data: updatedRecord,
      message: 'Phone number updated successfully'
    });
  } catch (error) {
    console.error('Error updating phone number:', error);
    
    // Handle unique constraint error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'This phone number already exists in the system'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update phone number',
      error: error.message
    });
  }
};

/**
 * Delete phone number
 */
const deletePhoneNumber = async (req, res) => {
  try {
    const { id } = req.params;
    
    const phoneNumberRecord = await PhoneNumber.findByPk(id);
    
    if (!phoneNumberRecord) {
      return res.status(404).json({
        success: false,
        message: 'Phone number not found'
      });
    }
    
    await phoneNumberRecord.destroy();
    
    res.json({
      success: true,
      message: 'Phone number deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting phone number:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete phone number',
      error: error.message
    });
  }
};

/**
 * Check if phone number exists
 */
const checkPhoneNumber = async (req, res) => {
  try {
    const { number } = req.params;
    
    if (!number) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Validate and normalize the number
    const validation = validatePhoneNumber(number);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    
    // Check if normalized number exists
    const existingNumber = await PhoneNumber.findOne({
      where: {
        normalized_number: validation.normalized
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }]
    });
    
    if (existingNumber) {
      res.json({
        success: true,
        exists: true,
        data: existingNumber,
        message: 'Phone number already exists in the system'
      });
    } else {
      res.json({
        success: true,
        exists: false,
        normalized_number: validation.normalized,
        message: 'Phone number is available'
      });
    }
  } catch (error) {
    console.error('Error checking phone number:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check phone number',
      error: error.message
    });
  }
};

module.exports = {
  getAllPhoneNumbers,
  addPhoneNumber,
  updatePhoneNumber,
  deletePhoneNumber,
  checkPhoneNumber
};
