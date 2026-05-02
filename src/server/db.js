import mongoose from "mongoose";

const configuredMongoUri =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL;

const isProduction = process.env.NODE_ENV === "production";
const MONGO_URI = configuredMongoUri || (!isProduction ? "mongodb://127.0.0.1:27017/blogDB" : null);

let cached = globalThis.__blogscapeMongoose;

if (!cached) {
  cached = globalThis.__blogscapeMongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!MONGO_URI) {
    throw new Error("MongoDB connection string is missing. Set MONGO_URI, MONGODB_URI, or DATABASE_URL.");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
