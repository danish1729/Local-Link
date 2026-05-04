import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import FraudFlag from "@/models/FraudFlag";
import Notification from "@/models/Notification";
import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { action, userId, flagId } = await req.json();

    const user = await User.findById(userId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    if (action === "freeze_account") {
      // Freeze logic: mark status as suspended
      if (user.role === "provider") {
        user.providerStatus = "frozen";
      } else {
        user.role = "suspended";
      }
      await user.save();

      // Update flag action taken
      if (flagId) {
        await FraudFlag.findByIdAndUpdate(flagId, { status: "Resolved", actionTaken: "Account Frozen" });
      }

      return NextResponse.json({ success: true, message: "Account frozen successfully." });
    }

    if (action === "send_warning") {
      // Create an in-app notification to warn the user
      const notification = await Notification.create({
        userId: user._id,
        title: "Account Warning",
        content: "We have detected unusual activity on your account that violates our terms of service. Please adhere to the platform rules, or your account may be suspended.",
        type: "system",
        link: "/dashboard"
      });

      // Send real-time notification
      await pusherServer.trigger(`private-user-${user._id}`, "new-notification", notification);

      // Log action
      if (flagId) {
        await FraudFlag.findByIdAndUpdate(flagId, { status: "Resolved", actionTaken: "Warning Issued" });
      }

      return NextResponse.json({ success: true, message: "Warning sent successfully." });
    }

    if (action === "resolve_flag") {
      if (flagId) {
        await FraudFlag.findByIdAndUpdate(flagId, { status: "Resolved", actionTaken: "Dismissed (Safe)" });
      }
      return NextResponse.json({ success: true, message: "Flag resolved." });
    }

    return new NextResponse("Invalid action", { status: 400 });

  } catch (error) {
    console.error("Admin User Action Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
