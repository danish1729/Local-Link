import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    await connectDB();

    const { email, password } = await req.json();

    // 1. Basic Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    // 2. Find User
    // We explicitly select the password if your schema hides it by default,
    // otherwise standard findOne is fine.
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" }, // Generic message is safer for security
        { status: 401 },
      );
    }

    // 3. Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 4. Generate Token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        name: user.name,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 5. Sanitize User Object (Remove Password)
    // .toObject() converts Mongoose document to plain JS object so we can delete props
    const userData = user.toObject();
    delete userData.password;

    // 6. Create Response
    const response = NextResponse.json({
      message: "Login successful",
      user: userData, // Send the full profile to the frontend
    });

    // 7. Set HTTP-Only Cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    return response;
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
