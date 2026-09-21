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
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
              Actionable Execution
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{activeGoal?.title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study Tasks & Daily Actions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Turn your roadmap into bite-sized daily achievements. Missed a session? Our intelligent scheduler redistributes workload without cascading burnout.
          </p>
        </div>

        {/* Quick Task Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-center">
            <div className="text-lg font-bold text-slate-900">{summary.total}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-center">
            <div className="text-lg font-bold text-emerald-700">{summary.completed}</div>
            <div className="text-[10px] uppercase font-bold text-emerald-600">Done</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-center">
            <div className="text-lg font-bold text-amber-700">{summary.pending}</div>
            <div className="text-[10px] uppercase font-bold text-amber-600">Pending</div>
          </div>
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-center">
            <div className="text-lg font-bold text-rose-700">{summary.overdue}</div>
            <div className="text-[10px] uppercase font-bold text-rose-600">Overdue</div>
          </div>
        </div>
      </div>

      {/* INTELLIGENT PENDING TASK RESCHEDULER BANNER */}
      {summary.overdue > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-amber-50 to-indigo-50 border border-amber-200 p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Intelligent Rescheduling Available
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  {summary.overdue} overdue task(s)
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Life happened? Don't let missed tasks pile up.
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                Rather than dumping every missed assignment onto tomorrow, our scheduling engine inspects your daily hour capacity and spreads tasks smoothly across available upcoming days.
              </p>
            </div>
          </div>

          <button
            onClick={handleSmartReschedulePending}
            disabled={isReschedulingAll}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all shrink-0 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isReschedulingAll ? 'Balancing Schedule...' : '⚡ Smart Reschedule Pending Tasks'}</span>
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'today', label: "Today's Agenda" },
          { id: 'pending', label: 'Pending' },
          { id: 'overdue', label: 'Overdue' },
          { id: 'rescheduled', label: 'Rescheduled' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
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
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-soft">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No tasks in this view</h3>
          <p className="text-xs text-slate-500">
            {activeFilter === 'today'
              ? 'Nothing scheduled for today. Explore your timetable to generate more tasks.'
              : 'You have no tasks matching this filter.'}
          </p>
          <Link
            to="/timetable"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            <span>Open Timetable</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Single Task Reschedule Modal */}
      <RescheduleSingleModal
        task={taskToReschedule}
        isOpen={!!taskToReschedule}
        onClose={() => setTaskToReschedule(null)}
        onConfirm={handleSingleReschedule}
      />

    </div>
  );
};
