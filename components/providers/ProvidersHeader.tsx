"use client";

import { motion } from "framer-motion";
import { Star, MapPin, CheckCircle, Shield, Users, Award } from "lucide-react";

type Provider = {
  name: string;
  serviceType?: string;
  location?: string;
  bio?: string;
  rating?: number;
  completedJobs?: number;
  hourlyRate?: number;
};

type Props = {
  provider: Provider;
};

export default function ProviderHeader({ provider }: Props) {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
          {/* Avatar */}
          <motion.div variants={itemVariants}>
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-blue-200 to-blue-300 text-white flex items-center justify-center text-5xl font-bold shadow-2xl border-4 border-white">
              {provider.name.charAt(0).toUpperCase()}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div variants={itemVariants} className="flex-1 text-white">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold">
                {provider.name}
              </h1>
              <CheckCircle className="w-8 h-8 text-blue-200 fill-blue-200" />
            </div>

            <div className="flex flex-wrap gap-6 text-blue-100 mb-6">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">{provider.serviceType}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">
                  {provider.location || "Pakistan"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span className="font-semibold">
                  {provider.rating || 4.8} Rating
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg">
                <p className="text-xs text-blue-100 uppercase tracking-wide">
                  Completed Jobs
                </p>
                <p className="text-2xl font-bold">
                  {provider.completedJobs || "120+"}
                </p>
              </div>
              <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg">
                <p className="text-xs text-blue-100 uppercase tracking-wide">
                  Hourly Rate
                </p>
                <p className="text-2xl font-bold">
                  Rs {provider.hourlyRate || "500"}
                </p>
              </div>
              <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Verified</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
