import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },
});

CustomerSchema.index({ location: "2dsphere" });

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
