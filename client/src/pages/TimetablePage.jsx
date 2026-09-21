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
      const res = await api.get('/timetable/current');
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
          bg: 'bg-blue-50/70 border-blue-200 text-blue-900',
          dot: 'bg-blue-600',
          icon: BookOpen
        };
      case 'practice':
        return {
          badge: 'Practice & Coding',
          bg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
          dot: 'bg-emerald-600',
          icon: Code
        };
      case 'break':
        return {
          badge: 'Rest & Refresh',
          bg: 'bg-amber-50/70 border-amber-200 text-amber-900',
          dot: 'bg-amber-500',
          icon: Coffee
        };
      default:
        return {
          badge: 'Review Session',
          bg: 'bg-slate-50 border-slate-200 text-slate-900',
          dot: 'bg-slate-600',
          icon: Layers
        };
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
              Personalized Planner
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{activeGoal?.title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Weekly Study Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            A realistic schedule matching your daily hour capacity, complete with recovery breaks and synchronized tasks.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate My Timetable</span>
          </button>

          <Link
            to="/tasks"
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors"
          >
            <span>Task Board</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Days of Week Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {daysList.map((day) => {
          const count = timetable?.blocks?.filter(b => b.dayOfWeek === day).length || 0;
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[100px] p-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold">{day}</div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                {count > 0 ? `${count} slots` : 'Rest Day'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Daily Schedule Blocks View */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-28 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : blocksForSelectedDay.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
            <span>Schedule for {selectedDay}</span>
            <span>{blocksForSelectedDay.length} Scheduled Blocks</span>
          </div>

          <div className="space-y-3">
            {blocksForSelectedDay.map((block, idx) => {
              const style = getBlockTypeStyle(block.blockType);
              const IconComp = style.icon;

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${style.bg}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/60 flex items-center justify-center shrink-0">
                      <IconComp className="w-6 h-6 text-slate-700" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          {style.badge}
                        </span>
                        {block.stageNumber && (
                          <span className="text-[10px] bg-white/80 border border-slate-200/80 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                            Stage {block.stageNumber}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {block.title}
                      </h3>
                      {block.topicTitle && (
                        <p className="text-xs text-slate-600 mt-0.5">
                          Topic: <strong className="font-semibold">{block.topicTitle}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Slot Time & Duration */}
                  <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0 border-t sm:border-t-0 border-slate-200/50 pt-3 sm:pt-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{block.startTime} – {block.endTime}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {block.durationMinutes} mins duration
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-soft">
          <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No study blocks for {selectedDay}</h3>
          <p className="text-xs text-slate-500">
            {timetable ? 'This is marked as a rest day or review day in your current timetable.' : 'You have not generated a timetable yet. Click the button below to build your weekly schedule.'}
          </p>
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Generate My Timetable
          </button>
        </div>
      )}

      {/* Generator Wizard Sub-Page / Modal */}
      <TimetableGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerated={(newTimetable) => setTimetable(newTimetable)}
      />

    </div>
  );
};
