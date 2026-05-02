"use client";

import { useEffect, useState } from "react";
import { Search, Calendar, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => 
    b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) || 
    b.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.providerId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">All Bookings</h2>
          <p className="text-sm text-slate-500">Monitor all platform transactions</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID, customer or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Booking Info</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Financials</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-mono font-bold text-slate-800">{booking.bookingNumber}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Booked on {format(new Date(booking.createdAt), "MMM d, yyyy")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{booking.customerId?.name || "Deleted User"}</p>
                      <p className="text-xs text-slate-500">{booking.customerId?.email || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{booking.providerId?.name || "Deleted Provider"}</p>
                      <p className="text-xs text-slate-500">{booking.providerId?.email || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        {format(new Date(booking.bookingDate), "MMM d, yyyy")}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {booking.startTime} - {booking.endTime} ({booking.hours} hrs)
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">Rs. {booking.totalAmount}</p>
                      <p className="text-xs text-slate-500">Platform Fee: <span className="font-medium text-emerald-600">Rs. {booking.platformCommission || 0}</span></p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                        booking.status === "Pending" ? "bg-amber-100 text-amber-700" :
                        booking.status === "Confirmed" ? "bg-emerald-100 text-emerald-700" :
                        booking.status === "Completed" ? "bg-blue-100 text-blue-700" :
                        booking.status.includes("Cancel") ? "bg-red-100 text-red-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {booking.status === "Pending" && <Clock className="w-3 h-3" />}
                        {booking.status === "Completed" && <CheckCircle2 className="w-3 h-3" />}
                        {booking.status.includes("Cancel") && <XCircle className="w-3 h-3" />}
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
