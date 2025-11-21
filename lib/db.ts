// lib/db.ts
import mongoose from 'mongoose';

// Interface to extend the global object with our Mongoose connection cache
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Check if a global cache already exists, otherwise initialize it.
// This is a common pattern to cache connections across hot reloads in development.
let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // 1. If we have a cached connection, return it immediately
  if (cached.conn) {
    console.log("Using cached MongoDB connection.");
    return cached.conn;
  }

  // 2. If there is no connection, but a promise is pending, await the promise
  if (cached.promise) {
    console.log("Awaiting existing MongoDB connection promise.");
    
    // FIX 1: Await the promise which resolves to the full Mongoose object
    const mongooseInstance = await cached.promise;
    
    // FIX 2: Cache the specific .connection property before returning it
    cached.conn = mongooseInstance.connection;
    return cached.conn;
  }

  // 3. If no connection or promise exists, create a new connection promise
  const opts = {
    bufferCommands: false, // Disable Mongoose buffering
  };

  cached.promise = mongoose.connect(MONGODB_URI, opts)
    .then((mongooseInstance) => {
      // Log connection status
      console.log("MongoDB connected successfully.");
      return mongooseInstance;
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error);
      cached.promise = null; // Clear promise on failure
      throw error;
    });

  // Await the new promise and cache the result
  const mongooseInstance = await cached.promise;
  
  // FIX 3: Assign the connection object to the cache
  cached.conn = mongooseInstance.connection;
  
  return cached.conn;
}