"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle, TrendingUp, Award } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  gradient: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  gradient,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className={`relative rounded-2xl p-6 text-white overflow-hidden group`}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 ${gradient} z-0`}></div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300 z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
            <Icon className="w-6 h-6" />
          </div>
        </div>

        <p className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">
          {label}
        </p>
        <p className="text-4xl font-bold mb-1">{value}</p>
        {subtext && <p className="text-white/70 text-sm">{subtext}</p>}
      </div>
    </motion.div>
  );
}

interface ProviderStatsProps {
  providerId: string;
}

export default function ProviderStats({ providerId }: ProviderStatsProps) {
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

  // Mock stats - replace with actual data from API
  const stats = [
    {
      icon: Star,
      label: "Overall Rating",
      value: "4.9",
      subtext: "Out of 5 stars",
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-600",
    },
    {
      icon: CheckCircle,
      label: "Jobs Completed",
      value: "120+",
      subtext: "Satisfied customers",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: "98%",
      subtext: "On-time delivery",
      gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      icon: Award,
      label: "Years Experience",
      value: "5+",
      subtext: "Industry expertise",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition"
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold text-slate-900 mb-8"
      >
        Performance Metrics
      </motion.h2>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Info */}
      <motion.div
        variants={itemVariants}
        className="mt-8 pt-8 border-t border-slate-200 grid md:grid-cols-3 gap-4"
      >
        <div className="text-center">
          <p className="text-slate-600 text-sm font-medium">Last Worked</p>
          <p className="text-slate-900 font-bold text-lg">2 hours ago</p>
        </div>
        <div className="text-center">
          <p className="text-slate-600 text-sm font-medium">Member Since</p>
          <p className="text-slate-900 font-bold text-lg">Mar 2022</p>
        </div>
        <div className="text-center">
          <p className="text-slate-600 text-sm font-medium">Response Rate</p>
          <p className="text-slate-900 font-bold text-lg">99%</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
