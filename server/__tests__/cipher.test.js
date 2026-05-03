/**
 * Cipher Service — Unit Tests
 * Tests encrypt/decrypt roundtrips for all cipher types.
 */

const {
  caesarEncrypt, caesarDecrypt,
  vigenereEncrypt, vigenereDecrypt,
  base64Encode, base64Decode,
  aesEncrypt, aesDecrypt,
  processCipher,
} = require('../services/cipherService');

// Set AES key for tests
process.env.AES_SECRET_KEY = 'test-secret-key-12345';

describe('Caesar Cipher', () => {
  test('encrypts with default shift (3)', () => {
    expect(caesarEncrypt('Hello', 3)).toBe('Khoor');
  });

  test('decrypts with default shift (3)', () => {
    expect(caesarDecrypt('Khoor', 3)).toBe('Hello');
  });

  test('roundtrip preserves original text', () => {
    const text = 'The Quick Brown Fox';
    expect(caesarDecrypt(caesarEncrypt(text, 7), 7)).toBe(text);
  });

  test('preserves non-alphabetic characters', () => {
    expect(caesarEncrypt('Hello, World! 123', 3)).toBe('Khoor, Zruog! 123');
  });

  test('handles negative shift', () => {
    expect(caesarEncrypt('Khoor', -3)).toBe('Hello');
  });

  test('handles shift > 26', () => {
    expect(caesarEncrypt('Hello', 29)).toBe('Khoor');
  });
});

describe('Vigenère Cipher', () => {
  test('encrypts correctly', () => {
    expect(vigenereEncrypt('HELLO', 'KEY')).toBe('RIJVS');
  });

  test('roundtrip preserves original', () => {
    const text = 'Attack at dawn';
    const key = 'LEMON';
    expect(vigenereDecrypt(vigenereEncrypt(text, key), key)).toBe(text);
  });

  test('preserves non-alpha characters', () => {
    const text = 'Hello, World!';
    const key = 'key';
    const decrypted = vigenereDecrypt(vigenereEncrypt(text, key), key);
    expect(decrypted).toBe(text);
  });

  test('throws on empty key', () => {
    expect(() => vigenereEncrypt('Hello', '')).toThrow();
  });

  test('throws on missing key', () => {
    expect(() => vigenereEncrypt('Hello')).toThrow();
  });
});

describe('Base64 Encoding', () => {
  test('encodes correctly', () => {
    expect(base64Encode('Hello World')).toBe('SGVsbG8gV29ybGQ=');
  });

  test('decodes correctly', () => {
    expect(base64Decode('SGVsbG8gV29ybGQ=')).toBe('Hello World');
  });

  test('roundtrip preserves original', () => {
    const text = 'Special chars: !@#$%^&*()';
    expect(base64Decode(base64Encode(text))).toBe(text);
  });

  test('handles unicode', () => {
    const text = 'Hello 🌍';
    expect(base64Decode(base64Encode(text))).toBe(text);
  });
});

describe('AES Encryption', () => {
  const key = 'my-secret-key';

  test('encrypts and produces different output', () => {
    const encrypted = aesEncrypt('Hello', key);
    expect(encrypted).not.toBe('Hello');
    expect(encrypted.length).toBeGreaterThan(0);
  });

  test('roundtrip preserves original', () => {
    const text = 'Sensitive data here!';
    const encrypted = aesEncrypt(text, key);
    expect(aesDecrypt(encrypted, key)).toBe(text);
  });

  test('wrong key fails decryption', () => {
    const encrypted = aesEncrypt('Hello', key);
    expect(() => aesDecrypt(encrypted, 'wrong-key')).toThrow();
  });
});

describe('processCipher dispatcher', () => {
  test('dispatches caesar encrypt', () => {
    expect(processCipher('Hello', 'caesar', 'encrypt', '3')).toBe('Khoor');
  });

  test('dispatches base64 decrypt', () => {
    expect(processCipher('SGVsbG8=', 'base64', 'decrypt')).toBe('Hello');
  });

  test('throws on unsupported cipher', () => {
    expect(() => processCipher('test', 'rot13', 'encrypt')).toThrow('Unsupported cipher type');
  });

  test('throws on unsupported operation', () => {
    expect(() => processCipher('test', 'caesar', 'hash')).toThrow('Unsupported operation');
  });
});
