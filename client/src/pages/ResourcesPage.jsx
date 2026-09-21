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
      setResources(res.data.data.resources || []);
      setUserSelectedIds(res.data.data.userSelectedResourceIds || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [activeGoal, selectedStage, selectedType, selectedDifficulty]);

  const handleToggleSelect = async (resourceId) => {
    if (!isAuthenticated) {
      addToast('Sign in to save resources to your vault', 'info');
      return;
    }

    try {
      const res = await api.post('/resources/select', {
        goalId: activeGoal._id,
        resourceId,
      });

      setUserSelectedIds(res.data.data.selectedResourceIds || []);
      addToast(
        userSelectedIds.includes(resourceId)
          ? 'Removed from your study vault'
          : 'Saved to your study vault!',
        'success'
      );
    } catch (err) {
      console.error(err);
      addToast('Failed to update study vault', 'error');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Banner */}
      <div className="knw-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-knw-red/15 text-red-400 border border-knw-red/30 uppercase tracking-wider font-mono">
                Curated Resource Hub
              </span>
              <span className="text-xs text-knw-subtle">•</span>
              <span className="text-xs text-knw-muted font-medium font-mono">
                {activeGoal ? activeGoal.title : 'All Ambitions'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              Top Study Materials, Playlists & Practice
            </h1>
            <p className="text-xs sm:text-sm text-knw-muted max-w-2xl mt-1 leading-relaxed">
              Vetted high-yield resources aligned with each stage of your roadmap. Bookmark items to personalize your learning queue.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-knw-surface px-5 py-3 rounded-2xl border border-white/10 shrink-0 font-mono">
            <div>
              <span className="text-xl font-black text-knw-red">{resources.length}</span>
              <span className="text-[10px] text-knw-muted block">Available</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="text-xl font-black text-white">{userSelectedIds.length}</span>
              <span className="text-[10px] text-knw-muted block">Saved in Vault</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-knw-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, author, LeetCode, docs, or keywords..."
              className="w-full bg-knw-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red transition-colors"
            />
          </form>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-knw-offWhite focus:outline-none focus:border-knw-red"
            >
              {resourceTypes.map((t) => (
                <option key={t.id} value={t.id} className="bg-knw-surface text-white">
                  {t.label}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-knw-offWhite focus:outline-none focus:border-knw-red"
            >
              {difficulties.map((d) => (
                <option key={d.id} value={d.id} className="bg-knw-surface text-white">
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 knw-skeleton rounded-3xl" />
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              isSelected={userSelectedIds.includes(resource._id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center knw-card rounded-3xl space-y-3">
          <BookOpen className="w-10 h-10 text-knw-red mx-auto" />
          <h3 className="text-base font-bold text-white">No Resources Matched Your Filters</h3>
          <p className="text-xs text-knw-muted">Try resetting search criteria or selecting "All Ambitions".</p>
        </div>
      )}
    </div>
  );
};
