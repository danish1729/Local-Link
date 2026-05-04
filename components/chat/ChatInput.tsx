"use client";

import { useState } from "react";
import { Send, Paperclip, Handshake, X } from "lucide-react";
import { Loader2 } from "lucide-react";

interface ChatInputProps {
  conversationId: string;
  isProvider: boolean;
}

export default function ChatInput({ conversationId, isProvider }: ChatInputProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Offer State
  const [hourlyRate, setHourlyRate] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSendText = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, text })
      });
      setText("");
    } finally {
      setSending(false);
    }
  };

  const handleSendOffer = async () => {
    if (!hourlyRate || !bookingDate || !startTime || !endTime) {
      alert("Please fill all offer details");
      return;
    }
    setSending(true);
    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          text: "I have sent you a custom offer.",
          isOffer: true,
          offerDetails: {
            hourlyRate: Number(hourlyRate),
            bookingDate,
            startTime,
            endTime
          }
        })
      });
      setShowOfferModal(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-3 md:p-4 shrink-0">
      <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        
        {isProvider && (
          <button 
            onClick={() => setShowOfferModal(true)}
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0"
            title="Send Custom Offer"
          >
            <Handshake className="w-5 h-5" />
          </button>
        )}
        
        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0" title="Attach File">
          <Paperclip className="w-5 h-5" />
        </button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-2 text-slate-800 text-sm"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendText();
            }
          }}
        />

        <button 
          onClick={handleSendText}
          disabled={!text.trim() || sending}
          className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shrink-0 mb-0.5 mr-0.5"
        >
          {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Handshake className="w-5 h-5 text-indigo-600"/> Create Custom Offer</h3>
              <button onClick={() => setShowOfferModal(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Hourly Rate (Rs)</label>
                <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="w-full border-slate-200 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. 500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full border-slate-200 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Start Time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border-slate-200 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">End Time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border-slate-200 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <button 
                onClick={handleSendOffer}
                disabled={sending}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-2 flex justify-center items-center gap-2"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
