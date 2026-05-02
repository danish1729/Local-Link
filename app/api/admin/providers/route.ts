import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "all";

    const query: any = { role: "provider" };
    if (status !== "all") {
      query.providerStatus = status;
    }

    const providers = await User.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ providers });
  } catch (error) {
    console.error("ADMIN GET PROVIDERS ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }
}
