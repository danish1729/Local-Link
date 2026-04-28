import Header from "@/components/layout/Header";
import ProfileClient from "./ProfileClient";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <ProfileClient />
    </div>
  );
}
