import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Booking from "@/models/Booking";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    // We await params in Next.js 15+
    const { id: providerId } = await params;

    const provider = await User.findById(providerId).select("availability unavailableDates role");

    if (!provider || provider.role !== "provider") {
      return NextResponse.json({ message: "Provider not found" }, { status: 404 });
    }

    // Fetch all future active bookings for this provider
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      providerId,
      bookingDate: { $gte: today },
      status: { $in: ["Pending", "Confirmed", "InProgress", "RescheduleRequested"] }
    }).select("bookingDate startTime endTime");

    return NextResponse.json(
      { 
        availability: provider.availability || [], 
        unavailableDates: provider.unavailableDates || [],
        bookings 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch availability" }, { status: 500 });
  }
}
