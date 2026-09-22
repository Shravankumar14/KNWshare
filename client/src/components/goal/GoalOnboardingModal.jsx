import React, { useState } from 'react';
import { X, Target, Calendar, Clock, Award, ArrowRight, Check } from 'lucide-react';
import { useGoal } from '../../context/GoalContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const GoalOnboardingModal = ({ goal, isOpen, onClose }) => {
  const { selectGoal, setPreviewGoal } = useGoal();
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [level, setLevel] = useState('beginner');
  const [targetMonths, setTargetMonths] = useState(goal?.estimatedMonths || 12);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !goal) return null;

  const isJee = goal?.slug === 'jee-mains-advanced' ||
    goal?.category === 'engineering_exams' ||
    goal?.title?.toLowerCase().includes('jee');

  const levels = isJee ? [
    { id: 'beginner', title: 'Starting Scratch / Class 11', desc: 'New to JEE prep, building core PCM foundational concepts' },
    { id: 'intermediate', title: 'Class 12 / In Progress', desc: 'Studying syllabus, targeting speed, accuracy & PYQ drills' },
    { id: 'advanced', title: 'Dropper / Final Revision', desc: 'Covered syllabus, focusing on mock tests & top IIT rank' },
  ] : [
    { id: 'beginner', title: 'Absolute Beginner', desc: 'Starting from scratch with no prior background' },
    { id: 'intermediate', title: 'Familiar / Student', desc: 'Know basic syntax or theory, want structured mastery' },
    { id: 'advanced', title: 'Practitioner', desc: 'Have built small projects, targeting advanced prep' },
  ];

  const suggestedSkills = isJee ? [
    'Physics: Kinematics & Mechanics',
    'Physics: Optics & Modern Physics',
    'Chemistry: Mole Concept & Bonding',
    'Chemistry: Organic Mechanisms',
    'Math: Quadratic Equations & Algebra',
    'Math: Differential & Integral Calculus',
    'Math: Vectors & 3D Geometry'
  ] : [
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
      // 1. Immediately activate goal in client state & local storage
      if (goal.slug) {
        localStorage.setItem('knwshare_active_goal_slug', goal.slug);
      }
      setPreviewGoal(goal);

      // 2. Ensure user is logged in
      if (!isAuthenticated) {
        await demoLogin();
      }

      // 3. Persist enrollment in server
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + Number(targetMonths));

      if (goal._id) {
        try {
          await selectGoal({
            goalId: goal._id,
            targetDate,
            hoursPerDay: Number(hoursPerDay),
            currentLevel: level,
            currentKnowledge: knowledge,
          });
        } catch (enrollErr) {
          console.warn('Server enrollment fallback warning:', enrollErr);
        }
      }

      onClose();
      navigate(`/roadmap/${goal.slug || 'jee-main-advanced'}`);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      onClose();
      navigate(`/roadmap/${goal.slug || 'jee-main-advanced'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="knw-glass rounded-3xl max-w-xl w-full border border-knw-red/40 shadow-red-lg overflow-hidden relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-knw-red via-knw-redBright to-knw-redDark shadow-red" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-knw-red/20 border border-knw-red/40 flex items-center justify-center text-knw-red shadow-red">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Personalize Your Learning Plan</h2>
              <p className="text-xs text-knw-muted">Tailoring roadmap & schedule for: <span className="text-knw-red font-semibold">{goal.title}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-knw-muted hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Current Level */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-knw-red" />
              <span>Where are you starting from?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLevel(lvl.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    level === lvl.id
                      ? 'border-knw-red bg-knw-red/15 shadow-red text-white'
                      : 'border-white/10 hover:border-white/20 bg-knw-surface text-knw-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{lvl.title}</span>
                    {level === lvl.id && <Check className="w-3.5 h-3.5 text-knw-red" />}
                  </div>
                  <p className="text-[10px] text-knw-muted mt-1 leading-relaxed">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Target Timeline & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Timeline */}
            <div className="bg-knw-surface p-4 rounded-2xl border border-white/10">
              <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-knw-red" />
                <span>Target Timeline</span>
              </label>
              <select
                value={targetMonths}
                onChange={(e) => setTargetMonths(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-medium text-white focus:border-knw-red outline-none"
              >
                <option value={3} className="bg-knw-surface text-white">Fast Track Crash Course (3 Months)</option>
                <option value={6} className="bg-knw-surface text-white">Intensive Target (6 Months)</option>
                <option value={9} className="bg-knw-surface text-white">Comprehensive 1-Year (9 Months)</option>
                <option value={12} className="bg-knw-surface text-white">Two-Year Comprehensive (12+ Months)</option>
              </select>
            </div>

            {/* Daily Hours Capacity */}
            <div className="bg-knw-surface p-4 rounded-2xl border border-white/10">
              <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-knw-red" />
                <span>Daily Study Commitment</span>
              </label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="w-full accent-knw-red cursor-pointer"
                />
                <span className="text-sm font-mono font-bold text-white shrink-0 min-w-[50px] text-right">
                  {hoursPerDay}h / day
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Prior Skills */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
              Select topics you already feel comfortable with (Optional):
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => {
                const isSelected = knowledge.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                      isSelected
                        ? 'border-knw-red bg-knw-red/20 text-knw-red shadow-red'
                        : 'border-white/10 bg-knw-surface text-knw-muted hover:text-white'
                    }`}
                  >
                    {skill} {isSelected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-knw-surface border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold text-knw-muted hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="btn-red px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-red"
          >
            <span>{loading ? 'Assembling Roadmap...' : 'Start Learning Journey'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
