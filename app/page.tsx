"use client";

import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Shield,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Check,
  MessageCircle,
  Clock,
  Award,
  Search,
  Heart,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"service" | "provider">("service");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                LocalLink
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 font-medium transition"
              >
                Browse Services
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 font-medium transition"
              >
                Become a Provider
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 font-medium transition"
              >
                How it Works
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/login"
                className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition"
              >
                Login
              </a>
              <a
                href="/signup"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Content */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Pakistanapos;s Local Services Marketplace
                  </span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Find Trusted Services{" "}
                  <span className="text-blue-600">Near You</span>
                </h1>

                <p className="text-xl text-slate-600 max-w-lg">
                  Connect with verified service providers or offer your skills
                  to thousands of customers in your area. Quick, reliable, and
                  secure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/signup?role=customer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg group"
                >
                  Find Services
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/signup?role=provider"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-900 rounded-lg hover:border-slate-400 transition font-semibold text-lg"
                >
                  Start Earning
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-bold text-slate-900">50K+</div>
                  <p className="text-slate-600">Active Users</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">10K+</div>
                  <p className="text-slate-600">Services Completed</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Hero Image */}
            <motion.div
              variants={itemVariants}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl transform -rotate-3"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-3xl transform rotate-1 opacity-80 flex items-center justify-center">
                  <div className="text-center text-white space-y-6">
                    <Users className="w-20 h-20 mx-auto" />
                    <h3 className="text-2xl font-bold">Connect Instantly</h3>
                    <p>With verified professionals in your city</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
                How LocalLink Works
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Getting started is simple. Find services or start earning in
                minutes.
              </p>
            </motion.div>

            {/* Tabs */}
            <div className="flex justify-center gap-4">
              <motion.button
                variants={itemVariants}
                onClick={() => setActiveTab("service")}
                className={`px-8 py-3 rounded-lg font-semibold transition ${
                  activeTab === "service"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                I Need Services
              </motion.button>
              <motion.button
                variants={itemVariants}
                onClick={() => setActiveTab("provider")}
                className={`px-8 py-3 rounded-lg font-semibold transition ${
                  activeTab === "provider"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                I Want to Earn
              </motion.button>
            </div>

            {/* Steps */}
            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-4 gap-6"
            >
              {activeTab === "service" ? (
                <>
                  {[
                    {
                      icon: Search,
                      title: "Search",
                      desc: "Browse trusted service providers near you",
                    },
                    {
                      icon: MessageCircle,
                      title: "Connect",
                      desc: "Chat directly to discuss your needs",
                    },
                    {
                      icon: Check,
                      title: "Book",
                      desc: "Secure booking with instant confirmation",
                    },
                    {
                      icon: Star,
                      title: "Review",
                      desc: "Rate and review after service completion",
                    },
                  ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="relative"
                    >
                      <div className="bg-white rounded-2xl p-8 h-full border border-slate-200 hover:border-blue-300 hover:shadow-lg transition">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                          <step.icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-slate-600">{step.desc}</p>
                        {idx < 3 && (
                          <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-300" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    {
                      icon: Award,
                      title: "Create Profile",
                      desc: "Set up your profile with your skills",
                    },
                    {
                      icon: TrendingUp,
                      title: "Set Rates",
                      desc: "Define your hourly rate and availability",
                    },
                    {
                      icon: Heart,
                      title: "Get Discovered",
                      desc: "Appear in customer searches nearby",
                    },
                    {
                      icon: Zap,
                      title: "Start Earning",
                      desc: "Receive bookings and grow your income",
                    },
                  ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="relative"
                    >
                      <div className="bg-white rounded-2xl p-8 h-full border border-slate-200 hover:border-blue-300 hover:shadow-lg transition">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                          <step.icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-slate-600">{step.desc}</p>
                        {idx < 3 && (
                          <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-300" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
                Why Choose LocalLink?
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Built for Pakistanapos;s unique market with features youapos;ll
                love
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: MapPin,
                  title: "Hyperlocal",
                  desc: "Find services within your neighborhood. Real connections, real communities.",
                },
                {
                  icon: Shield,
                  title: "Safe & Secure",
                  desc: "Verified profiles, secure payments, and buyer protection on every transaction.",
                },
                {
                  icon: Clock,
                  title: "Quick & Convenient",
                  desc: "Book same-day services or schedule for later. Flexible and on your timeline.",
                },
                {
                  icon: TrendingUp,
                  title: "Earn More",
                  desc: "Service providers earn competitive rates with transparent pricing and no hidden fees.",
                },
                {
                  icon: Award,
                  title: "Verified Quality",
                  desc: "All providers are verified and rated by real customers. Quality you can trust.",
                },
                {
                  icon: Zap,
                  title: "Fast Support",
                  desc: "Local support in Urdu and English. We're here to help 24/7.",
                },
              ].map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants} className="group">
                  <div className="bg-slate-50 rounded-2xl p-8 h-full hover:bg-blue-50 transition space-y-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 group-hover:bg-blue-700 transition">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 lg:py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl lg:text-5xl font-bold">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-slate-300">
                Real reviews from real customers across Pakistan
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  name: "Fatima Khan",
                  role: "Homeowner, Karachi",
                  content:
                    "Found an amazing electrician within 5 minutes. Professional, on-time, and affordable. Best experience!",
                  rating: 5,
                },
                {
                  name: "Ali Ahmed",
                  role: "Freelance Designer, Lahore",
                  content:
                    "Tripled my income in just 3 months. The platform is easy to use and customers are genuine.",
                  rating: 5,
                },
                {
                  name: "Zainab Malik",
                  role: "Business Owner, Islamabad",
                  content:
                    "Reliable service providers for all my needs. The payment system is transparent and secure.",
                  rating: 5,
                },
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-slate-800 rounded-2xl p-8 border border-slate-700"
                >
                  <div className="flex gap-1 mb-4">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                  </div>
                  <p className="text-slate-200 mb-6 leading-relaxed">
                    {testimonial.content}
                  </p>
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl lg:text-5xl font-bold"
            >
              Ready to Get Started?
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-blue-100 max-w-2xl mx-auto"
            >
              Join thousands of Pakistanis who are already connecting with
              services and earning money on LocalLink.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <a
                href="/signup?role=customer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-slate-100 transition font-semibold text-lg"
              >
                Find Services Now
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/signup?role=provider"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-blue-800 transition font-semibold text-lg"
              >
                Become a Provider
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">LocalLink</span>
              </div>
              <p className="text-sm">
                Pakistanapos;s most trusted hyperlocal services marketplace.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Customers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Browse Services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Providers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Join Now
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Earning Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms & Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <p className="text-center text-sm">
              © 2024 LocalLink. All rights reserved. Made for Pakistan 🇵🇰
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
