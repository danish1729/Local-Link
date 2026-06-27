import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { 
      customerId, 
      providerId, 
      serviceId, 
      bookingDate, 
      startTime, 
      endTime, 
      hours, 
      totalAmount,
      paymentMethod,
      customerLocation,
      phoneNumber,
      reasonForBooking,
      notes 
    } = body;

    const platformCommission = totalAmount * 0.1;
    const providerPayout = totalAmount * 0.9;

    // Generate unique booking number
    const bookingNumber = "BK-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const booking = await Booking.create({
      bookingNumber,
      customerId,
      providerId,
      serviceId,
      bookingDate,
      startTime,
      endTime,
      hours,
      totalAmount,
      platformCommission,
      providerPayout,
      paymentMethod,
      customerLocation,
      phoneNumber,
      reasonForBooking,
      notes,
      status: "Pending",
      paymentStatus: "Pending",
    });

    // Create notification for the provider
    try {
      const Notification = (await import("@/models/Notification")).default;
      const User = (await import("@/models/User")).default;
      const customer = await User.findById(customerId);
      
      const notification = await Notification.create({
        userId: providerId,
        type: "booking",
        content: `New booking request #${bookingNumber} from ${customer?.name || "a customer"}`,
        actionUrl: `/dashboard?role=provider&booking=${booking._id}`
      });

      // Trigger Pusher for live notification
      const { pusherServer } = await import("@/lib/pusher-server");
      await pusherServer.trigger(`private-user-${providerId}`, "new-notification", notification);
    } catch (err) {
      console.error("Booking notification error:", err);
    }

    // Proactively scan for fraud using AI
    import("@/lib/ai-fraud").then(({ analyzeBookingForFraud }) => {
      analyzeBookingForFraud(booking).catch(console.error);
    });

    return NextResponse.json(
      { message: "Booking created successfully", booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ message: "Booking failed", error: (error as Error).message }, { status: 500 });
  }
}
