import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Video, ExternalLink, Target, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGoal } from '../context/GoalContext';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, logout, isAuthenticated, demoLogin } = useAuth();
  const { myGoals, activeGoal, switchActiveGoal } = useGoal();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/experts/my-bookings');
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="knw-card rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 my-12 border border-knw-red/30 shadow-red">
        <User className="w-12 h-12 text-knw-red mx-auto" />
        <h3 className="text-base font-bold text-white">Sign in to view your profile</h3>
        <p className="text-xs text-knw-muted">
          Manage your enrolled goals, session bookings, and daily settings.
        </p>
        <button
          onClick={() => demoLogin()}
          className="btn-red px-5 py-2.5 text-xs font-bold shadow-red"
        >
          1-Click Demo Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Profile Overview Card */}
      <div className="knw-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-knw-red text-white font-black text-2xl flex items-center justify-center shadow-red">
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{user?.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-knw-red/15 text-red-400 border border-knw-red/30 uppercase">
                {user?.role || 'Student'}
              </span>
            </div>
            <p className="text-xs text-knw-muted mt-0.5 font-mono">{user?.email}</p>
            {user?.bio && (
              <p className="text-xs text-gray-300 mt-2 max-w-md">{user.bio}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-800/60 text-red-400 hover:bg-red-950/40 text-xs font-bold transition-colors self-start sm:self-center font-mono"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrolled Goals List */}
        <div className="knw-card rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-knw-red" />
              <span>Enrolled Goals ({myGoals.length})</span>
            </h2>
            <Link to="/" className="text-xs font-bold text-knw-red hover:text-red-400 font-mono">
              + New Goal
            </Link>
          </div>

          <div className="space-y-3">
            {myGoals.map((ug) => {
              const isCurrent = activeGoal?._id === ug.goalId?._id;
              return (
                <div
                  key={ug._id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-knw-red/60 bg-knw-red/10 shadow-red'
                      : 'border-white/5 bg-knw-surface hover:border-white/20'
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-bold text-white">
                      {ug.goalId?.title || ug.customTitle}
                    </h3>
                    <p className="text-[11px] text-knw-muted mt-0.5 font-mono">
                      Target: ~{ug.hoursPerDay} hrs/day • Progress: <strong className="text-red-400">{ug.overallProgress || 0}%</strong>
                    </p>
                  </div>

                  {isCurrent ? (
                    <span className="px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-knw-red text-white shadow-red">
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => switchActiveGoal(ug._id)}
                      className="px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-knw-muted hover:text-white hover:border-knw-red/40"
                    >
                      Make Active
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mentorship Appointments */}
        <div className="knw-card rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-knw-red" />
              <span>Mentorship Guidance Bookings ({bookings.length})</span>
            </h2>
            <Link to="/roadmap" className="text-xs font-bold text-knw-red hover:text-red-400 font-mono">
              Book Expert →
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-4 rounded-2xl border border-white/10 bg-knw-surface space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      Session with {booking.expertId?.name || 'Industry Expert'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-700/50">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-[11px] text-knw-muted font-mono">
                    {booking.sessionDate} • {booking.timeSlot}
                  </p>
                  {booking.studentQuestion && (
                    <p className="text-[11px] text-gray-300 italic">
                      "{booking.studentQuestion}"
                    </p>
                  )}
                  <div className="pt-2 border-t border-white/5 flex justify-end">
                    <a
                      href={booking.meetingLink || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-knw-red hover:text-red-400 font-mono text-[11px]"
                    >
                      <span>Join Video Call</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-knw-muted font-mono">
                No active 1-on-1 mentorship bookings yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
