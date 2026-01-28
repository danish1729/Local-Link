import mongoose from "mongoose";

const ServiceProviderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceType: { type: String, required: true },
  bio: String,
  hourlyRate: Number,
  isVerified: { type: Boolean, default: false },
  serviceArea: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  stripeAccountId: String,
});

ServiceProviderSchema.index({ serviceArea: "2dsphere" });

export default mongoose.models.ServiceProvider ||
  mongoose.model("ServiceProvider", ServiceProviderSchema);
