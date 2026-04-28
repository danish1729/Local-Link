import Link from "next/link";
import { MapPin } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import HeaderActions from "./HeaderActions";
import HeaderSearch from "./HeaderSearch";

export default async function Header() {
  const user = await getAuthUser();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 group-hover:bg-blue-700 transition-colors flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 hidden sm:block">
                LocalLink
              </span>
            </Link>

            {/* ── Center nav links ── */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/services"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              >
                Browse Services
              </Link>
              <Link
                href="/how-it-works"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              >
                How It Works
              </Link>
              {user?.providerStatus != 'approved' && <Link
                href="/become-seller"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              >
                Become a Seller
              </Link>
              }
              
            </nav>

            {/* ── Search trigger (center on large screens) ── */}
            <div className="flex-1 max-w-sm hidden md:flex justify-center">
              <HeaderSearch />
            </div>

            {/* ── Right: Auth actions ── */}
            <HeaderActions user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
