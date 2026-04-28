import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const { credential, latitude, longitude, address } = await req.json();

    if (!credential) {
      return NextResponse.json({ message: "Google credential is required" }, { status: 400 });
    }

    // 1. Verify the Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ message: "Invalid Google Token" }, { status: 400 });
    }

    const { email, name, sub: googleId, picture } = payload;

    await connectDB();

    // 2. Find or Create User
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user (Signup flow via Google)
      // Since everyone starts as customer, we set it explicitly
      
      const locationData = latitude && longitude ? {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      } : undefined;

      user = await User.create({
        name: name || "Google User",
        email: email,
        googleId,
        role: "customer",
        providerStatus: "none",
        profileImage: picture,
        address: address || "Not provided",
        location: locationData
      });
    } else {
      // If user exists, we can link the googleId and update location
      const updateData: any = {};
      
      if (!user.googleId) {
        updateData.googleId = googleId;
        if (!user.profileImage && picture) {
          updateData.profileImage = picture;
        }
      }

      if (latitude && longitude) {
        updateData.location = {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        };
      }

      if (Object.keys(updateData).length > 0) {
        await User.updateOne({ _id: user._id }, { $set: updateData });

        if (updateData.googleId) user.googleId = googleId;
        if (updateData.profileImage) user.profileImage = picture;
        if (updateData.location) user.location = updateData.location;
      }
    }

    // 3. Generate Custom JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        name: user.name,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = user.toObject();
    delete userData.password;

    // 4. Set Cookie and Respond
    const response = NextResponse.json({
      message: "Google login successful",
      user: userData,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    return response;
  } catch (error) {
    console.error("❌ GOOGLE AUTH ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error during Google Auth" },
      { status: 500 }
    );
  }
}
