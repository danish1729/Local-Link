// models/User.ts
import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth
    googleId: { type: String, sparse: true, unique: true }, // For Google Auth users
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      required: true,
      default: "customer"
    },
    // Seller Approval Status
    providerStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    // ✅ Added Address so it saves to DB
    address: { type: String },

    // Professional Fields
    phoneNumber: { type: String },
    education: [{ 
      degree: String, 
      institution: String, 
      year: String 
    }],
    workExperience: [{ 
      jobTitle: String, 
      company: String, 
      duration: String 
    }],
    certificates: [{ type: String }], // Array of Cloudinary URLs

    // Security Verification Fields
    cnicNumber: { type: String },
    cnicFrontImage: { type: String },
    cnicBackImage: { type: String },

    // Provider specific fields
    serviceType: String,
    hourlyRate: Number,
    bio: String,
    profileImage: { type: String, default: null },

    // Metrics
    impressions: { type: Number, default: 0 },
    profileClicks: { type: Number, default: 0 },

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
    
    // ✅ Reviews
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    reviewsReceived: [
      {
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        customerName: { type: String, required: true },
        customerImage: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    reviewsGiven: [
      {
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true },
);

// Prevent model overwrite in Next.js hot-reloading
export default models.User || mongoose.model("User", UserSchema);
