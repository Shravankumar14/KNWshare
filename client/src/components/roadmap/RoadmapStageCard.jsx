import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Sparkles
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

  const isStageCompleted = completedStages.includes(stage.stageNumber);
  const totalTopicsCount = stage.topics.length;
  const completedTopicsCount = stage.topics.filter(t =>
    completedTopics.includes(`${stage.stageNumber}:${t.title}`)
  ).length;

  const stageProgressPercent = totalTopicsCount > 0
    ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
    : 0;

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 overflow-hidden bg-white shadow-soft ${
        isStageCompleted
          ? 'border-emerald-200 bg-emerald-50/20'
          : 'border-slate-200 hover:border-brand-300'
      }`}
    >
      {/* Stage Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
              isStageCompleted
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-brand-50 text-brand-700 border border-brand-200'
            }`}
          >
            {isStageCompleted ? <CheckCircle2 className="w-6 h-6" /> : `S${stage.stageNumber}`}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Stage {stage.stageNumber}
              </span>
              {stage.dependencies && stage.dependencies.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Requires: Stage {stage.dependencies.join(', ')}
                </span>
              )}
              {isStageCompleted && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  Stage Mastered ✓
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{stage.title}</h3>
            {stage.shortSummary && (
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{stage.shortSummary}</p>
            )}
          </div>
        </div>

        {/* Right stats & collapse toggle */}
        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{stage.estimatedHours} hrs est.</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {completedTopicsCount} / {totalTopicsCount} topics done ({stageProgressPercent}%)
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stage Topics Body */}
      {expanded && (
        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stage.topics.map((topic, idx) => {
              const isTopicDone = completedTopics.includes(`${stage.stageNumber}:${topic.title}`);

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isTopicDone
                      ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                      : 'border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-brand-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleTopic(stage.stageNumber, topic.title)}
                        className={`mt-0.5 shrink-0 transition-colors ${
                          isTopicDone ? 'text-emerald-600' : 'text-slate-300 hover:text-brand-500'
                        }`}
                        title={isTopicDone ? 'Mark topic incomplete' : 'Mark topic completed'}
                      >
                        {isTopicDone ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div>
                        <h4 className={`text-sm font-bold ${isTopicDone ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                          {topic.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {topic.description}
                        </p>

                        {/* Subtopics */}
                        {topic.subtopics && topic.subtopics.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {topic.subtopics.map((sub, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] text-slate-600"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      ~{topic.estimatedHours}h
                    </span>
                  </div>

                  {/* Resource link shortcut */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">
                      Importance: <strong className="text-slate-600 capitalize">{topic.importance}</strong>
                    </span>

                    <Link
                      to={`/resources?stage=${stage.stageNumber}&topic=${encodeURIComponent(topic.title)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-800"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Explore Resources</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stage Milestone Outcome */}
          {stage.milestoneOutcome && (
            <div className="mt-4 p-3.5 rounded-2xl bg-brand-50/60 border border-brand-100 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
              <div className="text-xs text-brand-900">
                <strong>Milestone Outcome:</strong> {stage.milestoneOutcome}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
