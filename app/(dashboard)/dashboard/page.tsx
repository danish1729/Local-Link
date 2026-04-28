import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import DashboardClient from "./DashboardClient";
import Header from "@/components/layout/Header";

export default async function ProviderDashboardPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  // Only providers allowed
  if (authUser.role !== "provider") {
    redirect("/bookings");
  }

  await connectDB();
  const user = await User.findById(authUser._id);
  
  if (!user) redirect("/login");

  // If they are a provider but still pending/rejected, redirect to onboarding flow
  if (user.providerStatus !== "approved") {
    redirect("/become-seller");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <DashboardClient />
    </div>
  );
}