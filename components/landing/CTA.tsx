"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-20 text-center"
        >
          {/* Background image with dark overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=2000&q=80&auto=format&fit=crop"
              alt="Office"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-slate-900/70" />
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <p className="text-emerald-400 font-semibold uppercase tracking-widest text-sm mb-4">
              Start Today
            </p>
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Find the talent needed to grow<br className="hidden lg:block" /> your business — right now.
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Join over 50,000 businesses that trust Local Link to get things done
              faster, better, and at the right price.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-10 mb-12 text-white">
              {[
                { value: "10k+", label: "Vetted Professionals" },
                { value: "50k+", label: "Happy Clients" },
                { value: "98%", label: "Satisfaction Rate" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-4xl font-extrabold text-emerald-400">{s.value}</p>
                  <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup?role=customer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors text-lg"
              >
                Hire a Professional <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/become-seller"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-xl transition-colors text-lg"
              >
                Become a Provider
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
