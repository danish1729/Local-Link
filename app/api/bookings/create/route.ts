import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { customerId, providerId, serviceId, dateTime, totalAmount } =
      await req.json();

    const platformCommission = totalAmount * 0.1;
    const providerPayout = totalAmount * 0.9;

    const booking = await Booking.create({
      customerId,
      providerId,
      serviceId,
      dateTime,
      totalAmount,
      platformCommission,
      providerPayout,
      status: "Pending",
    });

    return NextResponse.json(
      { message: "Booking created", booking },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Booking failed" }, { status: 500 });
  }
}
