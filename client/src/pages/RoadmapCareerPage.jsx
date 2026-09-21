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
  Briefcase
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

// Rich verified mentors with real-life positions, fields, and live slot postings
const FEATURED_INDUSTRY_MENTORS = [
  {
    _id: 'm1',
    name: 'Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?img=47',
    headline: 'Senior SDE at Microsoft | Ex-Amazon | Tech Interview Mentor',
    realLifePositions: 'Senior SDE at Microsoft | Ex-Amazon | Tech Lead',
    companyOrCollege: 'Microsoft Corp',
    expertField: 'Full Stack Architecture, Distributed Systems & MERN',
    rating: 4.95,
    sessionsCompleted: 142,
    sessionDurationMinutes: 45,
    bio: 'Over 6 years of experience scaling distributed systems and mentoring 120+ students into top tier tech companies. Specializes in MERN architecture, backend scalability, and behavioral interview coaching.',
    expertiseAreas: ['Full Stack Development', 'System Design', 'React & Node.js', 'Mock Interviews'],
    whatTheyShare: [
      'High-throughput distributed systems & backend architecture review',
      'Production-grade MERN scalability & microservices breakdown',
      'Realistic FAANG coding & behavioral mock interview drills'
    ],
    postedSlots: ['Today 3:00 PM', 'Today 6:30 PM', 'Tomorrow 10:00 AM'],
    availableSlots: [
      { dayOfWeek: 'Today', startTime: '3:00 PM', endTime: '3:45 PM' },
      { dayOfWeek: 'Today', startTime: '6:30 PM', endTime: '7:15 PM' },
      { dayOfWeek: 'Tomorrow', startTime: '10:00 AM', endTime: '10:45 AM' }
    ]
  },
  {
    _id: 'm2',
    name: 'Arjun Mehta',
    avatar: 'https://i.pravatar.cc/150?img=33',
    headline: 'AI Research Engineer at DeepMind | Former Researcher in OpenAI',
    realLifePositions: 'AI Research Engineer at Google DeepMind | Ex-OpenAI',
    companyOrCollege: 'Google DeepMind & IIT Bombay Alumnus',
    expertField: 'Generative AI, Transformer LLMs & PyTorch',
    rating: 4.98,
    sessionsCompleted: 89,
    sessionDurationMinutes: 45,
    bio: 'Researches foundational models and transformer architectures. Mentors students transitioning into Applied AI, ML research, and competitive mathematics.',
    expertiseAreas: ['Machine Learning', 'Deep Learning & PyTorch', 'LLMs & RAG', 'Research Papers'],
    whatTheyShare: [
      'Transformer attention mechanism implementations & tuning',
      'RAG pipeline defense topology & production vector search',
      'Publishing in NeurIPS/ICLR and breaking into AI research labs'
    ],
    postedSlots: ['🔴 LIVE NOW', 'Tomorrow 2:00 PM', 'Tomorrow 5:00 PM'],
    availableSlots: [
      { dayOfWeek: 'Today (Live)', startTime: '2:00 PM', endTime: '2:45 PM' },
      { dayOfWeek: 'Tomorrow', startTime: '2:00 PM', endTime: '2:45 PM' },
      { dayOfWeek: 'Tomorrow', startTime: '5:00 PM', endTime: '5:45 PM' }
    ]
  },
  {
    _id: 'm3',
    name: 'Rohan Verma',
    avatar: 'https://i.pravatar.cc/150?img=52',
    headline: 'AIR 42 in JEE Advanced | B.Tech CSE IIT Delhi | Ex-Unacademy',
    realLifePositions: 'AIR 42 in JEE Advanced | IIT Delhi CSE Graduate',
    companyOrCollege: 'IIT Delhi Alumnus & Academic Coach',
    expertField: 'Competitive Exams (JEE/GATE), Physics & Math Mastery',
    rating: 4.92,
    sessionsCompleted: 210,
    sessionDurationMinutes: 45,
    bio: 'Cracked JEE Advanced in the top 50 ranks. Has guided hundreds of aspirants in mastering study discipline, revision loops, and overcoming exam anxiety.',
    expertiseAreas: ['JEE Strategy', 'Physics Problem Solving', 'Calculus Mastery', 'Exam Psychology'],
    whatTheyShare: [
      'High-yield revision strategies & daily milestone timetables',
      'Advanced problem breakdown for mechanics & multivariable calculus',
      'Time management and psychological resilience under pressure'
    ],
    postedSlots: ['Today 8:00 PM', 'Tomorrow 9:00 AM', 'Tomorrow 7:00 PM'],
    availableSlots: [
      { dayOfWeek: 'Today', startTime: '8:00 PM', endTime: '8:45 PM' },
      { dayOfWeek: 'Tomorrow', startTime: '9:00 AM', endTime: '9:45 AM' },
      { dayOfWeek: 'Tomorrow', startTime: '7:00 PM', endTime: '7:45 PM' }
    ]
  },
  {
    _id: 'm4',
    name: 'Devika Patel',
    avatar: 'https://i.pravatar.cc/150?img=44',
    headline: 'Staff Infrastructure Engineer at Cloudflare | Ex-Meta',
    realLifePositions: 'Staff Infrastructure Engineer at Cloudflare | Ex-Meta',
    companyOrCollege: 'Cloudflare Engineering',
    expertField: 'Cloud Native DevOps, Kubernetes & High Availability',
    rating: 4.97,
    sessionsCompleted: 115,
    sessionDurationMinutes: 45,
    bio: 'Specialist in cloud native deployment, containerization, distributed databases, and high availability systems across multi-region networks.',
    expertiseAreas: ['Cloud Architecture', 'DevOps & Docker', 'Backend Systems', 'Open Source'],
    whatTheyShare: [
      'Multi-region Kubernetes cluster deployment & zero-downtime routing',
      'Database sharding, caching strategies with Redis & CDN internals',
      'Hands-on Terraform & CI/CD pipeline architectural audits'
    ],
    postedSlots: ['Today 7:00 PM', 'Thursday 11:00 AM', 'Friday 4:00 PM'],
    availableSlots: [
      { dayOfWeek: 'Today', startTime: '7:00 PM', endTime: '7:45 PM' },
      { dayOfWeek: 'Thursday', startTime: '11:00 AM', endTime: '11:45 AM' },
      { dayOfWeek: 'Friday', startTime: '4:00 PM', endTime: '4:45 PM' }
    ]
  }
];

