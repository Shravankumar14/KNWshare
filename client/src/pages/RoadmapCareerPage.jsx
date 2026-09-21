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
  Layers
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

export const RoadmapCareerPage = () => {
  const { activeGoal, activeUserGoal } = useGoal();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  const [roadmapData, setRoadmapData] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [completedStages, setCompletedStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'career' | 'experts'
  const [selectedExpertForBooking, setSelectedExpertForBooking] = useState(null);

  // Fetch roadmap, user progress, and mentors for active goal
  const fetchRoadmap = async () => {
    if (!activeGoal?._id) return;
    setLoading(true);
    try {
      const res = await api.get(`/roadmaps/${activeGoal._id}`);
      setRoadmapData(res.data.data.roadmap);
      setMentors(res.data.data.mentors || []);
      setCompletedTopics(res.data.data.userProgress?.completedTopics || []);
      setCompletedStages(res.data.data.userProgress?.completedStages || []);
    } catch (err) {
      console.error('Error loading roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [activeGoal]);

  const handleToggleTopic = async (stageNumber, topicTitle) => {
    if (!isAuthenticated) {
      addToast('Please sign in to track and save your progress!', 'info');
      return;
    }

    try {
      const res = await api.post('/roadmaps/toggle-topic', {
        goalId: activeGoal._id,
        stageNumber,
        topicTitle,
      });

      setCompletedTopics(res.data.data.completedTopics);
      setCompletedStages(res.data.data.completedStages);
      addToast('Topic progress updated!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to update progress', 'error');
    }
  };

  if (!activeGoal) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto space-y-4">
        <Compass className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">No Goal Selected Yet</h2>
        <p className="text-xs text-slate-500">
          Select what you want to achieve on the front page to view your structured roadmap.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
        >
          <span>Choose a Goal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const totalStagesCount = roadmapData?.stages?.length || 0;
  const stagesMasteredCount = completedStages.length;
  const overallRoadmapPercent = totalStagesCount > 0
    ? Math.round((stagesMasteredCount / totalStagesCount) * 100)
    : (activeUserGoal?.overallProgress || 0);

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Goal Overview & Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
                Active Goal Curriculum
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                ~{activeGoal.estimatedMonths || 6} Months Blueprint
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeGoal.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              {activeGoal.description}
            </p>
          </div>

          {/* Quick Progress Indicator & Next Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Roadmap Mastery</span>
                <span className="text-brand-600">{overallRoadmapPercent}%</span>
              </div>
              <div className="w-44 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${overallRoadmapPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {stagesMasteredCount} of {totalStagesCount} stages mastered
              </span>
            </div>

            <Link
              to="/timetable"
              className="px-4 py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Timetable</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs (Roadmap, Career Guidance, Expert Mentors) on the SAME page */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'roadmap'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Interactive Roadmap ({totalStagesCount} Stages)</span>
          </button>

          <button
            onClick={() => setActiveTab('career')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'career'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Career Path Guidance Ladder</span>
          </button>

          <button
            onClick={() => setActiveTab('experts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'experts'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Stage-by-Stage Curriculum</h2>
              <p className="text-xs text-slate-500">
                Check off topics as you learn. Stages adapt as you complete prior prerequisites.
              </p>
            </div>

            <Link
              to="/resources"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Explore All Resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-44 bg-white rounded-3xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : roadmapData?.stages?.length > 0 ? (
            <div className="space-y-6">
              {roadmapData.stages.map((stage) => (
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
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
              No roadmap stages configured for this goal yet.
            </div>
          )}
        </div>
      )}

      {/* 2. CAREER PATH GUIDANCE LADDER */}
      {activeTab === 'career' && (
        <CareerPathGuidance
          careerPath={activeGoal.careerPath}
          targetRoles={activeGoal.targetRoles}
          goalTitle={activeGoal.title}
        />
      )}

      {/* 3. EXPERT GUIDANCE & ONE-TO-ONE SESSIONS */}
      {activeTab === 'experts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  Verified Mentors
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Connect with Real Industry Mentors
              </h2>
              <p className="text-xs text-slate-500">
                Book a 1-on-1 video call for architecture review, interview drills, and personalized doubt resolution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((expert) => (
              <ExpertCard
                key={expert._id}
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
