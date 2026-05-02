"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, SlidersHorizontal, MapPin, Star, DollarSign,
  RotateCcw, ShieldCheck, ChevronDown, ChevronUp, Loader2,
} from "lucide-react";
import type { FilterState } from "@/app/services/BrowseServicesClient";

type Props = {
  filters: FilterState;
  categories: string[];
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  activeCount: number;
};

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

const SORT_OPTIONS = [
  { value: "rating",     label: "Top Rated" },
  { value: "reviews",    label: "Most Reviews" },
  { value: "price_asc",  label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "newest",     label: "Newest" },
];

function Section({
  title, icon, children, defaultOpen = true,
}: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 pb-5 mb-5">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-left mb-3 group"
      >
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          {icon}
          {title}
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          : <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export default function FilterSidebar({
  filters, categories, onChange, onReset, activeCount,
}: Props) {
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError]     = useState<string | null>(null);

  // ── Nearby radius: request GPS and store coords in filter state ──────────
  const handleLocationToggle = () => {
    if (filters.nearbyEnabled) {
      onChange({ nearbyEnabled: false, userLat: null, userLng: null });
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // ✅ Pass the actual coordinates into the filter state
        onChange({
          nearbyEnabled: true,
          userLat: position.coords.latitude,
          userLng: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationError(
          err.code === 1
            ? "Location access denied. Please allow location in your browser settings."
            : "Could not get your location. Please try again."
        );
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  // ── Dual-range slider ────────────────────────────────────────────────────
  const MIN_RATE = 0;
  const MAX_RATE = 500;

  const minPercent = ((filters.minRate - MIN_RATE) / (MAX_RATE - MIN_RATE)) * 100;
  const maxPercent = ((filters.maxRate - MIN_RATE) / (MAX_RATE - MIN_RATE)) * 100;

  const rangeTrackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (rangeTrackRef.current) {
      rangeTrackRef.current.style.background = `linear-gradient(
        to right,
        #e2e8f0 ${minPercent}%,
        #4f46e5 ${minPercent}%,
        #4f46e5 ${maxPercent}%,
        #e2e8f0 ${maxPercent}%
      )`;
    }
  }, [minPercent, maxPercent]);

  return (
    <div
      className="rounded-2xl p-5 text-sm bg-white"
      style={{ border: "1px solid #e0e7ff", boxShadow: "0 1px 12px rgba(99,102,241,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          Filters
          {activeCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors text-xs font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* ── Keyword Search ───────────────────────────────────────────────── */}
      <Section title="Search" icon={<Search className="w-4 h-4 text-indigo-500" />}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Name, skill, keyword…"
            value={filters.q}
            onChange={e => onChange({ q: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </Section>

      {/* ── Category ─────────────────────────────────────────────────────── */}
      <Section title="Category" icon={<SlidersHorizontal className="w-4 h-4 text-indigo-500" />}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange({ category: "" })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !filters.category
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onChange({ category: filters.category === cat ? "" : cat })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filters.category === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
          {categories.length === 0 && (
            <span className="text-slate-400 text-xs italic">Loading categories…</span>
          )}
        </div>
      </Section>

      {/* ── Hourly Rate ──────────────────────────────────────────────────── */}
      <Section title="Hourly Rate ($)" icon={<DollarSign className="w-4 h-4 text-indigo-500" />}>
        <div className="space-y-4">
          <div className="flex justify-between text-slate-700 font-semibold text-sm">
            <span>${filters.minRate}</span>
            <span>${filters.maxRate === 500 ? "500+" : filters.maxRate}</span>
          </div>

          {/* Dual-range slider */}
          <div className="relative h-2 rounded-full" ref={rangeTrackRef} style={{ background: "#e2e8f0" }}>
            <input
              type="range"
              min={MIN_RATE}
              max={MAX_RATE}
              step={5}
              value={filters.minRate}
              onChange={e => {
                const val = Math.min(Number(e.target.value), filters.maxRate - 5);
                onChange({ minRate: val });
              }}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
              style={{ zIndex: filters.minRate > MAX_RATE - 50 ? 5 : 3 }}
            />
            <input
              type="range"
              min={MIN_RATE}
              max={MAX_RATE}
              step={5}
              value={filters.maxRate}
              onChange={e => {
                const val = Math.max(Number(e.target.value), filters.minRate + 5);
                onChange({ maxRate: val });
              }}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
              style={{ zIndex: 4 }}
            />
            {/* Visible thumbs */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 border-2 border-white rounded-full shadow-md pointer-events-none"
              style={{ left: `calc(${minPercent}% - 8px)` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 border-2 border-white rounded-full shadow-md pointer-events-none"
              style={{ left: `calc(${maxPercent}% - 8px)` }}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-slate-500 text-xs mb-1 block">Min</label>
              <input
                type="number"
                min={0}
                max={filters.maxRate - 5}
                value={filters.minRate}
                onChange={e => onChange({ minRate: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-slate-500 text-xs mb-1 block">Max</label>
              <input
                type="number"
                min={filters.minRate + 5}
                max={500}
                value={filters.maxRate}
                onChange={e => onChange({ maxRate: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Minimum Rating ───────────────────────────────────────────────── */}
      <Section title="Minimum Rating" icon={<Star className="w-4 h-4 text-indigo-500" />}>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map(r => (
            <button
              key={r}
              onClick={() => onChange({ minRating: r === 0 ? 0 : r })}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                filters.minRating === r
                  ? "bg-amber-400 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
              }`}
              title={r === 0 ? "Any rating" : `${r}+ stars`}
            >
              {r === 0 ? (
                <span>Any</span>
              ) : (
                <>
                  <Star className="w-3 h-3 fill-current" />
                  <span>{r}+</span>
                </>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Nearby Radius ────────────────────────────────────────────────── */}
      <Section title="Nearby Radius" icon={<MapPin className="w-4 h-4 text-indigo-500" />}>
        {/* Toggle button */}
        <button
          onClick={handleLocationToggle}
          disabled={locationLoading}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all mb-3 ${
            filters.nearbyEnabled
              ? "bg-indigo-50 border-indigo-300 text-indigo-700"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {locationLoading
              ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              : <MapPin className={`w-4 h-4 ${filters.nearbyEnabled ? "text-indigo-500" : "text-slate-400"}`} />}
            <span className="text-sm font-medium">
              {locationLoading
                ? "Getting location…"
                : filters.nearbyEnabled
                ? "Location active"
                : "Use my location"}
            </span>
          </div>
          {/* Toggle pill */}
          <div className={`relative w-10 h-5 rounded-full transition-colors ${filters.nearbyEnabled ? "bg-indigo-500" : "bg-slate-300"}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${filters.nearbyEnabled ? "left-5" : "left-0.5"}`} />
          </div>
        </button>

        {/* Error message */}
        {locationError && (
          <div className="flex items-start gap-2 text-red-600 text-xs mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <span>⚠️</span>
            <span>{locationError}</span>
          </div>
        )}

        {/* Hint when inactive */}
        {!filters.nearbyEnabled && !locationError && !locationLoading && (
          <p className="text-slate-400 text-xs">
            Enable to show only providers within a set distance from you.
          </p>
        )}

        {/* Radius pill selector */}
        {filters.nearbyEnabled && (
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {RADIUS_OPTIONS.map(km => (
                <button
                  key={km}
                  onClick={() => onChange({ radius: km })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filters.radius === km
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
            <p className="text-slate-500 text-xs">
              Showing providers within{" "}
              <span className="text-indigo-600 font-semibold">{filters.radius} km</span> of your location
            </p>
          </div>
        )}
      </Section>

      {/* ── Verified Only ────────────────────────────────────────────────── */}
      <Section title="Verification" icon={<ShieldCheck className="w-4 h-4 text-indigo-500" />} defaultOpen={false}>
        <button
          onClick={() => onChange({ verified: !filters.verified })}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
            filters.verified
              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className={`w-4 h-4 ${filters.verified ? "text-emerald-600" : "text-slate-400"}`} />
            <span className="text-sm font-medium">Verified pros only</span>
          </div>
          <div className={`relative w-10 h-5 rounded-full transition-colors ${filters.verified ? "bg-emerald-500" : "bg-slate-300"}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${filters.verified ? "left-5" : "left-0.5"}`} />
          </div>
        </button>
      </Section>

      {/* ── Sort By (mobile only) ─────────────────────────────────────────── */}
      <div className="lg:hidden">
        <Section title="Sort By" icon={<SlidersHorizontal className="w-4 h-4 text-indigo-500" />} defaultOpen={false}>
          <div className="grid grid-cols-2 gap-2">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onChange({ sortBy: opt.value })}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  filters.sortBy === opt.value
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
