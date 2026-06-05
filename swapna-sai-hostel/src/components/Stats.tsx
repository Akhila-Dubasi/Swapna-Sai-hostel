"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "125+", label: "Beds" },
  { value: "4.8★", label: "Google rating" },
  { value: "24 hr", label: "Security" },
];

export function Stats() {
  return (
    <section className="py-12 border-y border-white/5 bg-[#0f0f0f]/50 backdrop-blur-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center py-4 md:py-0"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <span className="text-accent">{stat.value.replace(/[^0-9.]/g, '')}</span>
                {stat.value.replace(/[0-9.]/g, '')}
              </div>
              <div className="text-muted text-sm md:text-base uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
