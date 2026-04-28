import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(authUser._id).select("-password -googleId");
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();
    
    // Validate email uniqueness if changing email
    if (updates.email && updates.email !== authUser.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser) {
        return NextResponse.json({ message: "Email is already in use" }, { status: 400 });
      }
    }

    // Only allow updating certain fields
    const allowedUpdates: Record<string, any> = {};
    if (updates.name) allowedUpdates.name = updates.name;
    if (updates.email) allowedUpdates.email = updates.email;
    if (updates.phoneNumber) allowedUpdates.phoneNumber = updates.phoneNumber;
    if (updates.address) allowedUpdates.address = updates.address;
    if (updates.profileImage) allowedUpdates.profileImage = updates.profileImage;

    const updatedUser = await User.findByIdAndUpdate(
      authUser._id,
      { $set: allowedUpdates },
      { new: true }
    ).select("-password -googleId");

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
