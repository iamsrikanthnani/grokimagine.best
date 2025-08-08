import mongoose, { Mongoose } from "mongoose";

// Get MongoDB host from environment variables
const MONGO_DB_HOST = process.env.MONGO_DB_HOST;

// Interface for Mongoose connection object
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Define global augmentation for the mongoose property
declare global {
  const mongoose:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}
// Cached connection object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: MongooseConnection = (global as any).mongoose || {
  conn: null,
  promise: null,
};

// If no cached connection exists, create a new one
if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

// Function to connect to the MongoDB database
export const connectToDatabase = async () => {
  // If connection already exists, return it
  if (cached.conn) return cached.conn;

  // Throw error if MongoDB host is not provided
  if (!MONGO_DB_HOST) throw new Error("Missing MONGO_DB_HOST");

  // If no promise exists, create a new one by connecting to the MongoDB database
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGO_DB_HOST, {
      dbName: "imagine",
      bufferCommands: false, // Disable command buffering
    });

  // Await the promise and set the connection object in the cache
  cached.conn = await cached.promise;
  // Return the connection object
  return cached.conn;
};
