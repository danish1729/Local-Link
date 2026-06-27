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

    // Update conversation: set last message and increment unread count for the RECIPIENT
    const conversation = await Conversation.findById(conversationId);
    const recipientId = conversation.participants.find((p: any) => p.toString() !== userId.toString());

    if (recipientId) {
      const recipientIdStr = recipientId.toString();
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: newMessage._id,
        $inc: { [`unreadCount.${recipientIdStr}`]: 1 },
      });

      // Get updated conversation for total unread count
      const updatedConvo = await Conversation.findById(conversationId).lean();
      const recipientUnreadCount = updatedConvo.unreadCount ? updatedConvo.unreadCount[recipientIdStr] : 0;

      // Create notification for the recipient
      const Notification = (await import("@/models/Notification")).default;
      const notification = await Notification.create({
        userId: recipientIdStr,
        type: "message_alert",
        content: `New message from ${populatedMessage.senderId.name}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
        actionUrl: `/messages?conversationId=${conversationId}`
      });

      // Trigger user-level notification event (for badge)
      await pusherServer.trigger(`private-user-${recipientIdStr}`, "new-message-alert", {
        conversationId,
        unreadCount: recipientUnreadCount, 
        notification
      });
      
      // Trigger new-notification for the bell
      await pusherServer.trigger(`private-user-${recipientIdStr}`, "new-notification", notification);
    }

    // Trigger conversation-level Pusher (for the active chat window)
    await pusherServer.trigger(`private-conversation-${conversationId}`, "new-message", populatedMessage);

    // AI Fraud detection for chat messages
    import("@/lib/ai-fraud").then(({ analyzeMessageForFraud }) => {
      analyzeMessageForFraud(newMessage).catch(console.error);
    });

    return NextResponse.json(populatedMessage);
  } catch (error) {
    console.error("Messages POST Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
