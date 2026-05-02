"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Search,
  Compass,
  HelpCircle,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Calendar,
  User,
  LogOut,
  Sparkles,
  MapPin,
  ChevronRight,
  Loader2,
} from "lucide-react";

type UserProps = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  profileImage?: string | null;
  providerStatus?: string;
} | null;

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Browse Services", icon: Compass },
  { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
];

// Stagger animation variants for menu items
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, x: -24 },
};

export default function MobileMenu({ user }: { user: UserProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <>
      {/* ── Hamburger trigger (visible only on mobile / tablet) ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-slate-700" />
      </button>

      {/* ── Off-canvas drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed top-0 bottom-0 left-0 z-[201] w-[300px] max-w-[85vw] h-screen bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              {/* ── Drawer header ── */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-slate-900">LocalLink</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* ── User info card (logged in) ── */}
              {user && user._id && (
                <div className="px-5 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-white shadow-md">
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
              )}

              {/* ── Navigation links ── */}
              <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4">
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="space-y-1"
                >
                  {/* Main nav */}
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.li key={link.href} variants={itemVariants}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                            isActive
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                          {link.label}
                          {isActive && (
                            <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}

                  {/* Divider */}
                  <motion.li variants={itemVariants}>
                    <div className="my-3 border-t border-slate-100" />
                  </motion.li>

                  {/* Search (mobile) */}
                  <motion.li variants={itemVariants}>
                    <Link
                      href="/services"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all group"
                    >
                      <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                      Search Providers
                      <ChevronRight className="w-4 h-4 ml-auto text-slate-300" />
                    </Link>
                  </motion.li>

                  {/* Logged-in items */}
                  {user && user._id && (
                    <>
                      <motion.li variants={itemVariants}>
                        <div className="my-3 border-t border-slate-100" />
                        <p className="px-4 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Account</p>
                      </motion.li>

                      {user.role === "provider" && (
                        <motion.li variants={itemVariants}>
                          <Link
                            href="/dashboard?role=provider"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all group"
                          >
                            <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                            Seller Dashboard
                            <ChevronRight className="w-4 h-4 ml-auto text-slate-300" />
                          </Link>
                        </motion.li>
                      )}

                      {user.role === "customer" && (
                        <motion.li variants={itemVariants}>
                          <Link
                            href="/bookings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all group"
                          >
                            <Calendar className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                            My Bookings
                            <ChevronRight className="w-4 h-4 ml-auto text-slate-300" />
                          </Link>
                        </motion.li>
                      )}

                      <motion.li variants={itemVariants}>
                        <Link
                          href="/profile"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all group"
                        >
                          <User className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                          Profile Settings
                          <ChevronRight className="w-4 h-4 ml-auto text-slate-300" />
                        </Link>
                      </motion.li>

                      {/* Become a Seller CTA */}
                      {user.role !== "provider" && user.providerStatus !== "approved" && (
                        <motion.li variants={itemVariants}>
                          <Link
                            href="/become-seller"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 mx-1 mt-2 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 hover:shadow-md transition-all group"
                          >
                            <Sparkles className="w-5 h-5 text-emerald-500" />
                            Become a Seller
                            <ChevronRight className="w-4 h-4 ml-auto text-emerald-400" />
                          </Link>
                        </motion.li>
                      )}
                    </>
                  )}
                </motion.ul>
              </nav>

              {/* ── Bottom area ── */}
              <div className="shrink-0 border-t border-slate-100 px-4 py-4">
                {user && user._id ? (
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold transition-all border border-red-100"
                  >
                    {loggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-bold hover:bg-slate-50 transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                    >
                      <UserPlus className="w-4 h-4" />
                      Join Free
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
