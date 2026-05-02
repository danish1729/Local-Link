"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, MapPin, Clock, ShieldCheck, Zap, DollarSign, Navigation,
} from "lucide-react";
import type { Provider } from "@/app/services/BrowseServicesClient";

type Props = {
  provider: Provider;
  index: number;
  viewMode: "grid" | "list";
  nearbyEnabled: boolean;
};

const CATEGORY_COLORS: Record<string, string> = {
  "Plumbing":         "bg-blue-50 text-blue-700 border-blue-200",
  "Electrical":       "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Cleaning":         "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Carpentry":        "bg-amber-50 text-amber-700 border-amber-200",
  "Painting":         "bg-purple-50 text-purple-700 border-purple-200",
  "Landscaping":      "bg-green-50 text-green-700 border-green-200",
  "HVAC":             "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Moving":           "bg-orange-50 text-orange-700 border-orange-200",
  "Web Development":  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Graphic Design":   "bg-pink-50 text-pink-700 border-pink-200",
};

const getCategoryColor = (cat: string) =>
  CATEGORY_COLORS[cat] ?? "bg-indigo-50 text-indigo-700 border-indigo-200";

function StarRow({ rating, count }: { rating: number; count: number }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= rounded
                ? "fill-amber-400 text-amber-400"
                : i - 0.5 === rounded
                ? "fill-amber-200 text-amber-400"
                : "fill-slate-200 text-slate-200"
            }`}
          />
        ))}
      </div>
      <span className="text-amber-600 font-bold text-xs">{rating > 0 ? rating.toFixed(1) : "New"}</span>
      <span className="text-slate-400 text-xs">({count})</span>
    </div>
  );
}

function Avatar({ provider }: { provider: Provider }) {
  const initials = provider.name
    ?.split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

  const GRADIENTS = [
    "from-indigo-500 to-violet-600",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-pink-500 to-rose-600",
    "from-purple-500 to-indigo-600",
  ];
  const grad = GRADIENTS[provider._id.charCodeAt(0) % GRADIENTS.length];

  return provider.profileImage ? (
    <img
      src={provider.profileImage}
      alt={provider.name}
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <div className={`w-full h-full rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-lg`}>
      {initials}
    </div>
  );
}

export default function ServiceProviderCard({
  provider, index, viewMode, nearbyEnabled,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const catColor = getCategoryColor(provider.serviceType);

  // ── List view ──────────────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.3 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-xl overflow-hidden transition-all duration-200 bg-white"
        style={{
          border: hovered ? "1px solid #c7d2fe" : "1px solid #e2e8f0",
          boxShadow: hovered ? "0 4px 20px rgba(99,102,241,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center gap-4 p-4">
          {/* Avatar */}
          <div className="relative shrink-0 w-14 h-14">
            <Avatar provider={provider} />
            {provider.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-slate-900 font-bold text-base truncate">{provider.name}</h3>
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${catColor}`}>
                {provider.serviceType}
              </span>
            </div>
            <StarRow rating={provider.averageRating} count={provider.totalReviews} />
            {provider.bio && (
              <p className="text-slate-500 text-xs mt-1 line-clamp-1">{provider.bio}</p>
            )}
          </div>

          {/* Right: rate + distance + CTAs */}
          <div className="shrink-0 text-right flex flex-col items-end gap-2">
            <div className="flex items-center gap-0.5 text-slate-900 font-bold text-lg">
              <DollarSign className="w-4 h-4 text-slate-500" />
              {provider.hourlyRate > 0 ? provider.hourlyRate : "—"}
              <span className="text-slate-400 text-xs font-normal">/hr</span>
            </div>
            {nearbyEnabled && provider.distanceKm !== null && (
              <div className="flex items-center gap-1 text-indigo-600 text-xs font-semibold">
                <Navigation className="w-3 h-3" />
                {provider.distanceKm} km away
              </div>
            )}
            <div className="flex gap-2 mt-1">
              <Link
                href={`/provider/${provider._id}`}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
              >
                Profile
              </Link>
              <Link
                href={`/book/${provider._id}`}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                Book
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Grid card ──────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-200 bg-white"
      style={{
        border: hovered ? "1px solid #c7d2fe" : "1px solid #e2e8f0",
        boxShadow: hovered
          ? "0 12px 40px rgba(99,102,241,0.13)"
          : "0 1px 6px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* Indigo accent top bar */}
      <div
        className="h-1 w-full"
        style={{
          background: "linear-gradient(90deg, #4f46e5, #7c3aed, #0ea5e9)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
        }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Header: avatar + badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative w-14 h-14">
            <Avatar provider={provider} />
            {provider.isVerified && (
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white"
                title="Verified Professional"
              >
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${catColor}`}>
              {provider.serviceType || "Professional"}
            </span>
            {nearbyEnabled && provider.distanceKm !== null && (
              <span className="flex items-center gap-1 text-indigo-600 text-xs font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                <Navigation className="w-3 h-3" />
                {provider.distanceKm} km
              </span>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-slate-900 font-bold text-base mb-1 truncate">{provider.name}</h3>

        {/* Rating */}
        <div className="mb-2">
          <StarRow rating={provider.averageRating} count={provider.totalReviews} />
        </div>

        {/* Bio */}
        {provider.bio && (
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
            {provider.bio}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-slate-100 my-3" />

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-slate-900 font-extrabold text-xl">
                {provider.hourlyRate > 0 ? `Rs. ${provider.hourlyRate}` : "Free quote"}
              </span>
              {provider.hourlyRate > 0 && (
                <span className="text-slate-400 text-xs">/hr</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Fast response</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              href={`/book/${provider._id}`}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Zap className="w-3 h-3" />
              Book Now
            </Link>
            <Link
              href={`/provider/${provider._id}`}
              className="text-center text-slate-500 hover:text-indigo-600 text-xs font-medium transition-colors"
            >
              View Profile →
            </Link>
          </div>
        </div>

        {/* Location tag */}
        {provider.address && (
          <div className="flex items-center gap-1 mt-3 text-slate-400 text-xs">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{provider.address}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
