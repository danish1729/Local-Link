import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    // params needs to be awaited in Next 15+
    const { id } = await params;

    const provider = await User.findOne({ _id: id, role: "provider" })
      .select("-password -__v");

    if (!provider) {
      return NextResponse.json({ message: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json({ provider }, { status: 200 });
  } catch (error) {
    console.error("Provider fetch error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
