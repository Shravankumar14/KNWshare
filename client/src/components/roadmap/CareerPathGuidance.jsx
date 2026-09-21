import React from 'react';
import {
  Compass,
  Code,
  FolderGit2,
  Briefcase,
  Award,
  ArrowDown,
  CheckCircle2,
  Sparkles,
  Target
} from 'lucide-react';

const stepIcons = {
  Compass,
  Code,
  FolderGit2,
  Briefcase,
  Award,
  Target
};

export const CareerPathGuidance = ({ careerPath = [], targetRoles = [], goalTitle = '' }) => {
  if (!careerPath || careerPath.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Career Trajectory & Growth Ladder
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Career Path Guidance for {goalTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The proven sequence from foundational concepts to securing professional roles and top ranks.
          </p>
        </div>

        {/* Target Roles Pill List */}
        {targetRoles && targetRoles.length > 0 && (
          <div className="sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Destination Roles:
            </span>
            <div className="flex flex-wrap sm:justify-end gap-1.5">
              {targetRoles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-medium shadow-xs"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visual Progression Pathway */}
      <div className="relative space-y-6">
        {careerPath.map((step, idx) => {
          const IconComp = stepIcons[step.icon] || Award;
          const isLast = idx === careerPath.length - 1;

          return (
            <div key={idx} className="relative flex items-start gap-4 sm:gap-6 group">
              
              {/* Left Timeline Line & Icon */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-105 ${
                  isLast
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-amber-500/20'
                    : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                }`}>
                  <IconComp className="w-6 h-6" />
                </div>
                {!isLast && (
                  <div className="w-0.5 h-full min-h-[4rem] bg-gradient-to-b from-indigo-200 to-slate-200 my-1" />
                )}
              </div>

              {/* Step Details Card */}
              <div className="flex-1 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 hover:bg-white hover:border-indigo-300 hover:shadow-soft transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                    {step.subtitle || `Phase ${step.stepNumber || idx + 1}`}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Step {step.stepNumber || idx + 1} of {careerPath.length}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-0.5">{step.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.description}</p>

                {/* Milestones list */}
                {step.milestones && step.milestones.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-700 block mb-2">Key Competency Milestones:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.milestones.map((m, mIdx) => (
                        <div key={mIdx} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
