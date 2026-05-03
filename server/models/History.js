/**
 * ════════════════════════════════════════════════════════
 *  History Model — MongoDB Schema
 * ════════════════════════════════════════════════════════
 * 
 *  Stores each cipher conversion with input/output text,
 *  cipher type, operation, and timestamp.
 */

const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    /** The original text provided by the user */
    inputText: {
      type: String,
      required: [true, 'Input text is required'],
      maxlength: [10000, 'Input text cannot exceed 10,000 characters'],
    },

    /** The resulting text after encryption/decryption */
    outputText: {
      type: String,
      required: [true, 'Output text is required'],
    },

    /** The cipher algorithm used */
    cipherType: {
      type: String,
      required: [true, 'Cipher type is required'],
      enum: {
        values: ['caesar', 'vigenere', 'base64', 'aes'],
        message: '{VALUE} is not a supported cipher type',
      },
    },

    /** Whether this was an encrypt or decrypt operation */
    operation: {
      type: String,
      required: [true, 'Operation type is required'],
      enum: {
        values: ['encrypt', 'decrypt'],
        message: '{VALUE} is not a valid operation',
      },
    },

    /** Optional key/shift used (stored for reference, not for AES secrets) */
    keyUsed: {
      type: String,
      default: null,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Index for efficient history queries (most recent first)
historySchema.index({ createdAt: -1 });

module.exports = mongoose.model('History', historySchema);
