"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Search, Clock, FileBadge } from "lucide-react";
import { toast } from "react-hot-toast";

import { Suspense } from "react";

function AdminProvidersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = searchParams.get("tab") || "all";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProviders = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/providers?status=${status}`);
      const data = await res.json();
      setProviders(data.providers || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders(activeTab);
    router.replace(`/admin-panel/providers?tab=${activeTab}`, { scroll: false });
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/providers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success(data.message);
      // Remove from list if we are on a specific tab, or update status if on "all"
      if (activeTab === "all") {
        setProviders(prev => prev.map(p => p._id === id ? { ...p, providerStatus: status } : p));
      } else {
        setProviders(prev => prev.filter(p => p._id !== id));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredProviders = providers.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.serviceType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
          {["all", "pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                activeTab === tab 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 px-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No providers found for this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Provider Info</th>
                  <th className="px-6 py-4">Service & Rate</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">ID Documents</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProviders.map((provider) => (
                  <tr key={provider._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                          {provider.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{provider.name}</p>
                          <p className="text-xs text-slate-500">{provider.email}</p>
                          <p className="text-xs text-slate-400">{provider.phoneNumber || "No phone"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{provider.serviceType || "N/A"}</p>
                      <p className="text-xs text-slate-500">Rs. {provider.hourlyRate || 0}/hr</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                        provider.providerStatus === "pending" ? "bg-amber-100 text-amber-700" :
                        provider.providerStatus === "approved" ? "bg-emerald-100 text-emerald-700" :
                        provider.providerStatus === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {provider.providerStatus === "pending" && <Clock className="w-3 h-3" />}
                        {provider.providerStatus === "approved" && <CheckCircle className="w-3 h-3" />}
                        {provider.providerStatus === "rejected" && <XCircle className="w-3 h-3" />}
                        {provider.providerStatus || "none"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {provider.cnicNumber ? (
                        <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 w-max">
                          <FileBadge className="w-4 h-4" />
                          CNIC Provided
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {provider.providerStatus === "pending" && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(provider._id, "approved")}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(provider._id, "rejected")}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => router.push(`/admin-panel/providers/${provider._id}`)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 text-xs font-bold"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProvidersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <AdminProvidersContent />
    </Suspense>
  );
}
