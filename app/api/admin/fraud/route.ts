import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FraudFlag from "@/models/FraudFlag";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Check auth here for super admin (omitted for brevity, assume protected by middleware or route group layout)
    
    // Ensure models are registered
    User.init();
    Booking.init();
    Message.init();
    Conversation.init();

    const flags = await FraudFlag.find()
      .populate("userId", "name email role providerStatus")
      .populate("bookingId", "bookingNumber totalAmount status bookingDate")
      .populate("messageId", "text")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ flags });
  } catch (error) {
    console.error("Fetch Fraud Flags Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
