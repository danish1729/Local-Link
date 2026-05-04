import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
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

    const { reportedUserId, conversationId, reason } = await req.json();

    if (!reportedUserId || !reason) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectDB();

    const report = await Report.create({
      reporterId: userId,
      reportedUserId,
      conversationId,
      reason
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Reports POST Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
