"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Loader2,
  Navigation,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// 🌎 Dynamically import Map (Client Side Only)
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 rounded-xl text-slate-400 gap-2">
      <Loader2 className="w-8 h-8 animate-spin" />
      <span className="text-sm font-medium">Loading Map...</span>
    </div>
  ),
});

type ProviderResult = {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  image?: string;
};

export default function SmartSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProviderResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Default: Faisalabad Clock Tower (Fallback)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    31.4504, 73.135,
  ]);

  // Debounce Search Timer
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // 1. Get User Location on Mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          fetchProviders(latitude, longitude, ""); // Initial fetch
        },
        (error) => {
          console.error("Location access denied", error);
          setLocationError("Location access denied. Showing default area.");
          // Still fetch using default Faisalabad coordinates
          fetchProviders(31.4504, 73.135, "");
        },
      );
    }
  }, []);

  // 2. Fetch Data from API
  const fetchProviders = async (
    lat: number,
    lng: number,
    searchText: string,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        q: searchText,
        radius: "5000", // 5km
      });

      const res = await fetch(`/api/providers/search?${params}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch providers", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Search Input (Debounced)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      // Use userLocation if available, else mapCenter
      const [lat, lng] = userLocation || mapCenter;
      fetchProviders(lat, lng, text);
    }, 500); // Wait 500ms after typing stops
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto min-h-[600px]">
      {/* --- Search Header --- */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Find Local <span className="text-blue-600">Experts</span> Near You
        </h1>

        {locationError && (
          <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            {locationError}
          </div>
        )}

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for 'Plumber', 'Electrician'..."
              value={query}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Split View Content --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Left: Results List */}
        <div className="h-full overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          {results.length === 0 && !loading ? (
            <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <MapPin className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p>No providers found nearby.</p>
              <p className="text-sm mt-1">
                Try increasing the radius or changing the search.
              </p>
            </div>
          ) : (
            results.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all cursor-pointer"
                onClick={() => setMapCenter([provider.lat, provider.lng])}
              >
                {/* Avatar */}
                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100">
                  {provider.image ? (
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 font-bold text-xl">
                      {provider.name[0]}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {provider.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs font-bold text-yellow-700">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {provider.rating}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">
                      {provider.price > 0
                        ? `PKR ${provider.price}/hr`
                        : "Negotiable"}
                    </p>
                    <Link
                      href={`/providers/${provider.id}`}
                      className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Right: Map */}
        <div className="h-[400px] lg:h-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative">
          <Map center={mapCenter} providers={results} />

          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-medium shadow-md flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> You
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>{" "}
              Providers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
