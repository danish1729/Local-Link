"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { z } from "zod";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Zap,
  Github,
  CheckCircle2,
  Briefcase,
  MapPin,
  Banknote,
} from "lucide-react";
import { useLocation } from "@/hooks/useLocation";

// 1️⃣ Improved Zod Schema
// We use refine to handle string-to-number validation gracefully
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["customer", "provider"]).default("customer"),
  // Optional fields must allow empty strings to pass initial validation
  serviceType: z.string().optional(),
  hourlyRate: z.string().optional(),
});

const providerSchema = signupSchema.extend({
  serviceType: z.string().min(1, "Service type is required"),
  hourlyRate: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Hourly rate must be a valid number",
    }),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface FormErrors {
  [key: string]: string | undefined;
}

export default function SignupForm() {
  const router = useRouter();
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    serviceType: "",
    hourlyRate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Track touched fields to avoid showing errors before user types
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    try {
      const currentRole = formData.role;
      const schema = currentRole === "provider" ? providerSchema : signupSchema;

      // Extract specific field schema for validation
      const fieldSchema = schema.pick({ [name as keyof typeof formData]: true } as Record<string, true>);
      fieldSchema.parse({ [name]: value });

      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message;
      }
      return "Invalid input";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    // 1. Validate Form Fields
    try {
      const schema =
        formData.role === "provider" ? providerSchema : signupSchema;
      schema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    // 2. Validate Location (Critical for your Backend!)
    if (!location) {
      setErrors({
        general: locationError
          ? "Location access is blocked. Please enable permissions."
          : "Fetching location... please wait a moment.",
      });
      return;
    }

    setLoading(true);

    try {
      // 3. Prepare Payload (Convert types)
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        address: "Detected Location", // You might want to reverse-geocode this later
        latitude: location.latitude,
        longitude: location.longitude,
        // Only include these if provider
        ...(formData.role === "provider" && {
          serviceType: formData.serviceType,
          hourlyRate: Number(formData.hourlyRate),
        }),
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Success!
      router.push("/login");
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Get Started</h2>
          <p className="text-blue-100 text-sm">
            Create your LocalLink account today
          </p>
        </motion.div>

        {/* Form content */}
        <div className="px-8 py-8 space-y-5">
          {/* General Error / Location Error */}
          {(errors.general || locationError) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                {errors.general || locationError}
              </p>
            </motion.div>
          )}

          {/* Location Status Indicator (UX Improvement) */}
          {!locationError && !location && (
            <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
              <Loader2 className="w-3 h-3 animate-spin" />
              Detecting your location for local matching...
            </div>
          )}

          {/* Name */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.name
                    ? "border-red-300 focus:ring-red-200 bg-red-50"
                    : "border-slate-200 focus:ring-blue-200 bg-slate-50"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email
                    ? "border-red-300 focus:ring-red-200 bg-red-50"
                    : "border-slate-200 focus:ring-blue-200 bg-slate-50"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.password
                    ? "border-red-300 focus:ring-red-200 bg-red-50"
                    : "border-slate-200 focus:ring-blue-200 bg-slate-50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </motion.div>

          {/* Role */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              I am a
            </label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full pl-4 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-slate-50"
              >
                <option value="customer">Customer (Looking for help)</option>
                <option value="provider">
                  Service Provider (Offering help)
                </option>
              </select>
            </div>
          </motion.div>

          {/* Provider Specific Fields */}
          {/* We wrap this in AnimatePresence or a motion.div with explicit animate props */}
          {formData.role === "provider" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Service Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Service Type
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Plumber, Tutor"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.serviceType
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
                {errors.serviceType && (
                  <p className="text-sm text-red-600">{errors.serviceType}</p>
                )}
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Hourly Rate (Rs)
                </label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="50"
                    min="1"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.hourlyRate
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
                {errors.hourlyRate && (
                  <p className="text-sm text-red-600">{errors.hourlyRate}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            // We disable if loading OR if location is strictly missing
            disabled={loading || !location}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : !location && !locationError ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Waiting for Location...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Create Account</span>
              </>
            )}
          </motion.button>

          <motion.p 
            variants={itemVariants}
            className="text-center text-sm text-slate-600"
          >
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Login
            </a>
          </motion.p>

          {/* ... Social Buttons ... */}
        </div>
      </div>
      {/* ... Trust Badges ... */}
    </motion.form>
  );
}
