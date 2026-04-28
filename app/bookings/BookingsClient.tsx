"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  Loader2,
  DollarSign,
  User,
  ShieldAlert
} from "lucide-react";

interface Booking {
  _id: string;
  customerId: any;
  providerId: any;
  dateTime: string;
  status: string;
  totalAmount: number;
}

export default function BookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (res.ok) setBookings(data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelAction = async (bookingId: string, action: "request_cancel" | "approve_cancel") => {
    if (!confirm(action === "request_cancel" ? "Are you sure you want to request cancellation?" : "Are you sure you want to approve the cancellation?")) return;
    
    setProcessingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      await fetchBookings();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  const getFilteredBookings = () => {
    return bookings.filter(b => {
      if (activeTab === "active") return ["Pending", "Accepted", "CancelRequestedByCustomer", "CancelRequestedByProvider"].includes(b.status);
      if (activeTab === "completed") return b.status === "Completed";
      if (activeTab === "cancelled") return b.status === "Cancelled";
      return true;
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Pending": return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>;
      case "Accepted": return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active</span>;
      case "Completed": return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Completed</span>;
      case "Cancelled": return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> Cancelled</span>;
      case "CancelRequestedByCustomer":
      case "CancelRequestedByProvider": 
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Cancellation Pending</span>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-500 mt-1">Manage your active and past service bookings.</p>
      </div>

      <div className="flex gap-6 border-b border-slate-200 mb-8">
        {[
          { id: "active", label: "Active Orders" },
          { id: "completed", label: "Completed" },
          { id: "cancelled", label: "Cancelled" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === tab.id ? "text-blue-600" : "text-slate-500 hover:text-slate-800"}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No {activeTab} bookings</h3>
            <p className="text-slate-500 text-sm mt-1">When you book a service, it will appear here.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const otherParty = booking.providerId || booking.customerId;
            
            return (
              <div key={booking._id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow group">
                
                <div className="flex items-center gap-4 w-full md:w-1/3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {otherParty?.profileImage ? (
                      <img src={otherParty.profileImage} alt={otherParty.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-3 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{otherParty?.name || "Unknown User"}</h3>
                    <p className="text-sm text-slate-500 truncate">{otherParty?.serviceType || "Service Request"}</p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Date & Time</p>
                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {booking.dateTime ? format(new Date(booking.dateTime), "MMM d, yyyy • h:mm a") : "Not scheduled"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Amount</p>
                    <p className="text-sm font-bold text-slate-900 flex items-center mt-1">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      {booking.totalAmount || "TBD"}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-end gap-3 shrink-0">
                  {getStatusBadge(booking.status)}
                  
                  {activeTab === "active" && (
                    <div className="flex gap-2">
                      {(booking.status === "Pending" || booking.status === "Accepted") && (
                        <button 
                          onClick={() => handleCancelAction(booking._id, "request_cancel")}
                          disabled={processingId === booking._id}
                          className="text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          {processingId === booking._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel Order"}
                        </button>
                      )}
                      
                      {(booking.status === "CancelRequestedByProvider" || booking.status === "CancelRequestedByCustomer") && (
                        <button 
                          onClick={() => handleCancelAction(booking._id, "approve_cancel")}
                          disabled={processingId === booking._id}
                          className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          {processingId === booking._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve Cancellation"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
