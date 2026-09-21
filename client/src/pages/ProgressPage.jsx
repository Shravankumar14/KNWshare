import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  Award,
  Layers,
  ArrowRight,
  Compass,
  Calendar,
  Zap
} from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

export const ProgressPage = () => {
  const { activeGoal, activeUserGoal } = useGoal();
  const { isAuthenticated } = useAuth();

  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/progress/summary');
      setProgressData(res.data.data);
    } catch (err) {
      console.error('Failed to load progress metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [activeGoal, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="knw-card rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 my-12">
        <BarChart2 className="w-12 h-12 text-knw-red mx-auto" />
        <h3 className="text-base font-bold text-white">Track Your Progress</h3>
        <p className="text-xs text-knw-muted">
          Sign in or use 1-click Demo Login to track your goal completion percentage, study hours, and milestones.
        </p>
        <Link
          to="/login"
          className="btn-red inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold shadow-red"
        >
          <span>Sign In / Demo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const metrics = progressData?.metrics || {
    overallPercentage: activeUserGoal?.overallProgress || 0,
    totalTasks: 24,
    completedTasksCount: 6,
    pendingTasksCount: 18,
    overdueTasksCount: 0,
    totalHoursStudied: 14,
    streakDays: 4,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Banner */}
      <div className="knw-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-knw-red/15 text-red-400 border border-knw-red/30 uppercase tracking-wider font-mono">
              Goal Tracking & Momentum
            </span>
            <span className="text-xs text-knw-subtle">•</span>
            <span className="text-xs text-knw-muted font-semibold font-mono">{activeGoal?.title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Your Progress Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-knw-muted leading-relaxed">
            Direct, transparent insight answering: <em>"Where am I right now?"</em>, <em>"What have I completed?"</em>, and <em>"What should I tackle next?"</em>
          </p>
        </div>

        {/* Big Overall Goal Gauge */}
        <div className="flex items-center gap-5 bg-knw-surface border border-white/10 p-5 rounded-3xl shadow-red">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-knw-red transition-all duration-700 stroke-current"
                strokeDasharray={`${metrics.overallPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white font-mono">{metrics.overallPercentage}%</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-knw-muted block tracking-wider">
              Overall Goal Completion
            </span>
            <span className="text-sm font-bold text-red-300 font-mono">
              {metrics.completedTasksCount} / {metrics.totalTasks} Tasks Done
            </span>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Hours */}
        <div className="knw-card p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-knw-red/15 border border-knw-red/30 text-knw-red flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-knw-muted uppercase tracking-wider">Hours Focused</span>
            <h3 className="text-2xl font-black text-white mt-0.5 font-mono">{metrics.totalHoursStudied}h</h3>
            <span className="text-[11px] text-knw-subtle">Logged on study sessions</span>
          </div>
        </div>

        {/* Current Streak */}
        <div className="knw-card p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6 fill-current animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-knw-muted uppercase tracking-wider">Consistency Streak</span>
            <h3 className="text-2xl font-black text-yellow-400 mt-0.5 font-mono">{metrics.streakDays} Days</h3>
            <span className="text-[11px] text-knw-subtle">Consecutive active study</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="knw-card p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-knw-muted uppercase tracking-wider">Completed Tasks</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-0.5 font-mono">{metrics.completedTasksCount}</h3>
            <span className="text-[11px] text-emerald-500 font-semibold">Mastered concepts</span>
          </div>
        </div>

        {/* Pending & Overdue */}
        <div className="knw-card p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-400 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-knw-muted uppercase tracking-wider">Remaining Agenda</span>
            <h3 className="text-2xl font-black text-white mt-0.5 font-mono">{metrics.pendingTasksCount}</h3>
            <span className="text-[11px] text-knw-subtle">Upcoming in timetable</span>
          </div>
        </div>
      </div>

      {/* Progress Next Step CTA */}
      <div className="knw-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-knw-red/20">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Ready for your next learning milestone?</h3>
          <p className="text-xs text-knw-muted">Jump straight into your interactive roadmap stages or book a 1-on-1 advisor slot.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/roadmap" className="btn-red px-5 py-2.5 text-xs font-bold shadow-red flex items-center gap-1.5">
            <span>Open Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/timetable" className="btn-red-outline px-4 py-2.5 text-xs font-bold font-mono">
            <span>View Timetable</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
