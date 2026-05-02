import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const q         = searchParams.get("q")?.trim() || "";
    const category  = searchParams.get("category") || "";
    const minRate   = parseFloat(searchParams.get("minRate") || "0");
    const maxRate   = parseFloat(searchParams.get("maxRate") || "99999");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const verified  = searchParams.get("verified") === "true";
    const sortBy    = searchParams.get("sortBy") || "rating";
    const page      = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit     = Math.min(24, parseInt(searchParams.get("limit") || "12"));

    // Geo params
    const lat    = parseFloat(searchParams.get("lat") || "");
    const lng    = parseFloat(searchParams.get("lng") || "");
    const radius = parseFloat(searchParams.get("radius") || "10"); // km

    const useGeo = !isNaN(lat) && !isNaN(lng);

    // ── Build match stage ────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matchStage: Record<string, any> = {
      role: "provider",
      // Include approved providers OR providers without providerStatus set yet (backwards compat)
      $or: [
        { providerStatus: "approved" },
        { providerStatus: { $exists: false } },
        { providerStatus: "none" },
      ],
    };

    if (category) matchStage.serviceType = category;
    if (verified) matchStage.isVerified = true;
    if (minRate > 0 || maxRate < 99999) {
      matchStage.hourlyRate = { $gte: minRate, $lte: maxRate };
    }
    if (minRating > 0) {
      matchStage.averageRating = { $gte: minRating };
    }
    if (q) {
      // Use $and so the keyword $or doesn't overwrite the providerStatus $or
      matchStage.$and = [
        { $or: matchStage.$or },
        {
          $or: [
            { name:        { $regex: q, $options: "i" } },
            { serviceType: { $regex: q, $options: "i" } },
            { bio:         { $regex: q, $options: "i" } },
            { address:     { $regex: q, $options: "i" } },
          ],
        },
      ];
      delete matchStage.$or;
    }

    // ── Sort ─────────────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortStage: Record<string, any> = { averageRating: -1 };
    if (sortBy === "price_asc")  sortStage = { hourlyRate: 1 };
    if (sortBy === "price_desc") sortStage = { hourlyRate: -1 };
    if (sortBy === "newest")     sortStage = { createdAt: -1 };
    if (sortBy === "reviews")    sortStage = { totalReviews: -1 };

    // ── Aggregation pipeline ─────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = [];

    if (useGeo) {
      // $geoNear must be the FIRST stage when used
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distanceMeters",
          maxDistance: radius * 1000, // convert km → metres
          spherical: true,
          query: {
            role: "provider",
            $or: [
              { providerStatus: "approved" },
              { providerStatus: { $exists: false } },
              { providerStatus: "none" },
            ],
          },
        },
      });
      // After geoNear, apply remaining filters
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { role: _r, $or: _or, ...restMatch } = matchStage;
      if (Object.keys(restMatch).length) pipeline.push({ $match: restMatch });
    } else {
      pipeline.push({ $match: matchStage });
    }

    // Add computed distanceKm field (null if geo not used)
    pipeline.push({
      $addFields: {
        distanceKm: useGeo
          ? { $round: [{ $divide: ["$distanceMeters", 1000] }, 1] }
          : null,
      },
    });

    // Sort + paginate
    pipeline.push({ $sort: sortStage });

    // Count facet for pagination
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        providers: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              name: 1,
              serviceType: 1,
              hourlyRate: 1,
              profileImage: 1,
              bio: 1,
              averageRating: 1,
              totalReviews: 1,
              isVerified: 1,
              address: 1,
              location: 1,
              distanceKm: 1,
              createdAt: 1,
            },
          },
        ],
      },
    });

    const [result] = await User.aggregate(pipeline);

    const total     = result?.metadata?.[0]?.total ?? 0;
    const providers = result?.providers ?? [];

    // ── Fetch distinct categories for filter ─────────────────────────────────
    const categories = await User.distinct("serviceType", {
      role: "provider",
      serviceType: { $exists: true, $ne: "" },
    });

    return NextResponse.json({
      providers: providers.map((p: mongoose.Document & {
        _id: mongoose.Types.ObjectId;
        name?: string;
        serviceType?: string;
        hourlyRate?: number;
        profileImage?: string | null;
        bio?: string;
        averageRating?: number;
        totalReviews?: number;
        isVerified?: boolean;
        address?: string;
        distanceKm?: number | null;
        createdAt?: Date;
      }) => ({
        ...p,
        _id: p._id.toString(),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      categories: categories.filter(Boolean).sort(),
    });
  } catch (error) {
    console.error("SERVICES API ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch services", error: String(error) },
      { status: 500 }
    );
  }
}
