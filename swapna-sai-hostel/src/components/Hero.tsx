"use client";

import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-6 block">
              SAFE · AFFORDABLE · HOMELY
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Your home away from <span className="text-accent relative inline-block">home<div className="absolute -bottom-2 left-0 w-full h-1 bg-accent/30 rounded-full" /></span> in Mangalpally
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted mb-10 max-w-2xl leading-relaxed"
          >
            Premium girls hostel in Mangalapally & Meals, WiFi, 24/7 security included.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/contact"
              className="group flex items-center justify-center gap-2 bg-white text-[#0f0f0f] px-8 py-4 rounded-full text-base font-semibold hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto"
            >
              Send enquiry
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="https://wa.me/number" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 bg-[#181818] text-white border border-white/10 px-8 py-4 rounded-full text-base font-medium hover:bg-[#222222] hover:border-white/20 transition-all duration-300 w-full sm:w-auto"
            >
              <MessageCircle size={18} className="text-green-500" />
              WhatsApp us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
