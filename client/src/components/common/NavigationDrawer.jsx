import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NavigationDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Close drawer on Escape key and prevent background scroll when open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close drawer when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname, location.search]);

  const productFlowLinks = [
    { label: '1. Goal Selection & Feed', path: '/dashboard' },
    { label: '2. Roadmap & Career Path', path: '/roadmap' },
    { label: '3. Curated Resources Hub', path: '/resources' },
    { label: '4. Timetable Generator', path: '/timetable' },
    { label: '5. Task Management', path: '/tasks' },
    { label: '6. Progress Analytics', path: '/progress' },
  ];

  const communityMentorLinks = [
    { label: 'Find an Industry Mentor', path: '/goals' },
    { label: 'Book 1-on-1 Video Slots', path: '/goals' },
    { label: 'Milestones & Streaks', path: '/progress' },
    { label: 'Top Tech & FAANG Alumni', path: '/goals' },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
    >
      {/* ── Dark Semi-Transparent Backdrop Overlay ── */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Slide-in Navigation Drawer ── */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-10 w-[82vw] sm:w-76 md:w-80 max-w-[320px] h-full bg-[#080808] border-r border-white/10 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation drawer"
      >
        {/* Top Header & Navigation Links (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin">
          {/* Header with InfoNest Wordmark & Close Button */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <Link
              to={user?.role === 'teacher' ? '/teacher/dashboard' : '/dashboard'}
              onClick={onClose}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-knw-red flex items-center justify-center text-white font-black text-sm shadow-red group-hover:scale-105 transition-transform">
                I
              </div>
              <div className="leading-tight">
                <span className="text-lg font-black tracking-tight">
                  <span className="text-white">Info</span>
                  <span className="text-knw-red">Nest</span>
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-knw-muted hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Group 1: PRODUCT FLOW ── */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-knw-red animate-pulse" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-knw-red">
                PRODUCT FLOW
              </h3>
            </div>

            <nav className="space-y-1">
              {productFlowLinks.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'));

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 group text-[#D4AF37] hover:text-[#FFE788] hover:bg-[#D4AF37]/10 hover:translate-x-1 ${
                      isActive ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#FFE788] shadow-sm' : ''
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]/40 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ── Subtle Divider Between Groups ── */}
          <div className="my-5 border-t border-white/10" />

          {/* ── Group 2: COMMUNITY & MENTORS ── */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-knw-red animate-pulse" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-knw-red">
                COMMUNITY & MENTORS
              </h3>
            </div>

            <nav className="space-y-1">
              {communityMentorLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold text-[#D4AF37] hover:text-[#FFE788] hover:bg-[#D4AF37]/10 hover:translate-x-1 transition-all duration-200 group"
                >
                  <span className="truncate">{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]/40 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Bottom User Action Footer (for logged-in users) ── */}
        {user && (
          <div className="p-4 border-t border-white/10 bg-black/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-bold flex items-center justify-center text-xs uppercase shrink-0">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                  <p className="text-knw-muted text-[10px] truncate">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="p-2 rounded-xl text-knw-muted hover:text-knw-red hover:bg-knw-red/10 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default NavigationDrawer;
