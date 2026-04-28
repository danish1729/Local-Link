"use client";

import { useState, useEffect } from "react";
import ProfilePictureUploader from "@/components/seller/ProfilePictureUploader";
import { User, Mail, Phone, MapPin, Shield, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfileClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [activeTab, setActiveTab] = useState("account");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    profileImage: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok && data.user) {
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            phoneNumber: data.user.phoneNumber || "",
            address: data.user.address || "",
            profileImage: data.user.profileImage || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
      
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <button 
          onClick={() => setActiveTab("account")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === "account" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-600 hover:bg-slate-200/50"}`}
        >
          <User className="w-5 h-5" /> Account Details
        </button>
        <button 
          onClick={() => setActiveTab("security")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === "security" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-600 hover:bg-slate-200/50"}`}
        >
          <Shield className="w-5 h-5" /> Security
        </button>
      </div>

      <div className="flex-1">
        {activeTab === "account" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-b border-slate-100 px-8 py-6">
              <h2 className="text-2xl font-bold text-slate-900">Account Details</h2>
              <p className="text-slate-500 text-sm mt-1">Manage your personal information and public profile.</p>
            </div>

            <div className="p-8 space-y-8">
              
              {message && (
                <div className={`flex items-center gap-2 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {message.text}
                </div>
              )}

              <div className="flex items-center gap-8 pb-8 border-b border-slate-100">
                <ProfilePictureUploader 
                  initialImage={formData.profileImage} 
                  onUpload={(url) => setFormData(prev => ({...prev, profileImage: url}))}
                />
                <div>
                  <h3 className="font-semibold text-slate-800">Profile Picture</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">
                    Upload a professional picture so your customers or providers can recognize you easily.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 bg-slate-50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 bg-slate-50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 bg-slate-50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Physical Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, City, Country"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 bg-slate-50 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-b border-slate-100 px-8 py-6">
              <h2 className="text-2xl font-bold text-slate-900">Security</h2>
              <p className="text-slate-500 text-sm mt-1">Manage your password and security settings.</p>
            </div>
            <div className="p-8">
              <p className="text-slate-600 mb-4">Password management will be available here soon.</p>
              <button disabled className="bg-slate-200 text-slate-500 px-6 py-2.5 rounded-lg font-semibold cursor-not-allowed">
                Change Password
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
