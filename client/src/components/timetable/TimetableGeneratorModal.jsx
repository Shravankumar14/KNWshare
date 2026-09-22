import React, { useState } from 'react';
import { X, Calendar, Clock, Coffee, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useGoal } from '../../context/GoalContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';

export const TimetableGeneratorModal = ({ isOpen, onClose, onGenerated }) => {
  const { activeGoal, activeUserGoal } = useGoal();
  const { isAuthenticated, demoLogin } = useAuth();
  const { addToast } = useNotification();

  const [availableDays, setAvailableDays] = useState([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ]);
  const [dailyHours, setDailyHours] = useState(activeUserGoal?.hoursPerDay || 2);
  const [preferredSlot, setPreferredSlot] = useState('morning');
  const [includeBreaks, setIncludeBreaks] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day) => {
    if (availableDays.includes(day)) {
      if (availableDays.length === 1) return; // Must have at least 1 day
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const slots = [
    { id: 'morning', label: 'Morning', time: '09:00 AM – 12:00 PM', desc: 'High focus & retention' },
    { id: 'afternoon', label: 'Afternoon', time: '02:00 PM – 05:00 PM', desc: 'Post-lunch study block' },
    { id: 'evening', label: 'Evening', time: '06:00 PM – 09:00 PM', desc: 'After college/work block' },
    { id: 'night', label: 'Night', time: '09:00 PM – 12:00 AM', desc: 'Late night quiet focus' },
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isAuthenticated) {
        await demoLogin();
      }

      const res = await api.post('/timetable/generate', {
        userGoalId: activeUserGoal?._id,
        goalId: activeGoal?._id,
        goalSlug: activeGoal?.slug || 'jee-mains-advanced',
        availableDays,
        dailyHours: Number(dailyHours),
        preferredSlot,
        includeBreaks,
      });

      addToast(`Personalized timetable generated with ${res.data.tasksGenerated || 12} study tasks!`, 'success');
      onGenerated(res.data.data);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to generate timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="knw-glass rounded-3xl max-w-xl w-full border border-knw-red/40 shadow-red-lg overflow-hidden relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-knw-red/20 border border-knw-red/40 flex items-center justify-center text-knw-red shadow-red">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Generate Study Schedule</h2>
              <p className="text-xs text-knw-muted">Adaptive daily planning for {activeGoal?.title || 'Active Goal'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-knw-muted hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Days Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
              1. Which days can you commit to studying?
            </label>
            <div className="flex flex-wrap gap-2">
              {daysList.map((day) => {
                const isSelected = availableDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                      isSelected
                        ? 'border-knw-red bg-knw-red text-white shadow-red'
                        : 'border-white/10 bg-knw-surface text-knw-muted hover:text-white'
                    }`}
                  >
                    {day.slice(0, 3)} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Hours Slider */}
          <div className="bg-knw-surface p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-knw-muted">
                2. Daily Hours Capacity
              </label>
              <span className="text-xs font-mono font-bold text-white bg-knw-red/20 border border-knw-red/40 px-2.5 py-0.5 rounded-full">
                {dailyHours} Hours / Day
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              className="w-full accent-knw-red cursor-pointer"
            />
          </div>

          {/* Preferred Time of Day */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
              3. Preferred Focus Window
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {slots.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setPreferredSlot(s.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    preferredSlot === s.id
                      ? 'border-knw-red bg-knw-red/15 text-white shadow-red'
                      : 'border-white/10 bg-knw-surface text-knw-muted hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{s.label}</span>
                    {preferredSlot === s.id && <Check className="w-3.5 h-3.5 text-knw-red" />}
                  </div>
                  <span className="text-[10px] text-red-300 font-mono block mt-0.5">{s.time}</span>
                  <span className="text-[10px] text-knw-subtle block mt-0.5">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recovery Breaks Checkbox */}
          <div className="flex items-center gap-3 p-3 bg-knw-surface rounded-2xl border border-white/10">
            <input
              type="checkbox"
              id="breaksCheckbox"
              checked={includeBreaks}
              onChange={(e) => setIncludeBreaks(e.target.checked)}
              className="w-4 h-4 accent-knw-red rounded cursor-pointer"
            />
            <label htmlFor="breaksCheckbox" className="text-xs text-knw-offWhite cursor-pointer">
              Automatically interleave 15-minute recovery blocks to avoid mental fatigue
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-red py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-red"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Synthesizing Optimal Schedule...' : 'Build AI Timetable'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
