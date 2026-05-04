import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "" },
    attachment: { type: String }, // Cloudinary URL
    isRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who read it
    
    // Custom Offer details
    isOffer: { type: Boolean, default: false },
    offerDetails: {
      hourlyRate: { type: Number },
      bookingDate: { type: Date },
      startTime: { type: String },
      endTime: { type: String },
      status: { type: String, enum: ["pending", "accepted", "rejected", "cancelled"], default: "pending" }
    }
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
