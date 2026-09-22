import React from 'react';
import {
  Compass,
  Code,
  FolderGit2,
  Briefcase,
  Award,
  CheckCircle2,
  Target,
  GraduationCap,
  Sparkles,
  Building2,
  BookOpen
} from 'lucide-react';

const stepIcons = {
  Compass,
  Code,
  FolderGit2,
  Briefcase,
  Award,
  Target,
  GraduationCap,
  Building2,
  BookOpen
};

export const CareerPathGuidance = ({
  careerPath = [],
  targetRoles = [],
  goalTitle = '',
  engineeringBranches = [],
  counselingLadder = []
}) => {
  const isJee = goalTitle.toLowerCase().includes('jee') || engineeringBranches.length > 0;
  const activePath = (isJee && counselingLadder.length > 0) ? counselingLadder : careerPath;

  return (
    <div className="space-y-8">
      {/* Main Guidance Card */}
      <div className="knw-card rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-knw-red/15 px-2.5 py-0.5 rounded-full border border-knw-red/30 font-mono">
                {isJee ? 'JoSAA Counselling & Rank Milestone Ladder' : 'Career Trajectory & Growth Ladder'}
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-2">
              {isJee ? 'Post-JEE Admissions & Career Roadmap' : `Career Path Guidance for ${goalTitle}`}
            </h2>
            <p className="text-xs text-knw-muted mt-0.5 max-w-2xl leading-relaxed">
              {isJee
                ? 'Structured step-by-step guidance from JEE Main percentile evaluation through JoSAA choice filling, seat allocation, and IIT branch selection.'
                : 'The battle-tested sequence from foundational concepts to securing professional roles and senior engineering titles.'}
            </p>
          </div>

          {/* Target Roles / Ranks Pill List */}
          {targetRoles && targetRoles.length > 0 && (
            <div className="sm:text-right">
              <span className="text-[11px] font-bold text-knw-subtle uppercase tracking-wider block mb-1 font-mono">
                {isJee ? 'Target Ranks & Institutes:' : 'Destination Roles:'}
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
          {activePath.map((step, idx) => {
            const IconComp = stepIcons[step.icon] || Award;
            const isLast = idx === activePath.length - 1;

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
                    <span className="text-[11px] text-knw-subtle font-mono">Step {step.stepNumber || idx + 1} of {activePath.length}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-0.5">{step.title}</h3>
                  <p className="text-xs text-knw-muted mt-1 leading-relaxed">{step.description}</p>

                  {/* Milestones list */}
                  {step.milestones && step.milestones.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-white/5">
                      <span className="text-[11px] font-mono font-bold text-gray-300 block mb-2">
                        {isJee ? 'Key Action Items & Checkpoints:' : 'Key Competency Milestones:'}
                      </span>
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

      {/* Engineering Branches Grid (Specific for JEE) */}
      {isJee && engineeringBranches.length > 0 && (
        <div className="knw-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-knw-red/15 text-red-400 border border-knw-red/30 uppercase tracking-wider font-mono">
                IIT & NIT Branch Navigator
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              Top Engineering Branches & Career Specializations
            </h3>
            <p className="text-xs text-knw-muted mt-0.5">
              Compare closing ranks, premier institutes, and high-impact industry careers across major engineering disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {engineeringBranches.map((branch) => (
              <div
                key={branch.code}
                className="bg-knw-surface p-5 rounded-2xl border border-white/10 hover:border-knw-red/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-knw-red/20 text-red-300 text-xs font-mono font-bold">
                      {branch.code}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                      {branch.closingRankRange}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2">{branch.name}</h4>

                  <p className="text-xs text-knw-muted mt-2">
                    <strong className="text-gray-300 font-mono">Core Focus: </strong>
                    {branch.coreFocus}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1.5 text-[11px] text-knw-muted">
                    <div>
                      <span className="text-knw-subtle font-mono">Top Institutes: </span>
                      <span className="text-gray-200">{branch.topInstitutes.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-red-300 font-mono">
                  💼 {branch.industryCareers}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
