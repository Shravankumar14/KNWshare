import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle,
  Tag
} from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { ResourceCard } from '../components/resources/ResourceCard';
import { useSearchParams } from 'react-router-dom';

export const ResourcesPage = () => {
  const { activeGoal } = useGoal();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();

  const [resources, setResources] = useState([]);
  const [userSelectedIds, setUserSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState(searchParams.get('stage') || 'all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const resourceTypes = [
    { id: 'all', label: 'All Formats' },
    { id: 'youtube_playlist', label: 'YouTube Playlists' },
    { id: 'youtube_video', label: 'Videos' },
    { id: 'doc', label: 'Documentation' },
    { id: 'course_free', label: 'Free Courses' },
    { id: 'book', label: 'Books' },
    { id: 'practice_platform', label: 'Practice / LeetCode' },
    { id: 'project', label: 'Project Ideas' },
  ];

  const difficulties = [
    { id: 'all', label: 'All Difficulties' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const fetchResources = async () => {
    if (!activeGoal?._id) return;
    setLoading(true);
    try {
      const params = {
        goalId: activeGoal._id,
        stageNumber: selectedStage !== 'all' ? selectedStage : undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        search: searchQuery || undefined,
      };

      const res = await api.get('/resources', { params });
      setResources(res.data.data);
      setUserSelectedIds(res.data.userSelectedIds || []);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [activeGoal, selectedStage, selectedType, selectedDifficulty, searchQuery]);

  const handleToggleSelect = async (resourceId) => {
    if (!isAuthenticated) {
      addToast('Sign in to bookmark resources to your study plan!', 'info');
      return;
    }

    try {
      const res = await api.post('/resources/toggle-select', {
        resourceId,
        goalId: activeGoal._id,
      });

      const idStr = resourceId.toString();
      if (userSelectedIds.includes(idStr)) {
        setUserSelectedIds(userSelectedIds.filter(id => id !== idStr));
        addToast('Resource removed from your plan', 'info');
      } else {
        setUserSelectedIds([...userSelectedIds, idStr]);
        addToast('Resource bookmarked to your study plan!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update bookmark', 'error');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
              Curated Resources Hub
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{activeGoal?.title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Curated Study Materials & Practice Platforms
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Every resource is mapped to an exact roadmap stage and topic so you never waste hours searching for what to study next.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search topics, author, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
            {/* Stage Filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Stages</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                <option key={s} value={s}>Stage {s}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
            >
              {resourceTypes.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
            >
              {difficulties.map(d => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-56 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(res => (
            <ResourceCard
              key={res._id}
              resource={res}
              isSelected={userSelectedIds.includes(res._id.toString())}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No resources found for this filter</h3>
          <p className="text-xs text-slate-500">
            Try choosing 'All Stages' or clearing the search terms to discover more study materials.
          </p>
          <button
            onClick={() => {
              setSelectedStage('all');
              setSelectedType('all');
              setSelectedDifficulty('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-brand-600"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
