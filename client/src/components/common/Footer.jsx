import React from 'react';
import { Compass, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0A0000] border-t border-knw-border mt-16 relative overflow-hidden">
      {/* Subtle red glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-knw-red/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-knw-red flex items-center justify-center text-white shadow-red font-black text-sm">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-white font-black">Info</span>
                <span className="text-knw-red font-black">Nest</span>
              </span>
            </div>
            <p className="text-xs text-knw-muted leading-relaxed">
              The modern student productivity and career guidance platform. Transforming aspirations into structured roadmaps, curated resources, 1-on-1 industry mentorship, and measurable daily execution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-knw-muted">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Production MERN Stack
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-knw-red" /> 1-on-1 Verified Mentors
            </span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-knw-subtle gap-4">
          <p>© {new Date().getFullYear()} InfoNest. Built for ambitious students worldwide.</p>
          <p className="flex items-center gap-1 text-knw-muted">
            Engineered with <Heart className="w-3.5 h-3.5 text-knw-red fill-knw-red" /> in Netflix-Dark & Neon.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
