import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  baseRate: Number,
});

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);
