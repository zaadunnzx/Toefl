/**
 * Phone number utilities for normalization and validation
 */

/**
 * Normalize phone number to international format
 * @param {string} phoneNumber - The phone number to normalize
 * @returns {string|null} - Normalized phone number or null if invalid
 */
function normalizePhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return null;
  }
  
  // Remove all non-digit characters except the leading +
  let normalized = phoneNumber.replace(/[^\d+]/g, '');
  
  // Handle empty result
  if (!normalized) {
    return null;
  }
  
  // Handle Indonesian numbers starting with 08
  if (normalized.startsWith('08')) {
    normalized = '+62' + normalized.substring(1);
  }
  // Handle Indonesian numbers starting with 62 (without +)
  else if (normalized.startsWith('62') && !normalized.startsWith('+62')) {
    normalized = '+' + normalized;
  }
  // Ensure international format starts with +
  else if (!normalized.startsWith('+')) {
    // If it's a number without country code, assume it's invalid
    // unless it's clearly an Indonesian number
    if (normalized.length >= 10 && normalized.length <= 15) {
      // Could be a local number, but we need country code
      return null;
    }
    normalized = '+' + normalized;
  }
  
  // Basic validation - should be between 8 and 15 digits after country code
  const digitsOnly = normalized.replace(/^\+/, '');
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return null;
  }
  
  return normalized;
}

/**
 * Validate if a phone number is in valid format
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidPhoneNumber(phoneNumber) {
  const normalized = normalizePhoneNumber(phoneNumber);
  return normalized !== null;
}

/**
 * Format phone number for display
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  
  // If it's already normalized, return as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  // Try to normalize and return
  const normalized = normalizePhoneNumber(phoneNumber);
  return normalized || phoneNumber;
}

/**
 * Get country code from phone number
 * @param {string} phoneNumber - The phone number
 * @returns {string|null} - Country code or null
 */
function getCountryCode(phoneNumber) {
  const normalized = normalizePhoneNumber(phoneNumber);
  if (!normalized) return null;
  
  // Extract country code (first 1-4 digits after +)
  const match = normalized.match(/^\+(\d{1,4})/);
  return match ? match[1] : null;
}

/**
 * Check if phone number is Indonesian
 * @param {string} phoneNumber - The phone number
 * @returns {boolean} - True if Indonesian number
 */
function isIndonesianNumber(phoneNumber) {
  const countryCode = getCountryCode(phoneNumber);
  return countryCode === '62';
}

module.exports = {
  normalizePhoneNumber,
  isValidPhoneNumber,
  formatPhoneNumber,
  getCountryCode,
  isIndonesianNumber
};