/**
 * Normalize phone number by removing spaces, dashes, and other formatting
 * @param {string} phoneNumber - Original phone number
 * @returns {string} - Normalized phone number
 */
const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters except the leading +
  let normalized = phoneNumber.replace(/[^\d+]/g, '');
  
  // Handle Indonesian numbers starting with 08
  if (normalized.startsWith('08')) {
    normalized = '+62' + normalized.substring(1);
  }
  
  // Ensure it starts with +
  if (!normalized.startsWith('+')) {
    // If it starts with digits, assume it needs a + prefix
    if (/^\d/.test(normalized)) {
      normalized = '+' + normalized;
    }
  }
  
  return normalized;
};

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} - Validation result
 */
const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return {
      isValid: false,
      message: 'Phone number is required'
    };
  }
  
  const normalized = normalizePhoneNumber(phoneNumber);
  
  // Basic validation: should start with + and have at least 10 digits total
  const phoneRegex = /^\+\d{10,15}$/;
  
  if (!phoneRegex.test(normalized)) {
    return {
      isValid: false,
      message: 'Invalid phone number format. Must be a valid international number (e.g., +6285476387)'
    };
  }
  
  return {
    isValid: true,
    normalized: normalized,
    message: 'Valid phone number'
  };
};

/**
 * Format phone number for display
 * @param {string} phoneNumber - Normalized phone number
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Basic formatting for display
  if (phoneNumber.startsWith('+62')) {
    // Indonesian number formatting
    const number = phoneNumber.substring(3);
    if (number.length >= 9) {
      return `+62 ${number.substring(0, 3)}-${number.substring(3, 6)}-${number.substring(6)}`;
    }
  }
  
  // Default formatting for other countries
  return phoneNumber;
};

module.exports = {
  normalizePhoneNumber,
  validatePhoneNumber,
  formatPhoneNumber
};
