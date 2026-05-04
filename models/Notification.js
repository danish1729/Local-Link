import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }, // e.g., 'booking', 'system', 'message_alert', 'offer'
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    actionUrl: { type: String } // optional link when clicked
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
