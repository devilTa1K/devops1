/**
 * Cipher API — HTTP client for backend communication
 */
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Encrypt text using the specified cipher
 */
export const encryptText = async (text, cipherType, key = '') => {
  const { data } = await api.post('/encrypt', { text, cipherType, key });
  return data;
};

/**
 * Decrypt text using the specified cipher
 */
export const decryptText = async (text, cipherType, key = '') => {
  const { data } = await api.post('/decrypt', { text, cipherType, key });
  return data;
};

/**
 * Fetch conversion history
 */
export const getHistory = async (page = 1, limit = 20) => {
  const { data } = await api.get('/history', { params: { page, limit } });
  return data;
};

/**
 * Clear all history
 */
export const clearHistory = async () => {
  const { data } = await api.delete('/history');
  return data;
};

export default api;
