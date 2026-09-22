import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Target,
  Map,
  BookOpen,
  Calendar,
  CheckSquare,
  BarChart2,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGoal } from '../../context/GoalContext';
import { useNotification } from '../../context/NotificationContext';

/* ─────────────────────────────────────────────
   KNWshare Netflix-dark Navbar
   Colours driven by tailwind.config.js:
     knw-bg       → #080808
     knw-surface  → #111111
     knw-red      → #E50914
     knw-border   → #1f1f1f
     knw-muted    → #6b7280
     knw-offWhite → #f5f5f5
   CSS helpers in index.css:
     .knw-glass-nav   – dark glass header
     .text-gradient-red – KNW gradient logo text
     .btn-red         – solid red CTA button
───────────────────────────────────────────── */

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { activeGoal, activeUserGoal, myGoals, switchActiveGoal } = useGoal();
  const { notifications, unreadCount, markAllAsRead } = useNotification();

  const [showGoalDropdown, setShowGoalDropdown]     = useState(false);
  const [showNotifications, setShowNotifications]   = useState(false);
  const [showUserDropdown, setShowUserDropdown]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]         = useState(false);

  const navLinks = [
    { name: 'Goals',            path: '/',         icon: Target      },
    { name: 'Roadmap & Career', path: '/roadmap',  icon: Map         },
    { name: 'Resources',        path: '/resources', icon: BookOpen   },
    { name: 'Timetable',        path: '/timetable', icon: Calendar   },
    { name: 'Tasks',            path: '/tasks',     icon: CheckSquare },
    { name: 'Progress',         path: '/progress',  icon: BarChart2  },
  ];

  const teacherLinks = [
    { name: 'Teacher Dashboard', path: '/teacher/dashboard', icon: Sparkles },
    { name: 'Curriculum & Roadmap', path: '/roadmap', icon: Map },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];

  const activeNavLinks = user?.role === 'teacher' ? teacherLinks : navLinks;

  const handleGoalSwitch = async (userGoalId) => {
    await switchActiveGoal(userGoalId);
    setShowGoalDropdown(false);
  };

  const closeAll = () => {
    setShowGoalDropdown(false);
    setShowNotifications(false);
    setShowUserDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="knw-glass-nav sticky top-0 z-40 border-b border-knw-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── LEFT: Logo + Active-Goal Badge ── */}
          <div className="flex items-center gap-5">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              {/* I icon */}
              <div className="w-9 h-9 rounded-lg bg-knw-red flex items-center justify-center shadow-lg shadow-knw-red/30 group-hover:shadow-knw-red/50 group-hover:scale-105 transition-all duration-200">
                <span className="text-white font-black text-base leading-none">I</span>
              </div>
              {/* Wordmark */}
              <div className="leading-tight">
                <span className="text-lg font-black tracking-tight">
                  <span className="text-white">Info</span>
                  <span className="text-knw-red">Nest</span>
                </span>
                <span className="block text-[9px] font-mono font-semibold uppercase tracking-[0.18em] text-knw-muted -mt-0.5">
                  GOAL → EXECUTION
                </span>
              </div>
            </Link>

            {/* Persistent Active Goal Badge (desktop) */}
            {activeGoal && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowGoalDropdown(!showGoalDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full
                             bg-white/5 border border-knw-border
                             text-knw-offWhite hover:border-knw-red/60
                             hover:bg-knw-red/10 transition-all duration-200
                             text-xs font-semibold"
                  title="Click to switch active goal"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-knw-muted font-normal">Active:</span>
                  <span className="max-w-[160px] truncate">{activeGoal.title}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-knw-red transition-transform duration-200 ${
                      showGoalDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Goal Switch Dropdown */}
                {showGoalDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowGoalDropdown(false)}
                    />
                    <div className="absolute left-0 mt-2 w-76 z-50
                                    bg-[#111] border border-knw-border
                                    rounded-xl shadow-2xl shadow-black/60
                                    animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-knw-border flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-knw-muted">
                          Your Goals
                        </span>
                        <Link
                          to="/"
                          onClick={closeAll}
                          className="text-[11px] font-semibold text-knw-red hover:text-red-400 transition-colors"
                        >
                          + New Goal
                        </Link>
                      </div>

                      <div className="max-h-60 overflow-y-auto py-1 divide-y divide-knw-border">
                        {myGoals && myGoals.length > 0 ? (
                          myGoals.map((ug) => (
                            <button
                              key={ug._id}
                              onClick={() => handleGoalSwitch(ug._id)}
                              className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                                activeUserGoal?._id === ug._id
                                  ? 'bg-knw-red/10 text-knw-red font-bold'
                                  : 'text-knw-offWhite/80 hover:bg-white/5'
                              }`}
                            >
                              <span className="truncate pr-2">{ug.goalId?.title || ug.customTitle}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-knw-muted font-medium shrink-0">
                                {ug.overallProgress || 0}%
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-4 text-xs text-knw-muted text-center">
                            Viewing preview mode. Select a goal on the home page to track progress!
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── MIDDLE: Desktop Nav Links ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {activeNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-knw-red'
                      : 'text-knw-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-knw-red' : ''}`} />
                  {link.name}
                  {/* Active underline dot */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-knw-red" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT: Bell + User / Auth ── */}
          <div className="flex items-center gap-2">

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    const opening = !showNotifications;
                    setShowNotifications(opening);
                    setShowUserDropdown(false);
                    if (opening && unreadCount > 0) markAllAsRead();
                  }}
                  className="relative p-2 rounded-lg text-knw-muted hover:text-white hover:bg-white/5 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-knw-red ring-2 ring-[#080808] animate-pulse" />
                  )}
                </button>

                {/* Notifications Panel */}
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50
                                    bg-[#111] border border-knw-border
                                    rounded-xl shadow-2xl shadow-black/60
                                    animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-knw-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-knw-muted">
                            Reminders & Alerts
                          </span>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-knw-red/20 text-knw-red">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] font-semibold text-knw-red hover:text-red-400 transition-colors"
                        >
                          Mark all read
                        </button>
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-knw-border">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div key={n._id} className="p-3 hover:bg-white/5 transition-colors">
                              <div className="text-xs font-semibold text-knw-offWhite flex items-center justify-between">
                                <span>{n.title}</span>
                                <span className="text-[10px] text-knw-muted font-normal shrink-0 ml-2">
                                  {new Date(n.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-[11px] text-knw-muted mt-0.5 leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-xs text-knw-muted">
                            All caught up! No unread notifications.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── User Profile OR Auth Buttons ── */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserDropdown(!showUserDropdown);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg
                             hover:bg-white/5 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-md bg-knw-red/20 border border-knw-red/40
                                  text-knw-red font-bold flex items-center justify-center text-xs uppercase">
                    {user?.name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <span className="text-xs font-semibold text-knw-offWhite hidden sm:inline max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-knw-muted transition-transform duration-200 ${
                      showUserDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-52 z-50
                                    bg-[#111] border border-knw-border
                                    rounded-xl shadow-2xl shadow-black/60
                                    animate-in fade-in zoom-in-95 duration-150">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-knw-border">
                        <p className="text-xs font-bold text-knw-offWhite truncate">{user?.name}</p>
                        <p className="text-[11px] text-knw-muted truncate mt-0.5">{user?.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold
                                         bg-knw-red/15 text-knw-red border border-knw-red/30 uppercase tracking-wide">
                          {user?.role}
                        </span>
                      </div>

                      <div className="py-1">
                        {user?.role === 'teacher' && (
                          <Link
                            to="/teacher/dashboard"
                            onClick={() => setShowUserDropdown(false)}
                            className="w-full text-left px-4 py-2 text-xs text-knw-red font-bold
                                       hover:bg-knw-red/10 flex items-center gap-2.5 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-knw-red" />
                            Teacher Workspace
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full text-left px-4 py-2 text-xs text-knw-offWhite/80
                                     hover:text-white hover:bg-white/5
                                     flex items-center gap-2.5 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-knw-muted" />
                          Profile & Settings
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-knw-red
                                     hover:bg-knw-red/10
                                     flex items-center gap-2.5 transition-colors
                                     border-t border-knw-border mt-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* ── Not authenticated: Demo / Sign In / Get Started ── */
              <div className="flex items-center gap-2">
                {/* 1-Click Demo */}
                <button
                  onClick={() => demoLogin()}
                  title="Instant demo student login with pre-populated goals"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                             border border-knw-red/60 text-knw-red text-xs font-bold
                             hover:bg-knw-red/10 hover:border-knw-red transition-all duration-200"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  1-Click Demo
                </button>

                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg border border-knw-border
                             text-xs font-semibold text-knw-muted
                             hover:text-white hover:border-white/20 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-knw-red
                             text-xs font-bold text-white
                             shadow-lg shadow-knw-red/25
                             hover:bg-red-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-knw-muted hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-knw-border space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">

            {/* Active goal pill in mobile */}
            {activeGoal && (
              <div className="px-3 py-2 mb-2 bg-knw-red/10 border border-knw-red/20 rounded-lg
                              flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate text-knw-offWhite">Active: {activeGoal.title}</span>
                </div>
                <span className="text-[10px] bg-knw-red/20 text-knw-red px-2 py-0.5 rounded-full shrink-0 ml-2">
                  {activeUserGoal?.overallProgress || 0}%
                </span>
              </div>
            )}

            {/* Nav links */}
            {activeNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-knw-red/10 text-knw-red border border-knw-red/20'
                      : 'text-knw-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-knw-red' : ''}`} />
                  {link.name}
                </Link>
              );
            })}

            {/* Demo login in mobile */}
            {!isAuthenticated && (
              <button
                onClick={() => {
                  demoLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg
                           border border-knw-red/60 text-knw-red text-xs font-bold
                           hover:bg-knw-red/10 transition-colors"
              >
                <Zap className="w-4 h-4 fill-current" />
                1-Click Instant Demo Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
