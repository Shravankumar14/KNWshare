import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  GraduationCap,
  Layers,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RoadmapStageCard = ({
  stage,
  completedTopics = [],
  completedStages = [],
  onToggleTopic,
  goalId,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [activeTopicDetails, setActiveTopicDetails] = useState(null); // title of expanded topic
  const [prepLayerTab, setPrepLayerTab] = useState('main'); // 'main' | 'advanced'
  const [checkedSteps, setCheckedSteps] = useState({}); // `${stageNumber}:${topicTitle}:${stepId}` -> boolean

  const isStageCompleted = completedStages.includes(stage.stageNumber);
  const totalTopicsCount = stage.topics?.length || 0;
  const completedTopicsCount = stage.topics?.filter(t =>
    completedTopics.includes(`${stage.stageNumber}:${t.title}`)
  ).length || 0;

  const stageProgressPercent = totalTopicsCount > 0
    ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
    : 0;

  const getSubjectBadge = (subject) => {
    switch (subject) {
      case 'Physics':
        return 'bg-blue-950/40 text-blue-400 border-blue-700/40';
      case 'Chemistry':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-700/40';
      case 'Mathematics':
        return 'bg-purple-950/40 text-purple-400 border-purple-700/40';
      case 'PCM Integrated':
      case 'Integrated Revision':
        return 'bg-amber-950/40 text-amber-400 border-amber-700/40';
      default:
        return 'bg-white/5 text-knw-muted border-white/10';
    }
  };

  const toggleStep = (topicTitle, stepId) => {
    const key = `${stage.stageNumber}:${topicTitle}:${stepId}`;
    setCheckedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getTopicProgressStatus = (topic) => {
    const isDone = completedTopics.includes(`${stage.stageNumber}:${topic.title}`);
    if (isDone) return { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-700/40' };

    const steps = topic.learningSteps || [];
    const doneCount = steps.filter(s => checkedSteps[`${stage.stageNumber}:${topic.title}:${s.id}`]).length;
    if (doneCount > 0) {
      return { label: `In Progress (${doneCount}/${steps.length})`, icon: Circle, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-700/40' };
    }
    return { label: 'Not Started', icon: Circle, color: 'text-knw-muted', bg: 'bg-white/5 border-white/10' };
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
        isStageCompleted
          ? 'border-emerald-500/40 bg-emerald-950/10'
          : 'knw-card'
      }`}
    >
      {/* Stage Header */}
      <div className="p-5 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm font-mono ${
              isStageCompleted
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-knw-red/20 text-knw-red border border-knw-red/40 shadow-red'
            }`}
          >
            {isStageCompleted ? <CheckCircle2 className="w-6 h-6" /> : `S${stage.stageNumber}`}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-knw-red font-mono">
                Stage {stage.stageNumber}
              </span>

              {stage.subject && (
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono border ${getSubjectBadge(stage.subject)}`}>
                  {stage.subject}
                </span>
              )}

              {stage.dependencies && stage.dependencies.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-knw-muted border border-white/10 font-mono">
                  Requires: Stage {stage.dependencies.join(', ')}
                </span>
              )}

              {isStageCompleted && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 font-semibold border border-emerald-700/40 font-mono">
                  Stage Mastered ✓
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white mt-1">{stage.title}</h3>
            {stage.shortSummary && (
              <p className="text-xs text-knw-muted mt-1 leading-relaxed">{stage.shortSummary}</p>
            )}
          </div>
        </div>

        {/* Right stats & collapse toggle */}
        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className="text-right font-mono">
            <div className="flex items-center gap-1.5 text-xs text-knw-muted font-medium">
              <Clock className="w-3.5 h-3.5 text-knw-red" />
              <span>{stage.estimatedHours} hrs est.</span>
            </div>
            <div className="text-[11px] text-knw-subtle mt-0.5">
              {completedTopicsCount} / {totalTopicsCount} topics done ({stageProgressPercent}%)
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-knw-muted hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stage Topics Body */}
      {expanded && (
        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {stage.topics?.map((topic, idx) => {
              const isTopicDone = completedTopics.includes(`${stage.stageNumber}:${topic.title}`);
              const isDetailOpen = activeTopicDetails === topic.title;
              const statusInfo = getTopicProgressStatus(topic);

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isTopicDone
                      ? 'border-emerald-500/30 bg-emerald-950/15'
                      : isDetailOpen
                        ? 'border-knw-red/50 bg-[#120000]/60 shadow-red-lg'
                        : 'border-white/5 bg-knw-surface hover:border-knw-red/40 hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Topic Bar */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => onToggleTopic(stage.stageNumber, topic.title)}
                        className={`mt-1 shrink-0 transition-colors ${
                          isTopicDone ? 'text-emerald-400' : 'text-knw-subtle hover:text-knw-red'
                        }`}
                        title={isTopicDone ? 'Mark topic incomplete' : 'Mark topic completed'}
                      >
                        {isTopicDone ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-900/40" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-sm sm:text-base font-bold truncate ${isTopicDone ? 'line-through text-knw-subtle' : 'text-white'}`}>
                            {topic.title}
                          </h4>

                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        <p className="text-xs text-knw-muted mt-1 leading-relaxed">
                          {topic.description}
                        </p>

                        {/* Prerequisites Badge */}
                        {topic.prerequisites && topic.prerequisites.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-amber-300/90">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="text-knw-muted">Prerequisite:</span>
                            <span className="font-semibold underline decoration-amber-500/50">{topic.prerequisites.join(', ')}</span>
                          </div>
                        )}

                        {/* Main / Advanced Relevance Tags */}
                        {(topic.jeeMainRelevance || topic.jeeAdvancedRelevance) && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5 font-mono text-[10px]">
                            {topic.jeeMainRelevance && (
                              <span className="px-2 py-0.5 rounded bg-yellow-950/40 text-yellow-300 border border-yellow-800/40">
                                Main: {topic.jeeMainRelevance}
                              </span>
                            )}
                            {topic.jeeAdvancedRelevance && (
                              <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/40">
                                Adv: {topic.jeeAdvancedRelevance}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions on the right */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center font-mono">
                      <span className="text-xs text-knw-muted">
                        ~{topic.estimatedHours}h est.
                      </span>

                      <button
                        onClick={() => setActiveTopicDetails(isDetailOpen ? null : topic.title)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isDetailOpen
                            ? 'bg-knw-red text-white shadow-red'
                            : 'bg-white/5 text-knw-muted hover:text-white border border-white/10'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{isDetailOpen ? 'Close Unit' : 'Interactive Unit'}</span>
                        {isDetailOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Interactive Learning Unit Panel */}
                  {isDetailOpen && (
                    <div className="p-5 border-t border-white/10 bg-black/40 space-y-6">
                      {/* Section 1: 7-Step Learning Cycle */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-knw-red" />
                            <span>Structured Learning Cycle (Step-by-Step Mastery)</span>
                          </h5>
                          <span className="text-[10px] font-mono text-knw-muted">Click step to mark completed</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                          {(topic.learningSteps || []).map((step) => {
                            const isStepDone = checkedSteps[`${stage.stageNumber}:${topic.title}:${step.id}`];

                            return (
                              <button
                                key={step.id}
                                type="button"
                                onClick={() => toggleStep(topic.title, step.id)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  isStepDone
                                    ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                                    : 'border-white/10 bg-knw-surface hover:border-white/20 text-knw-muted'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white font-mono">{step.label}</span>
                                  {isStepDone ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Circle className="w-3.5 h-3.5 text-knw-subtle" />
                                  )}
                                </div>
                                <p className="text-[10px] text-knw-muted mt-1 leading-snug">{step.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 2: Differentiated JEE Main vs JEE Advanced Preparation Layers */}
                      <div className="p-4 rounded-2xl bg-knw-surface border border-white/10 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                            Preparation Depth Focus
                          </span>

                          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 font-mono text-xs">
                            <button
                              onClick={() => setPrepLayerTab('main')}
                              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                                prepLayerTab === 'main'
                                  ? 'bg-knw-red text-white shadow-red'
                                  : 'text-knw-muted hover:text-white'
                              }`}
                            >
                              JEE Main Layer
                            </button>
                            <button
                              onClick={() => setPrepLayerTab('advanced')}
                              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                                prepLayerTab === 'advanced'
                                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-red'
                                  : 'text-knw-muted hover:text-white'
                              }`}
                            >
                              JEE Advanced Layer
                            </button>
                          </div>
                        </div>

                        {prepLayerTab === 'main' ? (
                          <div className="space-y-2">
                            <span className="text-[11px] font-mono text-yellow-300 font-bold block">
                              🎯 JEE Main Objectives & Numerical Accuracy:
                            </span>
                            <ul className="space-y-1.5 text-xs text-knw-muted">
                              {(topic.jeeMainLayer || [
                                'Master formula application and definitions without edge-case gaps',
                                'Solve 40-50 single-concept numerical and MCQ questions',
                                'Complete last 5 years of JEE Main chapter PYQs under 1.5 min per question',
                                'Condition 100% accuracy on standard direct-application questions'
                              ]).map((item, mIdx) => (
                                <li key={mIdx} className="flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-[11px] font-mono text-red-400 font-bold block">
                              ⚡ JEE Advanced Depth & Analytical Problem Solving:
                            </span>
                            <ul className="space-y-1.5 text-xs text-knw-muted">
                              {(topic.jeeAdvancedLayer || [
                                'Multi-concept synthesis with cross-chapter coupling',
                                'Solve Physics Galaxy Advanced Illustrations and multi-correct assertion problems',
                                'Practice subjective derivations and matrix-match questions from 15-year Advanced archives',
                                'Condition analytical problem-solving resilience under pressure'
                              ]).map((item, aIdx) => (
                                <li key={aIdx} className="flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Section 3: Verified Topic Resources */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Verified External Learning Materials for this Topic</span>
                          </h5>
                          <Link
                            to={`/resources?stage=${stage.stageNumber}&topic=${encodeURIComponent(topic.title)}`}
                            className="text-[11px] font-mono font-bold text-knw-red hover:text-red-300 flex items-center gap-1"
                          >
                            <span>Open in Resource Hub</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(topic.resources || []).map((res, rIdx) => (
                            <div
                              key={rIdx}
                              className="p-3.5 rounded-2xl bg-knw-surface border border-white/10 hover:border-knw-red/40 transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-knw-muted border border-white/10">
                                    {res.provider}
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-700/50">
                                    {res.isFree ? '100% Free' : 'Freemium'}
                                  </span>
                                </div>

                                <h6 className="text-xs font-bold text-white mt-2 leading-snug">
                                  {res.name}
                                </h6>
                                <p className="text-[11px] text-knw-muted mt-1 leading-relaxed">
                                  {res.description}
                                </p>
                              </div>

                              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-red-300">
                                  {res.examLevel || 'Both Main & Advanced'}
                                </span>

                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-red-outline text-[11px] px-2.5 py-1 flex items-center gap-1 font-mono"
                                >
                                  <span>Open Resource</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stage Milestone Outcome */}
          {stage.milestoneOutcome && (
            <div className="mt-4 p-3.5 rounded-2xl bg-knw-red/10 border border-knw-red/30 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-knw-red shrink-0" />
              <div className="text-xs text-red-200">
                <strong className="text-white">Milestone Outcome:</strong> {stage.milestoneOutcome}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
