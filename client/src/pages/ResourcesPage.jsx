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
import { getGoalDataByIdOrSlug } from '../data/goalRegistry';

export const ResourcesPage = () => {
  const { activeGoal, allGoals } = useGoal();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();

  const goalStaticData = getGoalDataByIdOrSlug(activeGoal, allGoals);

  const [resources, setResources] = useState(goalStaticData?.resources || []);
  const [userSelectedIds, setUserSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState(searchParams.get('stage') || 'all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedExamLevel, setSelectedExamLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const isJee = activeGoal?.slug === 'jee-mains-advanced' ||
    activeGoal?.category === 'engineering_exams' ||
    activeGoal?.title?.toLowerCase().includes('jee');

  const resourceTypes = [
    { id: 'all', label: 'All Formats' },
    { id: 'youtube_playlist', label: 'YouTube Playlists' },
    { id: 'youtube_video', label: 'Videos' },
    { id: 'doc', label: 'Official Docs / Text' },
    { id: 'course_free', label: 'Free Courses' },
    { id: 'book', label: 'Books' },
    { id: 'practice_platform', label: 'Practice / PYQs' },
    { id: 'mock_test', label: 'Mock Test Series' },
  ];

  const subjects = [
    { id: 'all', label: 'All Subjects' },
    { id: 'Physics', label: 'Physics' },
    { id: 'Chemistry', label: 'Chemistry' },
    { id: 'Mathematics', label: 'Mathematics' },
    { id: 'PCM Integrated', label: 'PCM Integrated' },
  ];

  const examLevels = [
    { id: 'all', label: 'All Exam Levels' },
    { id: 'JEE Main', label: 'JEE Main' },
    { id: 'JEE Advanced', label: 'JEE Advanced' },
    { id: 'Both Main & Advanced', label: 'Both Main & Adv' },
  ];

  const difficulties = [
    { id: 'all', label: 'All Difficulties' },
    { id: 'beginner', label: 'Beginner / Foundation' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const fetchResources = async () => {
    const staticResources = goalStaticData?.resources || [];

    if (!activeGoal?._id) {
      setResources(staticResources);
      return;
    }

    setLoading(true);
    try {
      const params = {
        goalId: activeGoal._id,
        stageNumber: selectedStage !== 'all' ? selectedStage : undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        examLevel: selectedExamLevel !== 'all' ? selectedExamLevel : undefined,
        search: searchQuery || undefined,
      };

      const res = await api.get('/resources', { params });
      const apiRes = res.data?.data?.resources;

      if (apiRes && apiRes.length > 0) {
        setResources(apiRes);
      } else {
        // Filter static resources client-side
        let filtered = [...staticResources];
        if (selectedSubject !== 'all') {
          filtered = filtered.filter(r => r.subject === selectedSubject);
        }
        if (selectedExamLevel !== 'all') {
          filtered = filtered.filter(r => r.examLevel === selectedExamLevel);
        }
        if (selectedType !== 'all') {
          filtered = filtered.filter(r => r.type === selectedType);
        }
        if (selectedDifficulty !== 'all') {
          filtered = filtered.filter(r => r.difficulty === selectedDifficulty);
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(r =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.platformOrAuthor?.toLowerCase().includes(q)
          );
        }
        setResources(filtered);
      }

      setUserSelectedIds(res.data?.data?.userSelectedResourceIds || []);
    } catch (err) {
      console.warn('API get resources warning, using high-fidelity curated data:', err.message);
      let filtered = [...staticResources];
      if (selectedSubject !== 'all') {
        filtered = filtered.filter(r => r.subject === selectedSubject);
      }
      if (selectedExamLevel !== 'all') {
        filtered = filtered.filter(r => r.examLevel === selectedExamLevel);
      }
      if (selectedType !== 'all') {
        filtered = filtered.filter(r => r.type === selectedType);
      }
      if (selectedDifficulty !== 'all') {
        filtered = filtered.filter(r => r.difficulty === selectedDifficulty);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(r =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.platformOrAuthor?.toLowerCase().includes(q)
        );
      }
      setResources(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [activeGoal, selectedStage, selectedSubject, selectedExamLevel, selectedType, selectedDifficulty]);

  const handleToggleSelect = async (resourceId) => {
    const isSaved = userSelectedIds.includes(resourceId);
    const nextSaved = isSaved
      ? userSelectedIds.filter(id => id !== resourceId)
      : [...userSelectedIds, resourceId];

    setUserSelectedIds(nextSaved);

    if (!isAuthenticated) {
      addToast(isSaved ? 'Removed from local vault' : 'Saved to local vault!', 'info');
      return;
    }

    try {
      const res = await api.post('/resources/select', {
        goalId: activeGoal._id,
        resourceId,
      });

      if (res.data?.data?.selectedResourceIds) {
        setUserSelectedIds(res.data.data.selectedResourceIds);
      }
      addToast(
        isSaved ? 'Removed from your study vault' : 'Saved to your study vault!',
        'success'
      );
    } catch (err) {
      console.warn('Sync resource select warning:', err.message);
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
              placeholder="Search topics, Ashish Arora, NCERT, MathonGo, PYQs..."
              className="w-full bg-knw-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red transition-colors"
            />
          </form>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 overflow-x-auto flex-wrap sm:flex-nowrap">
            {isJee && (
              <>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-knw-offWhite focus:outline-none focus:border-knw-red"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id} className="bg-knw-surface text-white">
                      {s.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedExamLevel}
                  onChange={(e) => setSelectedExamLevel(e.target.value)}
                  className="bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-knw-offWhite focus:outline-none focus:border-knw-red"
                >
                  {examLevels.map((el) => (
                    <option key={el.id} value={el.id} className="bg-knw-surface text-white">
                      {el.label}
                    </option>
                  ))}
                </select>
              </>
            )}

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
      {loading && resources.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 knw-skeleton rounded-3xl" />
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, idx) => (
            <ResourceCard
              key={resource._id || resource.title || idx}
              resource={resource}
              isSelected={userSelectedIds.includes(resource._id || resource.title)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center knw-card rounded-3xl space-y-3">
          <BookOpen className="w-10 h-10 text-knw-red mx-auto" />
          <h3 className="text-base font-bold text-white">No Resources Matched Your Filters</h3>
          <p className="text-xs text-knw-muted">Try resetting search criteria or selecting another subject.</p>
        </div>
      )}
    </div>
  );
};
