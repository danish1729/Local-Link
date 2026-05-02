"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import ServiceProviderCard from "./ServiceProviderCard";
import type { Provider, PaginationInfo } from "@/app/services/BrowseServicesClient";

type Props = {
  providers: Provider[];
  loading: boolean;
  viewMode: "grid" | "list";
  pagination: PaginationInfo | null;
  nearbyEnabled: boolean;
  onPageChange: (page: number) => void;
};

// ── Skeleton card ──────────────────────────────────────────────────────────
function SkeletonCard({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div
        className="rounded-xl p-4 flex items-center gap-4 animate-pulse bg-white"
        style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
      >
        <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-1/4" />
        </div>
        <div className="w-20 h-8 bg-slate-200 rounded-lg" />
      </div>
    );
  }
  return (
    <div
      className="rounded-2xl p-5 animate-pulse bg-white"
      style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      <div className="flex justify-between mb-4">
        <div className="w-14 h-14 rounded-full bg-slate-200" />
        <div className="w-24 h-6 rounded-full bg-slate-100" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
      </div>
      <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
        <div className="h-6 bg-slate-200 rounded w-16" />
        <div className="h-8 bg-slate-200 rounded-lg w-20" />
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-indigo-50"
        style={{ border: "1px solid #c7d2fe" }}
      >
        <Search className="w-9 h-9 text-indigo-400" />
      </div>
      <h3 className="text-slate-800 font-bold text-xl mb-2">No providers found</h3>
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
        Try adjusting your filters — widen the radius, change the category, or lower the minimum rating.
      </p>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────
function Pagination({
  pagination, onPageChange,
}: { pagination: PaginationInfo; onPageChange: (p: number) => void }) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const range: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {range.map((item, idx) =>
        item === "..." ? (
          <span key={`dots-${idx}`} className="text-slate-400 px-1">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item as number)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all shadow-sm ${
              item === page
                ? "bg-indigo-600 text-white shadow-indigo-200"
                : "bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function ResultsGrid({
  providers, loading, viewMode, pagination, nearbyEnabled, onPageChange,
}: Props) {
  const SKELETON_COUNT = 12;

  if (loading) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
            : "flex flex-col gap-3"
        }
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (!providers.length) return <EmptyState />;

  return (
    <div>
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
            : "flex flex-col gap-3"
        }
      >
        {providers.map((provider, index) => (
          <ServiceProviderCard
            key={provider._id}
            provider={provider}
            index={index}
            viewMode={viewMode}
            nearbyEnabled={nearbyEnabled}
          />
        ))}
      </div>

      {pagination && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}
