const express = require('express');
const router = express.Router();
const {
  getAllPhoneNumbers,
  addPhoneNumber,
  updatePhoneNumber,
  deletePhoneNumber,
  checkPhoneNumber
} = require('../controllers/phoneNumberController');

// GET /api/phone-numbers - Get all phone numbers
router.get('/', getAllPhoneNumbers);

// POST /api/phone-numbers - Add new phone number
router.post('/', addPhoneNumber);

// PUT /api/phone-numbers/:id - Update phone number
router.put('/:id', updatePhoneNumber);

// DELETE /api/phone-numbers/:id - Delete phone number
router.delete('/:id', deletePhoneNumber);

// GET /api/phone-numbers/check/:number - Check if phone number exists
router.get('/check/:number', checkPhoneNumber);

module.exports = router;
