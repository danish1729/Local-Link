"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function HeaderActions({
  user,
}: {
  user: { role: string } | null;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh(); // 🔥 re-render server components
  }

  if (!user || user.role === "guest") {
    return (
      <div className="flex gap-4 items-center">
        <Link href="/login" className="text-blue-600 font-medium">
          Login
        </Link>
        <Link
          href="/signup"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href={`/${user.role}/dashboard`}
        className="flex items-center gap-2 text-slate-700"
      >
        <User className="w-4 h-4" />
        Dashboard
      </Link>

      <button
        onClick={handleLogout}
        className="text-red-500 hover:text-red-600 cursor-pointer "
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
