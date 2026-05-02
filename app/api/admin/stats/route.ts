import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Booking from "@/models/Booking";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // Promises run in parallel for performance
    const [
      totalCustomers,
      totalProviders,
      pendingApprovals,
      totalBookings,
      recentBookings,
      pendingDisputes,
    ] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "provider", providerStatus: "approved" }),
      User.countDocuments({ role: "provider", providerStatus: "pending" }),
      Booking.countDocuments(),
      Booking.find().sort({ createdAt: -1 }).limit(5).populate("customerId", "name").populate("providerId", "name").lean(),
      Booking.countDocuments({ 
        status: { $in: ["CancelRequestedByCustomer", "CancelRequestedByProvider"] } 
      }),
    ]);

    return NextResponse.json({
      metrics: {
        totalCustomers,
        totalProviders,
        pendingApprovals,
        totalBookings,
        pendingDisputes,
      },
      recentBookings,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
