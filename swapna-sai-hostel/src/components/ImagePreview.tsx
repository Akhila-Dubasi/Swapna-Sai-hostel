"use client";

import { motion } from "framer-motion";

const previews = [
  {
    title: "Room photo",
    image: "https://images.unsplash.com/photo-1522771731470-ea433733b514?q=80&w=2070&auto=format&fit=crop", // Placeholder
  },
  {
    title: "Dining",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop", // Placeholder
  },
  {
    title: "Study area",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop", // Placeholder
  },
];

export function ImagePreview() {
  return (
    <section className="py-24 relative z-20" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience the <span className="text-accent">comfort</span></h2>
          <p className="text-muted max-w-2xl mx-auto">Take a glimpse into our modern facilities designed specifically for your comfort and security.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previews.map((preview, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${preview.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                  {preview.title}
                </h3>
                <div className="h-1 w-12 bg-accent rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
