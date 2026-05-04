import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
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

export async function GET(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");

    if (!conversationId) return new NextResponse("Missing conversationId", { status: 400 });

    await connectDB();

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Messages GET Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { conversationId, text, attachment, isOffer, offerDetails } = body;

    if (!conversationId) return new NextResponse("Missing conversationId", { status: 400 });

    await connectDB();

    const newMessage = await Message.create({
      conversationId,
      senderId: userId,
      text,
      attachment,
      isOffer,
      offerDetails
    });

    const populatedMessage = await newMessage.populate("senderId", "name profileImage");

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      $inc: { [`unreadCount.${userId}`]: -1 }, // Will fix unread counts later if needed
    });

    // Trigger Pusher
    await pusherServer.trigger(`private-conversation-${conversationId}`, "new-message", populatedMessage);

    return NextResponse.json(populatedMessage);
  } catch (error) {
    console.error("Messages POST Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
