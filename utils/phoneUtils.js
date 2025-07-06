/**
 * Normalize phone number to international format
 * @param {string} phoneNumber - Raw phone number
 * @returns {string} - Normalized phone number
 */
const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters except '+'
  let normalized = phoneNumber.replace(/[^\d+]/g, '');
  
  // Handle Indonesian phone numbers
  if (normalized.startsWith('08')) {
    // Convert 08xxx to +628xxx
    normalized = '+62' + normalized.substring(1);
  } else if (normalized.startsWith('8') && !normalized.startsWith('+')) {
    // Convert 8xxx to +628xxx
    normalized = '+62' + normalized;
  } else if (!normalized.startsWith('+')) {
    // Add + for international format
    normalized = '+' + normalized;
  }
  
  return normalized;
};

/**
 * Validate phone number format and return normalized version
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} - Validation result
 */
const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return {
      isValid: false,
      message: 'Phone number is required and must be a string',
      normalized: null
    };
  }
  
  // Remove whitespace
  const trimmed = phoneNumber.trim();
  
  if (trimmed.length < 8) {
    return {
      isValid: false,
      message: 'Phone number must be at least 8 digits long',
      normalized: null
    };
  }
  
  // Normalize the number
  const normalized = normalizePhoneNumber(trimmed);
  
  // Validate normalized format
  const phoneRegex = /^\+\d{8,15}$/;
  
  if (!phoneRegex.test(normalized)) {
    return {
      isValid: false,
      message: 'Invalid phone number format. Use international format (+country_code + number)',
      normalized: null
    };
  }
  
  return {
    isValid: true,
    message: 'Valid phone number',
    normalized: normalized
  };
};

/**
 * Check if phone number is Indonesian
 * @param {string} phoneNumber - Phone number to check
 * @returns {boolean} - True if Indonesian number
 */
const isIndonesianNumber = (phoneNumber) => {
  const normalized = normalizePhoneNumber(phoneNumber);
  return normalized.startsWith('+62');
};

module.exports = {
  normalizePhoneNumber,
  validatePhoneNumber,
  isIndonesianNumber
};
