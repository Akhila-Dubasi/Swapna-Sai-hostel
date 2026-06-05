"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { MapPin, Phone, Clock, MessageCircle, Send, Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  budget: z.string().min(1, "Please select a budget"),
  college: z.string().min(2, "College/Workplace is required"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/enquiries`, data);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => {
        setSubmitSuccess(false);
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit", error);
      alert("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">Get in touch</h1>
            <p className="text-muted mb-8">We usually reply within the hour. Send us your requirements and we'll help you find the perfect room.</p>
            
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 font-medium">
                Thank you! Your enquiry has been received. We will contact you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Your Name *</label>
                <input 
                  {...register("name")}
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2">Phone Number *</label>
                <input 
                  {...register("phone")}
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Monthly Budget *</label>
                  <select 
                    {...register("budget")}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="">Select budget</option>
                    <option value="5000-6000">₹5,000 - ₹6,000</option>
                    <option value="6000-7000">₹6,000 - ₹7,000</option>
                  </select>
                  {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">College / Workplace *</label>
                  <input 
                    {...register("college")}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="Where do you study/work?"
                  />
                  {errors.college && <p className="text-red-400 text-xs mt-1">{errors.college.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2">Any specific requirements? (Optional)</label>
                <textarea 
                  {...register("message")}
                  rows={4}
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell us if you need AC, specific sharing type, etc."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-70 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                {isSubmitting ? "Sending..." : "Send Enquiry"}
                {!isSubmitting && <Send size={18} />}
              </button>
            </form>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Map Embed */}
            <div className="w-full h-64 bg-[#181818] rounded-2xl border border-white/10 overflow-hidden relative group">
              <iframe 
                src="https://maps.google.com/maps?q=Swapna+Sai+Luxury+Girls+Hostel,+Mangalpally,+Telangana&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              />
              <a 
                href="https://share.google/d5dSxaInftQY2NHBy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute top-4 right-4 bg-[#0f0f0f]/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 hover:bg-accent hover:border-accent transition-colors"
              >
                Open App
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#181818] p-6 rounded-2xl border border-white/5">
                <MapPin className="text-accent mb-4" size={24} />
                <h3 className="font-semibold text-white mb-2">Location</h3>
                <p className="text-muted text-sm leading-relaxed">Swapna Sai Luxury Girls Hostel,<br />Near Main Road,<br />Mangalpally, Telangana 501510</p>
              </div>
              
              <div className="bg-[#181818] p-6 rounded-2xl border border-white/5">
                <Clock className="text-accent mb-4" size={24} />
                <h3 className="font-semibold text-white mb-2">Visiting Hours</h3>
                <p className="text-muted text-sm leading-relaxed">Mon - Sat: 9:00 AM - 6:00 PM<br />Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>

            <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Phone className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Direct Call</h3>
                <p className="text-xl font-bold text-accent">+91 9533013495</p>
                <p className="text-xl font-bold text-accent">+91 9949995849</p>
              </div>
            </div>

            <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Mail className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Email Us</h3>
                <a href="mailto:swapnasaigirlshostel@gmail.com" className="text-lg font-bold text-accent hover:underline break-all">swapnasaigirlshostel@gmail.com</a>
              </div>
            </div>

            <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20 flex items-start gap-4">
              <ShieldCheck className="text-accent mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-white mb-1">Women-Led Environment</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Owned and exclusively managed by <span className="text-white font-medium">Mrs. Swapna Reddy</span>, ensuring a completely secure, comfortable, and homely environment run by women, for women.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bottom WhatsApp */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-[#0f0f0f]/90 backdrop-blur-md border-t border-white/10 z-50 flex items-center justify-between sm:hidden">
        <span className="text-sm font-medium">Prefer WhatsApp?</span>
        <a 
          href="https://wa.me/+919533013495" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-bold"
        >
          <MessageCircle size={18} />
          Chat Now
        </a>
      </div>
    </main>
  );
}
