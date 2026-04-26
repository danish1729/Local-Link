// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
  // 1. Check if the variable is loaded
  if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is undefined. Check your .env file!");
    throw new Error("Invalid/Missing environment variable: 'MONGODB_URI'");
  }

  // 2. If already connected, return
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    // 3. Connect
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};
