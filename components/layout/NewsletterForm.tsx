"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 text-emerald-400 font-semibold">
        <CheckCircle2 className="w-5 h-5" />
        <span>You&apos;re subscribed! Thanks.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch gap-0 w-full md:w-auto max-w-md">
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full pl-10 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-l-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
        />
      </div>
      <button
        type="submit"
        className="flex items-center gap-2 px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-r-xl text-sm transition-colors shrink-0"
      >
        Subscribe <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
