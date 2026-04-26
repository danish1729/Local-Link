import Link from "next/link";
import { MapPin } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import HeaderActions from "./HeaderActions";
import HeaderSearch from "./HeaderSearch"; // 👈 Import the new component

export default async function Header() {
  const user = await getAuthUser();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* 1. Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 group-hover:bg-blue-700 transition-colors flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 hidden sm:block">
            LocalLink
          </span>
        </Link>

        {/* 2. Smart Search Button (Centered) */}

        {/* 3. Navigation & Actions (Right) */}
        <div className="flex items-center gap-6 shrink-0">
          <nav className="hidden lg:flex gap-6 text-sm font-medium text-slate-600">
            <Link
              href="/services"
              className="hover:text-blue-600 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-blue-600 transition-colors"
            >
              How It Works
            </Link>
          </nav>
          <div className="flex-1 max-w-2xl flex justify-center">
            <HeaderSearch />
          </div>
        </div>
        <HeaderActions user={user} />
      </div>
    </header>
  );
}
