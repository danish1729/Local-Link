"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ShieldAlert, AlertTriangle, CheckCircle, Lock, Mail, Search, ChevronRight } from "lucide-react";

export default function AdminFraudDashboard() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchFlags = async () => {
    try {
      const res = await fetch("/api/admin/fraud");
      const data = await res.json();
      setFlags(data.flags || []);
    } catch (error) {
      console.error("Failed to fetch fraud flags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleAction = async (flagId: string, userId: string, action: string) => {
    if (!confirm(`Are you sure you want to execute action: ${action}?`)) return;
    
    setActionLoading(flagId + action);
    try {
      const res = await fetch("/api/admin/users/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagId, userId, action })
      });
      if (res.ok) {
        alert("Action executed successfully.");
        await fetchFlags();
      } else {
        alert("Action failed.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical": return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">Critical</span>;
      case "High": return <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200">High</span>;
      case "Medium": return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">Medium</span>;
      default: return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200">Low</span>;
    }
  };

  const openFlags = flags.filter(f => f.status === "Open");
  const resolvedFlags = flags.filter(f => f.status === "Resolved");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-start gap-4">
        <div className="p-3 bg-red-50 rounded-xl">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Fraud & Security Desk</h1>
          <p className="text-slate-500 mt-1">
            Proactive monitoring of platform bookings. The AI system automatically flags suspicious transactions, potential money laundering, and off-platform communication attempts.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Active Alerts ({openFlags.length})
          </h2>
        </div>

        {openFlags.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-50" />
            <p>No active fraud alerts. The platform is secure.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {openFlags.map((flag) => (
              <div key={flag._id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Info Column */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      {getSeverityBadge(flag.severity)}
                      <span className="text-sm text-slate-500 font-medium">
                        Alert generated {format(new Date(flag.createdAt), "MMM d, h:mm a")}
                      </span>
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold border border-indigo-100">
                        AI Confidence: {flag.aiConfidenceScore}%
                      </span>
                    </div>

                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
                      <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2">AI Reasoning</h4>
                      <p className="text-sm text-red-900 leading-relaxed">{flag.reason}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Suspect Account</p>
                        <p className="font-bold text-slate-900">{flag.userId?.name || "Unknown User"}</p>
                        <p className="text-sm text-slate-600">{flag.userId?.email}</p>
                        <p className="text-xs text-slate-400 mt-1 capitalize">Role: {flag.userId?.role}</p>
                        {flag.userId?.providerStatus === 'suspended' || flag.userId?.role === 'suspended' ? (
                          <p className="text-xs font-bold text-red-600 mt-1">ACCOUNT SUSPENDED</p>
                        ) : null}
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        {flag.bookingId ? (
                          <>
                            <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Context (Booking)</p>
                            <p className="font-bold text-slate-900">{flag.bookingId?.bookingNumber}</p>
                            <p className="text-sm text-slate-600">Amount: Rs. {flag.bookingId?.totalAmount}</p>
                            <p className="text-xs text-slate-400 mt-1">Status: {flag.bookingId?.status}</p>
                          </>
                        ) : flag.messageId ? (
                          <>
                            <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Context (Chat Message)</p>
                            <p className="font-bold text-slate-900 line-clamp-2">"{flag.messageId?.text}"</p>
                            <p className="text-xs text-slate-400 mt-1">Conv ID: {flag.conversationId?.substring(0, 8)}...</p>
                          </>
                        ) : (
                          <p className="text-xs text-slate-400">Context not available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Column */}
                  <div className="lg:w-64 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
                    <p className="text-xs font-bold text-slate-400 uppercase text-center mb-1">Admin Actions</p>
                    
                    <button 
                      onClick={() => handleAction(flag._id, flag.userId?._id, "freeze_account")}
                      disabled={actionLoading !== null}
                      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" /> Freeze Account
                    </button>
                    
                    <button 
                      onClick={() => handleAction(flag._id, flag.userId?._id, "send_warning")}
                      disabled={actionLoading !== null}
                      className="w-full flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border border-amber-200 disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4" /> Issue Warning
                    </button>

                    <button 
                      onClick={() => handleAction(flag._id, flag.userId?._id, "resolve_flag")}
                      disabled={actionLoading !== null}
                      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border border-slate-200 mt-2 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" /> Dismiss (Safe)
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {resolvedFlags.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden opacity-70">
           <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-slate-400" />
              Resolved Alerts
            </h2>
          </div>
          <div className="p-4">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-500 font-semibold border-b border-slate-100">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Suspect</th>
                  <th className="pb-3">Severity</th>
                  <th className="pb-3">Action Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resolvedFlags.map(flag => (
                  <tr key={flag._id}>
                    <td className="py-3 text-slate-600">{format(new Date(flag.updatedAt), "MMM d, yyyy")}</td>
                    <td className="py-3 font-medium text-slate-800">{flag.userId?.name}</td>
                    <td className="py-3">{getSeverityBadge(flag.severity)}</td>
                    <td className="py-3 font-medium text-slate-700">{flag.actionTaken}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
