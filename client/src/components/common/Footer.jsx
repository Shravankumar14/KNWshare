import React from 'react';
import { Compass, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">KNWshare</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              The modern student productivity and career guidance platform. Transforming aspirations into structured roadmaps, curated resources, intelligent timetables, and measurable daily execution.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Production MERN Stack
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI-Ready Extensible Core
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Product Flow</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/" className="hover:text-brand-600">1. Goal Selection</Link></li>
              <li><Link to="/roadmap" className="hover:text-brand-600">2. Roadmap & Career Path</Link></li>
              <li><Link to="/resources" className="hover:text-brand-600">3. Curated Resources Hub</Link></li>
              <li><Link to="/timetable" className="hover:text-brand-600">4. Timetable Generator</Link></li>
              <li><Link to="/tasks" className="hover:text-brand-600">5. Task Management</Link></li>
              <li><Link to="/progress" className="hover:text-brand-600">6. Progress Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Community & Guidance</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/roadmap" className="hover:text-brand-600">Find an Expert Mentor</Link></li>
              <li><Link to="/roadmap" className="hover:text-brand-600">Book 1-on-1 Guidance</Link></li>
              <li><Link to="/progress" className="hover:text-brand-600">Milestones & Streaks</Link></li>
              <li><span className="text-slate-400">Open Source & Community</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} KNWshare. Built for ambitious students worldwide.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> on the MERN Stack.
          </p>
        </div>
      </div>
    </footer>
  );
};
