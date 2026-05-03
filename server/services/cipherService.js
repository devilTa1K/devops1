/**
 * ════════════════════════════════════════════════════════
 *  Cipher Service — Encryption/Decryption Algorithms
 * ════════════════════════════════════════════════════════
 * 
 *  Pure functions implementing classical and modern ciphers:
 *    • Caesar Cipher     — shift-based character rotation
 *    • Vigenère Cipher   — keyword polyalphabetic substitution
 *    • Base64            — standard base64 encode/decode
 *    • AES               — AES-256 symmetric encryption via crypto-js
 */

const CryptoJS = require('crypto-js');

// ─── Caesar Cipher ─────────────────────────────────────────

/**
 * Encrypts text using Caesar Cipher (shift each letter by N positions).
 * Non-alphabetic characters are preserved unchanged.
 * 
 * @param {string} text  — plaintext to encrypt
 * @param {number} shift — number of positions to shift (default: 3)
 * @returns {string} encrypted text
 */
function caesarEncrypt(text, shift = 3) {
  shift = ((shift % 26) + 26) % 26; // Normalize negative shifts
  return text
    .split('')
    .map(char => {
      if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
      }
      return char; // Non-alpha characters unchanged
    })
    .join('');
}

/**
 * Decrypts Caesar Cipher text by reversing the shift.
 * 
 * @param {string} text  — ciphertext to decrypt
 * @param {number} shift — the shift used during encryption (default: 3)
 * @returns {string} decrypted text
 */
function caesarDecrypt(text, shift = 3) {
  return caesarEncrypt(text, -shift);
}

// ─── Vigenère Cipher ───────────────────────────────────────

/**
 * Encrypts text using the Vigenère Cipher.
 * Each letter is shifted by the corresponding letter of the keyword.
 * Non-alphabetic characters are preserved and do not advance the key index.
 * 
 * @param {string} text — plaintext to encrypt
 * @param {string} key  — keyword for encryption (alphabetic only)
 * @returns {string} encrypted text
 */
function vigenereEncrypt(text, key) {
  if (!key || key.length === 0) {
    throw new Error('Vigenère cipher requires a keyword');
  }

  const normalizedKey = key.toLowerCase().replace(/[^a-z]/g, '');
  if (normalizedKey.length === 0) {
    throw new Error('Vigenère key must contain at least one letter');
  }

  let keyIndex = 0;
  return text
    .split('')
    .map(char => {
      if (char >= 'A' && char <= 'Z') {
        const shift = normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - 97;
        keyIndex++;
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      if (char >= 'a' && char <= 'z') {
        const shift = normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - 97;
        keyIndex++;
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join('');
}

/**
 * Decrypts Vigenère Cipher text by reversing the shift.
 * 
 * @param {string} text — ciphertext to decrypt
 * @param {string} key  — keyword used during encryption
 * @returns {string} decrypted text
 */
function vigenereDecrypt(text, key) {
  if (!key || key.length === 0) {
    throw new Error('Vigenère cipher requires a keyword');
  }

  const normalizedKey = key.toLowerCase().replace(/[^a-z]/g, '');
  if (normalizedKey.length === 0) {
    throw new Error('Vigenère key must contain at least one letter');
  }

  let keyIndex = 0;
  return text
    .split('')
    .map(char => {
      if (char >= 'A' && char <= 'Z') {
        const shift = normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - 97;
        keyIndex++;
        return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
      }
      if (char >= 'a' && char <= 'z') {
        const shift = normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - 97;
        keyIndex++;
        return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
      }
      return char;
    })
    .join('');
}

// ─── Base64 Encoding ───────────────────────────────────────

/**
 * Encodes text to Base64.
 * @param {string} text — plaintext to encode
 * @returns {string} Base64-encoded string
 */
function base64Encode(text) {
  return Buffer.from(text, 'utf-8').toString('base64');
}

/**
 * Decodes a Base64 string back to plaintext.
 * @param {string} text — Base64-encoded string to decode
 * @returns {string} decoded plaintext
 */
function base64Decode(text) {
  // Validate base64 format
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(text)) {
    throw new Error('Invalid Base64 string');
  }
  return Buffer.from(text, 'base64').toString('utf-8');
}

// ─── AES Encryption ────────────────────────────────────────

/**
 * Encrypts text using AES-256 symmetric encryption.
 * Uses the AES_SECRET_KEY from environment, or an explicit key.
 * 
 * @param {string} text — plaintext to encrypt
 * @param {string} key  — encryption key (falls back to env AES_SECRET_KEY)
 * @returns {string} AES-encrypted ciphertext string
 */
function aesEncrypt(text, key) {
  const secretKey = key || process.env.AES_SECRET_KEY;
  if (!secretKey) {
    throw new Error('AES encryption requires a secret key');
  }
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

/**
 * Decrypts AES-encrypted ciphertext back to plaintext.
 * 
 * @param {string} text — AES ciphertext to decrypt
 * @param {string} key  — decryption key (must match encryption key)
 * @returns {string} decrypted plaintext
 */
function aesDecrypt(text, key) {
  const secretKey = key || process.env.AES_SECRET_KEY;
  if (!secretKey) {
    throw new Error('AES decryption requires a secret key');
  }

  try {
    const bytes = CryptoJS.AES.decrypt(text, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Decryption failed — invalid key or corrupted ciphertext');
    }

    return decrypted;
  } catch (error) {
    throw new Error('AES decryption failed: ' + error.message);
  }
}

// ─── Dispatcher ────────────────────────────────────────────

/**
 * Dispatches to the appropriate cipher based on type and operation.
 * 
 * @param {string} text       — input text
 * @param {string} cipherType — one of: caesar, vigenere, base64, aes
 * @param {string} operation  — 'encrypt' or 'decrypt'
 * @param {string} key        — optional key/shift for the cipher
 * @returns {string} processed text
 */
function processCipher(text, cipherType, operation, key) {
  const ciphers = {
    caesar: {
      encrypt: (t, k) => caesarEncrypt(t, parseInt(k) || 3),
      decrypt: (t, k) => caesarDecrypt(t, parseInt(k) || 3),
    },
    vigenere: {
      encrypt: (t, k) => vigenereEncrypt(t, k),
      decrypt: (t, k) => vigenereDecrypt(t, k),
    },
    base64: {
      encrypt: (t) => base64Encode(t),
      decrypt: (t) => base64Decode(t),
    },
    aes: {
      encrypt: (t, k) => aesEncrypt(t, k),
      decrypt: (t, k) => aesDecrypt(t, k),
    },
  };

  const cipher = ciphers[cipherType];
  if (!cipher) {
    throw new Error(`Unsupported cipher type: ${cipherType}`);
  }

  const handler = cipher[operation];
  if (!handler) {
    throw new Error(`Unsupported operation: ${operation}`);
  }

  return handler(text, key);
}

module.exports = {
  caesarEncrypt,
  caesarDecrypt,
  vigenereEncrypt,
  vigenereDecrypt,
  base64Encode,
  base64Decode,
  aesEncrypt,
  aesDecrypt,
  processCipher,
};
