import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { action } = await req.json(); // action can be "request_cancel" or "approve_cancel"
    const { id: bookingId } = await params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const isCustomer = booking.customerId.toString() === authUser._id.toString();
    const isProvider = booking.providerId.toString() === authUser._id.toString();

    if (!isCustomer && !isProvider) {
      return NextResponse.json({ message: "Unauthorized to modify this booking" }, { status: 403 });
    }

    if (action === "request_cancel") {
      if (booking.status === "Cancelled") {
        return NextResponse.json({ message: "Booking is already cancelled" }, { status: 400 });
      }

      booking.status = isCustomer ? "CancelRequestedByCustomer" : "CancelRequestedByProvider";
      await booking.save();
      return NextResponse.json({ message: "Cancellation requested successfully", booking });
    }

    if (action === "approve_cancel") {
      // Customer can only approve if provider requested, and vice versa
      if (isCustomer && booking.status !== "CancelRequestedByProvider") {
        return NextResponse.json({ message: "No cancellation request from provider" }, { status: 400 });
      }
      if (isProvider && booking.status !== "CancelRequestedByCustomer") {
        return NextResponse.json({ message: "No cancellation request from customer" }, { status: 400 });
      }

      booking.status = "Cancelled";
      await booking.save();
      return NextResponse.json({ message: "Cancellation approved", booking });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Booking Cancel Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
