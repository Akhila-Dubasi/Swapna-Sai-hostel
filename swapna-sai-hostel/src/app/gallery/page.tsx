"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { X } from "lucide-react";
import axios from "axios";

// Mock data
const mockGallery = [
  { id: "1", category: "Rooms", image_url: "https://images.unsplash.com/photo-1522771731470-ea433733b514?q=80&w=2070&auto=format&fit=crop" },
  { id: "2", category: "Common areas", image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
  { id: "3", category: "Food", image_url: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop" },
  { id: "4", category: "Rooms", image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop" },
  { id: "5", category: "Common areas", image_url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop" },
  { id: "6", category: "Food", image_url: "https://images.unsplash.com/photo-1414235077428-338988a2e8c0?q=80&w=2070&auto=format&fit=crop" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [gallery, setGallery] = useState(mockGallery);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gallery`);
        if (response.data && response.data.length > 0) {
          setGallery(response.data);
        }
      } catch (error) {
        console.error("Failed to load gallery, using mock data.", error);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = filter === "All" ? gallery : gallery.filter((img) => img.category === filter);
  const categories = ["All", "Rooms", "Common areas", "Food"];

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our <span className="text-accent">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted max-w-2xl mx-auto"
          >
            Take a visual tour of our facilities, rooms, and lifestyle at Swapna Sai Luxury Girls Hostel.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat
                  ? "bg-accent text-white"
                  : "bg-[#181818] text-muted hover:text-white hover:bg-[#222222]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={img.id}
                onClick={() => setSelectedImg(img.image_url)}
                className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer bg-[#181818]"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${img.image_url})` }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">View Image</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white"
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImg}
              alt="Fullscreen preview"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
