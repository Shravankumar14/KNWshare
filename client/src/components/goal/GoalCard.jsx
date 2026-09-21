import React from 'react';
import {
  Layers,
  Brain,
  Target,
  Terminal,
  GraduationCap,
  Sparkles,
  Clock,
  ArrowRight,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

const iconMap = {
  Layers,
  Brain,
  Target,
  Terminal,
  GraduationCap,
  Sparkles,
};

export const GoalCard = ({ goal, isActive, onSelect }) => {
  const IconComponent = iconMap[goal.icon] || Target;

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'web_dev': return { label: 'Web & Software', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'ai_ml': return { label: 'AI & Data Science', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'competitive_programming': return { label: 'Algorithms & CP', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'engineering_exams': return { label: 'Academic & Exams', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'custom': return { label: 'Custom Career', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      default: return { label: 'Career Goal', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const badge = getCategoryBadge(goal.category);

  return (
    <div
      className={`relative group flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 bg-white ${
        isActive
          ? 'ring-2 ring-brand-500 border-brand-400 shadow-soft-lg'
          : 'border-slate-200/90 hover:border-brand-300 hover:shadow-soft-lg hover:-translate-y-0.5'
      }`}
    >
      {/* Top Banner / Category */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isActive ? 'bg-brand-600 text-white shadow-md' : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100'
            }`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
          </div>

          {isActive && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
          {goal.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {goal.tagline || goal.description}
        </p>

        {/* Target Roles */}
        {goal.targetRoles && goal.targetRoles.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Target Roles:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {goal.targetRoles.slice(0, 3).map((role, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium"
                >
                  {role}
                </span>
              ))}
              {goal.targetRoles.length > 3 && (
                <span className="px-1.5 py-0.5 text-slate-400 text-[10px]">
                  +{goal.targetRoles.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Select CTA */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>~{goal.estimatedMonths || 6} months</span>
        </div>

        <button
          onClick={() => onSelect(goal)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
              : 'bg-slate-900 text-white hover:bg-brand-600 shadow-sm'
          }`}
        >
          <span>{isActive ? 'Manage Journey' : 'Select Goal'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