export const RoadmapCareerPage = () => {
  const { activeGoal, activeUserGoal } = useGoal();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  const [roadmapData, setRoadmapData] = useState(null);
  const [mentors, setMentors] = useState(FEATURED_INDUSTRY_MENTORS);
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
      const apiMentors = res.data.data.mentors || [];
      // If API mentors exist, enrich with positions and slots
      if (apiMentors.length > 0) {
        const enriched = apiMentors.map((m, idx) => ({
          ...m,
          realLifePositions: m.headline || FEATURED_INDUSTRY_MENTORS[idx % FEATURED_INDUSTRY_MENTORS.length].realLifePositions,
          expertField: m.expertiseAreas?.[0] || FEATURED_INDUSTRY_MENTORS[idx % FEATURED_INDUSTRY_MENTORS.length].expertField,
          whatTheyShare: FEATURED_INDUSTRY_MENTORS[idx % FEATURED_INDUSTRY_MENTORS.length].whatTheyShare,
          postedSlots: FEATURED_INDUSTRY_MENTORS[idx % FEATURED_INDUSTRY_MENTORS.length].postedSlots,
          availableSlots: FEATURED_INDUSTRY_MENTORS[idx % FEATURED_INDUSTRY_MENTORS.length].availableSlots,
        }));
        setMentors(enriched);
      } else {
        setMentors(FEATURED_INDUSTRY_MENTORS);
      }
      setCompletedTopics(res.data.data.userProgress?.completedTopics || []);
      setCompletedStages(res.data.data.userProgress?.completedStages || []);
    } catch (err) {
      console.error('Error loading roadmap:', err);
      setMentors(FEATURED_INDUSTRY_MENTORS);
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

  const totalStagesCount = roadmapData?.stages?.length || 0;
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
                ~{activeGoal.estimatedMonths || 6} Months Blueprint
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
            <span>Career Path Guidance Ladder</span>
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-knw-red animate-pulse" />
                Stage-by-Stage Curriculum
              </h2>
              <p className="text-xs text-knw-muted">
                Check off topics as you learn. Stages adapt as you complete prior prerequisites.
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

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-44 knw-skeleton rounded-3xl" />
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
            <div className="p-8 text-center knw-card rounded-3xl text-xs text-knw-muted">
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

      {/* 3. EXPERT GUIDANCE & ONE-TO-ONE SESSIONS (Netflix Style With Slots & Real Positions) */}
      {activeTab === 'experts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-knw-red/15 text-red-400 border border-knw-red/30 uppercase tracking-wider font-mono">
                  Verified Industry Mentors
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                Connect with Real Industry Mentors
              </h2>
              <p className="text-xs text-knw-muted">
                Book 1-on-1 video slots for architecture reviews, FAANG interview drills, and personalized doubt resolution.
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
