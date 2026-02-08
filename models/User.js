import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      required: true,
    },
    profileImage: {
      type: String, // Cloudinary URL
      default: null,
    },
    serviceType: String,
    hourlyRate: Number,
    bio: String,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number], // [lng, lat]
    },
  },
  { timestamps: true },
);

UserSchema.index({ location: "2dsphere" });

export default models.User || mongoose.model("User", UserSchema);
