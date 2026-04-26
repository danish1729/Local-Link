"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Play } from "lucide-react";
import { useState } from "react";

interface GalleryItem {
  id: string;
  type: "image" | "video";
  title: string;
  thumbnail: string;
  date: string;
}

interface ProviderGalleryProps {
  providerId: string;
}

export default function ProviderGallery({ providerId }: ProviderGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Mock gallery items - replace with actual API call
  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      type: "image",
      title: "Modern Bathroom Installation",
      thumbnail:
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=400&fit=crop",
      date: "2024-02-05",
    },
    {
      id: "2",
      type: "image",
      title: "Plumbing Repair Work",
      thumbnail:
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=400&fit=crop",
      date: "2024-02-01",
    },
    {
      id: "3",
      type: "image",
      title: "Kitchen Plumbing Update",
      thumbnail:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop",
      date: "2024-01-28",
    },
    {
      id: "4",
      type: "video",
      title: "Installation Process Time-lapse",
      thumbnail:
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=400&fit=crop",
      date: "2024-01-25",
    },
    {
      id: "5",
      type: "image",
      title: "Emergency Repair Job",
      thumbnail:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
      date: "2024-01-20",
    },
    {
      id: "6",
      type: "image",
      title: "Pipeline Maintenance",
      thumbnail:
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=400&fit=crop",
      date: "2024-01-15",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Portfolio</h2>
        <p className="text-slate-600">
          View completed projects and work samples
        </p>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {galleryItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedItem(item)}
            className="group cursor-pointer relative overflow-hidden rounded-xl aspect-square"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
              style={{
                backgroundImage: `url(${item.thumbnail})`,
              }}
            ></div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <p className="text-white font-bold text-sm">{item.title}</p>
              <p className="text-white/70 text-xs">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>

            {/* Type Badge */}
            <div className="absolute top-3 right-3 bg-blue-600 rounded-lg p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {item.type === "video" ? (
                <Play className="w-4 h-4 fill-white" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </div>

            {/* Video Indicator */}
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3">
                  <Play className="w-6 h-6 text-blue-600 fill-blue-600" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* View All Button */}
      <motion.button
        variants={itemVariants}
        className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition font-semibold"
      >
        View All {galleryItems.length} Items
      </motion.button>

      {/* Selected Item Modal */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden"
          >
            <div className="relative aspect-video bg-black overflow-hidden">
              <img
                src={selectedItem.thumbnail}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              {selectedItem.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-20 h-20 text-white fill-white" />
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {selectedItem.title}
              </h3>
              <p className="text-slate-600">
                {new Date(selectedItem.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
