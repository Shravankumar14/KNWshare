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
      case 'high': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return { text: 'Completed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'overdue': return { text: 'Overdue', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'rescheduled': return { text: `Rescheduled (${task.rescheduleCount || 1}x)`, cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'in_progress': return { text: 'In Progress', cls: 'bg-blue-50 text-blue-700 border-blue-200' };
      default: return { text: 'Pending', cls: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const statusInfo = getStatusBadge(task.status);

  return (
    <div
      className={`p-5 rounded-3xl border transition-all bg-white shadow-soft hover:shadow-soft-lg ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/20'
          : isOverdue
          ? 'border-rose-200 bg-rose-50/10'
          : 'border-slate-200 hover:border-brand-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        
        {/* Checkbox & Task info */}
        <div className="flex items-start gap-3.5">
          <button
            onClick={() => onStatusChange(task._id, isCompleted ? 'pending' : 'completed')}
            className={`mt-1 shrink-0 transition-colors ${
              isCompleted ? 'text-emerald-600' : 'text-slate-300 hover:text-brand-600'
            }`}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 fill-emerald-100" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.cls}`}>
                {statusInfo.text}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityBadge(task.priority)} uppercase`}>
                {task.priority}
              </span>
              {task.stageNumber && (
                <span className="text-[10px] text-slate-500 font-medium">
                  Stage {task.stageNumber} • {task.topicTitle}
                </span>
              )}
            </div>

            <h3 className={`text-base font-bold mt-1.5 ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
              {task.title}
            </h3>

            {task.description && (
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Date & Time info */}
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {task.date}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {task.startTime} – {task.endTime} ({task.durationMinutes}m)
              </span>
              {task.originalDate && task.originalDate !== task.date && (
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  Originally scheduled: {task.originalDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {!isCompleted && (
            <button
              onClick={() => onRescheduleClick(task)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              title="Reschedule to another day"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Reschedule</span>
            </button>
          )}

          {isCompleted && task.completedAt && (
            <span className="text-[10px] text-emerald-600 font-semibold">
              Done on {new Date(task.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
