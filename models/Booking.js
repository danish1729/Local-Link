import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    dateTime: Date,
    status: {
      type: String,
      enum: [
        "Pending", 
        "Accepted", 
        "Completed", 
        "CancelRequestedByCustomer", 
        "CancelRequestedByProvider", 
        "Cancelled"
      ],
      default: "Pending",
    },
    totalAmount: Number,
    platformCommission: Number,
    providerPayout: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
