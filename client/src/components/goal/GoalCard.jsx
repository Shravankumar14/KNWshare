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
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const iconMap = {
  Layers,
  Brain,
  Target,
  Terminal,
  GraduationCap,
  Sparkles,
};

const getCategoryLabel = (cat) => {
  switch (cat) {
    case 'web_dev': return 'Web & Full Stack';
    case 'ai_ml': return 'AI & ML';
    case 'competitive_programming': return 'Competitive Prog.';
    case 'engineering_exams': return 'Exams (JEE/GATE)';
    case 'custom': return 'Custom Career';
    default: return 'Curriculum';
  }
};

export const GoalCard = ({
  goal,
  isActive = false,
  isEnrolled = false,
  onSelect,
  variant = 'expanded'
}) => {
  const enrolled = isEnrolled || isActive;
  const IconComponent = iconMap[goal.icon] || Target;

  if (variant === 'compact') {
    return (
      <div
        onClick={() => onSelect && onSelect(goal)}
        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
          enrolled
            ? 'border-knw-red bg-knw-red/10 shadow-red'
            : 'border-white/5 bg-knw-surface hover:border-knw-red/40 hover:bg-white/[0.02]'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">{goal.title}</span>
              {enrolled && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-knw-red text-white font-bold shrink-0">
                  Enrolled
                </span>
              )}
            </div>
            <p className="text-[10px] text-knw-muted mt-0.5 line-clamp-1 leading-tight">
              {goal.description}
            </p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-knw-subtle shrink-0 mt-0.5" />
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-knw-subtle font-mono">
          <span>~{goal.estimatedDuration || `${goal.estimatedMonths || 6} months`}</span>
          <span>• {getCategoryLabel(goal.category)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect && onSelect(goal)}
      className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
        enrolled
          ? 'border-knw-red bg-knw-red/10 shadow-red hover:shadow-red-lg'
          : 'knw-card border-white/10 hover:border-knw-red/50 hover:bg-white/[0.03]'
      }`}
    >
      <div>
        {/* Top Header: Category badge & Enrolled status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                enrolled
                  ? 'bg-knw-red text-white shadow-red'
                  : 'bg-white/5 text-knw-red border border-white/10 group-hover:bg-knw-red/10 group-hover:border-knw-red/30'
              }`}
            >
              <IconComponent className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-knw-muted group-hover:border-knw-red/40 group-hover:text-knw-red transition-colors">
              {getCategoryLabel(goal.category)}
            </span>
          </div>

          {enrolled ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-knw-red text-white shadow-red">
              <CheckCircle2 className="w-3 h-3" />
              <span>Enrolled</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono text-knw-subtle">
              ~{goal.estimatedDuration || `${goal.estimatedMonths || 6} months`}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-2 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-knw-red transition-colors flex items-center justify-between">
            <span>{goal.title}</span>
            <ChevronRight className="w-4 h-4 text-knw-subtle group-hover:text-knw-red group-hover:translate-x-1 transition-all shrink-0" />
          </h3>
          <p className="text-xs sm:text-sm text-knw-muted line-clamp-2 leading-relaxed">
            {goal.tagline || goal.description}
          </p>
        </div>

        {/* Target Roles (if present) */}
        {goal.targetRoles && goal.targetRoles.length > 0 && (
          <div className="pt-3 border-t border-white/5 space-y-1.5 mb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-knw-subtle block">
              Target Roles:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {goal.targetRoles.slice(0, 3).map((role, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300"
                >
                  {role}
                </span>
              ))}
              {goal.targetRoles.length > 3 && (
                <span className="text-[10px] font-mono text-knw-subtle self-center">
                  +{goal.targetRoles.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Select CTA */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-mono text-knw-muted">
          <Clock className="w-3.5 h-3.5 text-knw-red" />
          <span>{goal.estimatedDuration || `${goal.estimatedMonths || 6} Months`}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(goal);
          }}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            enrolled
              ? 'bg-knw-red text-white shadow-red'
              : 'text-knw-red bg-knw-red/10 border border-knw-red/30 group-hover:bg-knw-red group-hover:text-white'
          }`}
        >
          <span>{enrolled ? 'Manage Journey' : 'Select Goal'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
