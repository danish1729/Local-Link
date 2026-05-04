"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
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
  ShieldAlert,
  MapPin,
  FileText
} from "lucide-react";
import MessageButton from "@/components/chat/MessageButton";

interface Booking {
  _id: string;
  customerId: any;
  providerId: any;
  bookingDate: string;
  startTime: string;
  endTime: string;
  hours: number;
  status: string;
  totalAmount: number;
  cancelReason?: string;
  reasonForBooking?: string;
  notes?: string;
  customerLocation?: {
    address: string;
  };
}

export default function BookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        setCurrentUserId(data.currentUserId);
      }
    } catch (error) {
      console.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: string, status: string, reason?: string) => {
    setProcessingId(bookingId);
    try {
      const res = await fetch("/api/bookings/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status, reason }),
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

  const handleCancelAction = async (bookingId: string, action: "request_cancel" | "approve_cancel") => {
    let reason;
    if (action === "request_cancel") {
      reason = prompt("Please provide a reason for cancellation:");
      if (!reason) return; // User cancelled prompt
    } else {
      if (!confirm("Are you sure you want to approve the cancellation?")) return;
    }
    
    setProcessingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
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
      if (activeTab === "cancelled") return ["Cancelled", "Rejected"].includes(b.status);
      return true;
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Pending": return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Pending</span>;
      case "Accepted": return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Accepted</span>;
      case "Completed": return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Completed</span>;
      case "Cancelled": 
      case "Rejected": return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold flex items-center gap-1 w-max"><XCircle className="w-3 h-3"/> {status}</span>;
      case "CancelRequestedByCustomer":
      case "CancelRequestedByProvider": 
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-max"><ShieldAlert className="w-3 h-3"/> Cancellation Pending</span>;
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
          { id: "cancelled", label: "Cancelled / Rejected" }
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

      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No {activeTab} bookings</h3>
            <p className="text-slate-500 text-sm mt-1">When you book a service, it will appear here.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const isProvider = booking.providerId?._id === currentUserId;
            const otherParty = isProvider ? booking.customerId : booking.providerId;
            const roleLabel = isProvider ? "Customer" : "Provider";
            
            return (
              <div key={booking._id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow group">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      {otherParty?.profileImage ? (
                        <img src={otherParty.profileImage} alt={otherParty.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full p-3 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">{roleLabel}</p>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={isProvider ? `/customer/${otherParty?._id}` : `/provider/${otherParty?._id}`}
                          className="font-bold text-slate-900 text-lg hover:text-indigo-600 transition-colors"
                        >
                          {otherParty?.name || "Unknown User"}
                        </Link>
                        {otherParty?._id && (
                          <MessageButton 
                            userId={otherParty._id} 
                            iconOnly 
                            variant="ghost" 
                            className="text-indigo-600 hover:bg-indigo-50"
                          />
                        )}
                      </div>
                      {!isProvider && <p className="text-sm text-slate-500 truncate">{otherParty?.serviceType || "Service"}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    {getStatusBadge(booking.status)}
                    <p className="text-xl font-bold text-slate-900 flex items-center">
                      <DollarSign className="w-5 h-5 text-slate-400" />
                      {booking.totalAmount || "TBD"}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-1 mb-1">
                        <Clock className="w-3.5 h-3.5" /> Date & Time
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        {booking.bookingDate ? format(new Date(booking.bookingDate), "MMM d, yyyy") : "Not scheduled"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {booking.startTime} - {booking.endTime} ({booking.hours} hours)
                      </p>
                    </div>

                    {booking.customerLocation?.address && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-1 mb-1">
                          <MapPin className="w-3.5 h-3.5" /> Address
                        </p>
                        <p className="text-sm text-slate-800">{booking.customerLocation.address}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {booking.reasonForBooking && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-1 mb-1">
                          <FileText className="w-3.5 h-3.5" /> Reason for Booking
                        </p>
                        <p className="text-sm text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">{booking.reasonForBooking}</p>
                      </div>
                    )}
                    
                    {booking.notes && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Notes / Precautions</p>
                        <p className="text-sm text-slate-600">{booking.notes}</p>
                      </div>
                    )}

                    {booking.cancelReason && (
                      <div>
                        <p className="text-xs text-red-500 uppercase font-semibold tracking-wider mb-1">Cancellation / Rejection Reason</p>
                        <p className="text-sm text-red-700 bg-red-50 p-2 rounded-lg border border-red-100">{booking.cancelReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Section */}
                {activeTab === "active" && (
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    {/* Provider: Accept/Reject Pending Order */}
                    {isProvider && booking.status === "Pending" && (
                      <>
                        <button 
                          onClick={() => {
                            const reason = prompt("Please provide a reason for rejecting this booking:");
                            if (reason) handleUpdateStatus(booking._id, "Rejected", reason);
                          }}
                          disabled={processingId === booking._id}
                          className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                        >
                          {processingId === booking._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(booking._id, "Accepted")}
                          disabled={processingId === booking._id}
                          className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                        >
                          {processingId === booking._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Accept"}
                        </button>
                      </>
                    )}

                    {/* Both: Cancel Order if Accepted (or Pending for Customer) */}
                    {((!isProvider && booking.status === "Pending") || booking.status === "Accepted") && (
                      <button 
                        onClick={() => handleCancelAction(booking._id, "request_cancel")}
                        disabled={processingId === booking._id}
                        className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                      >
                        {processingId === booking._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel Order"}
                      </button>
                    )}
                    
                    {/* Approve Cancellation */}
                    {((isCustomerReq(booking.status, isProvider)) || (isProviderReq(booking.status, isProvider))) && (
                      <button 
                        onClick={() => handleCancelAction(booking._id, "approve_cancel")}
                        disabled={processingId === booking._id}
                        className="text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                      >
                        {processingId === booking._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve Cancellation"}
                      </button>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

// Helpers
function isCustomerReq(status: string, isProvider: boolean) {
  return status === "CancelRequestedByCustomer" && isProvider;
}
function isProviderReq(status: string, isProvider: boolean) {
  return status === "CancelRequestedByProvider" && !isProvider;
}

