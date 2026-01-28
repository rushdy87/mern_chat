import mongoose from 'mongoose';
import { requireEnv } from '../lib/env.js';

export const connectDB = async () => {
  try {
    const mongoUri = requireEnv('MONGO_URI');

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
