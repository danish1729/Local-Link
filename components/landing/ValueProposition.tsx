"use client";

import { motion } from "framer-motion";
import { CheckCircle2, BadgeCheck, Headphones, CreditCard } from "lucide-react";
import Link from "next/link";

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Vetted Professionals",
    desc: "Every provider is background‑checked, skill‑verified, and rated by real customers.",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    desc: "Agree on a price before work begins. No surprises, no hidden fees.",
  },
  {
    icon: Headphones,
    title: "Always‑On Support",
    desc: "Our team is here 24/7 to resolve any issue fast so your business never stops.",
  },
  {
    icon: CheckCircle2,
    title: "Satisfaction Guarantee",
    desc: "Not happy? We'll make it right or refund your money — no questions asked.",
  },
];

export default function ValueProposition() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left – Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-emerald-600 font-semibold uppercase tracking-widest text-sm mb-4">
              Why Local Link?
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
              The smartest way to get work done
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              We connect businesses with skilled freelancers around the globe.
              Whether you need a logo in 24 hours or a full product built from
              scratch, we have the right professional for every budget.
            </p>

            <div className="space-y-6">
              {BENEFITS.map((b, idx) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="mt-1 p-2.5 bg-emerald-100 rounded-xl text-emerald-600 shrink-0">
                    <b.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{b.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 mt-10 bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Get Started for Free
            </Link>
          </motion.div>

          {/* Right – Image collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative hidden lg:block"
          >
            {/* Main image */}
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format&fit=crop"
                alt="Professional at work"
                className="w-full h-[520px] object-cover"
              />
            </div>

            {/* Floating badge – reviews */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4 border border-slate-100"
            >
              <div className="flex -space-x-3">
                {[
                  "https://i.pravatar.cc/40?img=1",
                  "https://i.pravatar.cc/40?img=2",
                  "https://i.pravatar.cc/40?img=3",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Trusted by 50k+</p>
                <p className="text-slate-500 text-xs">Happy customers worldwide</p>
              </div>
            </motion.div>

            {/* Floating badge – rating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100"
            >
              <p className="text-3xl font-extrabold text-slate-900">4.9★</p>
              <p className="text-slate-500 text-xs mt-0.5">Overall Rating</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
