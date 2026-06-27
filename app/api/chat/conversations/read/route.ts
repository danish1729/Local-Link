import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Conversation from "@/models/Conversation";
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

    const { conversationId } = await req.json();
    if (!conversationId) return new NextResponse("Missing conversationId", { status: 400 });

    await connectDB();

    // Reset unread count for this user in this conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCount.${userId}`]: 0 }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat Read POST Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
