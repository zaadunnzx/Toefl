const express = require('express');
const router = express.Router();
const phoneNumberController = require('../controllers/phoneNumberController');

// GET /api/phone-numbers - Get all phone numbers
router.get('/', phoneNumberController.getAllPhoneNumbers);

// POST /api/phone-numbers - Add new phone number
router.post('/', phoneNumberController.addPhoneNumber);

// POST /api/phone-numbers/bulk - Bulk import phone numbers
router.post('/bulk', phoneNumberController.bulkImportPhoneNumbers);

// POST /api/phone-numbers/check - Check if phone number exists
router.post('/check', phoneNumberController.checkPhoneNumber);

// PUT /api/phone-numbers/:id - Update phone number
router.put('/:id', phoneNumberController.updatePhoneNumber);

// DELETE /api/phone-numbers/:id - Delete phone number
router.delete('/:id', phoneNumberController.deletePhoneNumber);

module.exports = router;
