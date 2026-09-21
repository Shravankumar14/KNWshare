import React, { useState } from 'react';
import { X, Calendar, RotateCcw } from 'lucide-react';

export const RescheduleSingleModal = ({ task, isOpen, onClose, onConfirm }) => {
  const [newDate, setNewDate] = useState(task?.date || new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(task._id, newDate);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to reschedule task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="knw-glass rounded-3xl max-w-md w-full border border-knw-red/40 shadow-red-lg overflow-hidden relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />

        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-knw-red" />
            <h3 className="text-base font-bold text-white">Reschedule Task</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-knw-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-knw-subtle uppercase tracking-wider block mb-1">
              Task
            </span>
            <p className="text-xs font-bold text-white">{task.title}</p>
            <p className="text-[11px] text-knw-muted font-mono">Currently scheduled: {task.date || task.scheduledDate || 'Today'}</p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
              Select New Target Date
            </label>
            <input
              type="date"
              required
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-knw-surface border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-knw-red"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono font-bold text-knw-muted hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-red px-5 py-2 text-xs font-bold shadow-red"
            >
              {loading ? 'Rescheduling...' : 'Confirm New Date'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
