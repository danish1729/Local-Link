import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const providers = await User.find(
      { role: "provider" },
      {
        name: 1,
        serviceType: 1,
        hourlyRate: 1,
        profileImage: 1,
      },
    ).lean();

    // 🔁 Group providers by category
    type ProviderSummary = {
      _id: string;
      name: string;
      hourlyRate?: number;
      profileImage: string | null;
      rating: number;
    };
    const grouped: Record<string, ProviderSummary[]> = {};

    providers.forEach((p) => {
      if (!p.serviceType) return;

      if (!grouped[p.serviceType]) {
        grouped[p.serviceType] = [];
      }

      grouped[p.serviceType].push({
        _id: p._id.toString(),
        name: p.name,
        hourlyRate: p.hourlyRate,
        profileImage: p.profileImage || null,
        rating: 4.8,
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
