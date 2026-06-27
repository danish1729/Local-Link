"use client";

import { Award, FileText } from "lucide-react";

type ProviderCertificatesProps = {
  certificates?: any[];
};

export default function ProviderCertificates({ certificates }: ProviderCertificatesProps) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 mt-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Award className="w-5 h-5 text-slate-400" /> Certifications & Licenses
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert: any, idx: number) => {
          const fileUrl = typeof cert === "string" ? cert : cert?.fileUrl;
          const title = typeof cert === "string" ? `Certificate ${idx + 1}` : cert?.title || `Certificate ${idx + 1}`;
          const issuingOrganization = typeof cert === "string" ? "" : cert?.issuingOrganization;

          if (!fileUrl) return null;

          return (
            <a
              key={idx}
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-4 border border-slate-100 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition"
            >
              <div className="w-full h-40 bg-slate-100 rounded-lg overflow-hidden relative mb-4">
                {fileUrl.endsWith(".pdf") ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <FileText className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">PDF Document</span>
                  </div>
                ) : (
                  <img
                    src={fileUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 line-clamp-1">{title}</h3>
                {issuingOrganization && (
                  <p className="text-sm text-slate-500 mt-1">Issued by: {issuingOrganization}</p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
