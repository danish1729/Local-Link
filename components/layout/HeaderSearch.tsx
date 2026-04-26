"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SmartSearch from "@/components/search/SmartSearch"; // Ensure this path is correct

export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when search is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* 1. The Trigger Button (Visible in Header) */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 text-sm transition-all md:w-80 group border border-transparent hover:border-slate-300"
      >
        <Search className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
        <span className="hidden md:inline">
          Search for &quot;Plumber&quot;...
        </span>
        <span className="md:hidden">Search...</span>
        <div className="hidden md:flex ml-auto items-center gap-1">
          <span className="text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200">
            ⌘K
          </span>
        </div>
      </button>

      {/* 2. The Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 sm:pt-10 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-[110] p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              {/* Render the Smart Search Component */}
              <div className="overflow-y-auto custom-scrollbar">
                <SmartSearch />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
