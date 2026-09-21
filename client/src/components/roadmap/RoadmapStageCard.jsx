import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
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

            <h3 className="text-lg font-bold text-white mt-0.5">{stage.title}</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stage.topics.map((topic, idx) => {
              const isTopicDone = completedTopics.includes(`${stage.stageNumber}:${topic.title}`);

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isTopicDone
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-100'
                      : 'border-white/5 bg-knw-surface hover:border-knw-red/40 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleTopic(stage.stageNumber, topic.title)}
                        className={`mt-0.5 shrink-0 transition-colors ${
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

                      <div>
                        <h4 className={`text-sm font-bold ${isTopicDone ? 'line-through text-knw-subtle' : 'text-white'}`}>
                          {topic.title}
                        </h4>
                        <p className="text-xs text-knw-muted mt-1 leading-relaxed">
                          {topic.description}
                        </p>

                        {/* Subtopics */}
                        {topic.subtopics && topic.subtopics.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {topic.subtopics.map((sub, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 bg-black/40 border border-white/10 rounded-md text-[10px] text-knw-muted font-mono"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-semibold text-knw-subtle shrink-0">
                      ~{topic.estimatedHours}h
                    </span>
                  </div>

                  {/* Resource link shortcut */}
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-knw-subtle">
                      Importance: <strong className="text-knw-red capitalize">{topic.importance}</strong>
                    </span>

                    <Link
                      to={`/resources?stage=${stage.stageNumber}&topic=${encodeURIComponent(topic.title)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-knw-red hover:text-red-400 font-mono"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Resources</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
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
