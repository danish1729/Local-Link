"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  Calendar,
  CreditCard,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  Zap
} from "lucide-react";

const SECTIONS = [
  { id: "account", label: "Account & Registration" },
  { id: "booking", label: "Booking & Hiring" },
  { id: "payments", label: "Payments & Security" },
  { id: "selling", label: "Become a Seller" }
];

const FAQS = [
  {
    category: "account",
    question: "How do I create an account?",
    answer: "You can sign up by clicking on the 'Join' or 'Sign In' button on the top right corner. You can register using your email and password, or quickly authenticate using your Google account. Both customers and service providers use the same registration form."
  },
  {
    category: "account",
    question: "Can I use the platform without registering?",
    answer: "You can browse available service providers and view their profiles, but to book a professional, send a message, or register as a provider yourself, you must create a free account."
  },
  {
    category: "account",
    question: "What is the difference between a customer and provider?",
    answer: "Customers use LocalLink to find and book skilled professionals. Providers register their services, list their availability, set their own hourly rates, and get hired by customers."
  },
  {
    category: "booking",
    question: "How do I hire a service provider?",
    answer: "Find a provider that matches your needs on the 'Browse Services' page. On their profile page, click 'Book Now', select your preferred time slot, and finalize the reservation details. Your booking is confirmed instantly."
  },
  {
    category: "booking",
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking directly from your customer dashboard. Cancellations made at least 24 hours in advance are fully refundable. Please check our refund policy for more details."
  },
  {
    category: "booking",
    question: "How do the nearby radius filters work?",
    answer: "When you browse services, you can toggle the 'Use my location' filter. The platform securely requests your GPS coordinates and uses an advanced distance algorithm to show you service providers near you (within 5 to 100 kilometers)."
  },
  {
    category: "payments",
    question: "How are payments handled?",
    answer: "LocalLink supports secure electronic payments. Once you confirm a booking, the payment is securely processed. Your funds are held safely and only released once the service is successfully completed."
  },
  {
    category: "payments",
    question: "Is my personal data and payment information secure?",
    answer: "We use top-tier SSL encryption and industry-standard payment processors to protect your card details and identity. We never share your sensitive contact information with anyone without your permission."
  },
  {
    category: "selling",
    question: "How do I become a seller?",
    answer: "Sign up or log in to your account, click on 'Become a Seller' in the top or bottom navigation, submit your service type, set your hourly rate, and add your professional details like work experience, education, and ID verification."
  },
  {
    category: "selling",
    question: "Are there any fees for sellers?",
    answer: "Registration and listing on LocalLink are completely free. We only charge a small platform commission fee on successful bookings, allowing you to maximize your earnings."
  }
];

export default function HowItWorksClient() {
  const [activeSection, setActiveSection] = useState("account");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter((f) => f.category === activeSection);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div
        className="relative py-14 px-4 overflow-hidden border-b border-indigo-100"
        style={{
          background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #eff6ff 100%)",
        }}
      >
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            Learn everything about the platform
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            How{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LocalLink Works
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Discover the seamless way to connect with skilled professionals or grow your independent business.
          </p>
        </div>
      </div>

      {/* ── Steps Section ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Your journey from start to finish
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: UserPlus,
              step: "01",
              title: "Create an Account",
              desc: "Sign up securely using email or Google. Choose whether to discover services or build your professional profile.",
              color: "bg-blue-50 border-blue-100 text-blue-600"
            },
            {
              icon: Search,
              step: "02",
              title: "Browse Services",
              desc: "Find skilled local pros with our advanced search, rating filters, and precise nearby radius location filters.",
              color: "bg-indigo-50 border-indigo-100 text-indigo-600"
            },
            {
              icon: Calendar,
              step: "03",
              title: "Book & Pay",
              desc: "Reserve the right slot on their availability calendar and pay securely through our encrypted portal.",
              color: "bg-purple-50 border-purple-100 text-purple-600"
            },
            {
              icon: Star,
              step: "04",
              title: "Review & Repeat",
              desc: "Once work is done, leave honest reviews to help the community grow and find reliable pros.",
              color: "bg-amber-50 border-amber-100 text-amber-600"
            }
          ].map((item) => (
            <div
              key={item.step}
              className={`p-6 rounded-2xl border bg-white shadow-sm flex flex-col justify-between h-full transition hover:shadow-md ${item.color}`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-200">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Detailed Accordion / FAQ Section ─────────────────────────────── */}
      <div className="bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Have questions? We have answers</h2>
            <p className="text-slate-500">Pick a category below to view detailed guides and answers.</p>
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  setOpenFaq(null);
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  activeSection === sec.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 select-none"
                  >
                    <span className="font-bold text-slate-800 text-base">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-0">
                      <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
