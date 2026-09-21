import React, { useState } from 'react';
import {
  Compass,
  Target,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Zap,
  Users
} from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';
import { GoalCard } from '../components/goal/GoalCard';
import { GoalOnboardingModal } from '../components/goal/GoalOnboardingModal';
import { CustomGoalModal } from '../components/goal/CustomGoalModal';
import { Link } from 'react-router-dom';

export const GoalSelectionPage = () => {
  const { allGoals, activeGoal, activeUserGoal, loading } = useGoal();
  const { isAuthenticated, demoLogin } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetGoalToEnroll, setTargetGoalToEnroll] = useState(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCustomGoalOpen, setIsCustomGoalOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Ambitions' },
    { id: 'web_dev', label: 'Web & Full Stack' },
    { id: 'ai_ml', label: 'AI & Machine Learning' },
    { id: 'competitive_programming', label: 'Competitive Programming' },
    { id: 'engineering_exams', label: 'Academic & Exams (JEE/GATE)' },
    { id: 'custom', label: 'Custom Goals' },
  ];

  const filteredGoals = allGoals.filter((g) => {
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectGoal = (goal) => {
    setTargetGoalToEnroll(goal);
    setIsOnboardingOpen(true);
  };

  return (
    <div className="space-y-12">
      
      {/* Hero Section: "What do you want to achieve?" */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-brand-900 via-slate-900 to-slate-950 text-white px-6 py-14 sm:px-12 sm:py-20 shadow-2xl border border-slate-800">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-brand-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>Structured Learning • Clear Roadmaps • Daily Execution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            What do you want to <span className="bg-gradient-to-r from-brand-300 via-brand-200 to-amber-200 bg-clip-text text-transparent">achieve?</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Select a target career or academic ambition. KNWshare will construct your stage-by-stage roadmap, curate verified resources, build a realistic weekly timetable, and track your daily momentum.
          </p>

          {/* Search & Custom Goal CTA Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search goals (e.g., Full Stack, JEE, Machine Learning)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white/15 backdrop-blur-md transition-all"
              />
            </div>

            <button
              onClick={() => setIsCustomGoalOpen(true)}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Custom Goal</span>
            </button>
          </div>

          {/* Active Goal Quick Link (if user has active goal) */}
          {activeGoal && (
            <div className="pt-2">
              <Link
                to="/roadmap"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-300 hover:text-white transition-colors bg-white/5 px-4 py-1.5 rounded-full border border-white/10"
              >
                <span>Currently active: <strong className="text-white">{activeGoal.title}</strong></span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredGoals.length}</span> goal paths
        </div>
      </div>

      {/* Goal Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              isActive={activeGoal?._id === goal._id}
              onSelect={handleSelectGoal}
            />
          ))}

          {/* Add Custom Goal Card */}
          <div
            onClick={() => setIsCustomGoalOpen(true)}
            className="group cursor-pointer flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 transition-all duration-200 min-h-[260px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-700">
              Have a Different Ambition?
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Define your own customized goal. Our curriculum engine will decompose it into a tailored roadmap.
            </p>
            <span className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-white border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
              Create Custom Goal →
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <Target className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching goals found</h3>
          <p className="text-xs text-slate-500">
            Couldn't find what you're looking for? Create a custom goal and our AI engine will generate a complete roadmap.
          </p>
          <button
            onClick={() => setIsCustomGoalOpen(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
          >
            Create Custom Goal
          </button>
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      <GoalOnboardingModal
        goal={targetGoalToEnroll}
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Custom Goal Modal */}
      <CustomGoalModal
        isOpen={isCustomGoalOpen}
        onClose={() => setIsCustomGoalOpen(false)}
      />

      {/* The KNWshare Learning Architecture Diagram Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 border border-slate-800 shadow-soft">
        <div className="max-w-3xl mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">The KNWshare Methodology</span>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">From Aspiration to Daily Habit</h2>
          <p className="text-xs text-slate-400 mt-1">
            Most students fail not from lack of ambition, but from lack of a systematic bridge between the goal and daily action.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {[
            { step: '1. Goal', desc: 'Define target' },
            { step: '2. Roadmap', desc: 'Step-by-step stages' },
            { step: '3. Career', desc: 'Expert guidance' },
            { step: '4. Resources', desc: 'Curated media' },
            { step: '5. Timetable', desc: 'Weekly planner' },
            { step: '6. Tasks', desc: 'Daily execution' },
            { step: '7. Progress', desc: 'Real momentum' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
              <span className="text-xs font-bold text-brand-300">{item.step}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
