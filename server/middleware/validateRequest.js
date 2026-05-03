/**
 * Request Validation Middleware
 * Validates cipher request bodies before processing.
 */

const VALID_CIPHERS = ['caesar', 'vigenere', 'base64', 'aes'];

const validateCipherRequest = (req, res, next) => {
  const { text, cipherType, key } = req.body;
  const errors = [];

  // Text validation
  if (!text || typeof text !== 'string') {
    errors.push('Text is required and must be a string');
  } else if (text.trim().length === 0) {
    errors.push('Text cannot be empty');
  } else if (text.length > 10000) {
    errors.push('Text cannot exceed 10,000 characters');
  }

  // Cipher type validation
  if (!cipherType) {
    errors.push('Cipher type is required');
  } else if (!VALID_CIPHERS.includes(cipherType)) {
    errors.push(`Invalid cipher type. Supported: ${VALID_CIPHERS.join(', ')}`);
  }

  // Key validation for ciphers that require it
  if (cipherType === 'vigenere' && (!key || key.trim().length === 0)) {
    errors.push('Vigenère cipher requires a keyword');
  }

  if (cipherType === 'caesar' && key !== undefined && key !== null && key !== '') {
    const shift = parseInt(key);
    if (isNaN(shift)) {
      errors.push('Caesar cipher shift must be a number');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Sanitize
  req.body.text = text.trim();
  next();
};

module.exports = { validateCipherRequest };
