"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import FilterSidebar from "@/components/services/FilterSidebar";
import ResultsGrid from "@/components/services/ResultsGrid";

export type FilterState = {
  q: string;
  category: string;
  minRate: number;
  maxRate: number;
  minRating: number;
  verified: boolean;
  sortBy: string;
  nearbyEnabled: boolean;
  radius: number;
  userLat: number | null;   // actual GPS lat stored here
  userLng: number | null;   // actual GPS lng stored here
  page: number;
};

export type Provider = {
  _id: string;
  name: string;
  serviceType: string;
  hourlyRate: number;
  profileImage: string | null;
  bio: string;
  averageRating: number;
  totalReviews: number;
  isVerified: boolean;
  address: string;
  distanceKm: number | null;
  createdAt: string;
};

export type PaginationInfo = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const DEFAULT_FILTERS: FilterState = {
  q: "",
  category: "",
  minRate: 0,
  maxRate: 500,
  minRating: 0,
  verified: false,
  sortBy: "rating",
  nearbyEnabled: false,
  radius: 10,
  userLat: null,
  userLng: null,
  page: 1,
};

export default function BrowseServicesClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters]         = useState<FilterState>(DEFAULT_FILTERS);
  const [providers, setProviders]     = useState<Provider[]>([]);
  const [categories, setCategories]   = useState<string[]>([]);
  const [pagination, setPagination]   = useState<PaginationInfo | null>(null);
  const [loading, setLoading]         = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode]       = useState<"grid" | "list">("grid");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Hydrate filters from URL on mount ──────────────────────────────────────
  useEffect(() => {
    const fromUrl: Partial<FilterState> = {};
    if (searchParams.get("q"))         fromUrl.q             = searchParams.get("q")!;
    if (searchParams.get("category"))  fromUrl.category      = searchParams.get("category")!;
    if (searchParams.get("minRate"))   fromUrl.minRate       = Number(searchParams.get("minRate"));
    if (searchParams.get("maxRate"))   fromUrl.maxRate       = Number(searchParams.get("maxRate"));
    if (searchParams.get("minRating")) fromUrl.minRating     = Number(searchParams.get("minRating"));
    if (searchParams.get("verified"))  fromUrl.verified      = searchParams.get("verified") === "true";
    if (searchParams.get("sortBy"))    fromUrl.sortBy        = searchParams.get("sortBy")!;
    if (searchParams.get("radius"))    fromUrl.radius        = Number(searchParams.get("radius"));
    if (searchParams.get("page"))      fromUrl.page          = Number(searchParams.get("page"));
    setFilters(prev => ({ ...prev, ...fromUrl }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch providers whenever filters change (debounced for text) ───────────
  const fetchProviders = useCallback(async (f: FilterState) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.q)             params.set("q", f.q);
      if (f.category)      params.set("category", f.category);
      if (f.minRate > 0)   params.set("minRate", String(f.minRate));
      if (f.maxRate < 500) params.set("maxRate", String(f.maxRate));
      if (f.minRating > 0) params.set("minRating", String(f.minRating));
      if (f.verified)      params.set("verified", "true");
      params.set("sortBy", f.sortBy);
      params.set("page", String(f.page));

      // Only send geo params if nearby is enabled AND we have valid coordinates
      if (f.nearbyEnabled && f.userLat !== null && f.userLng !== null) {
        params.set("lat", String(f.userLat));
        params.set("lng", String(f.userLng));
        params.set("radius", String(f.radius));
      }

      const res  = await fetch(`/api/services?${params.toString()}`);
      const data = await res.json();
      setProviders(data.providers  ?? []);
      setPagination(data.pagination ?? null);
      setCategories(prev => data.categories?.length ? data.categories : prev);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProviders(filters);
      // Sync URL (no lat/lng in URL for privacy)
      const params = new URLSearchParams();
      if (filters.q)             params.set("q", filters.q);
      if (filters.category)      params.set("category", filters.category);
      if (filters.minRating > 0) params.set("minRating", String(filters.minRating));
      if (filters.verified)      params.set("verified", "true");
      if (filters.nearbyEnabled) params.set("radius", String(filters.radius));
      if (filters.page > 1)      params.set("page", String(filters.page));
      params.set("sortBy", filters.sortBy);
      router.replace(`/services?${params.toString()}`, { scroll: false });
    }, filters.q ? 400 : 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [filters, fetchProviders, router]);

  const updateFilter = (patch: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const activeFilterCount = [
    filters.q,
    filters.category,
    filters.minRate > 0,
    filters.maxRate < 500,
    filters.minRating > 0,
    filters.verified,
    filters.nearbyEnabled,
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div
        className="relative py-14 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #eff6ff 100%)",
          borderBottom: "1px solid #e0e7ff",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute", top: "-80px", left: "-80px",
            width: "320px", height: "320px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "-60px", right: "-60px",
            width: "260px", height: "260px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            {pagination?.total ?? "..."} Professionals Available
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Browse{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Local Services
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Find verified professionals near you — filter by skill, price, rating, or proximity.
          </p>
        </div>
      </div>

      {/* ── Mobile toolbar ───────────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:text-slate-700"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:text-slate-700"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <span className="text-slate-500 text-sm ml-auto">
          {loading ? "Loading..." : `${pagination?.total ?? 0} results`}
        </span>
      </div>

      {/* ── Mobile sidebar overlay ───────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <span className="text-slate-900 font-bold text-lg">Filters</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              categories={categories}
              onChange={updateFilter}
              onReset={resetFilters}
              activeCount={activeFilterCount}
            />
          </div>
        </div>
      )}

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                categories={categories}
                onChange={updateFilter}
                onReset={resetFilters}
                activeCount={activeFilterCount}
              />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar — desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-slate-600 font-medium">
                  {loading
                    ? "Searching..."
                    : `${pagination?.total ?? 0} service${pagination?.total !== 1 ? "s" : ""} found`}
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filters.sortBy}
                  onChange={e => updateFilter({ sortBy: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                >
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>

                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:text-slate-700"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:text-slate-700"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <ResultsGrid
              providers={providers}
              loading={loading}
              viewMode={viewMode}
              pagination={pagination}
              nearbyEnabled={filters.nearbyEnabled && filters.userLat !== null}
              onPageChange={p => updateFilter({ page: p })}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
