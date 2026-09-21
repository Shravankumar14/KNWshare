import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Clock,
  Calendar,
  Filter,
  CheckCircle2,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { TaskCard } from '../components/tasks/TaskCard';
import { RescheduleSingleModal } from '../components/tasks/RescheduleSingleModal';
import { Link } from 'react-router-dom';

export const TasksPage = () => {
  const { activeGoal, activeUserGoal } = useGoal();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'today' | 'pending' | 'completed' | 'overdue' | 'rescheduled'
  const [taskToReschedule, setTaskToReschedule] = useState(null);
  const [isReschedulingAll, setIsReschedulingAll] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchTasks = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = {};
      if (activeFilter === 'today') {
        params.date = todayStr;
      } else if (activeFilter !== 'all') {
        params.status = activeFilter;
      }

      const res = await api.get('/tasks', { params });
      setTasks(res.data.data);
      if (res.data.summary) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeGoal, activeFilter, isAuthenticated]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      addToast(`Task marked as ${newStatus}!`, 'success');
      await fetchTasks();
    } catch (err) {
      console.error(err);
      addToast('Failed to update task status', 'error');
    }
  };

  const handleSingleReschedule = async (taskId, newDate) => {
    try {
      await api.post(`/tasks/${taskId}/reschedule`, { newDate });
      addToast('Task rescheduled successfully', 'success');
      await fetchTasks();
    } catch (err) {
      console.error(err);
      addToast('Failed to reschedule task', 'error');
    }
  };

  const handleSmartReschedulePending = async () => {
    setIsReschedulingAll(true);
    try {
      const res = await api.post('/tasks/reschedule-pending', {
        userGoalId: activeUserGoal?._id,
      });

      addToast(res.data.data.message || 'Pending tasks smoothly redistributed!', 'success');
      await fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to reschedule pending tasks');
    } finally {
      setIsReschedulingAll(false);
    }
  };

  const pendingOrOverdueCount = summary.overdue + summary.pending;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Banner */}
      <div className="knw-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-knw-red/15 text-red-400 border border-knw-red/30 uppercase tracking-wider font-mono">
              Actionable Execution
            </span>
            <span className="text-xs text-knw-subtle">•</span>
            <span className="text-xs text-knw-muted font-semibold font-mono">{activeGoal?.title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Study Tasks & Daily Actions
          </h1>
          <p className="text-xs sm:text-sm text-knw-muted leading-relaxed">
            Turn your roadmap into bite-sized daily achievements. Missed a session? Our intelligent scheduler redistributes workload without cascading burnout.
          </p>
        </div>

        {/* Quick Task Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 font-mono">
          <div className="bg-knw-surface border border-white/10 p-3 rounded-2xl text-center">
            <div className="text-lg font-bold text-white">{summary.total}</div>
            <div className="text-[10px] uppercase font-bold text-knw-subtle">Total</div>
          </div>
          <div className="bg-emerald-950/30 border border-emerald-700/40 p-3 rounded-2xl text-center">
            <div className="text-lg font-bold text-emerald-400">{summary.completed}</div>
            <div className="text-[10px] uppercase font-bold text-emerald-500">Done</div>
          </div>
          <div className="bg-yellow-950/30 border border-yellow-700/40 p-3 rounded-2xl text-center">
            <div className="text-lg font-bold text-yellow-400">{summary.pending}</div>
            <div className="text-[10px] uppercase font-bold text-yellow-500">Pending</div>
          </div>
          <div className="bg-red-950/30 border border-red-700/40 p-3 rounded-2xl text-center">
            <div className="text-lg font-bold text-red-400">{summary.overdue}</div>
            <div className="text-[10px] uppercase font-bold text-red-500">Overdue</div>
          </div>
        </div>
      </div>

      {/* INTELLIGENT PENDING TASK RESCHEDULER BANNER */}
      {summary.overdue > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-black border border-knw-red/40 p-6 shadow-red flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-knw-red/20 text-knw-red flex items-center justify-center shrink-0 border border-knw-red/40 shadow-red">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono">
                  Intelligent Rescheduling Available
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-knw-red text-white font-mono font-bold">
                  {summary.overdue} Overdue
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Life happened? Automatically adjust your study queue.
              </h3>
              <p className="text-xs text-knw-muted mt-1 leading-relaxed max-w-xl">
                Redistribute overdue tasks across your remaining timetable slots without sacrificing buffer time or exam deadlines.
              </p>
            </div>
          </div>

          <button
            onClick={handleSmartReschedulePending}
            disabled={isReschedulingAll}
            className="btn-red px-5 py-3 text-xs font-bold flex items-center gap-2 shrink-0 shadow-red"
          >
            <RotateCcw className={`w-4 h-4 ${isReschedulingAll ? 'animate-spin' : ''}`} />
            <span>{isReschedulingAll ? 'Redistributing...' : 'Auto-Reschedule All'}</span>
          </button>
        </div>
      )}

      {/* Filter Tabs & Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto font-mono">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'today', label: 'Today' },
              { id: 'pending', label: 'Pending' },
              { id: 'completed', label: 'Completed' },
              { id: 'overdue', label: 'Overdue' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === f.id
                    ? 'bg-knw-red text-white shadow-red'
                    : 'bg-knw-surface text-knw-muted hover:text-white border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-knw-muted font-mono">
            Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-28 knw-skeleton rounded-3xl" />
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onRescheduleClick={(t) => setTaskToReschedule(t)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center knw-card rounded-3xl space-y-3">
            <CheckCircle2 className="w-10 h-10 text-knw-red mx-auto" />
            <h3 className="text-base font-bold text-white">All Caught Up!</h3>
            <p className="text-xs text-knw-muted">No tasks matching the "{activeFilter}" filter.</p>
          </div>
        )}
      </div>

      {/* Single Task Reschedule Modal */}
      {taskToReschedule && (
        <RescheduleSingleModal
          task={taskToReschedule}
          onClose={() => setTaskToReschedule(null)}
          onReschedule={handleSingleReschedule}
        />
      )}
    </div>
  );
};
