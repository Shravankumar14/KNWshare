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
        availableDays,
        dailyHours: Number(dailyHours),
        preferredSlot,
        includeBreaks,
      });

      addToast(`Personalized timetable generated with ${res.data.tasksGenerated} study tasks!`, 'success');
      onGenerated(res.data.data);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to generate timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Timetable Generator</h2>
              <p className="text-xs text-brand-100">Realistic schedule tailored to {activeGoal?.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleGenerate} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Step 1: Available Days */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Which days are you available to study?
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {daysList.map((day) => {
                const isSelected = availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Selected: {availableDays.length} days/week
            </p>
          </div>

          {/* Step 2: Daily Hours Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-600" />
                Daily Dedicated Hours
              </span>
              <span className="text-sm font-bold text-brand-600">{dailyHours} hrs / day</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 hr (Light)</span>
              <span>2.5 hrs (Standard)</span>
              <span>6 hrs (Intensive)</span>
            </div>
          </div>

          {/* Step 3: Preferred Study Slot */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Preferred Daily Study Period
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slots.map((slot) => {
                const isSelected = preferredSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setPreferredSlot(slot.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500/20 text-brand-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{slot.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{slot.time}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{slot.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Include Buffer Breaks */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-50/50 border border-brand-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-900">Include 15-Minute Recovery Breaks</h4>
                <p className="text-[11px] text-brand-700">Prevents mental fatigue between deep study and practice sessions.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeBreaks}
              onChange={(e) => setIncludeBreaks(e.target.checked)}
              className="w-5 h-5 rounded text-brand-600 accent-brand-600 cursor-pointer"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing...' : 'Generate My Timetable'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
