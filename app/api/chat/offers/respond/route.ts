import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Conversation from "@/models/Conversation";
import { pusherServer } from "@/lib/pusher-server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const getUserId = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded.userId;
  } catch {
    return null;
  }
};

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { messageId, status } = await req.json(); // status: "accepted" or "rejected"
    if (!["accepted", "rejected"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    await connectDB();

    const message = await Message.findById(messageId);
    if (!message || !message.isOffer) {
      return new NextResponse("Offer not found", { status: 404 });
    }

    if (message.offerDetails.status !== "pending") {
      return new NextResponse("Offer already processed", { status: 400 });
    }

    // Update message status
    message.offerDetails.status = status;
    await message.save();

    const populatedMessage = await message.populate("senderId", "name profileImage");
    
    // Broadcast status change
    await pusherServer.trigger(`private-conversation-${message.conversationId}`, "offer-updated", populatedMessage);

    if (status === "accepted") {
      // Create a booking!
      const customer = await User.findById(userId);
      const providerId = message.senderId;

      const { hourlyRate, bookingDate, startTime, endTime } = message.offerDetails;
      
      // Calculate hours naively for now (assuming same day)
      const start = new Date(`1970-01-01T${startTime}:00Z`);
      const end = new Date(`1970-01-01T${endTime}:00Z`);
      const hours = Math.abs(end.getTime() - start.getTime()) / 36e5;

      const totalAmount = hourlyRate * (hours || 1);

      const booking = await Booking.create({
        bookingNumber: `BK-${Date.now()}`,
        customerId: customer._id,
        providerId: providerId,
        bookingDate,
        startTime,
        endTime,
        hours: hours || 1,
        totalAmount,
        customerLocation: {
          address: customer.address || "Address not provided",
          coordinates: [0, 0] // Default, should be updated by customer location
        },
        phoneNumber: customer.phone || "0000000000",
        reasonForBooking: "Custom Offer from Chat",
        status: "Accepted" // Since provider sent it and customer accepted
      });

      // Proactively scan for fraud using AI
      import("@/lib/ai-fraud").then(({ analyzeBookingForFraud }) => {
        analyzeBookingForFraud(booking).catch(console.error);
      });

      // Send a system message in chat
      const systemMessage = await Message.create({
        conversationId: message.conversationId,
        senderId: userId, // Customer sent the system auto-message
        text: `Offer accepted! Booking ${booking.bookingNumber} has been created.`,
      });

      const popSysMsg = await systemMessage.populate("senderId", "name profileImage");
      await pusherServer.trigger(`private-conversation-${message.conversationId}`, "new-message", popSysMsg);

      await Conversation.findByIdAndUpdate(message.conversationId, { lastMessage: systemMessage._id });

      // Notify the provider (offer sender)
      try {
        const Notification = (await import("@/models/Notification")).default;
        await Notification.create({
          userId: providerId,
          type: "offer",
          content: `${customer.name} accepted your custom offer! Booking ${booking.bookingNumber} is confirmed.`,
          actionUrl: `/dashboard?role=provider&booking=${booking._id}`
        });

        await pusherServer.trigger(`private-user-${providerId}`, "new-notification", {
          type: "offer",
          content: `${customer.name} accepted your custom offer!`,
          actionUrl: `/dashboard?role=provider&booking=${booking._id}`
        });
      } catch (err) {
        console.error("Offer acceptance notification error:", err);
      }
    }

    return NextResponse.json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error("Offer Respond Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
