"use client";

import { useState } from "react";
import { Search, Star, Shield, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const POPULAR = ["Web Design", "Logo Design", "WordPress", "Mobile App", "SEO"];

const STATS = [
  { icon: Star, value: "4.9★", label: "Average Rating", color: "text-yellow-400" },
  { icon: Shield, value: "100%", label: "Secure Payments", color: "text-emerald-400" },
  { icon: TrendingUp, value: "50k+", label: "Happy Clients", color: "text-blue-400" },
  { icon: Clock, value: "24/7", label: "Support", color: "text-purple-400" },
];

export default function Hero() {
  const [query, setQuery] = useState("");

  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-64px)] overflow-hidden bg-slate-900">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2400&q=80&auto=format&fit=crop"
          alt="Team of professionals"
          className="w-full h-full object-cover object-center opacity-25"
        />
        {/* Radial vignette so center is darker, edges fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-900/90" />
      </div>

      {/* Subtle animated gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* ── Centred content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-5 py-2 text-white text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          10,000+ Verified Professionals Available
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.06] tracking-tight mb-6"
        >
          Find the perfect{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">
              freelance
            </span>
            {/* Underline accent */}
            <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
              <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="url(#grad)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <defs>
                <linearGradient id="grad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#34d399"/>
                  <stop offset="100%" stopColor="#2dd4bf"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
          {" "}services
          <br className="hidden sm:block" /> for your business
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Connect with top-rated experts for any job — fast, secure, and satisfaction guaranteed.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-stretch max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/20"
          >
            <div className="flex items-center pl-5">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "logo design" or "web development"'
              className="flex-1 px-4 py-5 text-slate-800 text-base outline-none placeholder:text-slate-400 bg-transparent"
            />
            <div className="p-2">
              <button
                type="submit"
                className="h-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold px-7 rounded-xl text-sm transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-400 font-medium">Popular:</span>
            {POPULAR.map((t) => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                className="px-3 py-1 rounded-full border border-white/20 text-white/80 hover:bg-white hover:text-slate-900 transition-all text-xs font-medium backdrop-blur-sm"
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-5 px-4"
            >
              <s.icon className={`w-5 h-5 ${s.color} mb-1`} />
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-slate-400 text-xs font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
