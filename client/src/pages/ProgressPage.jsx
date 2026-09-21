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
  Calendar
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
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-soft">
        <BarChart2 className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Track Your Progress</h3>
        <p className="text-xs text-slate-500">
          Sign in or use 1-click Demo Login to track your goal completion percentage, study hours, and milestones.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
        >
          <span>Sign In / Demo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const metrics = progressData?.metrics || {
    overallPercentage: 0,
    totalTasks: 0,
    completedTasksCount: 0,
    pendingTasksCount: 0,
    overdueTasksCount: 0,
    totalHoursStudied: 0,
    streakDays: 0,
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
              Goal Tracking & Momentum
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{activeGoal?.title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Progress Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Direct, transparent insight answering: <em>"Where am I right now?"</em>, <em>"What have I completed?"</em>, and <em>"What should I tackle next?"</em>
          </p>
        </div>

        {/* Big Overall Goal Gauge */}
        <div className="flex items-center gap-4 bg-slate-900 text-white p-5 rounded-3xl shadow-soft">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-brand-400 transition-all duration-700 stroke-current"
                strokeDasharray={`${metrics.overallPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold">{metrics.overallPercentage}%</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Overall Goal Completion
            </span>
            <span className="text-sm font-bold text-brand-300">
              {metrics.completedTasksCount} / {metrics.totalTasks} Tasks Done
            </span>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Hours */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hours Focused</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{metrics.totalHoursStudied}h</h3>
            <span className="text-[11px] text-slate-500">Logged on study sessions</span>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consistency Streak</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{metrics.streakDays} Days</h3>
            <span className="text-[11px] text-slate-500">Consecutive active study</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Tasks</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{metrics.completedTasksCount}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">Mastered concepts</span>
          </div>
        </div>

        {/* Pending & Overdue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Remaining Agenda</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{metrics.pendingTasksCount}</h3>
            <span className="text-[11px] text-slate-500">Upcoming in timetable</span>
          </div>
        </div>

      </div>

      {/* Roadmap Stage Mastery Breakdown */}
      {progressData?.stagesProgress && progressData.stagesProgress.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Roadmap Stage Mastery Breakdown</h2>
              <p className="text-xs text-slate-500">
                Detailed completion across each stage of your active curriculum.
              </p>
            </div>
            <Link to="/roadmap" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              View Stages →
            </Link>
          </div>

          <div className="space-y-4">
            {progressData.stagesProgress.map((stage) => (
              <div key={stage.stageNumber} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Stage {stage.stageNumber}: {stage.title}
                  </span>
                  <span className="font-semibold text-slate-500">
                    {stage.completedTasks} / {stage.totalTasks} tasks ({stage.percent}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stage.percent === 100
                        ? 'bg-emerald-500'
                        : stage.percent > 0
                        ? 'bg-brand-500'
                        : 'bg-slate-200'
                    }`}
                    style={{ width: `${stage.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competency Milestones */}
      {progressData?.milestones && progressData.milestones.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Achievement Milestones</h2>
            <p className="text-xs text-slate-500">
              Meaningful milestones validating your study consistency and execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {progressData.milestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  m.achieved
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 opacity-60 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    m.achieved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  {m.achieved && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Achieved ✓
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold">{m.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
