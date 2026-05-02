"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  AlertTriangle, 
  LogOut,
  Server
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const navItems = [
  { name: "Overview", href: "/admin-panel", icon: LayoutDashboard },
  { name: "Providers & Approvals", href: "/admin-panel/providers", icon: Users },
  { name: "Bookings", href: "/admin-panel/bookings", icon: CalendarCheck },
  { name: "Disputes", href: "/admin-panel/disputes", icon: AlertTriangle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("auth_token");
    toast.success("Logged out successfully");
    router.push("/admin-login");
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col hidden md:flex">
        {/* Header */}
        <div className="h-16 flex items-center px-6 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
            <Server className="w-5 h-5 text-indigo-500" />
            Super Admin
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-indigo-600 text-white font-medium shadow-sm" 
                        : "hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header (Mobile mainly, or context) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <h1 className="text-xl font-bold text-slate-800">
            {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              Admin Session
            </span>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
