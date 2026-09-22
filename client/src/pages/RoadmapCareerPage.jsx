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
  Filter,
  CheckCircle,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { RoadmapStageCard } from '../components/roadmap/RoadmapStageCard';
import { CareerPathGuidance } from '../components/roadmap/CareerPathGuidance';
import { ExpertCard } from '../components/expert/ExpertCard';
import { BookingModal } from '../components/expert/BookingModal';
import { Link, useParams } from 'react-router-dom';
import { getGoalDataByIdOrSlug, resolveCanonicalGoalSlug } from '../data/goalRegistry';

export const RoadmapCareerPage = ({ initialTab = 'roadmap' }) => {
  const { goalSlug: urlGoalSlug } = useParams();
  const { activeGoal, activeUserGoal, allGoals, selectedGoalSlug, setSelectedGoalSlug } = useGoal();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  // Target slug from URL or context
  const currentSlug = resolveCanonicalGoalSlug(urlGoalSlug || selectedGoalSlug || activeGoal?.slug || 'jee-main-advanced');

  // Keep GoalContext in sync with URL
  useEffect(() => {
    if (urlGoalSlug && resolveCanonicalGoalSlug(urlGoalSlug) !== selectedGoalSlug) {
      setSelectedGoalSlug(urlGoalSlug);
    }
  }, [urlGoalSlug, selectedGoalSlug, setSelectedGoalSlug]);

  const goalStaticData = getGoalDataByIdOrSlug(currentSlug, allGoals);

  const [roadmapData, setRoadmapData] = useState(goalStaticData?.roadmap || null);
  const [mentors, setMentors] = useState(goalStaticData?.mentors || []);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [completedStages, setCompletedStages] = useState([]);
  const [pacingData, setPacingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab); // 'roadmap' | 'pacing' | 'career' | 'experts'
  const [selectedExpertForBooking, setSelectedExpertForBooking] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');

  // Fetch roadmap, user progress, and personalized pacing
  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      // 1. Fetch Goal-scoped Roadmap (Additive /api or /api/v1)
      const res = await api.get(`/goals/${currentSlug}/roadmap`);
      const fetched = res.data?.data?.roadmap;
      if (fetched && fetched.stages?.length > 0) {
        setRoadmapData(fetched);
      } else if (goalStaticData?.roadmap) {
        setRoadmapData(goalStaticData.roadmap);
      }

      // 2. If authenticated, fetch personalized pacing and progress
      if (isAuthenticated) {
        try {
          const pacingRes = await api.get(`/users/me/roadmap/${currentSlug}`);
          if (pacingRes.data?.data?.pacing) {
            setPacingData(pacingRes.data.data.pacing);
          }
          if (pacingRes.data?.data?.completedTopics) {
            setCompletedTopics(pacingRes.data.data.completedTopics);
          }
        } catch (pacingErr) {
          console.warn('Personalized pacing fetch error:', pacingErr.message);
        }
      } else if (activeGoal?._id) {
        // Fallback to general userProgress if available
        try {
          const progRes = await api.get(`/roadmaps/${activeGoal._id}`);
          if (progRes.data?.data?.userProgress?.completedTopics) {
            setCompletedTopics(progRes.data.data.userProgress.completedTopics);
          }
          if (progRes.data?.data?.mentors) {
            setMentors(progRes.data.data.mentors);
          }
        } catch {}
      }
    } catch (err) {
      console.warn('Goal roadmap API error, using static goal data if matching:', err.message);
      if (goalStaticData?.roadmap) {
        setRoadmapData(goalStaticData.roadmap);
      }
      if (goalStaticData?.mentors) {
        setMentors(goalStaticData.mentors);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedSubject('All Subjects');
    fetchRoadmap();
  }, [currentSlug, isAuthenticated]);

  const handleToggleTopic = async (stageNumber, topicTitle, topicId) => {
    const topicKey = `${stageNumber}:${topicTitle}`;
    const isCurrentlyDone = completedTopics.includes(topicKey) || (topicId && completedTopics.includes(topicId.toString()));

    const nextCompleted = isCurrentlyDone
      ? completedTopics.filter((t) => t !== topicKey && t !== topicId?.toString())
      : [...completedTopics, topicId ? topicId.toString() : topicKey];

    // Optimistically update UI
    setCompletedTopics(nextCompleted);

    if (!isAuthenticated) {
      addToast('Progress updated locally! Sign in to sync across devices.', 'info');
      return;
    }

    try {
      const newStatus = isCurrentlyDone ? 'not_started' : 'completed';
      // Call additive progress API (§4)
      await api.patch(`/users/me/progress/${topicId || topicKey}`, {
        status: newStatus,
        goalSlug: currentSlug,
        goalId: activeGoal?._id,
        stageNumber,
        topicTitle,
        topicKey
      });

      addToast(newStatus === 'completed' ? 'Topic marked completed!' : 'Topic marked pending', 'success');
      // Refresh personalized pacing calculations
      const pacingRes = await api.get(`/users/me/roadmap/${currentSlug}`).catch(() => null);
      if (pacingRes?.data?.data?.pacing) {
        setPacingData(pacingRes.data.data.pacing);
      }
    } catch (err) {
      console.warn('Could not sync progress to server:', err.message);
    }
  };

  const stagesList = roadmapData?.stages || [];
  const subjectsAvailable = Array.from(new Set(stagesList.map((s) => s.subject).filter(Boolean)));
  const hasSubjects = subjectsAvailable.length > 1;

  const filteredStages = selectedSubject === 'All Subjects'
    ? stagesList
    : stagesList.filter((s) => s.subject === selectedSubject);

  const totalStagesCount = stagesList.length;
  const stagesMasteredCount = completedStages.length;
  const overallRoadmapPercent = pacingData?.summary?.completionPercentage !== undefined
    ? pacingData.summary.completionPercentage
    : (totalStagesCount > 0 ? Math.round((stagesMasteredCount / totalStagesCount) * 100) : 0);

  const currentGoalMeta = activeGoal?.slug === currentSlug
    ? activeGoal
    : (allGoals.find((g) => resolveCanonicalGoalSlug(g.slug) === currentSlug) || goalStaticData?.goal || {
        title: currentSlug.replace(/-/g, ' ').toUpperCase(),
        description: 'Structured Multi-Goal Curriculum and Verified Guidance'
      });

  if (!urlGoalSlug && !activeGoal) {
    return (
      <div className="knw-card rounded-3xl p-12 text-center max-w-md mx-auto space-y-5 my-12 border border-knw-border">
        <div className="w-16 h-16 rounded-3xl bg-knw-surface border border-knw-border flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-knw-red" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-knw-muted">0% Progress</div>
          <h2 className="text-2xl font-black text-white">Choose your goal to begin.</h2>
          <p className="text-xs text-knw-muted max-w-sm mx-auto">
            Select a target goal to unlock your custom curriculum stages, topological pacing engine, and faculty mentors.
          </p>
        </div>
        <Link
          to="/goal-select"
          className="btn-red inline-flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-red"
        >
          <span>Select a Goal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Top Banner: Goal Overview & Tabs */}
      <div className="knw-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-knw-border">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-knw-redBright to-knw-redDark shadow-red" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-knw-red/15 text-knw-red border border-knw-red/30 uppercase tracking-wider font-mono">
                Goal-Scoped Curriculum
              </span>
              <span className="text-xs text-knw-subtle">•</span>
              <span className="text-xs text-knw-muted font-medium font-mono">
                ~{currentGoalMeta.estimatedMonths || 6} Months Blueprint
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentGoalMeta.title} Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-knw-muted max-w-2xl leading-relaxed">
              {currentGoalMeta.description}
            </p>
          </div>

          {/* Quick Progress Stat */}
          <div className="p-4 rounded-2xl bg-knw-surface border border-white/10 flex items-center gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase text-knw-muted font-semibold block">
                Roadmap Mastery
              </span>
              <div className="text-xl font-black text-white mt-0.5">
                <span className="text-knw-red font-mono">{overallRoadmapPercent}%</span>
              </div>
            </div>
            <div>
              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-knw-red to-knw-redBright shadow-red rounded-full transition-all duration-500"
                  style={{ width: `${overallRoadmapPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-knw-muted mt-1 block font-mono">
                {pacingData?.summary?.completedHours || 0}h of {pacingData?.summary?.totalRoadmapHours || roadmapData?.totalEstimatedHours || 200}h completed
              </span>
            </div>

            <Link
              to={`/timetable/${currentSlug}`}
              className="btn-red px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-red"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Timetable</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs (Roadmap, Personalized Pacing, Career Guidance, Mentors) */}
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
            <span>Curriculum Stages ({totalStagesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('pacing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pacing'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Weekly Pacing Plan {pacingData ? `(${pacingData.weeks.length} Wks)` : ''}</span>
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
            <span>Career Path Guidance</span>
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
            <span>Faculty Mentors</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CURRICULUM STAGES */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-knw-red animate-pulse" />
                Stage-by-Stage Architecture
              </h2>
              <p className="text-xs text-knw-muted">
                Official learning order strictly determined by the roadmap graph. Zero fallback content.
              </p>
            </div>

            <Link
              to={`/resources/${currentSlug}`}
              className="text-xs font-bold text-knw-red hover:text-knw-redBright flex items-center gap-1 font-mono"
            >
              <span>Explore {currentGoalMeta.title} Resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Subject Filter Tabs */}
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
                  {subject} {subject !== 'All Subjects' && `(${stagesList.filter((s) => s.subject === subject).length})`}
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
                  key={stage._id || stage.stageNumber}
                  stage={stage}
                  goalId={activeGoal?._id}
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

      {/* TAB 2: PERSONALIZED WEEK-BY-WEEK PACING */}
      {activeTab === 'pacing' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-knw-surface p-6 rounded-3xl border border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-knw-red/20 text-knw-red font-bold">
                  Topological Pacing Engine
                </span>
                <span className="text-xs text-knw-muted font-mono">
                  Level: {pacingData?.summary?.level?.toUpperCase() || 'BEGINNER'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Your Week-by-Week Learning Calendar</h2>
              <p className="text-xs text-knw-muted">
                Mathematical distribution of topics based on {pacingData?.summary?.hoursPerDay || 2}h/day, {pacingData?.summary?.daysPerWeek || 6} days/wk ({pacingData?.summary?.weeklyAvailableHours || 12} hrs/week).
              </p>
            </div>

            <Link
              to={`/timetable/${currentSlug}`}
              className="btn-red px-4 py-2 text-xs font-bold flex items-center gap-2 self-start sm:self-center"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize Hours & Level</span>
            </Link>
          </div>

          {pacingData?.weeks?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pacingData.weeks.map((week) => (
                <div
                  key={week.weekNumber}
                  className={`knw-card rounded-3xl p-6 border transition-all ${
                    week.isCompleted ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-knw-red/20 text-knw-red flex items-center justify-center font-mono font-bold text-xs border border-knw-red/30">
                        W{week.weekNumber}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-white">Week {week.weekNumber} Plan</h3>
                        <span className="text-[10px] text-knw-muted font-mono">
                          {week.plannedHours} hrs planned / {week.capacityHours}h weekly capacity
                        </span>
                      </div>
                    </div>

                    {week.isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {week.topics.map((topic, tIdx) => {
                      const isDone = completedTopics.includes(`${topic.stageNumber}:${topic.title}`) || completedTopics.includes(topic._id?.toString());
                      return (
                        <div
                          key={tIdx}
                          onClick={() => handleToggleTopic(topic.stageNumber, topic.title, topic._id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isDone
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-knw-muted'
                              : 'bg-knw-surface border-white/5 hover:border-white/15 text-white'
                          }`}
                        >
                          <button
                            type="button"
                            className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-emerald-500 text-black'
                                : 'border border-white/20 hover:border-knw-red'
                            }`}
                          >
                            {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className={`text-xs font-bold truncate ${isDone ? 'line-through text-knw-muted' : 'text-white'}`}>
                                {topic.title}
                              </h4>
                              <span className="text-[10px] font-mono text-knw-muted shrink-0">
                                ~{topic.estimatedHours}h
                              </span>
                            </div>
                            <span className="text-[10px] text-knw-muted truncate block">
                              {topic.stageTitle}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 knw-card rounded-3xl text-xs text-knw-muted">
              Pacing calculation in progress. Connect or configure your timeline above.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CAREER PATH GUIDANCE */}
      {activeTab === 'career' && (
        <CareerPathGuidance
          careerPath={currentGoalMeta.careerPath || goalStaticData?.goal?.careerPath || []}
          targetRoles={currentGoalMeta.targetRoles || goalStaticData?.goal?.targetRoles || []}
          goalTitle={currentGoalMeta.title}
          engineeringBranches={goalStaticData?.engineeringBranches || []}
          counselingLadder={goalStaticData?.counselingLadder || []}
        />
      )}

      {/* TAB 4: EXPERT GUIDANCE */}
      {activeTab === 'experts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-knw-red/15 text-knw-red border border-knw-red/30 uppercase tracking-wider font-mono">
                  Verified Academic Mentors
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                Connect with Mentors for {currentGoalMeta.title}
              </h2>
              <p className="text-xs text-knw-muted">
                Book 1-on-1 sessions for concept clarity, code review, revision scheduling, and strategic guidance.
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
        goalId={activeGoal?._id}
      />
    </div>
  );
};
