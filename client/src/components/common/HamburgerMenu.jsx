import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LogOut, User, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HamburgerMenu = ({ isOpen, onClose, navLinks = [] }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Close on Escape key
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop / Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer from Left */}
      <aside
        className="mobile-drawer relative w-4/5 max-w-sm h-full bg-[#0D0D0D] border-r border-[#2A2A2A] p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200"
      >
        <div>
          {/* Header with Wordmark and Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-[#222222]">
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37] text-xl font-bold">❖</span>
              <span className="text-white text-lg font-bold">Info<span className="text-[#D4AF37]">Nest</span></span>
            </div>
            <button
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="py-4 border-b border-[#222222] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-bold flex items-center justify-center text-sm uppercase shrink-0">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                <p className="text-[#888888] text-xs truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Nav Items Stacked Vertically */}
          <nav className="mt-6 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const currentFull = location.pathname + location.search;
              const isActive =
                user?.role === 'teacher'
                  ? currentFull === link.path || (link.path.includes('tab=overview') && location.pathname === '/teacher/dashboard' && !location.search)
                  : link.path === '/dashboard' || link.path === '/'
                  ? location.pathname === '/dashboard' || location.pathname === '/'
                  : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className={`w-full min-h-[48px] px-4 rounded-xl text-[14px] font-medium flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold border border-[#D4AF37]/30'
                      : 'text-white hover:bg-white/5 hover:text-[#D4AF37]'
                  }`}
                >
                  {Icon && <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-[#888888]'}`} />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions in Drawer */}
        <div className="pt-4 border-t border-[#222222] space-y-2">
          {user?.role === 'teacher' ? (
            <Link
              to="/teacher/dashboard"
              onClick={onClose}
              className="w-full min-h-[44px] px-4 rounded-xl text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 flex items-center gap-2.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Teacher Workspace</span>
            </Link>
          ) : (
            <Link
              to="/profile"
              onClick={onClose}
              className="w-full min-h-[44px] px-4 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-colors"
            >
              <User className="w-4 h-4 text-[#888888]" />
              <span>Profile & Settings</span>
            </Link>
          )}

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full min-h-[44px] px-4 rounded-xl text-xs font-semibold text-[#E05252] hover:bg-[#E05252]/10 flex items-center gap-2.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default HamburgerMenu;
