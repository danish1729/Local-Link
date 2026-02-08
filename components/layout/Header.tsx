import Link from "next/link";
import { MapPin } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import HeaderActions from "./HeaderActions";

export default async function Header() {
  const user = await getAuthUser(); // 👈 SERVER AUTH CHECK

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900">LocalLink</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 text-slate-600">
          <Link href="/">Browse Services</Link>
          <Link href="/">How It Works</Link>
        </nav>

        {/* Auth Actions */}
        <HeaderActions user={user ?? { role: "guest" }} />
      </div>
    </header>
  );
}
