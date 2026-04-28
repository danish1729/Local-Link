"use client";

import { motion } from "framer-motion";
import { Search, MessageCircle, CheckCircle, Star } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Search for a Service",
    desc: "Browse hundreds of categories or type what you need in the search bar. Filter by rating, price, or delivery time.",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  {
    icon: MessageCircle,
    step: "02",
    title: "Connect with a Pro",
    desc: "Chat directly with providers, share your project brief, and align on expectations before any money changes hands.",
    color: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Book & Pay Securely",
    desc: "Confirm your booking and pay through our encrypted payment gateway. Funds are held safely until you approve the work.",
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
  {
    icon: Star,
    step: "04",
    title: "Review & Repeat",
    desc: "Rate your experience and help others find great providers. Build a trusted network you can rely on every time.",
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-emerald-600 font-semibold uppercase tracking-widest text-sm mb-3">
            Simple Process
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Getting the help you need takes just a few minutes from start to finish.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-slate-200 z-0" />

          {STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* Icon bubble */}
              <div className={`w-20 h-20 rounded-full ${step.color} border-4 ${step.border} flex items-center justify-center mb-6 bg-white shadow-sm`}>
                <step.icon className="w-8 h-8" />
              </div>

              {/* Step number */}
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Step {step.step}
              </span>

              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
