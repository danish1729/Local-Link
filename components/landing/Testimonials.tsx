"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Fatima Khan",
    role: "E-commerce Business Owner",
    location: "Karachi, PK",
    avatar: "https://i.pravatar.cc/80?img=5",
    rating: 5,
    content:
      "I found an incredible web designer within hours. The platform is so easy to use and the quality of professionals blew me away. My store's conversion rate doubled after the redesign!",
  },
  {
    name: "Ali Ahmed",
    role: "Startup Founder",
    location: "Lahore, PK",
    avatar: "https://i.pravatar.cc/80?img=8",
    rating: 5,
    content:
      "We built our entire MVP using freelancers found on Local Link. The payment protection gave us peace of mind and all our providers delivered on time. Couldn't recommend it more.",
  },
  {
    name: "Zainab Malik",
    role: "Marketing Director",
    location: "Islamabad, PK",
    avatar: "https://i.pravatar.cc/80?img=9",
    rating: 5,
    content:
      "We run all our social media campaigns through Local Link freelancers now. Reliable, talented, and always responsive. It's replaced our in-house agency completely.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-emerald-400 font-semibold uppercase tracking-widest text-sm mb-3">
            Real Stories
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Loved by Thousands
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Don't take our word for it — here's what our community says.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-emerald-400 mb-5 opacity-80" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(t.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-200 leading-relaxed mb-8 italic">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400/50"
                />
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-slate-400 text-sm">{t.role}</p>
                  <p className="text-slate-500 text-xs">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
