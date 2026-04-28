import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { 
      name,
      profileImage,
      serviceType, 
      hourlyRate, 
      bio,
      phoneNumber,
      education,
      workExperience,
      certificates,
      cnicNumber,
      cnicFrontImage,
      cnicBackImage
    } = await req.json();

    if (!serviceType || !hourlyRate || !bio || !phoneNumber || !cnicNumber || !cnicFrontImage || !cnicBackImage) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          name,
          profileImage,
          serviceType,
          hourlyRate,
          bio,
          phoneNumber,
          education,
          workExperience,
          certificates,
          cnicNumber,
          cnicFrontImage,
          cnicBackImage,
          providerStatus: "pending"
        }
      }
    );

    return NextResponse.json({ message: "Application submitted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Become Seller Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
