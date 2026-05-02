"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Clock,
  Eye,
  MousePointerClick,
  DollarSign,
  Loader2,
  MoreVertical,
  Star,
  Zap,
  AlertCircle
} from "lucide-react";

export default function DashboardClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/provider/dashboard", {
          credentials: "same-origin"
        });
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.message || "Failed to load dashboard");
        }
      } catch (err) {
        console.error(err);
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Dashboard Error</h2>
        <p className="text-slate-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, recentBookings, user } = data;

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        
        {/* Welcome Hero */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Zap className="w-64 h-64 text-blue-400" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden bg-slate-800">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-300">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name || "Provider"}!</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100 text-sm font-medium mb-4">
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {user.serviceType || "Service Provider"}</span>
                <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-4 h-4" /> Approved Seller</span>
              </div>
              <a href={`/provider/${user._id || ''}`} className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-semibold text-sm transition-colors border border-white/20">
                View Public Profile
              </a>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Earnings in November" 
            value={`Rs. ${metrics.totalEarnings.toLocaleString()}`} 
            icon={<DollarSign className="w-5 h-5 text-green-600" />} 
            trend="+12%" 
            bg="bg-green-50"
          />
          <MetricCard 
            title="Active Orders" 
            value={metrics.activeOrders} 
            icon={<Briefcase className="w-5 h-5 text-blue-600" />} 
            bg="bg-blue-50"
          />
          <MetricCard 
            title="Profile Impressions" 
            value={metrics.impressions} 
            icon={<Eye className="w-5 h-5 text-purple-600" />} 
            trend="+5%"
            bg="bg-purple-50"
          />
          <MetricCard 
            title="Profile Clicks" 
            value={metrics.profileClicks} 
            icon={<MousePointerClick className="w-5 h-5 text-amber-600" />} 
            bg="bg-amber-50"
          />
        </div>

        {/* Main Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Recent Orders */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Active & Recent Orders</h2>
                <a href="/bookings" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</a>
              </div>
              
              <div className="divide-y divide-slate-100">
                {recentBookings.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    No recent orders found. Keep your profile updated to attract customers!
                  </div>
                ) : (
                  recentBookings.map((booking: any) => (
                    <div key={booking._id} className="p-6 flex flex-col sm:flex-row items-center gap-4 hover:bg-slate-50 transition-colors group">
                      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        {booking.customerId?.profileImage ? (
                          <img src={booking.customerId.profileImage} alt="Customer" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-200">
                            {booking.customerId?.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h4 className="font-bold text-slate-900 truncate">{booking.customerId?.name || "Unknown Customer"}</h4>
                        <p className="text-sm text-slate-500">
                          {booking.dateTime ? format(new Date(booking.dateTime), "MMM d, yyyy") : "No date"}
                        </p>
                      </div>

                      <div className="text-center sm:text-right">
                        <p className="font-bold text-slate-900">Rs. {booking.totalAmount}</p>
                        <StatusBadge status={booking.status} />
                      </div>

                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hidden sm:block">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Seller Level & Tips */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> 
                Seller Level
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Response Rate</span>
                    <span className="text-green-600 font-bold">100%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Order Completion</span>
                    <span className="text-blue-600 font-bold">95%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[95%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="font-bold text-blue-900 mb-2">Boost Your Profile</h3>
              <p className="text-sm text-blue-700 mb-4">
                Sellers who regularly update their portfolio and add new certificates get 3x more bookings!
              </p>
              <a href="/profile" className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Edit Profile
              </a>
            </div>
          </div>

        </div>
      </main>
  );
}

function MetricCard({ title, value, icon, trend, bg }: { title: string, value: string | number, icon: any, trend?: string, bg: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-start justify-between group hover:border-blue-200 transition-colors">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <p className="text-sm font-medium text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> {trend}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        {icon}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch(status) {
    case "Pending": return <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Pending</span>;
    case "Accepted": return <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Active</span>;
    case "Completed": return <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Completed</span>;
    default: return <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-md">{status}</span>;
  }
}
