import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Coffee,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Layers,
  Code,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { TimetableGeneratorModal } from '../components/timetable/TimetableGeneratorModal';
import { Link } from 'react-router-dom';

export const TimetablePage = () => {
  const { activeGoal, activeUserGoal } = useGoal();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchTimetable = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/timetable/current', {
        params: {
          goalId: activeGoal?._id,
          goalSlug: activeGoal?.slug,
          userGoalId: activeUserGoal?._id
        }
      });
      setTimetable(res.data.data);
    } catch (err) {
      console.error('Error fetching timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [activeGoal, isAuthenticated]);

  const blocksForSelectedDay = timetable?.blocks?.filter(b => b.dayOfWeek === selectedDay) || [];

  const getBlockTypeStyle = (type) => {
    switch (type) {
      case 'study':
        return {
          badge: 'Study Block',
          bg: 'border-knw-red/40 bg-knw-red/10 text-knw-red',
          dot: 'bg-knw-red',
          icon: BookOpen
        };
      case 'practice':
        return {
          badge: 'Practice & Coding',
          bg: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
          dot: 'bg-emerald-500',
          icon: Code
        };
      case 'break':
        return {
          badge: 'Rest & Refresh',
          bg: 'border-yellow-500/40 bg-yellow-950/20 text-yellow-300',
          dot: 'bg-yellow-500',
          icon: Coffee
        };
      default:
        return {
          badge: 'Review Session',
          bg: 'border-white/10 bg-knw-surface text-knw-muted',
          dot: 'bg-knw-subtle',
          icon: Layers
        };
    }
  };

  if (!activeGoal) {
    return (
      <div className="knw-card rounded-3xl p-12 text-center max-w-md mx-auto space-y-5 my-12 border border-knw-border">
        <div className="w-16 h-16 rounded-3xl bg-knw-surface border border-knw-border flex items-center justify-center mx-auto">
          <CalendarIcon className="w-8 h-8 text-knw-red" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-knw-muted">0% Progress</div>
          <h2 className="text-2xl font-black text-white">Choose your goal to begin.</h2>
          <p className="text-xs text-knw-muted max-w-sm mx-auto">
            Select a target goal to customize your weekly hours, study slots, and balance your preparation agenda.
          </p>
        </div>
        <Link
          to="/goal-select"
          className="btn-red inline-flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-red"
        >
          <span>Select a Goal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Banner */}
      <div className="knw-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-knw-redBright to-knw-redDark shadow-red" />
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-knw-red/15 text-knw-red border border-knw-red/30 uppercase tracking-wider font-mono">
              Personalized Study Planner
            </span>
            <span className="text-xs text-knw-subtle">•</span>
            <span className="text-xs text-knw-muted font-semibold font-mono">{activeGoal?.title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Weekly Study Timetable
          </h1>
          <p className="text-xs sm:text-sm text-knw-muted leading-relaxed">
            A realistic schedule matching your daily hour capacity, complete with recovery breaks and synchronized tasks.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="btn-red flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold shadow-red"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate My Timetable</span>
          </button>

          <Link
            to="/tasks"
            className="btn-red-outline flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-bold font-mono"
          >
            <span>Task Board</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Days of Week Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono">
        {daysList.map((day) => {
          const count = timetable?.blocks?.filter(b => b.dayOfWeek === day).length || 0;
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-knw-red text-white shadow-red'
                  : 'bg-knw-surface text-knw-muted hover:text-white border border-white/5'
              }`}
            >
              <span>{day}</span>
              {count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-knw-subtle'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Timetable Blocks Grid */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-28 knw-skeleton rounded-3xl" />)}
        </div>
      ) : blocksForSelectedDay.length > 0 ? (
        <div className="space-y-4">
          {blocksForSelectedDay.map((block, idx) => {
            const style = getBlockTypeStyle(block.type);
            const IconComp = style.icon;

            return (
              <div
                key={idx}
                className={`p-5 rounded-3xl border transition-all knw-card ${style.bg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black/40 flex items-center justify-center shrink-0 border border-white/10">
                      <IconComp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
                          {style.badge}
                        </span>
                        {block.stageNumber && (
                          <span className="text-[10px] text-knw-muted font-mono">
                            Stage {block.stageNumber}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white">{block.title}</h3>
                      {block.description && (
                        <p className="text-xs text-knw-muted mt-0.5">{block.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-knw-red" />
                        <span>{block.startTime} - {block.endTime}</span>
                      </span>
                      <span className="text-[10px] text-knw-subtle block mt-0.5">
                        {block.durationMinutes} minutes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center knw-card rounded-3xl space-y-4">
          <CalendarIcon className="w-10 h-10 text-knw-red mx-auto" />
          <h3 className="text-base font-bold text-white">No Blocks Scheduled for {selectedDay}</h3>
          <p className="text-xs text-knw-muted max-w-sm mx-auto">
            Click "Generate My Timetable" to create an AI-balanced schedule tailored to your free study hours.
          </p>
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="btn-red px-6 py-2.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-red"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Schedule</span>
          </button>
        </div>
      )}

      {/* Timetable Generator Modal */}
      {isGeneratorOpen && (
        <TimetableGeneratorModal
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          onGenerated={() => {
            setIsGeneratorOpen(false);
            fetchTimetable();
          }}
          activeGoal={activeGoal}
        />
      )}
    </div>
  );
};
