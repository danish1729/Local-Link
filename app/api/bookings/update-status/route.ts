import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { bookingId, status } = await req.json();

    if (!["Accepted", "Rejected", "Completed"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    return NextResponse.json({
      message: "Booking status updated",
      booking,
    });
  } catch {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
