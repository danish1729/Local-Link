// models/User.ts
import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      required: true,
    },
    // ✅ Added Address so it saves to DB
    address: { type: String },

    // Provider specific fields
    serviceType: String,
    hourlyRate: Number,
    bio: String,
    profileImage: { type: String, default: null },

    // ✅ GeoJSON Location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere", // Define index here for safety
      },
    },
  },
  { timestamps: true },
);

// Prevent model overwrite in Next.js hot-reloading
export default models.User || mongoose.model("User", UserSchema);
