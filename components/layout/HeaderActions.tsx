"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LogOut, 
  LayoutDashboard, 
  User, 
  ChevronDown, 
  Loader2 
} from "lucide-react";

type UserProps = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  profileImage?: string | null;
} | null;

export default function HeaderActions({ user }: { user: UserProps }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Call API to clear the cookie
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh(); // Refresh to update server components
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Guest View (Not Logged In)
  if (!user || !user._id) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/login" 
          className="text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          Log in
        </Link>
        <Link 
          href="/signup" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Sign up
        </Link>
      </div>
    );
  }

  // 2. Logged In View
  const initials = user.name 
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() 
    : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
      >
        {/* Avatar Circle */}
        <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm overflow-hidden">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* Name & Arrow (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-2">
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-700 leading-none">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 capitalize leading-none mt-1">
              {user.role}
            </p>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Mobile Name (Visible only in dropdown on mobile) */}
          <div className="px-4 py-2 border-b border-slate-100 md:hidden">
            <p className="font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          <div className="py-1">
            <Link 
              href={`/dashboard?role=${user.role}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            
            <Link 
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <User className="w-4 h-4" />
              Profile Settings
            </Link>
          </div>

          <div className="border-t border-slate-100 mt-1 pt-1">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}