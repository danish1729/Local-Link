import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch bookings where user is either the customer or the provider
    const bookings = await Booking.find({
      $or: [
        { customerId: authUser._id },
        { providerId: authUser._id }
      ]
    })
    .populate("providerId", "name profileImage serviceType hourlyRate")
    .populate("customerId", "name profileImage address")
    .sort({ createdAt: -1 });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Bookings GET Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
