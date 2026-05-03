/**
 * ════════════════════════════════════════════════════════
 *  Cipher Routes — API Route Definitions
 * ════════════════════════════════════════════════════════
 * 
 *  Maps HTTP endpoints to controller handlers with
 *  input validation middleware.
 */

const express = require('express');
const router = express.Router();
const { encrypt, decrypt, getHistory, clearHistory } = require('../controllers/cipherController');
const { validateCipherRequest } = require('../middleware/validateRequest');

// ─── Cipher Operations ─────────────────────────────────
router.post('/encrypt', validateCipherRequest, encrypt);
router.post('/decrypt', validateCipherRequest, decrypt);

// ─── History ────────────────────────────────────────────
router.get('/history', getHistory);
router.delete('/history', clearHistory);

module.exports = router;
