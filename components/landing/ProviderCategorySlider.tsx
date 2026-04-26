"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
// Assuming you have this component. If not, use a standard <img> tag.
import Avatar from "@/components/common/Avatar";

type Provider = {
  _id: string;
  name: string;
  serviceType: string;
  hourlyRate?: number;
  profileImage?: string | null;
  rating: number;
  reviewCount: number;
};

export default function ProviderCategorySlider() {
  const [categories, setCategories] = useState<Record<string, Provider[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await fetch("/api/providers");

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load providers", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  // 1. Loading State
  if (loading) {
    return (
      <section className="py-20 bg-slate-50 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
        </div>
      </section>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <section className="py-20 text-center text-red-500">
        Failed to load providers. Please try refreshing.
      </section>
    );
  }

  // 3. Empty State (No providers found)
  if (Object.keys(categories).length === 0) {
    return (
      <section className="py-20 bg-slate-50 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Find Local Experts
        </h2>
        <p className="text-slate-500">
          No service providers registered yet. Be the first!
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block text-blue-600 font-semibold hover:underline"
        >
          Join as a Professional
        </Link>
      </section>
    );
  }

  // 4. Success State
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">
            Top Professionals Near You
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Browse verified experts by category and get your job done.
          </p>
        </div>

        {Object.entries(categories).map(([category, providers]) => (
          <div key={category} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                {category}
              </h3>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 scrollbar-hide snap-x">
              {providers.map((provider) => (
                <motion.div
                  key={provider._id}
                  whileHover={{ y: -5 }}
                  className="min-w-[280px] md:min-w-[300px] bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 snap-center"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Avatar Area */}
                    <div className="relative">
                      <div className="p-1 rounded-full border-2 border-dashed border-blue-200">
                        {provider.profileImage ? (
                          <img
                            src={provider.profileImage}
                            alt={provider.name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          // Fallback if you don't have the Avatar component
                          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                            {provider.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                    {/* Name & Rating */}
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 truncate max-w-[200px]">
                        {provider.name}
                      </h4>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-yellow-700">
                            {provider.rating}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          ({provider.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-slate-100"></div>

                    {/* Details */}
                    <div className="w-full flex justify-between items-center text-sm">
                      <div className="flex flex-col items-start">
                        <span className="text-slate-400 text-xs">Rate</span>
                        <span className="font-semibold text-slate-700">
                          {provider.hourlyRate
                            ? `$${provider.hourlyRate}/hr`
                            : "Negotiable"}
                        </span>
                      </div>
                      <Link
                        href={`/provider/${provider._id}`}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
