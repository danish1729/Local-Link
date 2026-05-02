import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    
    // Fetch bookings that have requested cancellation
    const disputes = await Booking.find({
      status: { $in: ["CancelRequestedByCustomer", "CancelRequestedByProvider"] }
    })
      .populate("customerId", "name email")
      .populate("providerId", "name email")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ disputes });
  } catch (error) {
    console.error("ADMIN GET DISPUTES ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
  }
}
