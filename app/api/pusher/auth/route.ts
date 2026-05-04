import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher-server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    const body = await req.text();
    const params = new URLSearchParams(body);
    const socketId = params.get("socket_id") as string;
    const channel = params.get("channel_name") as string;

    // Provide presence data if it's a presence channel
    const presenceData = {
      user_id: userId,
      user_info: {
        name: decoded.name || "User",
        role: decoded.role,
      },
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, presenceData);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher Auth Error:", error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
