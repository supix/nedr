import mongoose from 'mongoose';

// Simple connection with retry logic
export async function connectToMongo(uri: string, retries = 10, delayMs = 2000): Promise<void> {
  let lastErr: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      lastErr = err;
      console.warn(`MongoDB connection attempt ${i + 1}/${retries} failed. Retrying in ${delayMs}ms...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}
