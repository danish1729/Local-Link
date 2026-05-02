"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User as UserIcon, ShieldCheck, Mail, MapPin, Briefcase, FileBadge, AlertTriangle, ShieldBan, CheckCircle, GraduationCap } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminProviderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProvider = async () => {
    try {
      const res = await fetch(`/api/admin/providers/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProvider(data.provider);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const updateProvider = async (payload: any) => {
    try {
      const res = await fetch(`/api/admin/providers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success(data.message);
      setProvider(data.user);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold text-slate-800">Provider Not Found</h2>
        <button onClick={() => router.back()} className="mt-4 text-indigo-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Providers
        </button>

        <div className="flex gap-2">
          {provider.providerStatus !== "frozen" ? (
            <button
              onClick={() => updateProvider({ status: "frozen" })}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-100 transition-colors"
            >
              <ShieldBan className="w-4 h-4" />
              Freeze Account
            </button>
          ) : (
            <button
              onClick={() => updateProvider({ status: "approved" })}
              className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Unfreeze Account
            </button>
          )}

          {!provider.isVerified ? (
             <button
             onClick={() => updateProvider({ isVerified: true })}
             className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
           >
             <ShieldCheck className="w-4 h-4" />
             Verify Identity
           </button>
          ) : (
            <span className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              Identity Verified
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Profile Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-24 h-24 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
              {provider.profileImage ? (
                <img src={provider.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                provider.name.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{provider.name}</h2>
            <p className="text-slate-500 font-medium">{provider.serviceType || "No Service Selected"}</p>
            <p className="text-lg font-bold text-slate-800 mt-2">Rs. {provider.hourlyRate || 0} / hr</p>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                {provider.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {provider.address || "Location not provided"}
              </div>
            </div>
          </div>

          {/* Status Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Account Status</h3>
             <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Provider Approval</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 ${
                        provider.providerStatus === "pending" ? "bg-amber-100 text-amber-700" :
                        provider.providerStatus === "approved" ? "bg-emerald-100 text-emerald-700" :
                        provider.providerStatus === "frozen" ? "bg-red-100 text-red-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                    {provider.providerStatus}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Identity Verification</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 ${
                        provider.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>
                    {provider.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileBadge className="w-5 h-5 text-indigo-500" />
              Verification Documents
            </h3>
            {provider.cnicNumber ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-semibold text-slate-600">CNIC Number</span>
                  <span className="font-mono text-slate-900 font-bold">{provider.cnicNumber}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="font-semibold text-slate-600 mb-2">CNIC Front</span>
                  {provider.cnicFrontImage ? (
                    <img src={provider.cnicFrontImage} alt="CNIC Front" className="rounded-lg object-cover max-h-32" />
                  ) : (
                    <span className="text-xs text-slate-400">Not uploaded</span>
                  )}
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="font-semibold text-slate-600 mb-2">CNIC Back</span>
                  {provider.cnicBackImage ? (
                    <img src={provider.cnicBackImage} alt="CNIC Back" className="rounded-lg object-cover max-h-32" />
                  ) : (
                    <span className="text-xs text-slate-400">Not uploaded</span>
                  )}
                </div>
              </div>
            ) : (
               <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                 <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                 <p className="text-slate-600 font-medium">No Identity Documents Provided</p>
                 <p className="text-slate-400 text-sm mt-1">The provider has not submitted their CNIC for review.</p>
               </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              Professional Details
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Education
                </h4>
                {provider.education && provider.education.length > 0 ? (
                  <ul className="space-y-3">
                    {provider.education.map((edu: any, i: number) => (
                      <li key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="font-bold text-slate-800">{edu.degree}</p>
                        <p className="text-sm text-slate-600">{edu.institution} <span className="text-slate-400">({edu.year})</span></p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 text-sm">No education listed.</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Work Experience
                </h4>
                {provider.workExperience && provider.workExperience.length > 0 ? (
                  <ul className="space-y-3">
                    {provider.workExperience.map((exp: any, i: number) => (
                      <li key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="font-bold text-slate-800">{exp.jobTitle}</p>
                        <p className="text-sm text-slate-600">{exp.company} <span className="text-slate-400">({exp.duration})</span></p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 text-sm">No work experience listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
