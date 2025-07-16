/**
 * Normalize phone number to international format
 * @param {string} phoneNumber - Raw phone number
 * @returns {string} - Normalized phone number
 */
export const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters except '+' and handle various formats
  // This supports formats like: +62 813-4321-6935, +62-813-4321-6935, etc.
  let normalized = phoneNumber.replace(/[^\d+]/g, '');
  
  // Handle Indonesian phone numbers
  if (normalized.startsWith('08')) {
    // Convert 08xxx to +628xxx
    normalized = '+62' + normalized.substring(1);
  } else if (normalized.startsWith('8') && !normalized.startsWith('+')) {
    // Convert 8xxx to +628xxx
    normalized = '+62' + normalized;
  } else if (normalized.startsWith('62') && !normalized.startsWith('+')) {
    // Convert 62xxx to +62xxx
    normalized = '+' + normalized;
  } else if (!normalized.startsWith('+') && normalized.length >= 8) {
    // Add + for international format if not present
    normalized = '+' + normalized;
  }
  
  return normalized;
};

/**
 * Validate phone number format and return normalized version
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} - Validation result
 */
export const validatePhoneNumber = (phoneNumber) => {
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
  
  // Validate normalized format - lebih lenient untuk berbagai format
  const phoneRegex = /^\+\d{10,15}$/;
  
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
export const isIndonesianNumber = (phoneNumber) => {
  const normalized = normalizePhoneNumber(phoneNumber);
  return normalized.startsWith('+62');
};

/**
 * Format phone number for display
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  const normalized = normalizePhoneNumber(phoneNumber);
  
  // Format Indonesian numbers
  if (normalized.startsWith('+62')) {
    const number = normalized.substring(3);
    if (number.length >= 9) {
      return `+62 ${number.substring(0, 3)}-${number.substring(3, 7)}-${number.substring(7)}`;
    }
  }
  
  return normalized;
};

/**
 * Parse multiple phone numbers from text
 * @param {string} text - Text containing phone numbers
 * @returns {array} - Array of phone numbers
 */
export const parsePhoneNumbers = (text) => {
  if (!text) return [];
  
  // Split by common separators and filter empty lines
  const lines = text
    .split(/[\n\r,;]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  return lines;
};

/**
 * Clean phone number for display
 * @param {string} phoneNumber - Phone number to clean
 * @returns {string} - Cleaned phone number
 */
export const cleanPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/[^\d+]/g, '');
};