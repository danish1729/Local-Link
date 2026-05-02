"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, CalendarClock, AlertTriangle, Activity } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { metrics, recentBookings } = data;

  const statCards = [
    { title: "Total Customers", value: metrics.totalCustomers, icon: Users, color: "bg-blue-50 text-blue-600 border-blue-200" },
    { title: "Active Providers", value: metrics.totalProviders, icon: Briefcase, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { title: "Pending Approvals", value: metrics.pendingApprovals, icon: CalendarClock, color: "bg-amber-50 text-amber-600 border-amber-200" },
    { title: "Active Disputes", value: metrics.pendingDisputes, icon: AlertTriangle, color: "bg-red-50 text-red-600 border-red-200" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-xl border ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Recent Bookings Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Recent Booking Activity
            </h2>
            <Link href="/admin-panel/bookings" className="text-sm text-indigo-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b: any) => (
                  <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{b.bookingNumber}</td>
                    <td className="px-6 py-4 text-slate-600">{b.customerId?.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-slate-600">{b.providerId?.name || "Unknown"}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">Rs. {b.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        b.status === "Pending" ? "bg-amber-100 text-amber-700" :
                        b.status === "Confirmed" ? "bg-emerald-100 text-emerald-700" :
                        b.status.includes("Cancel") ? "bg-red-100 text-red-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <Link href="/admin-panel/providers?tab=pending" className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <CalendarClock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900">Review Applications</h4>
                  <p className="text-xs text-amber-700">{metrics.pendingApprovals} pending</p>
                </div>
              </div>
            </Link>

            <Link href="/admin-panel/disputes" className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-red-900">Manage Disputes</h4>
                  <p className="text-xs text-red-700">{metrics.pendingDisputes} active disputes</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
