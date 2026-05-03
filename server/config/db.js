/**
 * ════════════════════════════════════════════════════════
 *  MongoDB Connection Configuration
 * ════════════════════════════════════════════════════════
 * 
 *  Establishes a Mongoose connection to MongoDB with
 *  retry logic for resilience in containerized environments.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB with automatic retry on failure.
 * Retries up to 5 times with 5-second intervals.
 */
const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cipher-converter';
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(MONGO_URI, {
        // Mongoose 8 uses these by default, but explicit for clarity
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 10000,
      });

      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`⚠️  MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, error.message);

      if (attempt === MAX_RETRIES) {
        console.error('❌ All MongoDB connection attempts exhausted. Exiting...');
        throw error;
      }

      // Wait before retrying
      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

module.exports = connectDB;
