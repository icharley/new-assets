// This file is used to connect to MongoDB using Mongoose

import mongoose from "mongoose";

// Cache object to store the Mongoose connection and promise
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Use backticks for template literals and ensure environment variable is present
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable not defined");
    }

    cached.promise = mongoose
      .connect(`${process.env.MONGODB_URI}` / ecommerce, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
