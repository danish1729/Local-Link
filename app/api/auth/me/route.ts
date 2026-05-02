import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.log("No token found in cookies");
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing");

    const decoded = jwt.verify(token, secret) as any;

    return NextResponse.json({
      user: {
        _id: decoded.userId,
        role: decoded.role,
      }
    });
  } catch (error) {
    console.error("Auth/Me Route Error:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
