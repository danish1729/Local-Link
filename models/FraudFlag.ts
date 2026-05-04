import mongoose from "mongoose";

const FraudFlagSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: false,
    },
    reason: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Resolved"],
      default: "Open",
    },
    actionTaken: {
      type: String,
      default: "None"
    },
    aiConfidenceScore: {
      type: Number, // 0 to 100
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.models.FraudFlag ||
  mongoose.model("FraudFlag", FraudFlagSchema);
