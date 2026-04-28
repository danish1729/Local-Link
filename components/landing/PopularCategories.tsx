"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  {
    title: "Graphics & Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&auto=format&fit=crop",
    count: "1.2k providers",
    color: "from-pink-600/80",
  },
  {
    title: "Programming & Tech",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80&auto=format&fit=crop",
    count: "2.4k providers",
    color: "from-blue-700/80",
  },
  {
    title: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80&auto=format&fit=crop",
    count: "980 providers",
    color: "from-orange-600/80",
  },
  {
    title: "Writing & Translation",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80&auto=format&fit=crop",
    count: "750 providers",
    color: "from-emerald-700/80",
  },
  {
    title: "Video & Animation",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80&auto=format&fit=crop",
    count: "640 providers",
    color: "from-purple-700/80",
  },
  {
    title: "Music & Audio",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop",
    count: "420 providers",
    color: "from-red-700/80",
  },
  {
    title: "Business Services",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop",
    count: "530 providers",
    color: "from-slate-700/80",
  },
  {
    title: "AI Services",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80&auto=format&fit=crop",
    count: "310 providers",
    color: "from-indigo-700/80",
  },
];

export default function PopularCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-emerald-600 font-semibold uppercase tracking-widest text-sm mb-2">
              Browse Categories
            </p>
            <h2 className="text-4xl font-bold text-slate-900">
              Popular Services
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full border border-slate-200 hover:bg-slate-100 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full border border-slate-200 hover:bg-slate-100 transition"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden cursor-pointer snap-start"
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-black/30 to-transparent`} />
              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-lg leading-tight mb-1">
                  {cat.title}
                </h3>
                <p className="text-white/70 text-sm">{cat.count}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-slate-700 font-semibold hover:text-emerald-600 transition-colors"
          >
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
