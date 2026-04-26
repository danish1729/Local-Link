import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ServiceProvider from "@/models/ServiceProvider";

// Define the shape of the data we want to return
type ProviderCard = {
  _id: string;
  name: string;
  serviceType: string;
  hourlyRate?: number;
  profileImage: string | null;
  rating: number;
  reviewCount: number;
};

interface ProviderDoc {
  _id: { toString: () => string };
  name: string;
  serviceType?: string;
  hourlyRate?: number;
  profileImage?: string | null;
}

export async function GET() {
  try {
    await connectDB();

    // 1. Fetch only necessary fields
    const providers = await User.find(
      { role: "provider" },
      {
        name: 1,
        serviceType: 1,
        hourlyRate: 1,
        profileImage: 1,
        // If you had a 'rating' field in DB, fetch it here.
      },
    ).lean();

    // 2. Group by Service Type
    const grouped: Record<string, ProviderCard[]> = {};

    (providers as unknown as ProviderDoc[]).forEach((user) => {
      // Skip if no service type is set
      if (!user.serviceType) return;

      if (!grouped[user.serviceType]) {
        grouped[user.serviceType] = [];
      }

      // Generate a random rating for demo purposes (Remove this when you have real reviews)
      const demoRating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
      const demoCount = Math.floor(Math.random() * 50) + 1;

      grouped[user.serviceType].push({
        _id: user._id.toString(), // ✅ Convert ObjectId to string
        name: user.name,
        serviceType: user.serviceType,
        hourlyRate: user.hourlyRate || 0,
        profileImage: user.profileImage || null,
        rating: parseFloat(demoRating), // Number
        reviewCount: demoCount,
      });
    });

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("PROVIDERS API ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch providers" },
      { status: 500 },
    );
  }
}
