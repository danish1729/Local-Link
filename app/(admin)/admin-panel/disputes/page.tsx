"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, FileText, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/disputes`);
      const data = await res.json();
      setDisputes(data.disputes || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load disputes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (id: string, action: "cancel" | "revert") => {
    try {
      const res = await fetch(`/api/admin/disputes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success(data.message);
      setDisputes(prev => prev.filter(d => d._id !== id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          Active Disputes & Cancellations
        </h2>
        <p className="text-sm text-slate-500 mt-1">Review and resolve booking cancellation requests.</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : disputes.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">All Clear!</h3>
            <p className="text-slate-500">There are no active disputes or cancellation requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Booking Info</th>
                  <th className="px-6 py-4">Parties Involved</th>
                  <th className="px-6 py-4">Dispute Status</th>
                  <th className="px-6 py-4">Financials</th>
                  <th className="px-6 py-4 text-right">Resolve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {disputes.map((dispute) => (
                  <tr key={dispute._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-mono font-bold text-slate-800">{dispute.bookingNumber}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        For {format(new Date(dispute.bookingDate), "MMM d, yyyy")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Customer</p>
                          <p className="font-semibold text-slate-900">{dispute.customerId?.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Provider</p>
                          <p className="font-semibold text-slate-900">{dispute.providerId?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {dispute.status === "CancelRequestedByCustomer" ? "Customer Cancellation" : "Provider Cancellation"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">Rs. {dispute.totalAmount}</p>
                      <p className="text-xs text-slate-500">Hold</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleResolve(dispute._id, "cancel")}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200 text-xs font-bold flex items-center gap-1"
                          title="Force Cancel and Refund"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Approve Cancellation
                        </button>
                        <button 
                          onClick={() => handleResolve(dispute._id, "revert")}
                          className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-bold"
                          title="Reject Cancellation Request"
                        >
                          Revert to Confirmed
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
