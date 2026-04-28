import Header from "@/components/layout/Header";
import BookingsClient from "./BookingsClient";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BookingsPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <BookingsClient />
    </div>
  );
}
