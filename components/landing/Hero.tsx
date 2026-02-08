"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Pakistan’s Hyperlocal Marketplace
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            Find Trusted Services{" "}
            <span className="text-blue-600">Near You</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-xl">
            Connect with verified professionals or offer your services to
            customers in your area — fast, secure, and reliable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/signup?role=customer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Find Services
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/signup?role=provider"
              className="px-8 py-4 border-2 border-slate-300 rounded-lg font-semibold hover:border-slate-400 transition"
            >
              Become a Provider
            </a>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex justify-center"
        >
          <div className="w-96 h-96 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-center p-10 shadow-2xl">
            <p className="text-2xl font-semibold">Book • Connect • Earn</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
