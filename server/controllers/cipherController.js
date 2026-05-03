/**
 * ════════════════════════════════════════════════════════
 *  Cipher Controller — Business Logic Layer
 * ════════════════════════════════════════════════════════
 * 
 *  Handles encrypt, decrypt, and history retrieval requests.
 *  Each handler processes the request, calls the cipher service,
 *  saves to history, and returns the result.
 */

const { processCipher } = require('../services/cipherService');
const History = require('../models/History');

/**
 * POST /api/encrypt
 * Encrypts the provided text using the specified cipher.
 */
const encrypt = async (req, res, next) => {
  try {
    const { text, cipherType, key } = req.body;

    // Process encryption
    const result = processCipher(text, cipherType, 'encrypt', key);

    // Save to history (non-blocking — don't fail the request if DB is down)
    try {
      await History.create({
        inputText: text,
        outputText: result,
        cipherType,
        operation: 'encrypt',
        keyUsed: cipherType === 'aes' ? '***' : key || null, // Never store AES keys
      });
    } catch (dbError) {
      console.warn('⚠️  Failed to save history:', dbError.message);
    }

    res.status(200).json({
      success: true,
      result,
      operation: 'encrypt',
      cipherType,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/decrypt
 * Decrypts the provided text using the specified cipher.
 */
const decrypt = async (req, res, next) => {
  try {
    const { text, cipherType, key } = req.body;

    // Process decryption
    const result = processCipher(text, cipherType, 'decrypt', key);

    // Save to history
    try {
      await History.create({
        inputText: text,
        outputText: result,
        cipherType,
        operation: 'decrypt',
        keyUsed: cipherType === 'aes' ? '***' : key || null,
      });
    } catch (dbError) {
      console.warn('⚠️  Failed to save history:', dbError.message);
    }

    res.status(200).json({
      success: true,
      result,
      operation: 'decrypt',
      cipherType,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/history
 * Returns paginated conversion history, most recent first.
 * Query params: page (default: 1), limit (default: 20)
 */
const getHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      History.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      History.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/history
 * Clears all conversion history.
 */
const clearHistory = async (req, res, next) => {
  try {
    await History.deleteMany({});
    res.status(200).json({
      success: true,
      message: 'History cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  encrypt,
  decrypt,
  getHistory,
  clearHistory,
};
