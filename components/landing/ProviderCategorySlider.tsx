"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

type Provider = {
  _id: string;
  name: string;
  serviceType: string;
  hourlyRate?: number;
  profileImage?: string | null;
  rating: number;
  reviewCount: number;
};

// Accent colours — one thin top-border per card, cycles by index
const ACCENTS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

export default function ProviderCategorySlider() {
  const [categories, setCategories] = useState<Record<string, Provider[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ── Metrics logic (UNCHANGED) ──
  const [trackedImpressions, setTrackedImpressions] = useState<Set<string>>(new Set());

  const trackImpression = (providerId: string) => {
    if (trackedImpressions.has(providerId)) return;
    setTrackedImpressions((prev) => new Set(prev).add(providerId));
    fetch(`/api/provider/${providerId}/metrics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "impression" }),
    }).catch(console.error);
  };

  const trackClick = async (providerId: string) => {
    try {
      await fetch(`/api/provider/${providerId}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "click" }),
      });
    } catch (err) {
      console.error("Failed to track click", err);
    }
  };

  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await fetch("/api/providers");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load providers", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProviders();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="h-5 w-36 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse" />
          <div className="flex gap-5 mt-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[220px] h-64 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 text-center text-slate-400">
        Failed to load providers. Please refresh the page.
      </section>
    );
  }

  if (Object.keys(categories).length === 0) {
    return (
      <section className="py-24 bg-slate-50 text-center">
        <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No providers yet</h2>
        <p className="text-slate-500 mb-6">Be the first professional on LocalLink!</p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
        >
          Join as a Professional <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section header */}
        <div className="text-center">
          <p className="text-emerald-600 font-semibold uppercase tracking-widest text-sm mb-3">
            Hand-Picked for You
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Top-Rated Professionals</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Browse verified experts by category and get your job done right.
          </p>
        </div>

        {Object.entries(categories).map(([category, providers]) => (
          <CategoryRow
            key={category}
            category={category}
            providers={providers}
            trackImpression={trackImpression}
            trackClick={trackClick}
          />
        ))}
      </div>
    </section>
  );
}

// Per-category scrollable row
function CategoryRow({
  category,
  providers,
  trackImpression,
  trackClick,
}: {
  category: string;
  providers: Provider[];
  trackImpression: (id: string) => void;
  trackClick: (id: string) => Promise<void>;
}) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref) return;
    ref.scrollBy({ left: dir === "left" ? -250 : 250, behavior: "smooth" });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
          <h3 className="text-xl font-bold text-slate-900">{category}</h3>
          <span className="text-sm text-slate-400">({providers.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition"
          >
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div
        ref={setRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {providers.map((provider, idx) => (
          <ProviderCard
            key={provider._id}
            provider={provider}
            idx={idx}
            trackImpression={trackImpression}
            trackClick={trackClick}
          />
        ))}
      </div>
    </div>
  );
}

// Individual provider card — simple, clean, attractive
function ProviderCard({
  provider,
  idx,
  trackImpression,
  trackClick,
}: {
  provider: Provider;
  idx: number;
  trackImpression: (id: string) => void;
  trackClick: (id: string) => Promise<void>;
}) {
  const initials = provider.name.charAt(0).toUpperCase();
  const stars = Math.round(provider.rating);
  const accent = ACCENTS[idx % ACCENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: idx * 0.06 }}
      onViewportEnter={() => trackImpression(provider._id)}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className="min-w-[220px] max-w-[220px] snap-start"
    >
      <div
        className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-100 overflow-hidden flex flex-col transition-shadow duration-300"
        style={{ borderTop: `3px solid ${accent}` }}
      >
        {/* Avatar area */}
        <div className="flex flex-col items-center pt-7 pb-4 px-5">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-md">
              {provider.profileImage ? (
                <img
                  src={provider.profileImage}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ background: `linear-gradient(135deg, ${accent}99, ${accent})` }}
                >
                  {initials}
                </div>
              )}
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <h4 className="font-bold text-slate-900 text-sm text-center truncate w-full leading-tight">
            {provider.name}
          </h4>
          <p className="text-xs text-slate-400 text-center mt-0.5 truncate w-full">
            {provider.serviceType}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= stars ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-100"
                }`}
              />
            ))}
            <span className="text-xs font-semibold text-slate-600 ml-1.5">
              {provider.rating > 0 ? provider.rating.toFixed(1) : "New"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
          <span className="text-sm font-bold text-slate-900">
            {provider.hourlyRate ? (
              <>
                ${provider.hourlyRate}
                <span className="text-xs font-normal text-slate-400">/hr</span>
              </>
            ) : (
              <span className="text-slate-400 font-medium text-xs">Negotiable</span>
            )}
          </span>
          <Link
            href={`/provider/${provider._id}`}
            onClick={() => trackClick(provider._id)}
            className="text-xs font-bold px-3.5 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: accent }}
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
