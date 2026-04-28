"use client";

import { Briefcase, GraduationCap, MapPin, BadgeCheck, FileText } from "lucide-react";

type ProviderInfoProps = {
  provider: any;
};

export default function ProviderInfo({ provider }: ProviderInfoProps) {
  return (
    <div className="space-y-8 bg-white p-8 rounded-xl border border-slate-200">
      
      {/* About Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          About Me
        </h2>
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
          {provider.bio ? (
            <p className="whitespace-pre-wrap">{provider.bio}</p>
          ) : (
            <p className="italic text-slate-500">This provider hasn't written a bio yet. Feel free to contact them directly to ask about their expertise.</p>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-slate-100 my-6"></div>

      {/* Experience Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-slate-400" /> Work Experience
        </h2>
        
        {provider.workExperience && provider.workExperience.length > 0 ? (
          <div className="space-y-6">
            {provider.workExperience.map((exp: any, idx: number) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{exp.title}</h3>
                  <div className="text-slate-600 font-medium text-sm mb-1">{exp.company}</div>
                  <div className="text-slate-400 text-xs mb-2">
                    {exp.startDate} – {exp.endDate || "Present"}
                  </div>
                  {exp.description && (
                    <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic text-sm">No work experience listed.</p>
        )}
      </div>

      <div className="w-full h-px bg-slate-100 my-6"></div>

      {/* Education Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-slate-400" /> Education
        </h2>
        
        {provider.education && provider.education.length > 0 ? (
          <div className="space-y-6">
            {provider.education.map((edu: any, idx: number) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{edu.institution}</h3>
                  <div className="text-slate-600 font-medium text-sm mb-1">{edu.degree}</div>
                  <div className="text-slate-400 text-xs">
                    Graduated: {edu.yearOfGraduation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic text-sm">No education history listed.</p>
        )}
      </div>

    </div>
  );
}
