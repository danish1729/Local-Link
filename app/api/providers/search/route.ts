import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import mongoose, { Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  name: string;
  serviceType?: string;
  hourlyRate?: number;
  location: {
    coordinates: [number, number];
  };
  profileImage?: string;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const query = searchParams.get("q") || ""; // Search text (e.g., "Plumber")
    const radius = searchParams.get("radius") || "5000"; // Default 5km (in meters)

    if (!lat || !lng) {
      return NextResponse.json(
        { message: "Location required" },
        { status: 400 },
      );
    }

    // 1. Build the Geospatial Query
    const dbQuery: any = {
      role: "provider",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)], // MongoDB uses [Lng, Lat]
          },
          $maxDistance: parseInt(radius), // Limit to 5km radius
        },
      },
    };

    // 2. Add Text Search (if user typed something)
    if (query) {
      const regex = new RegExp(query, "i"); // Case-insensitive
      dbQuery.$or = [{ name: regex }, { serviceType: regex }];
    }

    // 3. Execute Query
    const providers = await User.find(dbQuery)
      .select("name serviceType hourlyRate location profileImage") // Only fetch needed fields
      .lean();

    // 4. Format for Frontend
    const results = (providers as unknown as IUser[]).map((p) => ({
      id: p._id.toString(),
      name: p.name,
      category: p.serviceType || "General",
      lat: p.location.coordinates[1], // Latitude is index 1
      lng: p.location.coordinates[0], // Longitude is index 0
      price: p.hourlyRate || 0,
      rating: 4.8, // Placeholder until you have reviews
      image: p.profileImage,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
