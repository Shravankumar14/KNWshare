import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Target, Map, BookOpen, Clock, CheckCircle2, ArrowRight,
  Sparkles, Zap, Star, TrendingUp, Play, Users, ChevronRight,
  Flame, MessageCircle, Bookmark, Share2, PlusCircle, Video,
  Briefcase, Check, ExternalLink, X, Compass, Award
} from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';
import { GoalOnboardingModal } from '../components/goal/GoalOnboardingModal';
import { CustomGoalModal } from '../components/goal/CustomGoalModal';

/* ── Story Sparks Data ────────────────────────────────────────── */
const STORY_SPARKS = [
  {
    id: 's1',
    author: 'Dr. Elena',
    handle: '@elena_ai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&fit=crop',
    badge: 'AI Flashcard',
    isLive: false,
    credential: 'Frontier AI Research Scientist · Ex-OpenAI',
    storyImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&fit=crop',
    tipTitle: 'Attention Scaling Trick',
    tipText: 'In FlashAttention-3, warping asynchronous TMA memory copies eliminates GPU register spilling. When training 70B models, this reduces memory pressure by 38% without quality regression.',
    slotAction: 'Book Research Review'
  },
  {
    id: 's2',
    author: 'Marcus',
    handle: '@marcus_distrib',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop',
    badge: 'Kafka Tip',
    isLive: false,
    credential: 'Principal Architect · Ex-AWS',
    storyImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&fit=crop',
    tipTitle: 'Consumer Rebalance Storms',
    tipText: 'Always use Cooperative Sticky Assignor in Kafka 3.0+. It prevents full partition revocation during rolling pod restarts, avoiding cascading latency spikes in production.',
    slotAction: 'Book Architecture Drill'
  },
  {
    id: 's3',
    author: 'Priya',
    handle: '@priya_ms',
    avatar: 'https://i.pravatar.cc/150?img=47',
    badge: 'Slot Posted',
    isLive: false,
    credential: 'Senior SDE at Microsoft | Ex-Amazon',
    storyImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&fit=crop',
    tipTitle: 'MERN Scalability Checklist',
    tipText: 'Stop querying Mongo without compound index prefixes. An unindexed $sort on 100k docs causes 100% CPU lockups. Here is my index audit script for your projects!',
    slotAction: 'Book 1-on-1 Slot'
  },
  {
    id: 's4',
    author: 'Arjun',
    handle: '@arjun_deepmind',
    avatar: 'https://i.pravatar.cc/150?img=33',
    badge: 'LIVE NOW',
    isLive: true,
    credential: 'AI Research Engineer, Google DeepMind',
    storyImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&fit=crop',
    tipTitle: 'Transformer Attention Deep Dive',
    tipText: 'Live session kicking off in 10 minutes: Breaking down query-key projection dot products and Rotary Position Embedding (RoPE) mathematically.',
    slotAction: 'Join Live Session'
  },
  {
    id: 's5',
    author: 'Devika',
    handle: '@devika_cf',
    avatar: 'https://i.pravatar.cc/150?img=44',
    badge: 'Cloud Tips',
    isLive: false,
    credential: 'Staff Infrastructure Engineer at Cloudflare | Ex-Meta',
    storyImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&fit=crop',
    tipTitle: 'Edge Routing Latency',
    tipText: 'Why Anycast BGP routing reduces cold-start TTFB to sub-15ms for globally distributed edge lambdas. Complete network packet trace included.',
    slotAction: 'Book DevOps Review'
  },
  {
    id: 's6',
    author: 'Rohan',
    handle: '@rohan_iit',
    avatar: 'https://i.pravatar.cc/150?img=52',
    badge: 'JEE Strategy',
    isLive: false,
    credential: 'AIR 42 JEE Advanced · IIT Delhi Alumnus',
    storyImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop',
    tipTitle: 'Revision Loops That Stick',
    tipText: 'The 1-3-7-21 spaced repetition protocol specifically adapted for JEE Advanced Physics formulas and Organic Chemistry reaction mechanisms.',
    slotAction: 'Book Strategy Slot'
  }
];

