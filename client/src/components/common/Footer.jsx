import React from 'react';
import { Compass, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#0A0000] border-t border-knw-border mt-20 relative overflow-hidden">
      {/* Subtle red glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-knw-red/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-knw-red flex items-center justify-center text-white shadow-red">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-white font-black">KNW</span>
                <span className="text-knw-red font-black">share</span>
              </span>
            </div>
            <p className="text-xs text-knw-muted max-w-sm leading-relaxed">
              The modern student productivity and career guidance platform. Transforming aspirations into structured roadmaps, curated resources, 1-on-1 industry mentorship, and measurable daily execution.
            </p>
            <div className="flex items-center gap-4 text-xs text-knw-muted pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Production MERN Stack
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-knw-red" /> 1-on-1 Verified Mentors
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-knw-red" /> Product Flow
            </h4>
            <ul className="space-y-2 text-xs text-knw-muted">
              <li><Link to="/" className="hover:text-knw-red transition-colors">1. Goal Selection & Feed</Link></li>
              <li><Link to="/roadmap" className="hover:text-knw-red transition-colors">2. Roadmap & Career Path</Link></li>
              <li><Link to="/resources" className="hover:text-knw-red transition-colors">3. Curated Resources Hub</Link></li>
              <li><Link to="/timetable" className="hover:text-knw-red transition-colors">4. Timetable Generator</Link></li>
              <li><Link to="/tasks" className="hover:text-knw-red transition-colors">5. Task Management</Link></li>
              <li><Link to="/progress" className="hover:text-knw-red transition-colors">6. Progress Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-knw-red" /> Community & Mentors
            </h4>
            <ul className="space-y-2 text-xs text-knw-muted">
              <li><Link to="/roadmap" className="hover:text-knw-red transition-colors">Find an Industry Mentor</Link></li>
              <li><Link to="/roadmap" className="hover:text-knw-red transition-colors">Book 1-on-1 Video Slots</Link></li>
              <li><Link to="/progress" className="hover:text-knw-red transition-colors">Milestones & Streaks</Link></li>
              <li><span className="text-knw-subtle">Top Tech & FAANG Alumni</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-knw-subtle gap-4">
          <p>© {new Date().getFullYear()} KNWshare. Built for ambitious students worldwide.</p>
          <p className="flex items-center gap-1 text-knw-muted">
            Engineered with <Heart className="w-3.5 h-3.5 text-knw-red fill-knw-red" /> in Netflix-Dark & Neon.
          </p>
        </div>
      </div>
    </footer>
  );
};
