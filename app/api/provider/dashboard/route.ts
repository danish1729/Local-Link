import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized: No valid session found" }, { status: 401 });
    }

    if (authUser.role !== "provider") {
      return NextResponse.json({ message: `Unauthorized: Role is ${authUser.role}, expected provider` }, { status: 401 });
    }

    const user = await User.findById(authUser._id);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch all bookings for this provider
    const bookings = await Booking.find({ providerId: authUser._id })
      .populate("customerId", "name profileImage")
      .sort({ createdAt: -1 });

    // Calculate metrics
    let totalEarnings = 0;
    let activeOrders = 0;
    let completedOrders = 0;

    const recentBookings: any[] = [];

    bookings.forEach((booking, index) => {
      if (booking.status === "Completed") {
        totalEarnings += booking.providerPayout || (booking.totalAmount * 0.8) || 0; // fallback logic
        completedOrders++;
      } else if (booking.status === "Accepted") {
        activeOrders++;
      }

      // Grab the top 5 for the recent list
      if (index < 5) {
        recentBookings.push(booking);
      }
    });

    return NextResponse.json({ 
      metrics: {
        totalEarnings,
        activeOrders,
        completedOrders,
        impressions: user.impressions || 0,
        profileClicks: user.profileClicks || 0,
      },
      recentBookings,
      user: {
        _id: user._id,
        name: user.name,
        profileImage: user.profileImage,
        serviceType: user.serviceType,
        providerStatus: user.providerStatus
      }
    });
  } catch (error) {
    console.error("Provider Dashboard Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
