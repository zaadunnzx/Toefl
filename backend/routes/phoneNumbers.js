const express = require('express');
const router = express.Router();
const PhoneNumber = require('../models/PhoneNumber');
const Category = require('../models/Category');
const { normalizePhoneNumber } = require('../utils/phoneUtils');

// Get all phone numbers with category information
router.get('/', async (req, res) => {
  try {
    const phoneNumbers = await PhoneNumber.findAll({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }],
      order: [['createdAt', 'DESC']]
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
});

// Add new phone number
router.post('/', async (req, res) => {
  try {
    const { phone_number, category_id } = req.body;
    
    if (!phone_number || phone_number.trim() === '') {
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
    
    // Check if category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Normalize phone number
    const normalized = normalizePhoneNumber(phone_number);
    if (!normalized) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }
    
    // Check for duplicates
    const existingNumber = await PhoneNumber.findOne({
      where: { normalized_number: normalized }
    });
    
    if (existingNumber) {
      return res.status(409).json({
        success: false,
        message: 'This phone number already exists in the system',
        data: existingNumber
      });
    }
    
    // Create phone number
    const phoneNumber = await PhoneNumber.create({
      original_number: phone_number.trim(),
      normalized_number: normalized,
      category_id: parseInt(category_id)
    });
    
    // Fetch with category information
    const result = await PhoneNumber.findByPk(phoneNumber.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }]
    });
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'Phone number added successfully'
    });
  } catch (error) {
    console.error('Error adding phone number:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add phone number',
      error: error.message
    });
  }
});

// Check if phone number exists (for duplicate checking)
router.post('/check', async (req, res) => {
  try {
    const { phone_number } = req.body;
    
    if (!phone_number || phone_number.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    const normalized = normalizePhoneNumber(phone_number);
    if (!normalized) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }
    
    const existingNumber = await PhoneNumber.findOne({
      where: { normalized_number: normalized },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }]
    });
    
    res.json({
      success: true,
      exists: !!existingNumber,
      data: existingNumber || null,
      normalized_number: normalized,
      message: existingNumber 
        ? 'Phone number already exists in the system' 
        : 'Phone number is available'
    });
  } catch (error) {
    console.error('Error checking phone number:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check phone number',
      error: error.message
    });
  }
});

// Delete phone number
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const phoneNumber = await PhoneNumber.findByPk(id);
    if (!phoneNumber) {
      return res.status(404).json({
        success: false,
        message: 'Phone number not found'
      });
    }
    
    await phoneNumber.destroy();
    
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
});

module.exports = router;