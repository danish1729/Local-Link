import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    bookingDate: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g. "14:00"
    endTime: { type: String, required: true }, // e.g. "16:00"
    hours: { type: Number, required: true },
    
    // Status
    status: {
      type: String,
      enum: [
        "Pending", 
        "Confirmed", 
        "InProgress",
        "Completed", 
        "CancelRequestedByCustomer", 
        "CancelRequestedByProvider", 
        "Cancelled",
        "RescheduleRequested",
        "Rescheduled"
      ],
      default: "Pending",
    },
    
    // Financials
    totalAmount: { type: Number, required: true },
    platformCommission: Number,
    providerPayout: Number,
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "PayPal", "Cash", "Wallet"],
      default: "Credit Card",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded", "Failed"],
      default: "Pending",
    },

    // Customer details for the booking
    customerLocation: {
      address: { type: String, required: true },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere"
      }
    },
    phoneNumber: { type: String, required: true },
    reasonForBooking: { type: String, required: true },
    notes: { type: String }, // Precautionary stuff, extra info
    
    // Rescheduling fields
    rescheduleRequest: {
      requestedBy: { type: String, enum: ["customer", "provider"] },
      proposedDate: Date,
      proposedStartTime: String,
      proposedEndTime: String,
      reason: String,
      status: { type: String, enum: ["Pending", "Accepted", "Rejected"] }
    }
  },
  { timestamps: true } // Provides createdAt and updatedAt
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
