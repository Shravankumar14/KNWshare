import React, { useState } from 'react';
import { X, Sparkles, Brain, Clock, Award, ArrowRight } from 'lucide-react';
import { useGoal } from '../../context/GoalContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const CustomGoalModal = ({ isOpen, onClose }) => {
  const { createCustomGoal } = useGoal();
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('beginner');
  const [targetMonths, setTargetMonths] = useState(6);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      if (!isAuthenticated) {
        await demoLogin();
      }

      await createCustomGoal({
        title: title.trim(),
        currentLevel: level,
        targetMonths: Number(targetMonths),
        hoursPerDay: Number(hoursPerDay),
      });

      onClose();
      navigate('/roadmap');
    } catch (err) {
      alert(err.message || 'Failed to create custom goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="knw-glass rounded-3xl max-w-lg w-full border border-knw-red/40 shadow-red-lg overflow-hidden relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-knw-red/20 border border-knw-red/40 flex items-center justify-center text-knw-red shadow-red">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Design a Custom Ambition</h2>
              <p className="text-xs text-knw-muted">AI engine will decompose your goal into structured roadmap stages</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
              What specific skill or exam do you want to master?
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Autonomous Driving Perception Engineer, Quantitative Trading, Rust Systems..."
              className="w-full bg-knw-surface border border-white/10 rounded-xl p-3 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Level */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
                Starting Experience
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-knw-red"
              >
                <option value="beginner" className="bg-knw-surface text-white">Absolute Beginner</option>
                <option value="intermediate" className="bg-knw-surface text-white">Intermediate Student</option>
                <option value="advanced" className="bg-knw-surface text-white">Advanced Practitioner</option>
              </select>
            </div>

            {/* Target Duration */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
                Target Timeline
              </label>
              <select
                value={targetMonths}
                onChange={(e) => setTargetMonths(Number(e.target.value))}
                className="w-full bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-knw-red"
              >
                <option value={3} className="bg-knw-surface text-white">3 Months (Intensive)</option>
                <option value={6} className="bg-knw-surface text-white">6 Months (Standard)</option>
                <option value={12} className="bg-knw-surface text-white">12 Months (Long-term)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
              Daily Study Hours Available: <span className="text-white font-bold">{hoursPerDay} hours/day</span>
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              className="w-full accent-knw-red cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-red py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-red mt-2"
          >
            <span>{loading ? 'Decomposing Ambition...' : 'Generate AI Roadmap & Enroll'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
