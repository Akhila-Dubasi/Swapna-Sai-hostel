"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Check } from "lucide-react";
import Link from "next/link";
import axios from "axios";

// Mock data as fallback
const mockRooms = [
  {
    id: "1",
    title: "Premium Single Room",
    price: "₹8,000",
    sharing_type: "1 sharing",
    facilities: ["Attached Washroom", "AC", "Study Table", "Locker"],
    image_url: "https://images.unsplash.com/photo-1522771731470-ea433733b514?q=80&w=2070&auto=format&fit=crop",
    available: true
  },
  {
    id: "2",
    title: "Standard Twin Sharing",
    price: "₹5,500",
    sharing_type: "2 sharing",
    facilities: ["Common Washroom", "Cooler", "Study Table", "Locker"],
    image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop",
    available: true
  },
  {
    id: "3",
    title: "Budget 3-Sharing",
    price: "₹4,000",
    sharing_type: "3 sharing",
    facilities: ["Common Washroom", "Fan", "Locker"],
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
    available: false
  }
];

export default function RoomsPage() {
  const [filter, setFilter] = useState("All");
  const [rooms, setRooms] = useState(mockRooms);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms`);
        if (response.data && response.data.length > 0) {
          setRooms(response.data);
        }
      } catch (error) {
        console.error("Failed to load rooms, using mock data.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = filter === "All" ? rooms : rooms.filter((r) => r.sharing_type === filter);
  const sharingTypes = ["All", ...Array.from(new Set(rooms.map(r => r.sharing_type)))];

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
            Find your perfect <span className="text-accent">room</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted max-w-2xl mx-auto"
          >
            Comfortable, secure, and thoughtfully designed living spaces for students and working professionals.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {sharingTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === type
                  ? "bg-accent text-white"
                  : "bg-[#181818] text-muted hover:text-white hover:bg-[#222222]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#181818] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors flex flex-col h-full"
            >
              <div 
                className="h-64 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${room.image_url})` }}
              >
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${room.available ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {room.available ? 'Available' : 'Full'}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{room.title}</h3>
                    <p className="text-muted text-sm">{room.sharing_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-accent">{room.price}</p>
                    <p className="text-xs text-muted">/ month</p>
                  </div>
                </div>

                <div className="mb-8 flex-grow">
                  <ul className="space-y-2">
                    {room.facilities.map((facility: string, i: number) => (
                      <li key={i} className="flex items-center text-sm text-muted">
                        <Check size={16} className="text-accent mr-2" />
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="block w-full text-center bg-white text-[#0f0f0f] py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Enquire this room
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
