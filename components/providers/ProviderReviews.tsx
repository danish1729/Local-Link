"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Phone,
  CheckCircle,
  Share2,
  Flag,
  Clock,
  Zap,
} from "lucide-react";

interface ProviderActionsProps {
  providerId: string;
}

export default function ProviderActions({ providerId }: ProviderActionsProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setContactMessage("");
    setShowContactForm(false);
    // Show success toast
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-6"
    >
      {/* Primary CTA Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white overflow-hidden relative group"
      >
        {/* Animated Background */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to hire?</h3>
            <p className="text-blue-100">
              Book this provider for your service needs today
            </p>
          </div>

          <Link
            href={`/booking/new?providerId=${providerId}`}
            className="block text-center bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Book Now
            </div>
          </Link>

          {/* Quick Info */}
          <div className="space-y-3 pt-6 border-t border-blue-500/30">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Responds within 1 hour</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Secure & verified</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Provider Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Contact Provider
        </h3>

        <div className="space-y-3">
          <button
            onClick={() => setShowContactForm(!showContactForm)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold"
          >
            <MessageCircle className="w-5 h-5" />
            Send Message
          </button>

          <a
            href="tel:+92-300-1234567"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition font-semibold"
          >
            <Phone className="w-5 h-5" />
            Call Now
          </a>
        </div>

        {/* Contact Form */}
        <AnimatePresence>
          {showContactForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleContactSubmit}
              className="mt-4 pt-4 border-t border-slate-200 space-y-3"
            >
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Tell the provider about your service needs..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <button
                type="submit"
                disabled={isSubmitting || !contactMessage.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Trust & Verification Card */}
      <motion.div
        variants={itemVariants}
        className="bg-green-50 rounded-2xl border border-green-200 p-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-900 mb-2">Verified Provider</h4>
            <p className="text-sm text-green-700">
              This provider has been verified and has completed multiple
              successful projects.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Additional Actions */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
      >
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition font-medium text-sm">
            <Share2 className="w-4 h-4" />
            Share Profile
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium text-sm">
            <Flag className="w-4 h-4" />
            Report Provider
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
