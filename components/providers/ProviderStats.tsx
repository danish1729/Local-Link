"use client";

import { Star, CheckCircle, TrendingUp, Award } from "lucide-react";

interface ProviderStatsProps {
  provider: any;
}

export default function ProviderStats({ provider }: ProviderStatsProps) {
  const stats = [
    {
      icon: Star,
      label: "Rating",
      value: provider.averageRating > 0 ? provider.averageRating.toString() : "New",
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: provider.totalReviews.toString(),
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      icon: TrendingUp,
      label: "Clicks",
      value: provider.profileClicks || 0,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: Award,
      label: "Experience",
      value: `${provider.experience || 1}y`,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center hover:border-slate-300 transition-colors">
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color} mb-3`}>
              <Icon className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
