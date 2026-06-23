import mongoose, { ConnectOptions } from 'mongoose';

// Cached connection
const cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = {
  conn: null,
  promise: null
};

async function connectDB() {
  // Get MongoDB URI at runtime (not at module load time to avoid build errors)
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env'
    );
  }

  // If we have a cached connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we're already connecting, wait for the promise to resolve
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (e) {
      cached.promise = null;
      throw e;
    }
  }

  const opts: ConnectOptions = {
    bufferCommands: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 50,
    minPoolSize: 10,
    maxIdleTimeMS: 10000,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    w: 'majority' as const,
    wtimeoutMS: 2500,
  };

  console.log('Connecting to MongoDB...');
  
  try {
    cached.promise = mongoose.connect(MONGODB_URI, opts);
    cached.conn = await cached.promise;
    console.log('Successfully connected to MongoDB');
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }
}

export const connectToDatabase = connectDB;
export default connectDB; 