import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { ImagePreview } from "@/components/ImagePreview";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] selection:bg-accent/30 selection:text-white">
      <Navbar />
      <Hero />
      <Stats />
      <ImagePreview />
      
      {/* Footer / Extra Enquire Section */}
      <footer className="py-12 border-t border-white/5 mt-12 bg-[#0f0f0f]" id="enquire">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to move in?</h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Contact us today to schedule a visit or reserve your bed. We have limited availability for the upcoming semester.
          </p>
          <a
            href="https://wa.me/+919533013495"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]"
          >
            Contact via WhatsApp
          </a>
          <p className="mt-12 text-sm text-muted/60">
            &copy; {new Date().getFullYear()} Swapna Sai Luxury Girls Hostel. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
