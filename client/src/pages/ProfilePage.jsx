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
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-soft">
        <User className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Sign in to view your profile</h3>
        <p className="text-xs text-slate-500">
          Manage your enrolled goals, session bookings, and daily settings.
        </p>
        <button
          onClick={() => demoLogin()}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          1-Click Demo Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-brand-500/20">
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            {user?.bio && (
              <p className="text-xs text-slate-600 mt-2 max-w-md">{user.bio}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Enrolled Goals List */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-600" />
              <span>Enrolled Goals ({myGoals.length})</span>
            </h2>
            <Link to="/" className="text-xs font-bold text-brand-600 hover:text-brand-700">
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
                      ? 'border-brand-500 bg-brand-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {ug.goalId?.title || ug.customTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Target: ~{ug.hoursPerDay} hrs/day • Progress: <strong>{ug.overallProgress || 0}%</strong>
                    </p>
                  </div>

                  {isCurrent ? (
                    <span className="px-3 py-1 rounded-xl text-[10px] font-bold bg-brand-600 text-white shadow-xs">
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => switchActiveGoal(ug._id)}
                      className="px-3 py-1 rounded-xl text-[10px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
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
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-600" />
              <span>Mentorship Guidance Bookings ({bookings.length})</span>
            </h2>
            <Link to="/roadmap" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              Book Expert →
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Session with {booking.expertId?.name || 'Expert'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {booking.sessionDate} • {booking.timeSlot}
                  </p>
                  {booking.studentQuestion && (
                    <p className="text-[11px] text-slate-600 italic">
                      "{booking.studentQuestion}"
                    </p>
                  )}
                  <div className="pt-2 border-t border-slate-200/60 flex justify-end">
                    <a
                      href={booking.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-800"
                    >
                      <span>Join Video Call</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No active 1-on-1 mentorship bookings yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
