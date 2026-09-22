import React, { useState, useEffect } from 'react';
import {
  Compass,
  Map,
  Sparkles,
  Award,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Layers,
  Clock,
  Briefcase,
  Filter
} from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { RoadmapStageCard } from '../components/roadmap/RoadmapStageCard';
import { CareerPathGuidance } from '../components/roadmap/CareerPathGuidance';
import { ExpertCard } from '../components/expert/ExpertCard';
import { BookingModal } from '../components/expert/BookingModal';
import { Link } from 'react-router-dom';
import { getGoalDataByIdOrSlug } from '../data/goalRegistry';

export const RoadmapCareerPage = () => {
  const { activeGoal, activeUserGoal, allGoals } = useGoal();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  // Resolved goal registry fallback
  const goalStaticData = getGoalDataByIdOrSlug(activeGoal, allGoals);

  const [roadmapData, setRoadmapData] = useState(goalStaticData?.roadmap || null);
  const [mentors, setMentors] = useState(goalStaticData?.mentors || []);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [completedStages, setCompletedStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'career' | 'experts'
  const [selectedExpertForBooking, setSelectedExpertForBooking] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');

  // Fetch roadmap, user progress, and mentors for active goal
  const fetchRoadmap = async () => {
    const staticData = getGoalDataByIdOrSlug(activeGoal, allGoals);

    if (!activeGoal?._id) {
      if (staticData?.roadmap) {
        setRoadmapData(staticData.roadmap);
        setMentors(staticData.mentors || []);
      }
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/roadmaps/${activeGoal._id}`);
      const fetchedRoadmap = res.data?.data?.roadmap;
      const apiMentors = res.data?.data?.mentors;

      if (fetchedRoadmap && fetchedRoadmap.stages?.length > 0) {
        setRoadmapData(fetchedRoadmap);
      } else if (staticData?.roadmap) {
        setRoadmapData(staticData.roadmap);
      }

      if (apiMentors && apiMentors.length > 0) {
        setMentors(apiMentors);
      } else if (staticData?.mentors) {
        setMentors(staticData.mentors);
      }

      setCompletedTopics(res.data?.data?.userProgress?.completedTopics || []);
      setCompletedStages(res.data?.data?.userProgress?.completedStages || []);
    } catch (err) {
      console.warn('Roadmap API returned error, activating high-fidelity fallback:', err.message);
      if (staticData?.roadmap) {
        setRoadmapData(staticData.roadmap);
      }
      if (staticData?.mentors) {
        setMentors(staticData.mentors);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset subject filter when switching goals
    setSelectedSubject('All Subjects');
    fetchRoadmap();
  }, [activeGoal]);

  const handleToggleTopic = async (stageNumber, topicTitle) => {
    const topicKey = `${stageNumber}:${topicTitle}`;
    const nextCompleted = completedTopics.includes(topicKey)
      ? completedTopics.filter(t => t !== topicKey)
      : [...completedTopics, topicKey];

    // Optimistically update UI
    setCompletedTopics(nextCompleted);

    if (!isAuthenticated) {
      addToast('Progress updated locally! Sign in to sync across devices.', 'info');
      return;
    }

    try {
      const res = await api.post('/roadmaps/toggle-topic', {
        goalId: activeGoal._id,
        stageNumber,
        topicTitle,
      });

      if (res.data?.data?.completedTopics) {
        setCompletedTopics(res.data.data.completedTopics);
      }
      if (res.data?.data?.completedStages) {
        setCompletedStages(res.data.data.completedStages);
      }
      addToast('Topic progress updated!', 'success');
    } catch (err) {
      console.warn('Could not sync progress to server:', err.message);
    }
  };

  if (!activeGoal) {
    return (
      <div className="text-center py-20 knw-card rounded-3xl p-8 max-w-lg mx-auto space-y-4 border border-knw-border">
        <Compass className="w-12 h-12 text-knw-red mx-auto" />
        <h2 className="text-lg font-bold text-white">No Goal Selected Yet</h2>
        <p className="text-xs text-knw-muted">
          Select what you want to achieve on the front page to view your structured roadmap.
        </p>
        <Link
          to="/"
          className="btn-red inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold shadow-red"
        >
          <span>Choose a Goal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const stagesList = roadmapData?.stages || [];
  const subjectsAvailable = Array.from(new Set(stagesList.map(s => s.subject).filter(Boolean)));
  const hasSubjects = subjectsAvailable.length > 1;

  const filteredStages = selectedSubject === 'All Subjects'
    ? stagesList
    : stagesList.filter(s => s.subject === selectedSubject);

  const totalStagesCount = stagesList.length;
  const stagesMasteredCount = completedStages.length;
  const overallRoadmapPercent = totalStagesCount > 0
    ? Math.round((stagesMasteredCount / totalStagesCount) * 100)
    : (activeUserGoal?.overallProgress || 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Top Banner: Goal Overview & Tabs (Netflix Black + Red Theme) */}
      <div className="knw-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-knw-red/15 text-red-400 border border-knw-red/30 uppercase tracking-wider font-mono">
                Active Goal Curriculum
              </span>
              <span className="text-xs text-knw-subtle">•</span>
              <span className="text-xs text-knw-muted font-medium font-mono">
                ~{activeGoal.estimatedMonths || 12} Months Blueprint
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeGoal.title}
            </h1>
            <p className="text-xs sm:text-sm text-knw-muted max-w-2xl leading-relaxed">
              {activeGoal.description}
            </p>
          </div>

          {/* Quick Progress Indicator & Next Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-knw-surface p-4 rounded-2xl border border-white/10">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                <span>Roadmap Mastery</span>
                <span className="text-knw-red font-mono">{overallRoadmapPercent}%</span>
              </div>
              <div className="w-44 h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-knw-red to-red-400 shadow-red rounded-full transition-all duration-500"
                  style={{ width: `${overallRoadmapPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-knw-muted mt-1 block font-mono">
                {stagesMasteredCount} of {totalStagesCount} stages mastered
              </span>
            </div>

            <Link
              to="/timetable"
              className="btn-red px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-red"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Timetable</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs (Roadmap, Career Guidance, Expert Mentors) */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'roadmap'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Interactive Roadmap ({totalStagesCount} Stages)</span>
          </button>

          <button
            onClick={() => setActiveTab('career')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'career'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Post-Goal Career & Admissions</span>
          </button>

          <button
            onClick={() => setActiveTab('experts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'experts'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1-on-1 Expert Mentors ({mentors.length})</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* 1. ROADMAP TIMELINE */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-knw-red animate-pulse" />
                Stage-by-Stage Curriculum
              </h2>
              <p className="text-xs text-knw-muted">
                Check off topics as you study. Verified resources and practice questions are tagged on each item.
              </p>
            </div>

            <Link
              to="/resources"
              className="text-xs font-bold text-knw-red hover:text-red-300 flex items-center gap-1 font-mono"
            >
              <span>Explore All Resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Subject Filter Tabs (Physics / Chemistry / Mathematics) */}
          {hasSubjects && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-mono text-knw-muted mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-knw-red" />
                Subject:
              </span>
              {['All Subjects', ...subjectsAvailable].map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedSubject === subject
                      ? 'bg-knw-red text-white shadow-red'
                      : 'bg-knw-surface border border-white/10 text-knw-muted hover:text-white'
                  }`}
                >
                  {subject} {subject !== 'All Subjects' && `(${stagesList.filter(s => s.subject === subject).length})`}
                </button>
              ))}
            </div>
          )}

          {loading && !roadmapData ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-44 knw-skeleton rounded-3xl" />
              ))}
            </div>
          ) : filteredStages.length > 0 ? (
            <div className="space-y-6">
              {filteredStages.map((stage) => (
                <RoadmapStageCard
                  key={stage.stageNumber}
                  stage={stage}
                  goalId={activeGoal._id}
                  completedTopics={completedTopics}
                  completedStages={completedStages}
                  onToggleTopic={handleToggleTopic}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center knw-card rounded-3xl text-xs text-knw-muted">
              No roadmap stages configured for this goal yet.
            </div>
          )}
        </div>
      )}

      {/* 2. CAREER PATH GUIDANCE LADDER */}
      {activeTab === 'career' && (
        <CareerPathGuidance
          careerPath={activeGoal.careerPath || goalStaticData?.goal?.careerPath || []}
          targetRoles={activeGoal.targetRoles || goalStaticData?.goal?.targetRoles || []}
          goalTitle={activeGoal.title}
          engineeringBranches={goalStaticData?.engineeringBranches || []}
          counselingLadder={goalStaticData?.counselingLadder || []}
        />
      )}

      {/* 3. EXPERT GUIDANCE & ONE-TO-ONE SESSIONS */}
      {activeTab === 'experts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-knw-red/15 text-red-400 border border-knw-red/30 uppercase tracking-wider font-mono">
                  Verified Mentors & Top Rankers
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                Connect with Real Mentors for {activeGoal.title}
              </h2>
              <p className="text-xs text-knw-muted">
                Book 1-on-1 sessions for concept clarity, revision scheduling, doubt clearance, and strategic guidance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((expert) => (
              <ExpertCard
                key={expert._id || expert.name}
                expert={expert}
                onBook={(exp) => setSelectedExpertForBooking(exp)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        expert={selectedExpertForBooking}
        isOpen={!!selectedExpertForBooking}
        onClose={() => setSelectedExpertForBooking(null)}
        goalId={activeGoal._id}
      />

    </div>
  );
};
