"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Banknote,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Award,
  ShieldCheck,
  Phone,
  CreditCard,
  Plus,
  Trash2,
  UploadCloud
} from "lucide-react";
import ProfilePictureUploader from "./ProfilePictureUploader";

interface MultiStepSellerFormProps {
  initialData: {
    name: string;
    profileImage: string | null;
  };
}

export default function MultiStepSellerForm({ initialData }: MultiStepSellerFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Complex State
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    profileImage: initialData.profileImage || "",
    bio: "",
    serviceType: "",
    hourlyRate: "",
    phoneNumber: "",
    cnicNumber: "",
    cnicFrontImage: "",
    cnicBackImage: "",
  });

  const [education, setEducation] = useState([{ degree: "", institution: "", year: "" }]);
  const [workExperience, setWorkExperience] = useState([{ jobTitle: "", company: "", duration: "" }]);
  const [certificates, setCertificates] = useState<string[]>([]);
  
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleArrayChange = (index: number, field: string, value: string, type: "edu" | "exp") => {
    if (type === "edu") {
      const newEdu = [...education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      setEducation(newEdu);
    } else {
      const newExp = [...workExperience];
      newExp[index] = { ...newExp[index], [field]: value };
      setWorkExperience(newExp);
    }
  };

  const addArrayItem = (type: "edu" | "exp") => {
    if (type === "edu") setEducation([...education, { degree: "", institution: "", year: "" }]);
    else setWorkExperience([...workExperience, { jobTitle: "", company: "", duration: "" }]);
  };

  const removeArrayItem = (index: number, type: "edu" | "exp") => {
    if (type === "edu") setEducation(education.filter((_, i) => i !== index));
    else setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "cnicFront" | "cnicBack" | "certificate") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFiles(true);
    try {
      const formPayload = new FormData();
      formPayload.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formPayload });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);

      if (field === "cnicFront") setFormData(prev => ({ ...prev, cnicFrontImage: data.url }));
      if (field === "cnicBack") setFormData(prev => ({ ...prev, cnicBackImage: data.url }));
      if (field === "certificate") setCertificates(prev => [...prev, data.url]);
      
    } catch (err) {
      console.error(err);
      alert("File upload failed");
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.bio || formData.bio.length < 20) newErrors.bio = "Bio must be at least 20 characters";
    if (!formData.serviceType) newErrors.serviceType = "Service Type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.hourlyRate || isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = "Please enter a valid hourly rate";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!formData.cnicNumber) newErrors.cnicNumber = "CNIC Number is required";
    if (!formData.cnicFrontImage) newErrors.cnicFrontImage = "CNIC Front Image is required";
    if (!formData.cnicBackImage) newErrors.cnicBackImage = "CNIC Back Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    setLoading(true);
    setErrors({});

    try {
      const payload = {
        ...formData,
        education: education.filter(e => e.degree || e.institution),
        workExperience: workExperience.filter(w => w.jobTitle || w.company),
        certificates
      };

      const res = await fetch("/api/user/become-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit application");

      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "An error occurred",
      });
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted!</h2>
        <p className="text-slate-600 text-lg mb-8">
          Your comprehensive seller profile has been received and is under review. Updating your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
      {/* Header & Stepper */}
      <div className="bg-slate-50 border-b border-slate-100 px-8 py-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Build Your Seller Profile</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full -z-10 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {[
            { num: 1, title: "Personal Info" },
            { num: 2, title: "Pricing" },
            { num: 3, title: "Security" }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                step >= s.num ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-200 text-slate-500"
              }`}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-xs font-semibold ${step >= s.num ? "text-blue-700" : "text-slate-400"}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8">
        {errors.general && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 rounded-lg border border-red-200 text-sm text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p>{errors.general}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Pic */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <ProfilePictureUploader 
                    initialImage={formData.profileImage}
                    onUpload={(url) => setFormData(prev => ({ ...prev, profileImage: url }))}
                  />
                  <span className="text-xs text-slate-500 font-medium">Professional Photo</span>
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 bg-slate-50 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200'}`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Service Type *</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-slate-50 ${errors.serviceType ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200'}`}
                        placeholder="e.g., Plumber, Tutor, Web Developer"
                      />
                    </div>
                    {errors.serviceType && <p className="text-xs text-red-600">{errors.serviceType}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Professional Bio *</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 bg-slate-50 resize-none ${errors.bio ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200'}`}
                  placeholder="Share your experience, skills, and what makes you great to work with (min 20 chars)..."
                />
                {errors.bio && <p className="text-xs text-red-600">{errors.bio}</p>}
              </div>

              {/* Education */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-800">Education (Optional)</h3>
                </div>
                {education.map((edu, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-3 items-start">
                    <input
                      type="text"
                      placeholder="Degree / Certificate"
                      value={edu.degree}
                      onChange={(e) => handleArrayChange(index, "degree", e.target.value, "edu")}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleArrayChange(index, "institution", e.target.value, "edu")}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={edu.year}
                      onChange={(e) => handleArrayChange(index, "year", e.target.value, "edu")}
                      className="w-24 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                    {index > 0 && (
                      <button onClick={() => removeArrayItem(index, "edu")} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => addArrayItem("edu")} className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-700">
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>

              {/* Work Experience */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-800">Work Experience (Optional)</h3>
                </div>
                {workExperience.map((exp, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-3 items-start">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.jobTitle}
                      onChange={(e) => handleArrayChange(index, "jobTitle", e.target.value, "exp")}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleArrayChange(index, "company", e.target.value, "exp")}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 2020-2022)"
                      value={exp.duration}
                      onChange={(e) => handleArrayChange(index, "duration", e.target.value, "exp")}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                    {index > 0 && (
                      <button onClick={() => removeArrayItem(index, "exp")} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => addArrayItem("exp")} className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-700">
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>

              {/* Certificates */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-800">Certifications (Optional)</h3>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {certificates.map((cert, index) => (
                    <div key={index} className="relative group w-32 h-24 rounded-lg overflow-hidden border border-slate-200">
                      <img src={cert} alt="Certificate" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setCertificates(certificates.filter((_, i) => i !== index))}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  ))}
                  
                  <label className="w-32 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                    <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-medium text-slate-500">Upload</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "certificate")} disabled={isUploadingFiles} />
                  </label>
                </div>
              </div>

            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <Banknote className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800">Set Your Pricing</h3>
                <p className="text-slate-500">How much do you charge for your services?</p>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <label className="block text-sm font-semibold text-slate-700 text-center">Hourly Rate (Rs) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rs.</span>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 text-xl font-bold border rounded-xl text-center focus:ring-2 bg-slate-50 ${errors.hourlyRate ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200'}`}
                    placeholder="1000"
                  />
                </div>
                {errors.hourlyRate && <p className="text-xs text-red-600 text-center">{errors.hourlyRate}</p>}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800">Identity Verification</h3>
                <p className="text-slate-500">To maintain trust in our community, we need to verify your identity.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-slate-50 ${errors.phoneNumber ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200'}`}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">CNIC Number *</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="cnicNumber"
                      value={formData.cnicNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-slate-50 ${errors.cnicNumber ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200'}`}
                      placeholder="12345-1234567-1"
                    />
                  </div>
                  {errors.cnicNumber && <p className="text-xs text-red-600">{errors.cnicNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">CNIC Front Image *</label>
                  {formData.cnicFrontImage ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={formData.cnicFrontImage} alt="CNIC Front" className="w-full h-full object-cover" />
                      <button onClick={() => setFormData(prev => ({...prev, cnicFrontImage: ""}))} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Trash2 className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors ${errors.cnicFrontImage ? 'border-red-300' : 'border-slate-300'}`}>
                      {isUploadingFiles ? <Loader2 className="w-8 h-8 text-blue-500 animate-spin" /> : (
                        <>
                          <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                          <span className="text-sm text-slate-500 font-medium">Upload Front Image</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "cnicFront")} disabled={isUploadingFiles} />
                    </label>
                  )}
                  {errors.cnicFrontImage && <p className="text-xs text-red-600">{errors.cnicFrontImage}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">CNIC Back Image *</label>
                  {formData.cnicBackImage ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={formData.cnicBackImage} alt="CNIC Back" className="w-full h-full object-cover" />
                      <button onClick={() => setFormData(prev => ({...prev, cnicBackImage: ""}))} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Trash2 className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors ${errors.cnicBackImage ? 'border-red-300' : 'border-slate-300'}`}>
                      {isUploadingFiles ? <Loader2 className="w-8 h-8 text-blue-500 animate-spin" /> : (
                        <>
                          <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                          <span className="text-sm text-slate-500 font-medium">Upload Back Image</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "cnicBack")} disabled={isUploadingFiles} />
                    </label>
                  )}
                  {errors.cnicBackImage && <p className="text-xs text-red-600">{errors.cnicBackImage}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          ) : <div></div>}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-200 transition-colors flex items-center gap-2"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || isUploadingFiles}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold rounded-lg shadow-lg shadow-green-200 transition-colors flex items-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              ) : (
                <><CheckCircle2 className="w-5 h-5" /> Submit Application</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
