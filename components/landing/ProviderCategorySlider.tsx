"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/common/Avatar";

type Provider = {
  _id: string;
  name: string;
  hourlyRate?: number;
  profileImage?: string | null;
  rating: number;
};

export default function ProviderCategorySlider() {
  const [categories, setCategories] = useState<Record<string, Provider[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await fetch("/api/providers");
        const data = await res.json();

        // 🚨 GUARD: API error
        if (!res.ok || typeof data !== "object" || Array.isArray(data)) {
          console.error("Invalid providers response:", data);
          setCategories({});
          return;
        }
          

        setCategories(data);
      } catch (err) {
        console.error("Failed to load providers", err);
        setCategories({});
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);
  

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 text-center">
        <p className="text-slate-500">Loading providers…</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <h2 className="text-4xl font-bold text-center text-slate-900">
          Top Providers by Category
        </h2>

        {Object.entries(categories).map(([category, providers]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-2xl font-semibold text-slate-800">
              {category}
            </h3>

            <div className="flex gap-6 overflow-x-auto pb-4">
              {providers.map((provider) => (
                <motion.div
                  whileHover={{ y: -6 }}
                  key={provider._id}
                  className="min-w-[240px] bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
                >
                  <div className="space-y-4">
                    <Avatar
                      src={provider.profileImage}
                      name={provider.name}
                      size={56}
                    />

                    <p className="font-semibold text-slate-900">
                      {provider.name}
                    </p>

                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      <span className="text-sm">{provider.rating}</span>
                    </div>

                    {provider.hourlyRate && (
                      <p className="text-sm text-slate-600">
                        PKR {provider.hourlyRate}/hr
                      </p>
                    )}

                    <Link
                      href={`/providers/${provider._id}`}
                      className="text-blue-600 text-sm font-medium"
                    >
                      View Profile →
                    </Link>
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
