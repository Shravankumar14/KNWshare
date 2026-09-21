import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Tag,
  ArrowRight
} from 'lucide-react';

export const TaskCard = ({ task, onStatusChange, onRescheduleClick }) => {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.status === 'overdue';
  const isRescheduled = task.status === 'rescheduled';

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'high': return 'bg-red-950/40 text-red-400 border-red-700/50';
      case 'medium': return 'bg-yellow-950/40 text-yellow-400 border-yellow-700/50';
      case 'low': return 'bg-white/5 text-knw-muted border-white/10';
      default: return 'bg-white/5 text-knw-muted border-white/10';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return { text: 'Completed', cls: 'bg-emerald-950/40 text-emerald-400 border-emerald-700/50' };
      case 'overdue': return { text: 'Overdue', cls: 'bg-red-950/40 text-red-400 border-red-700/50 animate-pulse' };
      case 'rescheduled': return { text: `Rescheduled (${task.rescheduleCount || 1}x)`, cls: 'bg-knw-red/15 text-red-300 border-knw-red/40' };
      case 'in_progress': return { text: 'In Progress', cls: 'bg-yellow-950/40 text-yellow-400 border-yellow-700/50' };
      default: return { text: 'Pending', cls: 'bg-white/5 text-knw-muted border-white/10' };
    }
  };

  const statusInfo = getStatusBadge(task.status);

  return (
    <div
      className={`p-5 rounded-3xl border transition-all knw-card ${
        isCompleted
          ? 'border-emerald-500/30 bg-emerald-950/10'
          : isOverdue
          ? 'border-red-500/40 bg-red-950/10'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Checkbox & Task info */}
        <div className="flex items-start gap-3.5">
          <button
            onClick={() => onStatusChange(task._id, isCompleted ? 'pending' : 'completed')}
            className={`mt-1 shrink-0 transition-colors ${
              isCompleted ? 'text-emerald-400' : 'text-knw-subtle hover:text-knw-red'
            }`}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 fill-emerald-900/40" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusInfo.cls}`}>
                {statusInfo.text}
              </span>

              {task.priority && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border capitalize ${getPriorityBadge(task.priority)}`}>
                  {task.priority} Priority
                </span>
              )}

              {task.stageNumber && (
                <span className="text-[10px] text-knw-subtle font-mono">
                  Stage {task.stageNumber}
                </span>
              )}
            </div>

            <h3 className={`text-sm font-bold transition-all ${
              isCompleted ? 'line-through text-knw-subtle' : 'text-white'
            }`}>
              {task.title}
            </h3>

            {task.description && (
              <p className="text-xs text-knw-muted mt-1 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {task.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="knw-tag-grey text-[10px]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timing and Reschedule action */}
        <div className="flex flex-col items-end gap-3 shrink-0 font-mono">
          <div className="text-right">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-knw-red" />
              <span>{task.allocatedMinutes || 60}m</span>
            </span>
            <span className="text-[10px] text-knw-subtle block mt-0.5">
              {task.scheduledDate || 'Today'}
            </span>
          </div>

          {!isCompleted && onRescheduleClick && (
            <button
              onClick={() => onRescheduleClick(task)}
              className="px-2.5 py-1 text-[11px] font-bold text-knw-red hover:text-white hover:bg-knw-red/20 rounded-lg border border-knw-red/30 transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reschedule</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
