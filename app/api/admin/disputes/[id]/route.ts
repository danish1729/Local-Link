import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action } = await req.json();

    if (!["cancel", "revert"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await connectDB();

    const newStatus = action === "cancel" ? "Cancelled" : "Confirmed";

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Dispute resolved: Booking ${newStatus}`, booking });
  } catch (error) {
    console.error("ADMIN PATCH DISPUTE ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
