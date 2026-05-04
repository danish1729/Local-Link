"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface MessageButtonProps {
  userId: string;
  className?: string;
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  iconOnly?: boolean;
}

export default function MessageButton({ 
  userId, 
  className = "", 
  label = "Message",
  variant = "primary",
  iconOnly = false
}: MessageButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow",
    secondary: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    outline: "border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    ghost: "text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
  };

  const sizing = iconOnly ? "p-2" : "px-4 py-2 text-sm";

  return (
    <Link 
      href={`/messages?userId=${userId}`}
      className={`${baseStyles} ${variants[variant]} ${sizing} ${className}`}
    >
      <MessageSquare className={iconOnly ? "w-5 h-5" : "w-4 h-4"} />
      {!iconOnly && <span>{label}</span>}
    </Link>
  );
}
