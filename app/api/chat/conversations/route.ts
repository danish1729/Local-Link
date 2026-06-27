import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";
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

    await connectDB();

    const conversations = await Conversation.find({ participants: userId })
      .populate({ path: "participants", select: "name profileImage role", model: User })
      .populate({ path: "lastMessage", model: Message })
      .sort({ updatedAt: -1 })
      .lean();

    // Calculate total unread count for this user
    const totalUnreadCount = conversations.reduce((acc: number, convo: any) => {
      const count = convo.unreadCount?.[userId] || 0;
      console.log(`Convo ${convo._id} unread for ${userId}: ${count}`);
      return acc + count;
    }, 0);

    console.log(`Total unread for ${userId}: ${totalUnreadCount}`);
    return NextResponse.json({ conversations, totalUnreadCount });
  } catch (error) {
    console.error("Conversations GET Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { otherUserId } = await req.json();
    if (!otherUserId) return new NextResponse("Missing otherUserId", { status: 400 });

    await connectDB();

    // Check if exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, otherUserId],
        unreadCount: {
          [userId]: 0,
          [otherUserId]: 0
        }
      });
    }

    const populatedConvo = await Conversation.findById(conversation._id).populate("participants", "name profileImage role");

    return NextResponse.json(populatedConvo);
  } catch (error) {
    console.error("Conversations POST Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
