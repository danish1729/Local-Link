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
  DollarSign,
} from "lucide-react";
import Input from "../Input";
import { useLocation } from "@/hooks/useLocation";

// Zod schema for form validation
const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .min(1, "Name is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .min(1, "Password is required"),
  role: z.enum(["customer", "provider"]).default("customer"),
  serviceType: z.string().optional(),
  hourlyRate: z.string().optional(),
});

const providerSchema = signupSchema.extend({
  serviceType: z.string().min(1, "Service type is required for providers"),
  hourlyRate: z.string().min(1, "Hourly rate is required for providers"),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  serviceType?: string;
  hourlyRate?: string;
  general?: string;
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
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    role: false,
    serviceType: false,
    hourlyRate: false,
  });

  const validateField = (name: string, value: string, role?: string) => {
    try {
      const currentRole = role || formData.role;
      const schema = currentRole === "provider" ? providerSchema : signupSchema;

      if (name === "name") {
        schema.pick({ name: true }).parse({ name: value });
      } else if (name === "email") {
        schema.pick({ email: true }).parse({ email: value });
      } else if (name === "password") {
        schema.pick({ password: true }).parse({ password: value });
      } else if (name === "serviceType") {
        if (currentRole === "provider") {
          providerSchema
            .pick({ serviceType: true })
            .parse({ serviceType: value });
        }
      } else if (name === "hourlyRate") {
        if (currentRole === "provider") {
          providerSchema
            .pick({ hourlyRate: true })
            .parse({ hourlyRate: value });
        }
      }
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message;
      }
    }
    return undefined;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (touched[name as keyof typeof touched]) {
      const error = validateField(
        name,
        value,
        name === "role" ? value : undefined,
      );
      setErrors((prev) => ({
        ...prev,
        [name]: error,
        general: undefined,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(
      name,
      formData[name as keyof typeof formData],
      name === "role" ? formData.role : undefined,
    );
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    try {
      const schema =
        formData.role === "provider" ? providerSchema : signupSchema;
      schema.parse(formData);
      setErrors({});
      setTouched({
        name: true,
        email: true,
        password: true,
        role: true,
        serviceType: true,
        hourlyRate: true,
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path as keyof FormErrors] = err.message;
        });
        setErrors(newErrors);
        setTouched({
          name: true,
          email: true,
          password: true,
          role: true,
          serviceType: true,
          hourlyRate: true,
        });
      }
      return false;
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    // 🔒 Safety check
    if (!location) {
      setErrors({
        general: "Location permission is required to sign up",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          serviceType:
            formData.role === "provider" ? formData.serviceType : undefined,
          hourlyRate:
            formData.role === "provider"
              ? Number(formData.hourlyRate)
              : undefined,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          general: data.message || "Signup failed. Please try again.",
        });
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "An error occurred",
      });
      setLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
          {/* Error message */}
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

          {/* Full Name field */}
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
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Email field */}
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
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Password field */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </motion.p>
            )}
          </motion.div>

          {/* Role Selection */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              I am a
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.role
                  ? "border-red-300 focus:ring-red-200 bg-red-50"
                  : "border-slate-200 focus:ring-blue-200 bg-slate-50"
              }`}
            >
              <option value="customer">Customer</option>
              <option value="provider">Service Provider</option>
            </select>
            {errors.role && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.role}
              </motion.p>
            )}
          </motion.div>

          {/* Provider Fields */}
          {formData.role === "provider" && (
            <>
              {/* Service Type */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
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
                    placeholder="e.g., Plumber, Tutor, Designer"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.serviceType
                        ? "border-red-300 focus:ring-red-200 bg-red-50"
                        : "border-slate-200 focus:ring-blue-200 bg-slate-50"
                    }`}
                  />
                </div>
                {errors.serviceType && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.serviceType}
                  </motion.p>
                )}
              </motion.div>

              {/* Hourly Rate */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-slate-700">
                  Hourly Rate
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="50"
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.hourlyRate
                        ? "border-red-300 focus:ring-red-200 bg-red-50"
                        : "border-slate-200 focus:ring-blue-200 bg-slate-50"
                    }`}
                  />
                </div>
                {errors.hourlyRate && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.hourlyRate}
                  </motion.p>
                )}
              </motion.div>
            </>
          )}

          {/* Submit button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || locationLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading || locationLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Create Account</span>
              </>
            )}
          </motion.button>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or</span>
            </div>
          </motion.div>

          {/* Social signup */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-3"
          >
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              <Github className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">GitHub</span>
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="px-8 py-6 bg-slate-50 border-t border-slate-100"
        >
          <p className="text-sm text-center text-slate-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign in
            </a>
          </p>
        </motion.div>
      </div>

      {/* Trust badge */}
      <motion.div
        variants={itemVariants}
        className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400"
      >
        <div className="flex items-center gap-1">
          <Lock className="w-4 h-4" />
          SSL Secure
        </div>
        <div className="w-px h-4 bg-slate-300"></div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4" />
          GDPR Compliant
        </div>
      </motion.div>
    </motion.form>
  );
}
