"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Camera,
  AlertCircle,
  CheckCircle,
  Loader2,
  Star,
  Award,
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  serviceType?: string;
  hourlyRate?: number;
  rating?: number;
  completedJobs?: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  serviceType?: string;
  hourlyRate?: string;
  general?: string;
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "customer";

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Mock data - replace with actual API call
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    phone: "+92-300-1234567",
    location: "Karachi, Sindh",
    bio:
      role === "provider"
        ? "Professional plumber with 5 years of experience. Expert in residential and commercial installations."
        : "Always looking for quality services in my area.",
    ...(role === "provider" && {
      serviceType: "Plumbing",
      hourlyRate: 500,
      rating: 4.8,
      completedJobs: 127,
    }),
  });

  const [formData, setFormData] = useState<ProfileData>(profileData);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        return undefined;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return undefined;
      case "phone":
        if (!value) return "Phone is required";
        if (!/^[\d\s\-\+\(\)]{10,}$/.test(value.replace(/\D/g, "")))
          return "Invalid phone number";
        return undefined;
      case "location":
        if (!value) return "Location is required";
        return undefined;
      case "bio":
        if (!value) return "Bio is required";
        if (value.length < 10) return "Bio must be at least 10 characters";
        return undefined;
      case "serviceType":
        if (role === "provider" && !value) return "Service type is required";
        return undefined;
      case "hourlyRate":
        if (role === "provider" && !value) return "Hourly rate is required";
        if (value && Number(value) <= 0)
          return "Hourly rate must be greater than 0";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key === "rating" || key === "completedJobs") return;
      const error = validateField(
        key,
        String(formData[key as keyof ProfileData] || ""),
      );
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setProfileData(formData);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({
        general: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setErrors({});
    setTouched({});
    setIsEditing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-600 mt-1">
              {role === "provider"
                ? "Manage your professional profile and service details"
                : "Update your account information"}
            </p>
          </div>

          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFormData(profileData);
                setIsEditing(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </motion.button>
          )}
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{successMessage}</p>
          </motion.div>
        )}

        {/* Error Message */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{errors.general}</p>
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <div className="flex items-end gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white cursor-pointer hover:bg-white/30 transition group"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                )}
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <p className="text-blue-100 text-sm">{profileData.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <form onSubmit={handleSave} className="p-8 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Basic Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      placeholder="Full Name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg transition disabled:bg-slate-50 disabled:cursor-not-allowed ${
                        errors.name
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:ring-blue-200"
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      placeholder="email@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg transition disabled:bg-slate-50 disabled:cursor-not-allowed ${
                        errors.email
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:ring-blue-200"
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      placeholder="+92-300-1234567"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg transition disabled:bg-slate-50 disabled:cursor-not-allowed ${
                        errors.phone
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:ring-blue-200"
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      placeholder="City, Province"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg transition disabled:bg-slate-50 disabled:cursor-not-allowed ${
                        errors.location
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:ring-blue-200"
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Bio / Description *
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!isEditing}
                  placeholder="Tell customers about yourself..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg transition disabled:bg-slate-50 disabled:cursor-not-allowed resize-none ${
                    errors.bio
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-blue-200"
                  } focus:outline-none focus:ring-2`}
                />
                <p className="text-xs text-slate-500">
                  {formData.bio?.length || 0} / 500 characters
                </p>
                {errors.bio && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Provider Specific Fields */}
            {role === "provider" && (
              <>
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Service Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Service Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Service Type *
                      </label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="serviceType"
                          value={formData.serviceType || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={!isEditing}
                          placeholder="e.g., Plumbing, Design"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg transition disabled:bg-slate-50 disabled:cursor-not-allowed ${
                            errors.serviceType
                              ? "border-red-300 focus:ring-red-200"
                              : "border-slate-200 focus:ring-blue-200"
                          } focus:outline-none focus:ring-2`}
                        />
                      </div>
                      {errors.serviceType && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.serviceType}
                        </p>
                      )}
                    </div>

                    {/* Hourly Rate */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Hourly Rate (PKR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                          Rs
                        </span>
                        <input
                          type="number"
                          name="hourlyRate"
                          value={formData.hourlyRate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={!isEditing}
                          placeholder="500"
                          min="0"
                          step="50"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg transition disabled:bg-slate-50 disabled:cursor-not-allowed ${
                            errors.hourlyRate
                              ? "border-red-300 focus:ring-red-200"
                              : "border-slate-200 focus:ring-blue-200"
                          } focus:outline-none focus:ring-2`}
                        />
                      </div>
                      {errors.hourlyRate && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.hourlyRate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Your Stats
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-lg">
                          <Star className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div>
                          <p className="text-slate-600 text-sm">Rating</p>
                          <p className="text-3xl font-bold text-slate-900">
                            {profileData.rating}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-600 rounded-lg">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-slate-600 text-sm">
                            Completed Jobs
                          </p>
                          <p className="text-3xl font-bold text-slate-900">
                            {profileData.completedJobs}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="border-t border-slate-200 pt-6 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition font-semibold"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </motion.button>
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
