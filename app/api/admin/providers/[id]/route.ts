import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await User.findById(id).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ provider: user });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, isVerified, reason } = await req.json();

    await connectDB();

    const updateData: any = {};
    if (status) {
        if (!["approved", "rejected", "pending", "frozen"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }
        updateData.providerStatus = status;
        if (status === "approved") {
            updateData.role = "provider";
        } else {
            updateData.role = "customer";
        }
    }
    
    if (typeof isVerified === "boolean") {
        updateData.isVerified = isVerified;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Provider successfully updated`, user });
  } catch (error) {
    console.error("ADMIN PATCH PROVIDER ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