/* ── Feed Posts Data (Instagram Style + Mentor Slots) ────────── */
const FEED_POSTS = [
  {
    id: 'post-1',
    postType: 'KNOWLEDGE DROP',
    badgeColor: 'red',
    timeAgo: '2 hours ago',
    author: {
      name: 'Dr. Elena Rostova',
      handle: '@elena_ai',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&fit=crop',
      credential: 'Frontier AI Research Scientist · Ex-OpenAI',
      verified: true
    },
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&fit=crop',
    imageOverlayTag: '✦ Architecture Topology Breakdown',
    tags: ['ReasoningAI', 'RAGSystems', 'GenerativeAI', 'SystemArchitecture'],
    title: 'Why RAG Systems Fail Silently in Production (And the 5-Layer Defense Topology)',
    description: 'Most enterprise RAG pipelines fail not with loud crashes, but with quiet semantic drift, hallucinated citations, and context window pollution. Here is our battle-tested 5-layer topology: Hierarchical chunking, reciprocal rank fusion (RRF), cross-encoder re-ranking, lost-in-the-middle context shuffling, and automated ground-truth verifiers.',
    reactionsCount: 6930,
    discussionsCount: 242,
    hashtags: ['#ReasoningAI', '#RAGSystems', '#GenerativeAI', '#SystemArchitecture'],
    isMentorSlot: false
  },
  {
    id: 'post-2',
    postType: 'MENTOR SLOT ANNOUNCEMENT',
    badgeColor: 'live',
    timeAgo: '45 min ago',
    author: {
      name: 'Priya Sharma',
      handle: '@priya_ms',
      avatar: 'https://i.pravatar.cc/150?img=47',
      credential: 'Senior SDE at Microsoft | Ex-Amazon | Tech Interview Mentor',
      verified: true
    },
    expertField: 'Full Stack Architecture, Distributed Systems & MERN',
    whatTheyShare: [
      'Production-grade MERN scalability & microservices breakdown',
      'Realistic FAANG coding & behavioral mock interview drills',
      'Architecture review of your personal full-stack projects'
    ],
    postedSlots: ['Today 3:00 PM', 'Today 6:30 PM', 'Tomorrow 10:00 AM'],
    coverImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=900&fit=crop',
    imageOverlayTag: '✦ Live Slots Available This Week',
    tags: ['FullStack', 'SystemDesign', 'ReactNode', 'FAANGPrep'],
    title: 'Opening 3 1-on-1 Mentorship Slots for MERN Architecture & FAANG Mock Drills',
    description: 'Students preparing for SDE-1 / SDE-2 roles: I am opening 3 slots this week for live 45-minute sessions. We will tear down your distributed backend, review database query efficiency, and simulate a real Microsoft/Amazon technical interview with immediate feedback.',
    reactionsCount: 1420,
    discussionsCount: 89,
    hashtags: ['#FullStack', '#SystemDesign', '#Microsoft', '#MockInterview'],
    isMentorSlot: true
  },
  {
    id: 'post-3',
    postType: 'LECTURE DROP (CO-CREATED)',
    badgeColor: 'purple',
    timeAgo: '5 hours ago',
    coCreatedWith: 'Co-Created with Dr. Elena Rostova',
    author: {
      name: 'Marcus Vance',
      handle: '@marcus_distrib',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop',
      credential: 'Principal Distributed Architect · Ex-AWS',
      verified: true
    },
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&fit=crop',
    imageOverlayTag: '✦ Full Lecture Theater (42:15)',
    lectureDuration: '42:15',
    tags: ['DistributedSystems', 'Kafka', 'EventDriven', 'HighScale'],
    title: 'Event-Driven Microservices at 100k Req/Sec: Partitioning, Ordering & Idempotency',
    description: 'An end-to-end masterclass demonstrating how we architected zero-loss event pipelines handling 100,000 transactions per second. Includes code patterns for transactional outbox, de-duplication caches, and exactly-once processing semantics.',
    reactionsCount: 4890,
    discussionsCount: 178,
    hashtags: ['#Kafka', '#Microservices', '#BackendArchitecture', '#AWS'],
    isMentorSlot: false,
    hasVideoPlayer: true
  },
  {
    id: 'post-4',
    postType: 'MENTOR SLOT ANNOUNCEMENT',
    badgeColor: 'live',
    timeAgo: '1 hour ago',
    author: {
      name: 'Arjun Mehta',
      handle: '@arjun_deepmind',
      avatar: 'https://i.pravatar.cc/150?img=33',
      credential: 'AI Research Engineer at Google DeepMind | Former OpenAI Researcher',
      verified: true
    },
    expertField: 'Generative AI, Transformer LLMs & PyTorch Research',
    whatTheyShare: [
      'Transformer attention mechanism mathematical breakdown',
      'RAG pipeline defense topology & production vector search',
      'Breaking into tier-1 AI research labs (DeepMind, FAIR, OpenAI)'
    ],
    postedSlots: ['🔴 LIVE NOW in 15m', 'Tomorrow 2:00 PM', 'Tomorrow 5:00 PM'],
    coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&fit=crop',
    imageOverlayTag: '✦ Live Research Session & 1-on-1 Slots',
    tags: ['MachineLearning', 'DeepMind', 'LLMs', 'PyTorch'],
    title: '🔴 LIVE IN 15 MIN: Transformer Multi-Head Attention Implementations in PyTorch',
    description: 'Join my live technical stream or book an exclusive 1-on-1 research review slot. We will write multi-head scaled dot-product attention from scratch, visualize memory bandwidth bottlenecks, and discuss research publications.',
    reactionsCount: 3120,
    discussionsCount: 215,
    hashtags: ['#GenerativeAI', '#DeepMind', '#PyTorch', '#MachineLearning'],
    isMentorSlot: true
  }
];

