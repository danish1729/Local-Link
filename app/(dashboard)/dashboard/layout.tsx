"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Menu,
  X,
  User,
  Briefcase,
  Home,
  Settings,
  Bell,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
  profile,
  bookings,
}: {
  children: React.ReactNode;
  profile: React.ReactNode;
  bookings: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role") || "customer";
  const activeTab = searchParams.get("tab") || "profile";

  const navItems = [
    {
      label: "Overview",
      icon: Home,
      value: "overview",
    },
    {
      label: role === "customer" ? "My Bookings" : "Received Bookings",
      icon: Briefcase,
      value: "bookings",
    },
    {
      label: "Profile",
      icon: User,
      value: "profile",
    },
    ...(role === "provider"
      ? [
          {
            label: "Earnings",
            icon: BarChart3,
            value: "earnings",
          },
        ]
      : []),
    {
      label: "Settings",
      icon: Settings,
      value: "settings",
    },
  ];

  const handleTabChange = (tab: string) => {
    router.push(`/dashboard?role=${role}&tab=${tab}`);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <Link href={'/'}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 hidden sm:block">
                  LocalLink
                </span>
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 transition group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
                <span className="text-sm font-medium text-slate-900 hidden sm:block">
                  Account
                </span>
                <ChevronDown className="w-4 h-4 text-slate-600 group-hover:rotate-180 transition" />
              </button>

              <AnimatePresence>
                {profileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden"
                  >
                    <a
                      href="#"
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition border-b border-slate-100"
                    >
                      My Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition border-b border-slate-100"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition border-b border-slate-100"
                    >
                      Help & Support
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -256, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -256, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800 h-[calc(100vh-64px)]"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1"
                >
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.value;

                    return (
                      <motion.button
                        key={item.value}
                        variants={itemVariants}
                        onClick={() => handleTabChange(item.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-slate-300 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>

              {/* Sidebar Footer */}
              <div className="border-t border-slate-800 p-6 space-y-4">
                <div className="text-xs text-slate-400">
                  <p className="mb-2">Logged in as:</p>
                  <p className="font-semibold text-white capitalize">{role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col w-64 bg-slate-900 text-white h-full"
              >
                <div className="flex-1 overflow-y-auto p-6 space-y-2 pt-20">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.value;

                    return (
                      <button
                        key={item.value}
                        onClick={() => handleTabChange(item.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-slate-300 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-800 p-6 space-y-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "profile" && profile}
              {activeTab === "bookings" && bookings}
              {(activeTab === "overview" ||
                activeTab === "earnings" ||
                activeTab === "settings") && (
                <div className="p-8">
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <p className="text-slate-600 text-lg">
                      Coming soon:{" "}
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                      section
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
