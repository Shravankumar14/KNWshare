import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle,
  Tag,
  FileText,
  Video,
  GraduationCap,
  Download,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { ResourceCard } from '../components/resources/ResourceCard';
import { useParams, useSearchParams } from 'react-router-dom';
import { getGoalDataByIdOrSlug, resolveCanonicalGoalSlug } from '../data/goalRegistry';

export const ResourcesPage = () => {
  const { goalSlug: urlGoalSlug } = useParams();
  const { activeGoal, allGoals, selectedGoalSlug, setSelectedGoalSlug } = useGoal();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();

  // Target Goal Slug
  const currentSlug = resolveCanonicalGoalSlug(urlGoalSlug || selectedGoalSlug || activeGoal?.slug || 'jee-main-advanced');

  // Sync GoalContext with URL if needed
  useEffect(() => {
    if (urlGoalSlug && resolveCanonicalGoalSlug(urlGoalSlug) !== selectedGoalSlug) {
      setSelectedGoalSlug(urlGoalSlug);
    }
  }, [urlGoalSlug, selectedGoalSlug, setSelectedGoalSlug]);

  const [resources, setResources] = useState([]);
  const [userSelectedIds, setUserSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Controlled Filter State (§8 & §4 query params)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState(searchParams.get('stage') || 'all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFree, setSelectedFree] = useState('all'); // 'all' | 'true' | 'false'
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'curated' | 'faculty'

  const resourceTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'video', label: 'Videos' },
    { id: 'playlist', label: 'Playlists' },
    { id: 'documentation', label: 'Documentation / Notes' },
    { id: 'book', label: 'Books' },
    { id: 'practice', label: 'Practice & PYQs' },
    { id: 'course', label: 'Courses' },
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  // Fetch Resources directly from /api/resources with controlled filters
  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {
        goal: currentSlug,
        stage: selectedStage !== 'all' ? selectedStage : undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        free: selectedFree !== 'all' ? selectedFree : undefined,
        search: searchQuery.trim() || undefined,
      };

      const res = await api.get('/resources', { params });
      const items = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.resources || []);
      setResources(items);

      if (res.data?.data?.userSelectedResourceIds) {
        setUserSelectedIds(res.data.data.userSelectedResourceIds);
      }
    } catch (err) {
      console.warn('API get resources warning:', err.message);
      // Try local goal static data if matching goal
      const staticGoal = getGoalDataByIdOrSlug(currentSlug, allGoals);
      if (staticGoal?.resources) {
        setResources(staticGoal.resources);
      } else {
        setResources([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [currentSlug, selectedStage, selectedType, selectedFree, selectedDifficulty]);

  const handleToggleSelect = async (resourceId) => {
    const isSaved = userSelectedIds.includes(resourceId);
    const nextSaved = isSaved
      ? userSelectedIds.filter((id) => id !== resourceId)
      : [...userSelectedIds, resourceId];

    setUserSelectedIds(nextSaved);

    if (!isAuthenticated) {
      addToast(isSaved ? 'Removed from local vault' : 'Saved to local vault!', 'info');
      return;
    }

    try {
      await api.post('/resources/select', {
        goalId: activeGoal?._id,
        resourceId,
      }).catch(() => null);

      addToast(isSaved ? 'Removed from vault' : 'Saved to vault!', 'success');
    } catch (err) {
      console.warn('Sync resource select warning:', err.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  // Tab Filtering (All vs Curated vs Faculty)
  const displayedResources = resources.filter((r) => {
    if (activeTab === 'faculty') return r.sourceType === 'teacher';
    if (activeTab === 'curated') return r.sourceType !== 'teacher';
    return true;
  });

  const currentGoalMeta = activeGoal?.slug === currentSlug
    ? activeGoal
    : (allGoals.find((g) => resolveCanonicalGoalSlug(g.slug) === currentSlug) || {
        title: currentSlug.replace(/-/g, ' ').toUpperCase()
      });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Banner */}
      <div className="knw-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-knw-border">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-knw-redBright to-knw-redDark shadow-red" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-knw-red/15 text-knw-red border border-knw-red/30 uppercase tracking-wider font-mono">
                Resource Catalog
              </span>
              <span className="text-xs text-knw-subtle">•</span>
              <span className="text-xs text-knw-muted font-medium font-mono">
                {currentGoalMeta.title}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              Curated Materials & Faculty Contributions
            </h1>
            <p className="text-xs sm:text-sm text-knw-muted max-w-2xl mt-1 leading-relaxed">
              Strictly goal-scoped study resources, video walkthroughs, and vetted notes for {currentGoalMeta.title}. Zero fallback content.
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
              <span className="text-xl font-black text-white">
                {resources.filter((r) => r.sourceType === 'teacher').length}
              </span>
              <span className="text-[10px] text-knw-muted block">Faculty Notes</span>
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
              placeholder={`Search ${currentGoalMeta.title} topics, documentation, problems...`}
              className="w-full bg-knw-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red transition-colors"
            />
          </form>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 overflow-x-auto flex-wrap sm:flex-nowrap">
            {/* Type */}
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

            {/* Free / Paid */}
            <select
              value={selectedFree}
              onChange={(e) => setSelectedFree(e.target.value)}
              className="bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-knw-offWhite focus:outline-none focus:border-knw-red"
            >
              <option value="all" className="bg-knw-surface text-white">All Pricing</option>
              <option value="true" className="bg-knw-surface text-white">Free Only</option>
              <option value="false" className="bg-knw-surface text-white">Paid</option>
            </select>

            {/* Difficulty */}
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

        {/* Source Sub-Tabs (All vs Platform vs Faculty) */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white'
            }`}
          >
            All Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('curated')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'curated'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white'
            }`}
          >
            Curated Platform ({resources.filter((r) => r.sourceType !== 'teacher').length})
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'faculty'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty Verified ({resources.filter((r) => r.sourceType === 'teacher').length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Resource Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 knw-skeleton rounded-3xl" />
          ))}
        </div>
      ) : displayedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedResources.map((resource) => (
            <ResourceCard
              key={resource._id || resource.url}
              resource={resource}
              isSelected={userSelectedIds.includes(resource._id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 knw-card rounded-3xl border border-knw-border p-8 max-w-lg mx-auto space-y-3">
          <BookOpen className="w-10 h-10 text-knw-muted mx-auto" />
          <h3 className="text-sm font-bold text-white">No Resources Found</h3>
          <p className="text-xs text-knw-muted">
            No resources match your active filters for {currentGoalMeta.title}. Try changing your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
};
