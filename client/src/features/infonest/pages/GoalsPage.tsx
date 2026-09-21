import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import {
  Target,
  Flame,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  Plus,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { goals, logStudyHours, currentUser, showToast } = useApp();
  const primaryGoal = goals[0];

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalHours, setNewGoalHours] = useState(10);
  const [newGoalDate, setNewGoalDate] = useState('December 2026');

  const progressPercent = primaryGoal
    ? Math.min(100, Math.round((primaryGoal.loggedHoursThisWeek / primaryGoal.targetHoursPerWeek) * 100))
    : 75;

  // Calendar days mock for heatmap
  const days = Array.from({ length: 28 }, (_, i) => {
    const activeLevel = (i % 4 === 0 || i % 7 === 2) ? 3 : (i % 3 === 0) ? 2 : (i % 5 === 0) ? 1 : 0;
    return { day: i + 1, level: activeLevel };
  });

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-8">
        {/* Header Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Target className="w-3.5 h-3.5" />
              <span>Personal Learning Rhythm & Velocity</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Goals & Progress
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Maintain consistent velocity. Track weekly study hours, celebrate milestone completions, and earn Knowledge Tokens for your deep work.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <Flame className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                  Active Streak
                </span>
                <h3 className="text-2xl font-black text-white font-mono">{currentUser.streakDays} Days</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Top KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Weekly Study Pace', value: `${primaryGoal?.loggedHoursThisWeek || 9.5}h / ${primaryGoal?.targetHoursPerWeek || 12}h`, icon: Clock, color: 'purple' },
            { label: 'Knowledge Tokens', value: `${currentUser.knowledgeTokens.toLocaleString()} KT`, icon: Award, color: 'gold' },
            { label: 'Courses Enrolled', value: `${currentUser.enrolledCoursesCount} Courses`, icon: Target, color: 'cyan' },
            { label: 'Completed Milestones', value: `${primaryGoal?.completedTasks || 8} / ${primaryGoal?.totalTasks || 15}`, icon: CheckCircle2, color: 'emerald' }
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{kpi.label}</span>
                  <div className="p-2 rounded-xl bg-white/5 text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white font-mono">{kpi.value}</h3>
              </div>
            );
          })}
        </div>

        {/* Circular Goal Gauge & Quick Logging Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Circular Progress Gauge */}
          <div className="lg:col-span-1 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Weekly Target Completion
            </h3>

            <div className="relative w-48 h-48 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-purple-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black font-mono text-white">{progressPercent}%</span>
                <span className="text-[11px] font-mono text-purple-300">of weekly target</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              {primaryGoal?.roadmapTitle}
            </p>
          </div>

          {/* Right 2 Cols: Quick Study Session Logger & Heatmap */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Log Buttons */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 bg-gradient-to-r from-purple-950/30 to-indigo-950/20">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold block">
                  Log Study Time Today
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Record your dedicated study session to advance your goal pace and earn Knowledge Tokens.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[0.5, 1, 2, 3].map((hrs) => (
                  <button
                    key={hrs}
                    onClick={() => {
                      if (primaryGoal) logStudyHours(primaryGoal.id, hrs);
                    }}
                    className="py-3 bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 rounded-2xl text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-purple-400" />
                    <span>+{hrs} hr session</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4-Week Study Heatmap */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>28-Day Study Activity Heatmap</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-400">14-Day Streak Active</span>
              </div>

              <div className="grid grid-cols-7 gap-2 pt-2">
                {days.map((item) => (
                  <div
                    key={item.day}
                    title={`Day ${item.day}: ${item.level > 0 ? `${item.level * 1.5}h studied` : 'Rest day'}`}
                    className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      item.level === 3
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : item.level === 2
                        ? 'bg-purple-800/80 text-purple-200'
                        : item.level === 1
                        ? 'bg-purple-950/60 text-purple-400 border border-purple-500/20'
                        : 'bg-white/5 text-slate-600'
                    }`}
                  >
                    {item.day}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-slate-500 pt-2">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded bg-white/5" />
                <span className="w-2.5 h-2.5 rounded bg-purple-950" />
                <span className="w-2.5 h-2.5 rounded bg-purple-800" />
                <span className="w-2.5 h-2.5 rounded bg-purple-600" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
