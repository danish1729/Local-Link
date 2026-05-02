import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "all";

    const query: any = {};
    if (status !== "all") {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("customerId", "name email")
      .populate("providerId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("ADMIN GET BOOKINGS ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
