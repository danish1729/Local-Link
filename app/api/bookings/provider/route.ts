import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get("providerId");

    const bookings = await Booking.find({ providerId })
      .populate("customerId")
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
