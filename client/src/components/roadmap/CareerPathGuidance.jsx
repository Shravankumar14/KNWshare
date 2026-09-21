import React from 'react';
import {
  Compass,
  Code,
  FolderGit2,
  Briefcase,
  Award,
  CheckCircle2,
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
    <div className="knw-card rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-knw-red/50 to-transparent" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-knw-red/15 px-2.5 py-0.5 rounded-full border border-knw-red/30 font-mono">
              Career Trajectory & Growth Ladder
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-2">
            Career Path Guidance for {goalTitle}
          </h2>
          <p className="text-xs text-knw-muted mt-0.5">
            The battle-tested sequence from foundational concepts to securing professional roles and top ranks.
          </p>
        </div>

        {/* Target Roles Pill List */}
        {targetRoles && targetRoles.length > 0 && (
          <div className="sm:text-right">
            <span className="text-[11px] font-bold text-knw-subtle uppercase tracking-wider block mb-1 font-mono">
              Destination Roles:
            </span>
            <div className="flex flex-wrap sm:justify-end gap-1.5">
              {targetRoles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-knw-surface border border-white/10 text-white rounded-lg text-xs font-mono font-medium"
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
                    ? 'bg-gradient-to-tr from-knw-red to-red-500 text-white shadow-red'
                    : 'bg-knw-surface border border-knw-red/30 text-knw-red'
                }`}>
                  <IconComp className="w-6 h-6" />
                </div>
                {!isLast && (
                  <div className="w-0.5 h-full min-h-[4rem] bg-gradient-to-b from-knw-red/50 to-white/10 my-1" />
                )}
              </div>

              {/* Step Details Card */}
              <div className="flex-1 bg-knw-surface border border-white/5 rounded-2xl p-5 hover:border-knw-red/40 hover:bg-white/[0.02] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-knw-red">
                    {step.subtitle || `Phase ${step.stepNumber || idx + 1}`}
                  </span>
                  <span className="text-[11px] text-knw-subtle font-mono">Step {step.stepNumber || idx + 1} of {careerPath.length}</span>
                </div>

                <h3 className="text-base font-bold text-white mt-0.5">{step.title}</h3>
                <p className="text-xs text-knw-muted mt-1 leading-relaxed">{step.description}</p>

                {/* Milestones list */}
                {step.milestones && step.milestones.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-white/5">
                    <span className="text-[11px] font-mono font-bold text-gray-300 block mb-2">Key Competency Milestones:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.milestones.map((m, mIdx) => (
                        <div key={mIdx} className="flex items-center gap-2 text-xs text-knw-muted">
                          <CheckCircle2 className="w-3.5 h-3.5 text-knw-red shrink-0" />
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
