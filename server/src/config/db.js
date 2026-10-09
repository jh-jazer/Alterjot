import mongoose from 'mongoose';

let isAtlasConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('\x1b[33m%s\x1b[0m', '⚡ [Alterjot DB] No MONGODB_URI configured. Running in Hybrid Local Memory Store mode.');
    return { isAtlas: false };
  }

  try {
    console.log('🔄 [Alterjot DB] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isAtlasConnected = true;
    console.log('\x1b[32m%s\x1b[0m', '✅ [Alterjot DB] Successfully connected to MongoDB Atlas!');
    return { isAtlas: true };
  } catch (error) {
    console.warn('\x1b[33m%s\x1b[0m', `⚠️ [Alterjot DB] Could not connect to MongoDB Atlas (${error.message}). Falling back to Hybrid Local Store.`);
    isAtlasConnected = false;
    return { isAtlas: false };
  }
}

export function isConnectedToAtlas() {
  return isAtlasConnected;
}
