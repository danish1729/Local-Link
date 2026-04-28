"use client";

import { useState, useRef } from "react";
import { Camera, Trash2, Loader2, User } from "lucide-react";

interface ProfilePictureUploaderProps {
  initialImage?: string | null;
  onUpload: (url: string) => void;
}

export default function ProfilePictureUploader({
  initialImage,
  onUpload,
}: ProfilePictureUploaderProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setImage(data.url);
      onUpload(data.url);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    setImage(null);
    onUpload("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center">
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        ) : image ? (
          <img src={image} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="w-16 h-16 text-slate-400" />
        )}

        {/* Hover Overlay */}
        {!isUploading && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
              title="Change Picture"
            >
              <Camera className="w-5 h-5" />
            </button>
            {image && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                title="Remove Picture"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
