import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Destructure the "Flat" data coming from the form
    const {
      name,
      email,
      password,
      role,
      latitude,
      longitude,
      address,
      serviceType,
      hourlyRate,
    } = await req.json();

    // 2. Check existing
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already taken" },
        { status: 400 },
      );
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 🛑 CONSTRUCT THE GEOJSON OBJECT 🛑
    // MongoDB requires [Longitude, Latitude] order!
    const locationData = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    // 5. Create User
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      address, // Now validated by schema
      location: locationData, // Saved as GeoJSON
      // Only add these if they exist (cleaner DB)
      ...(serviceType && { serviceType }),
      ...(hourlyRate && { hourlyRate }),
    });

    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Signup failed" },
      { status: 500 },
    );
  }
}
