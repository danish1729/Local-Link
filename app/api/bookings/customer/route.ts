import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    const bookings = await Booking.find({ customerId })
      .populate("providerId")
      .populate("serviceId")
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
