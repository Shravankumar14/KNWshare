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
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGoal } from '../../context/GoalContext';
import { useNotification } from '../../context/NotificationContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { activeGoal, activeUserGoal, myGoals, switchActiveGoal } = useGoal();
  const { notifications, unreadCount, markAllAsRead } = useNotification();

  const [showGoalDropdown, setShowGoalDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Goals', path: '/', icon: Target },
    { name: 'Roadmap & Career', path: '/roadmap', icon: Map },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Timetable', path: '/timetable', icon: Calendar },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Progress', path: '/progress', icon: BarChart2 },
    { name: '✦ The Nest', path: '/nest', icon: Sparkles, isNest: true },
  ];


  const handleGoalSwitch = async (userGoalId) => {
    await switchActiveGoal(userGoalId);
    setShowGoalDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-brand-600 bg-clip-text text-transparent">
                  KNWshare
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 -mt-1">
                  Goal → Execution
                </span>
              </div>
            </Link>

            {/* Persistent Active Goal Badge */}
            {activeGoal && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowGoalDropdown(!showGoalDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-900 hover:bg-brand-100/70 transition-colors text-xs font-semibold shadow-sm"
                  title="Click to switch or manage active goal"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-500 font-normal">Active:</span>
                  <span className="max-w-[170px] truncate font-medium">{activeGoal.title}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-600" />
                </button>

                {/* Switch Goal Dropdown */}
                {showGoalDropdown && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-soft-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Active Goals</span>
                      <Link
                        to="/"
                        onClick={() => setShowGoalDropdown(false)}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        + New Goal
                      </Link>
                    </div>

                    <div className="max-h-60 overflow-y-auto py-1">
                      {myGoals && myGoals.length > 0 ? (
                        myGoals.map((ug) => (
                          <button
                            key={ug._id}
                            onClick={() => handleGoalSwitch(ug._id)}
                            className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                              activeUserGoal?._id === ug._id
                                ? 'bg-brand-50 font-bold text-brand-900'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="truncate pr-2">{ug.goalId?.title || ug.customTitle}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                              {ug.overallProgress || 0}%
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-xs text-slate-500 text-center">
                          Viewing preview mode. Select a goal on the home page to track progress!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.isNest
                ? location.pathname.startsWith('/nest')
                : location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    link.isNest
                      ? isActive
                        ? 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm'
                        : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50 border border-transparent'
                      : isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.isNest ? 'text-purple-500' : isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications && unreadCount > 0) markAllAsRead();
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </button>

                {/* Notifications Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-soft-lg border border-slate-200 py-3 z-50">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Reminders & Alerts</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-100 text-brand-800">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div key={n._id} className="p-3 hover:bg-slate-50 transition-colors">
                            <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                              <span>{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-400">
                          All caught up! No unread notifications.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs border border-brand-200">
                    {user?.name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 hidden sm:inline">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-soft-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {user?.role?.toUpperCase()}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      Profile & Settings
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => demoLogin()}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-sm hover:brightness-105 transition-all"
                  title="Instant demo student login with pre-populated goals"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  1-Click Demo
                </button>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl bg-brand-600 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 space-y-1">
            {activeGoal && (
              <div className="px-3 py-2 bg-brand-50 rounded-xl mb-2 flex items-center justify-between text-xs text-brand-900 font-semibold">
                <span className="truncate">Active: {activeGoal.title}</span>
                <span className="text-[10px] bg-brand-200 px-2 py-0.5 rounded-full">
                  {activeUserGoal?.overallProgress || 0}%
                </span>
              </div>
            )}
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {link.name}
                </Link>
              );
            })}
            {!isAuthenticated && (
              <button
                onClick={() => {
                  demoLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold"
              >
                <Zap className="w-4 h-4" /> 1-Click Instant Demo Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