export const GoalSelectionPage = () => {
  const { allGoals, activeGoal, activeUserGoal, loading } = useGoal();
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetGoalToEnroll, setTargetGoalToEnroll] = useState(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCustomGoalOpen, setIsCustomGoalOpen] = useState(false);

  // Modals & Active Story States
  const [activeStory, setActiveStory] = useState(null);
  const [bookingMentor, setBookingMentor] = useState(null);
  const [reactionsState, setReactionsState] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [followingAuthors, setFollowingAuthors] = useState({});
  const [storyProgress, setStoryProgress] = useState(0);

  // Story Auto-progress simulation
  useEffect(() => {
    let interval;
    if (activeStory) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeStory]);

  const toggleReaction = (postId, baseCount) => {
    setReactionsState((prev) => {
      const current = prev[postId] || { count: baseCount, reacted: false };
      return {
        ...prev,
        [postId]: {
          count: current.reacted ? current.count - 1 : current.count + 1,
          reacted: !current.reacted
        }
      };
    });
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleFollow = (handle) => {
    setFollowingAuthors((prev) => ({ ...prev, [handle]: !prev[handle] }));
  };

  const categories = [
    { id: 'all', label: 'All Ambitions' },
    { id: 'web_dev', label: 'Web & Full Stack' },
    { id: 'ai_ml', label: 'AI & ML' },
    { id: 'competitive_programming', label: 'Competitive Prog.' },
    { id: 'engineering_exams', label: 'Exams (JEE/GATE)' },
  ];

  const filteredGoals = allGoals.filter((g) => {
    const mc = selectedCategory === 'all' || g.category === selectedCategory;
    const ms = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return mc && ms;
  });

  const handleSelectGoal = (goal) => {
    setTargetGoalToEnroll(goal);
    setIsOnboardingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* ── Top Hero for Unauthenticated Visitors ── */}
      {!isAuthenticated && (
        <div
          className="relative overflow-hidden px-4 py-10 sm:py-14 text-center border-b border-white/5"
          style={{ background: 'linear-gradient(180deg, #180000 0%, #0d0000 60%, #080808 100%)' }}
        >
          <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #E50914 0%, transparent 65%)' }} />
          <div className="relative max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-knw-red/40 bg-knw-red/15 text-xs font-mono text-red-400">
              <Sparkles className="w-3.5 h-3.5 text-knw-red animate-pulse" />
              <span>Netflix of Learning · Curated Knowledge & Mentorship</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Turn Ambition Into <span className="text-gradient-red">Mastery</span>
            </h1>
            <p className="text-xs sm:text-sm text-knw-muted max-w-lg mx-auto leading-relaxed">
              Connect directly with verified engineers from Google, OpenAI, Microsoft and IIT. Explore daily educational sparks, structured roadmaps, and book 1-on-1 guidance slots.
            </p>
            <div className="pt-2">
              <button
                onClick={() => demoLogin()}
                className="btn-red px-8 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-red inline-flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Instant Demo Student Access (Alex Rivera)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Two-Column Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ════════ LEFT / MAIN FEED COLUMN ════════ */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* ── 1. INSTAGRAM-STYLE STORIES BAR (KNOWLEDGE SPARKS) ── */}
            <div className="knw-card rounded-3xl p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-knw-red animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
                    KNOWLEDGE SPARKS
                  </span>
                  <span className="text-[11px] text-knw-subtle font-mono hidden sm:inline">
                    · Quick educational moments & live slots
                  </span>
                </div>
                <span className="text-[11px] font-mono text-knw-muted">Tap to view spark</span>
              </div>

              {/* Stories Scrollable Row */}
              <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                {/* "+ New Spark" Button */}
                <div
                  onClick={() => setIsCustomGoalOpen(true)}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-knw-red/50 flex items-center justify-center bg-knw-surface group-hover:border-knw-red group-hover:shadow-red transition-all">
                    <span className="text-2xl text-knw-red font-light">+</span>
                  </div>
                  <span className="text-[10px] font-mono text-knw-muted group-hover:text-white transition-colors">
                    New Spark
                  </span>
                </div>

                {/* Mentor Sparks Bubbles */}
                {STORY_SPARKS.map((spark) => (
                  <button
                    key={spark.id}
                    onClick={() => setActiveStory(spark)}
                    className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                  >
                    <div className={spark.isLive ? 'story-ring-live' : 'story-ring'}>
                      <div className="bg-[#080808] rounded-full p-[2px]">
                        <img
                          src={spark.avatar}
                          alt={spark.author}
                          className="w-14 h-14 rounded-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-bold text-white group-hover:text-knw-red transition-colors max-w-[70px] truncate leading-tight">
                        {spark.author}
                      </p>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full block mt-0.5 ${
                        spark.isLive
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-white/10 text-gray-300 border border-white/10'
                      }`}>
                        {spark.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── 2. "CONTINUE YOUR JOURNEY" BANNER (Matches Image 3) ── */}
            <div className="knw-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-knw-red/30 shadow-red">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-knw-red/20 border border-knw-red/40 flex items-center justify-center text-knw-red shrink-0 shadow-red">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                        CONTINUE YOUR JOURNEY
                      </span>
                      <span className="text-[10px] text-knw-subtle font-mono">• Module 4 of 8</span>
                    </div>
                    <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
                      {activeGoal ? activeGoal.title : 'Full-Stack Generative AI Architect'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right font-mono">
                    <span className="text-base font-black text-white">
                      {activeUserGoal?.overallProgress || 68}%
                    </span>
                    <span className="text-[10px] text-knw-subtle block -mt-0.5">completed</span>
                  </div>

                  <Link
                    to="/roadmap"
                    className="btn-red px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-red font-mono"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── 3. INSTAGRAM FEED POSTS ── */}
            <div className="space-y-6">
              {FEED_POSTS.map((post) => {
                const reaction = reactionsState[post.id] || { count: post.reactionsCount, reacted: false };
                const isBookmarked = bookmarkedPosts[post.id] || false;
                const isFollowing = followingAuthors[post.author.handle] || false;

                return (
                  <article
                    key={post.id}
                    className="knw-card rounded-3xl overflow-hidden relative group"
                  >
                    {/* Red hairline accent at top */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-knw-red/60 to-transparent" />

                    {/* Post Top Meta: Type badge + timestamp */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          post.badgeColor === 'live'
                            ? 'bg-red-600/20 text-red-400 border-red-500 animate-pulse'
                            : post.badgeColor === 'purple'
                            ? 'bg-purple-950/40 text-purple-300 border-purple-700/50'
                            : 'bg-knw-red/15 text-red-400 border-knw-red/40'
                        }`}>
                          ● {post.postType}
                        </span>
                        {post.coCreatedWith && (
                          <span className="text-[10px] text-purple-400 font-mono hidden sm:inline">
                            ✦ {post.coCreatedWith}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-knw-muted font-mono">{post.timeAgo}</span>
                    </div>

                    {/* Author Header */}
                    <div className="flex items-center justify-between px-5 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="story-ring shrink-0">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-11 h-11 rounded-full object-cover bg-black p-[1px]"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">{post.author.name}</span>
                            {post.author.verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                            )}
                            <span className="text-[11px] text-knw-subtle font-mono">{post.author.handle}</span>
                          </div>
                          <p className="text-xs text-knw-red font-semibold leading-tight mt-0.5">
                            {post.author.credential}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFollow(post.author.handle)}
                        className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all ${
                          isFollowing
                            ? 'border-knw-red/40 bg-knw-red/10 text-red-400'
                            : 'border-white/20 bg-white/5 text-white hover:border-knw-red/60 hover:text-red-400'
                        }`}
                      >
                        {isFollowing ? 'Following' : '+ Follow'}
                      </button>
                    </div>

                    {/* Media Cover Image with Interactive Overlay */}
                    <div className="relative mx-5 rounded-2xl overflow-hidden cursor-pointer group/img">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-56 sm:h-64 object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* Video Play Button Overlay if Lecture */}
                      {post.hasVideoPlayer && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-knw-red/90 text-white flex items-center justify-center shadow-red group-hover/img:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>
                      )}

                      {/* Bottom Banner Overlay on Image */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-gray-200 border border-white/10 font-mono font-medium">
                          {post.imageOverlayTag}
                        </span>
                        <span className="text-[10px] text-knw-muted bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full font-mono">
                          Hover to expand view
                        </span>
                      </div>
                    </div>

                    {/* Mentor Slot Timings & What They Share (If Mentor Slot Drop) */}
                    {post.isMentorSlot && (
                      <div className="mx-5 mt-4 p-4 rounded-2xl bg-knw-surface border border-knw-red/30 space-y-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold block mb-1">
                            🎯 WHAT I SHARE & TEACH IN 1-ON-1 SESSIONS:
                          </span>
                          <div className="space-y-1">
                            {post.whatTheyShare.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-knw-red shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Live Slot Badges */}
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-white font-bold block mb-1.5">
                            ⏰ AVAILABLE POSTED SLOTS (CLICK TO RESERVE):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {post.postedSlots.map((slot, idx) => (
                              <button
                                key={idx}
                                onClick={() => setBookingMentor(post.author)}
                                className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                  slot.includes('LIVE')
                                    ? 'bg-red-600 text-white border-red-500 animate-pulse'
                                    : 'bg-knw-red/15 text-red-300 border-knw-red/40 hover:bg-knw-red hover:text-white'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social Reaction Bar (Matches Image 3) */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-3">
                      <div className="flex items-center gap-3">
                        {/* Fire Reactions */}
                        <button
                          onClick={() => toggleReaction(post.id, post.reactionsCount)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                            reaction.reacted
                              ? 'bg-orange-950/40 text-orange-400 border-orange-700/50 shadow-sm'
                              : 'bg-white/5 text-knw-muted hover:text-orange-400 border-white/10'
                          }`}
                        >
                          <Flame className={`w-4 h-4 ${reaction.reacted ? 'fill-orange-400 text-orange-400' : ''}`} />
                          <span className="font-bold">{reaction.count.toLocaleString()}</span>
                          <span className="hidden sm:inline">Reactions</span>
                        </button>

                        {/* Discussions */}
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 text-knw-muted hover:text-white border border-white/10 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-bold">{post.discussionsCount}</span>
                          <span className="hidden sm:inline">Discussions</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Add to Trail / Book Slot */}
                        {post.isMentorSlot ? (
                          <button
                            onClick={() => setBookingMentor(post.author)}
                            className="btn-red text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold shadow-red font-mono"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Book Slot</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleBookmark(post.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-knw-red/10 border border-knw-red/30 text-red-300 hover:bg-knw-red hover:text-white transition-all flex items-center gap-1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Add to Trail</span>
                          </button>
                        )}

                        {/* Bookmark */}
                        <button
                          onClick={() => toggleBookmark(post.id)}
                          className={`p-2 rounded-xl border transition-all ${
                            isBookmarked
                              ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                              : 'bg-white/5 border-white/10 text-knw-muted hover:text-yellow-400'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>

                        {/* Share */}
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-knw-muted hover:text-white transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Description Body */}
                    <div className="px-5 pb-4 space-y-1.5">
                      <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {post.description}
                      </p>

                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {post.hashtags.map((ht) => (
                          <span
                            key={ht}
                            className="text-xs font-mono text-red-500/80 hover:text-knw-red cursor-pointer transition-colors"
                          >
                            {ht}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

          </div>

          {/* ════════ RIGHT SIDEBAR: GOALS & TOP MENTORS ════════ */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-6">
            <div className="sticky top-20 space-y-6">

              {/* Goal Selection Widget */}
              <div className="knw-card rounded-3xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-knw-red" />
                    <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
                      SELECT YOUR GOAL
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-knw-muted">{allGoals.length} Curricula</span>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ambitions, JEE, GATE, Web..."
                    className="w-full bg-knw-surface border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                        selectedCategory === c.id
                          ? 'bg-knw-red text-white border-knw-red shadow-red'
                          : 'bg-knw-surface border-white/10 text-knw-muted hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Goals List */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {filteredGoals.map((goal) => {
                    const isEnrolled = activeGoal?._id === goal._id;
                    return (
                      <div
                        key={goal._id}
                        onClick={() => handleSelectGoal(goal)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isEnrolled
                            ? 'border-knw-red bg-knw-red/10 shadow-red'
                            : 'border-white/5 bg-knw-surface hover:border-knw-red/40 hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{goal.title}</span>
                              {isEnrolled && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-600 text-white font-bold">
                                  Enrolled
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-knw-muted mt-0.5 line-clamp-1 leading-tight">
                              {goal.description}
                            </p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-knw-subtle shrink-0 mt-0.5" />
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-knw-subtle font-mono">
                          <span>~{goal.estimatedDuration || '6 months'}</span>
                          <span>• {goal.category}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Goal Trigger */}
                <button
                  onClick={() => setIsCustomGoalOpen(true)}
                  className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-knw-red/40 text-red-400 hover:bg-knw-red/10 transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Design Custom Goal with AI</span>
                </button>
              </div>

              {/* Top Industry Advisors Card */}
              <div className="knw-card rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
                    VERIFIED MENTORS
                  </span>
                  <Link to="/roadmap" className="text-[11px] font-mono text-knw-muted hover:text-white">
                    View All →
                  </Link>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Priya Sharma', pos: 'Senior SDE, Microsoft', avatar: 'https://i.pravatar.cc/150?img=47', rating: 4.95 },
                    { name: 'Arjun Mehta', pos: 'AI Engineer, DeepMind', avatar: 'https://i.pravatar.cc/150?img=33', rating: 4.98 },
                    { name: 'Devika Patel', pos: 'Staff Engineer, Cloudflare', avatar: 'https://i.pravatar.cc/150?img=44', rating: 4.97 },
                    { name: 'Rohan Verma', pos: 'AIR 42 JEE Adv, IIT Delhi', avatar: 'https://i.pravatar.cc/150?img=52', rating: 4.92 },
                  ].map((adv, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-knw-surface border border-white/5 hover:border-knw-red/30 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={adv.avatar} alt={adv.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-knw-red/40" />
                        <div>
                          <h4 className="text-xs font-bold text-white leading-tight">{adv.name}</h4>
                          <p className="text-[10px] text-knw-red font-mono truncate max-w-[130px]">{adv.pos}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-yellow-400 font-bold">★ {adv.rating}</span>
                        <button
                          onClick={() => setBookingMentor(adv)}
                          className="block text-[10px] font-mono text-red-400 hover:text-white mt-0.5 underline"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── 4. POPUP STORY VIEWER MODAL (Instagram Style) ── */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-[#0A0000] border border-knw-red/40 shadow-red-lg">
            {/* Story Progress Timer Bar */}
            <div className="absolute top-2 left-3 right-3 z-30 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-knw-red transition-all duration-100"
                style={{ width: `${storyProgress}%` }}
              />
            </div>

            {/* Story Header */}
            <div className="absolute top-5 left-4 right-4 z-30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.avatar}
                  alt={activeStory.author}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-knw-red"
                />
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">{activeStory.author}</span>
                  <span className="text-[9px] text-red-400 font-mono block">{activeStory.credential}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveStory(null)}
                className="p-1 rounded-full bg-black/60 text-white hover:text-knw-red transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Image */}
            <div className="relative h-72 w-full overflow-hidden">
              <img
                src={activeStory.storyImage}
                alt={activeStory.tipTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0000] via-transparent to-black/40" />
            </div>

            {/* Story Content & Educational Tip */}
            <div className="p-5 space-y-3 relative z-20">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400 px-2 py-0.5 rounded-full bg-knw-red/15 border border-knw-red/30">
                ✦ {activeStory.badge}
              </span>
              <h3 className="text-base font-black text-white leading-tight">
                {activeStory.tipTitle}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeStory.tipText}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const selected = activeStory;
                    setActiveStory(null);
                    setBookingMentor(selected);
                  }}
                  className="w-full btn-red py-2.5 text-xs font-bold shadow-red flex items-center justify-center gap-2 font-mono"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{activeStory.slotAction}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. ONBOARDING & BOOKING MODALS ── */}
      {isOnboardingOpen && targetGoalToEnroll && (
        <GoalOnboardingModal
          goal={targetGoalToEnroll}
          isOpen={isOnboardingOpen}
          onClose={() => {
            setIsOnboardingOpen(false);
            setTargetGoalToEnroll(null);
          }}
        />
      )}

      {isCustomGoalOpen && (
        <CustomGoalModal
          isOpen={isCustomGoalOpen}
          onClose={() => setIsCustomGoalOpen(false)}
        />
      )}

      {/* Mentor Slot Booking Modal from Feed */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg knw-glass rounded-3xl p-6 border border-knw-red/40 shadow-red-lg space-y-5">
            <button
              onClick={() => setBookingMentor(null)}
              className="absolute top-4 right-4 text-knw-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={bookingMentor.avatar}
                alt={bookingMentor.name || bookingMentor.author}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-knw-red/60"
              />
              <div>
                <h3 className="text-base font-bold text-white">{bookingMentor.name || bookingMentor.author}</h3>
                <p className="text-xs text-knw-red font-semibold">{bookingMentor.credential || bookingMentor.pos}</p>
                <span className="text-[10px] text-yellow-400 font-mono">★ 4.95 Rating · Verified Mentor</span>
              </div>
            </div>

            {/* What they share */}
            <div className="p-3 bg-knw-surface rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">1-ON-1 SESSION AGENDA:</span>
              <p className="text-xs text-gray-300">
                Code & Architecture Review, FAANG Mock Interview Drills, and Resume Guidance.
              </p>
            </div>

            {/* Slots Picker */}
            <div>
              <span className="text-xs font-mono uppercase text-knw-muted font-bold block mb-2">SELECT AVAILABLE SLOT:</span>
              <div className="grid grid-cols-3 gap-2">
                {['Today 3:00 PM', 'Today 6:30 PM', 'Tomorrow 10:00 AM', 'Tomorrow 4:00 PM', 'Friday 5:00 PM', 'Saturday 11:00 AM'].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      alert(`1-on-1 slot booked for ${s} with ${bookingMentor.name || bookingMentor.author}! A calendar invite has been dispatched.`);
                      setBookingMentor(null);
                    }}
                    className="p-2.5 rounded-xl border border-white/10 bg-knw-surface text-xs font-mono text-white hover:border-knw-red hover:bg-knw-red transition-all text-center"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-center text-knw-muted">
              Sessions are free for registered students. Video link is shared immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
