"use client";

import { useState } from "react";
import { Handshake, Calendar, Clock, DollarSign, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface OfferBubbleProps {
  msg: any;
  isMe: boolean;
  currentUser: any;
}

export default function OfferBubble({ msg, isMe, currentUser }: OfferBubbleProps) {
  const [loading, setLoading] = useState(false);
  const { hourlyRate, bookingDate, startTime, endTime, status } = msg.offerDetails;

  const handleRespond = async (responseStatus: "accepted" | "rejected") => {
    if (!confirm(`Are you sure you want to ${responseStatus} this offer?`)) return;
    setLoading(true);
    try {
      await fetch("/api/chat/offers/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: msg._id, status: responseStatus })
      });
    } catch (error) {
      alert("Failed to respond to offer");
    } finally {
      setLoading(false);
    }
  };

  const isCustomer = currentUser.role === "customer";
  const canRespond = !isMe && isCustomer && status === "pending";

  return (
    <div className={`w-64 sm:w-80 rounded-2xl overflow-hidden border shadow-sm ${isMe ? 'border-indigo-200' : 'border-slate-200'}`}>
      <div className={`p-3 flex items-center justify-between border-b ${isMe ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isMe ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
            <Handshake className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-800">Custom Offer</span>
        </div>
        {status === "accepted" && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Accepted</span>}
        {status === "rejected" && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3"/> Rejected</span>}
        {status === "pending" && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Pending</span>}
      </div>

      <div className="bg-white p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500 uppercase font-semibold">Hourly Rate</span>
          <span className="font-bold text-slate-900 flex items-center"><DollarSign className="w-4 h-4 text-slate-400"/>{hourlyRate} / hr</span>
        </div>
        
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold mb-0.5">Date</p>
            <p className="text-sm font-medium text-slate-800">{bookingDate ? format(new Date(bookingDate), "MMM d, yyyy") : "N/A"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold mb-0.5">Time</p>
            <p className="text-sm font-medium text-slate-800">{startTime} - {endTime}</p>
          </div>
        </div>

        {canRespond && (
          <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-slate-100">
            <button 
              onClick={() => handleRespond("rejected")}
              disabled={loading}
              className="py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Reject
            </button>
            <button 
              onClick={() => handleRespond("accepted")}
              disabled={loading}
              className="py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Accept"}
            </button>
          </div>
        )}

        {isMe && status === "pending" && (
          <div className="pt-2 text-center">
            <p className="text-xs text-slate-400 italic">Waiting for response...</p>
          </div>
        )}
      </div>
    </div>
  );
}
