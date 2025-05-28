import mongoose from "mongoose";

// Cache object to store the Mongoose connection and promise
// Uses Node's global object to persist across hot reloads in development
let cached = global.mongoose;

// Initialize the cache if it doesn't exist
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB using Mongoose with connection caching
 * Implements a singleton pattern to prevent multiple connections in serverless environments
 * @returns {Promise<mongoose.Connection>} Established Mongoose connection
 */
async function connectDB() {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disables Mongoose buffering to fail fast if not connected
    };

    // Create connection promise and store in cache
    cached.promise = mongoose
      .connect(`${process.env.MONGODB_URI}/ecommerce`, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  // Wait for connection to establish and cache the connection object
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise on connection failure to allow retries
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
