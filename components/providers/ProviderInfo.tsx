"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Clock,
  MapPin,
  FileText,
  Badge,
  Zap,
  Users,
} from "lucide-react";

type Provider = {
  bio?: string;
  serviceType?: string;
  hourlyRate?: number | string;
  experience?: number;
  location?: string;
  languages?: string[];
  responseTime?: string;
  availability?: string;
};

type ProviderInfoProps = {
  provider: Provider;
};

export default function ProviderInfo({ provider }: ProviderInfoProps) {
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
      {/* About Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">About</h2>
        </div>

        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          {provider.bio ||
            "This service provider has not added a bio yet. Contact them to learn more about their services and expertise."}
        </p>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                  Service Type
                </p>
                <p className="text-slate-900 font-semibold">
                  {provider.serviceType || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                  Hourly Rate
                </p>
                <p className="text-slate-900 font-semibold text-lg">
                  Rs {provider.hourlyRate || "500"}/hour
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                  Response Time
                </p>
                <p className="text-slate-900 font-semibold">
                  {provider.responseTime || "Within 1 hour"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                  Experience
                </p>
                <p className="text-slate-900 font-semibold">
                  {provider.experience || 5}+ Years
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                  Location
                </p>
                <p className="text-slate-900 font-semibold">
                  {provider.location || "Pakistan"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                  Availability
                </p>
                <p className="text-slate-900 font-semibold">
                  {provider.availability || "Full-time"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Languages Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {(provider.languages || ["Urdu", "English"]).map((language, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200"
            >
              {language}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
