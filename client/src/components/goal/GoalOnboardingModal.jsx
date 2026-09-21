import React, { useState } from 'react';
import { X, Target, Calendar, Clock, Award, ArrowRight, Check } from 'lucide-react';
import { useGoal } from '../../context/GoalContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const GoalOnboardingModal = ({ goal, isOpen, onClose }) => {
  const { selectGoal } = useGoal();
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [level, setLevel] = useState('beginner');
  const [targetMonths, setTargetMonths] = useState(goal?.estimatedMonths || 6);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !goal) return null;

  const levels = [
    { id: 'beginner', title: 'Absolute Beginner', desc: 'Starting from scratch with no prior background' },
    { id: 'intermediate', title: 'Familiar / Student', desc: 'Know basic syntax or theory, want structured mastery' },
    { id: 'advanced', title: 'Practitioner', desc: 'Have built small projects, targeting advanced prep' },
  ];

  const suggestedSkills = [
    'Basic Computer Literacy',
    'Git & GitHub',
    'Basic Math & Logic',
    'HTML/CSS Basics',
    'Python Syntax',
    'C++ / Java Basics'
  ];

  const toggleSkill = (skill) => {
    if (knowledge.includes(skill)) {
      setKnowledge(knowledge.filter(k => k !== skill));
    } else {
      setKnowledge([...knowledge, skill]);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (!isAuthenticated) {
        // Automatically perform instant demo login so student doesn't hit a wall
        await demoLogin();
      }

      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + Number(targetMonths));

      await selectGoal({
        goalId: goal._id,
        targetDate,
        hoursPerDay: Number(hoursPerDay),
        currentLevel: level,
        currentKnowledge: knowledge,
      });

      onClose();
      navigate('/roadmap');
    } catch (err) {
      alert(err.message || 'Failed to enroll in goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-brand-600 to-brand-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Personalize Your Learning Plan</h2>
              <p className="text-xs text-brand-100">Tailoring roadmap & schedule for: {goal.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Step 1: Current Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-600" />
              Where are you starting from?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLevel(lvl.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    level === lvl.id
                      ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{lvl.title}</span>
                    {level === lvl.id && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Target Timeline & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Target Timeline */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-600" />
                Target Timeline
              </label>
              <select
                value={targetMonths}
                onChange={(e) => setTargetMonths(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value={3}>Fast Track (3 Months)</option>
                <option value={6}>Standard Pace (6 Months)</option>
                <option value={9}>Thorough (9 Months)</option>
                <option value={12}>Full Academic Year (12 Months)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-2">
                We'll divide this period into actionable stages and review intervals.
              </p>
            </div>

            {/* Daily Study Hours */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-600" /> Available Time
                </span>
                <span className="text-brand-600 font-bold">{hoursPerDay} hrs / day</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 hr</span>
                <span>4 hrs</span>
                <span>8 hrs</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Total: ~{Math.round(hoursPerDay * 7)} hours / week
              </p>
            </div>
          </div>

          {/* Step 3: Prior Skills (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Current Skills or Background (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => {
                const isSelected = knowledge.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {skill} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Activating Journey...</span>
            ) : (
              <>
                <span>Launch My Journey</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
