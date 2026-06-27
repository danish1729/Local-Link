import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { bookingId, status, reason } = await req.json();

    if (!["Accepted", "Rejected", "Completed"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const updateData: any = { status };
    if (reason && status === "Rejected") {
      updateData.cancelReason = reason;
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    ).populate("providerId", "name");

    if (booking) {
      try {
        const Notification = (await import("@/models/Notification")).default;
        const { pusherServer } = await import("@/lib/pusher-server");
        
        const notification = await Notification.create({
          userId: booking.customerId,
          type: "booking",
          content: `Your booking #${booking.bookingNumber} has been ${status.toLowerCase()} by ${booking.providerId.name}`,
          actionUrl: `/bookings?id=${booking._id}`
        });

        await pusherServer.trigger(`private-user-${booking.customerId}`, "new-notification", notification);
      } catch (err) {
        console.error("Booking status notification error:", err);
      }
    }

    return NextResponse.json({
      message: "Booking status updated",
      booking,
    });
  } catch {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
