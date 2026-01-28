import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ServiceProvider from "@/models/ServiceProvider";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));

    if (!lat || !lng) {
      return NextResponse.json(
        { message: "Location required" },
        { status: 400 }
      );
    }

    const providers = await ServiceProvider.find({
      serviceArea: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 5000, // 5km
        },
      },
      isVerified: true,
    });

    return NextResponse.json(providers);
  } catch (error) {
    return NextResponse.json({ message: "Search failed" }, { status: 500 });
  }
}
