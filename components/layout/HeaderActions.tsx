"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
  Loader2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type UserProps = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  profileImage?: string | null;
  providerStatus?: string;
} | null;

export default function HeaderActions({ user }: { user: UserProps }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Close dropdown when clicking outside (UNCHANGED logic) ──
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Logout (UNCHANGED logic) ──
  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  // ── 1. Guest view ──
  if (!user || !user._id) {
    return (
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/login"
          className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-px"
        >
          Join Free
        </Link>
      </div>
    );
  }

  // ── 2. Logged-in view ──
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="relative flex items-center gap-3 shrink-0" ref={dropdownRef}>

      {/* Become a Seller pill — shown to any logged-in user who is NOT yet an approved provider */}
      {user.role !== "provider" && user.providerStatus !== "approved" && (
        <Link
          href="/become-seller"
          className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Become a Seller
        </Link>
      )}

      {/* ── Avatar button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-white">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name ?? "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* Name & role (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1.5">
          <div className="text-left leading-tight">
            <p className="text-sm font-bold text-slate-800">{user.name}</p>
            <p className="text-[11px] text-slate-400 capitalize">{user.role}</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-white">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name ?? ""} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-2">
              {/* Provider dashboard (UNCHANGED condition) */}
              {user.role === "provider" && (
                <Link
                  href="/dashboard?role=provider"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  Seller Dashboard
                </Link>
              )}

              {/* Admin dashboard (UNCHANGED condition) */}
              {user.role === "admin" && (
                <Link
                  href="/dashboard?role=admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  Admin Dashboard
                </Link>
              )}

              {/* My Bookings (UNCHANGED condition) */}
              {user.role === "customer" && (
                <Link
                  href="/bookings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  My Bookings
                </Link>
              )}

              {/* Profile Settings (always shown) */}
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <User className="w-4 h-4 shrink-0" />
                Profile Settings
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 p-2">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}