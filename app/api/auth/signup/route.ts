import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Customer from "@/models/Customer";
import ServiceProvider from "@/models/ServiceProvider";

interface SignupBody {
  name: string;
  email: string;
  password: string;
  role: "customer" | "provider" | "admin";
  address?: string;
  latitude?: number;
  longitude?: number;
  serviceType?: string;
  hourlyRate?: number;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body: SignupBody = await req.json();

    const {
      name,
      email,
      password,
      role,
      address,
      latitude,
      longitude,
      serviceType,
      hourlyRate,
    } = body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // 4️⃣ Role-based document creation
    if (role === "customer") {
      if (!latitude || !longitude) {
        return NextResponse.json(
          { message: "Location is required for customer" },
          { status: 400 }
        );
      }

      await Customer.create({
        userId: user._id,
        address,
        location: {
          type: "Point",
          coordinates: [longitude, latitude], // lng, lat
        },
      });
    }

    if (role === "provider") {
      if (!latitude || !longitude || !serviceType) {
        return NextResponse.json(
          { message: "Missing provider information" },
          { status: 400 }
        );
      }

      await ServiceProvider.create({
        userId: user._id,
        serviceType,
        hourlyRate,
        serviceArea: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
