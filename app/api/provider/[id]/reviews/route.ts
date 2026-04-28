import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Invalid rating" }, { status: 400 });
    }

    if (!comment || comment.trim() === "") {
      return NextResponse.json({ message: "Comment is required" }, { status: 400 });
    }

    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // You cannot review yourself
    if (authUser._id === id) {
      return NextResponse.json({ message: "You cannot review yourself" }, { status: 400 });
    }

    const provider = await User.findById(id);
    if (!provider || provider.role !== "provider") {
      return NextResponse.json({ message: "Provider not found" }, { status: 404 });
    }

    const customer = await User.findById(authUser._id);
    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    // Add review to Provider's received reviews
    const newReview = {
      rating: Number(rating),
      comment,
      customerId: new mongoose.Types.ObjectId(authUser._id),
      customerName: customer.name,
      customerImage: customer.profileImage || null,
      createdAt: new Date()
    };

    provider.reviewsReceived.push(newReview);

    // Recalculate average rating
    const totalReviews = provider.reviewsReceived.length;
    const sumRatings = provider.reviewsReceived.reduce((sum: number, r: any) => sum + r.rating, 0);
    provider.averageRating = Number((sumRatings / totalReviews).toFixed(1));
    provider.totalReviews = totalReviews;

    await provider.save();

    // Add to Customer's given reviews
    customer.reviewsGiven.push({
      rating: Number(rating),
      comment,
      providerId: new mongoose.Types.ObjectId(provider._id),
      createdAt: new Date()
    });

    await customer.save();

    return NextResponse.json({ message: "Review submitted successfully", review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Submit Review Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
