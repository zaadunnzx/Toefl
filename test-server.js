const express = require('express');
const { normalizePhoneNumber, validatePhoneNumber } = require('./utils/phoneUtils');

const app = express();
app.use(express.json());

// Test endpoint untuk validasi nomor tanpa database
app.post('/test/validate-phone', (req, res) => {
  const { phone_number } = req.body;
  
  if (!phone_number) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required'
    });
  }
  
  const validation = validatePhoneNumber(phone_number);
  const normalized = normalizePhoneNumber(phone_number);
  
  res.json({
    success: true,
    data: {
      original: phone_number,
      normalized: normalized,
      validation: validation
    }
  });
});

// Test berbagai format nomor
app.get('/test/phone-formats', (req, res) => {
  const testNumbers = [
    '+6285476387234',
    '+ 62-865-453-765',
    '+ 62 654 876 543',
    '08123456789',
    '+1234567890',
    '62-812-3456-789',
    '+62 812 3456 789'
  ];
  
  const results = testNumbers.map(number => ({
    original: number,
    normalized: normalizePhoneNumber(number),
    validation: validatePhoneNumber(number)
  }));
  
  res.json({
    success: true,
    data: results
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Phone Number Validation Test Server',
    endpoints: {
      'POST /test/validate-phone': 'Validate single phone number',
      'GET /test/phone-formats': 'Test various phone number formats'
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
  console.log('📱 Test phone validation without database dependency');
});

module.exports = app;
