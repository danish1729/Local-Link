"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Clock, Globe, Zap, Send, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type ProviderProfileCardProps = {
  provider: any;
};

export default function ProviderProfileCard({ provider }: ProviderProfileCardProps) {
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate sending message
    await new Promise(res => setTimeout(res, 800));
    setIsSending(false);
    setMessage("");
    setShowContact(false);
  };

  const isOnline = true; // Could be dynamic later

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-24"
    >
      {/* Top Banner (Optional subtle pattern) */}
      <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 w-full relative">
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700">Verified Pro</span>
        </div>
      </div>

      <div className="px-6 pb-6 pt-0 relative">
        {/* Avatar */}
        <div className="flex justify-center -mt-12 mb-4 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-sm border border-slate-100">
              {provider.profileImage ? (
                <img src={provider.profileImage} alt={provider.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                  {provider.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {isOnline && (
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
            )}
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{provider.name}</h1>
          <p className="text-slate-600 font-medium text-sm mb-3">{provider.serviceType || "Professional Service Provider"}</p>
          
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(provider.averageRating || 0) ? "fill-slate-900 text-slate-900" : "fill-slate-200 text-slate-200"}`} />
              ))}
            </div>
            <span className="font-bold text-slate-900">{provider.averageRating > 0 ? provider.averageRating : "New"}</span>
            <span className="text-slate-500 text-sm">({provider.totalReviews} reviews)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Link href={`/booking/new?providerId=${provider._id}`} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-bold transition">
            <Zap className="w-4 h-4" />
            Book Now
          </Link>
          <button onClick={() => setShowContact(!showContact)} className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 py-3 rounded-lg font-bold transition">
            <Mail className="w-4 h-4" />
            Contact Me
          </button>
        </div>

        {/* Contact Form Collapse */}
        <AnimatePresence>
          {showContact && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleContact}
              className="mb-6 overflow-hidden"
            >
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Hi, I'd like to ask about your services..."
                className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none h-24 mb-2 bg-slate-50"
              />
              <button disabled={isSending || !message.trim()} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-lg text-sm disabled:opacity-50 transition flex items-center justify-center gap-2">
                {isSending ? "Sending..." : <><Send className="w-3 h-3" /> Send Message</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="w-full h-px bg-slate-200 mb-6"></div>

        {/* Quick Stats Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-500"><MapPin className="w-4 h-4" /> From</div>
            <div className="font-semibold text-slate-900">{provider.location || "Pakistan"}</div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-500"><Globe className="w-4 h-4" /> Languages</div>
            <div className="font-semibold text-slate-900 text-right">
              {provider.languages && provider.languages.length > 0 
                ? provider.languages.join(", ") 
                : "English, Urdu"}
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-500"><Clock className="w-4 h-4" /> Member Since</div>
            <div className="font-semibold text-slate-900">
              {provider.createdAt ? format(new Date(provider.createdAt), "MMM yyyy") : "Recently"}
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-500"><Zap className="w-4 h-4" /> Avg. Response</div>
            <div className="font-semibold text-slate-900">1 hour</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
