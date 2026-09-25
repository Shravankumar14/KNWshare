import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers, Target, Map, BookOpen, Clock, CheckCircle2, ArrowRight,
  Sparkles, Zap, Star, TrendingUp, Play, Users, ChevronRight,
  Flame, MessageCircle, Bookmark, Share2, PlusCircle, Video,
  Briefcase, Check, ExternalLink, X, Compass, Award
} from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';
import { GoalOnboardingModal } from '../components/goal/GoalOnboardingModal';
import { CustomGoalModal } from '../components/goal/CustomGoalModal';

import api from '../services/api';


export const GoalSelectionPage = () => {
  const { allGoals, activeGoal, activeUserGoal, loading, setPreviewGoal } = useGoal();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetGoalToEnroll, setTargetGoalToEnroll] = useState(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCustomGoalOpen, setIsCustomGoalOpen] = useState(false);

  // Dynamic API feed states
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [availableMentors, setAvailableMentors] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);

  // Fetch real data from MongoDB
  const loadHomeFeed = async () => {
    setFeedLoading(true);
    try {
      const [storiesRes, postsRes, mentorsRes] = await Promise.all([
        api.get('/stories').catch(() => ({ data: { data: [] } })),
        api.get('/posts').catch(() => ({ data: { data: [] } })),
        api.get('/teachers/available').catch(() => ({ data: { data: [] } })),
      ]);
      setStories(storiesRes.data?.data || []);
      setPosts(postsRes.data?.data || []);
      setAvailableMentors(mentorsRes.data?.data || []);
    } catch (err) {
      console.warn('Feed load error:', err.message);
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    loadHomeFeed();
  }, []);

  // Modals & Active Story States
  const [activeStory, setActiveStory] = useState(null);
  const [bookingMentor, setBookingMentor] = useState(null);
  const [reactionsState, setReactionsState] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [followingAuthors, setFollowingAuthors] = useState({});
  const [storyProgress, setStoryProgress] = useState(0);
  const [bookingSlots, setBookingSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  // Sync slots when bookingMentor changes
  useEffect(() => {
    if (!bookingMentor) {
      setBookingSlots([]);
      setBookingStatus(null);
      return;
    }

    if (bookingMentor.availableSlots && bookingMentor.availableSlots.length > 0) {
      setBookingSlots(bookingMentor.availableSlots);
    } else {
      const teacherId = bookingMentor.teacherId || bookingMentor._id;
      if (teacherId) {
        setLoadingSlots(true);
        api.get(`/teachers/${teacherId}/slots`)
          .then((res) => {
            setBookingSlots(res.data?.data || []);
          })
          .catch(() => {
            setBookingSlots([]);
          })
          .finally(() => setLoadingSlots(false));
      }
    }
  }, [bookingMentor]);

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
    if (setPreviewGoal) {
      setPreviewGoal(goal);
    }
    setTargetGoalToEnroll(goal);
    setIsOnboardingOpen(true);
  };

  return (
    <div className="min-h-screen bg-knw-bg text-knw-offWhite">
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
                  <span className="text-xs font-mono uppercase tracking-widest text-knw-red font-bold">
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
                {stories.length > 0 ? (
                  stories.map((spark) => {
                    const authorName = spark.createdBy?.name || 'Educator';
                    const authorAvatar = spark.createdBy?.avatar || spark.mediaUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=2d0000&color=ff4444`;
                    return (
                      <button
                        key={spark._id}
                        onClick={() => setActiveStory(spark)}
                        className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                      >
                        <div className={spark.isLive ? 'story-ring-live' : 'story-ring'}>
                          <div className="bg-[#080808] rounded-full p-[2px]">
                            <img
                              src={authorAvatar}
                              alt={authorName}
                              className="w-14 h-14 rounded-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] font-bold text-white group-hover:text-knw-red transition-colors max-w-[70px] truncate leading-tight">
                            {authorName}
                          </p>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full block mt-0.5 ${
                            spark.isLive
                              ? 'bg-knw-red text-white animate-pulse'
                              : 'bg-white/10 text-gray-300 border border-white/10'
                          }`}>
                            {spark.badge || 'SPARK'}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex items-center text-xs font-mono text-knw-muted px-2 py-4">
                    No active educator sparks right now.
                  </div>
                )}
              </div>
            </div>

            {/* ── 2. "CONTINUE YOUR JOURNEY" OR CLEAN EMPTY STATE ── */}
            {activeGoal && activeUserGoal ? (
              <div className="knw-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-knw-red/30 shadow-red">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-knw-red/20 border border-knw-red/40 flex items-center justify-center text-knw-red shrink-0 shadow-red">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-knw-red font-bold">
                          CONTINUE YOUR JOURNEY
                        </span>
                        {activeUserGoal.currentStage && (
                          <span className="text-[10px] text-knw-subtle font-mono">
                            • Stage {activeUserGoal.currentStage}
                          </span>
                        )}
                      </div>
                      <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
                        {activeGoal.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right font-mono">
                      <span className="text-base font-black text-white">
                        {activeUserGoal.overallProgress || 0}%
                      </span>
                      <span className="text-[10px] text-knw-subtle block -mt-0.5">completed</span>
                    </div>

                    <Link
                      to={`/roadmap/${activeGoal.slug || ''}`}
                      className="btn-red px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-red font-mono"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="knw-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-white/10 bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                        GET STARTED
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                        Choose your goal below to begin your structured learning path
                      </h2>
                    </div>
                  </div>

                  <a
                    href="#goal-catalogue"
                    className="btn-red px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-red font-mono whitespace-nowrap self-start sm:self-center"
                  >
                    <span>Browse Goals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* ── 3. FEED POSTS (Data-driven from MongoDB) ── */}
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => {
                  const postId = post._id;
                  const reaction = reactionsState[postId] || { count: post.likesCount || 0, reacted: false };
                  const isBookmarked = bookmarkedPosts[postId] || false;
                  const authorName = post.createdBy?.name || 'Verified Educator';
                  const authorAvatar = post.createdBy?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=2d0000&color=ff4444`;
                  const authorCred = post.authorProfile?.headline || post.authorProfile?.qualification || 'Academic Coach';

                  return (
                    <article
                      key={postId}
                      className="knw-card rounded-3xl overflow-hidden relative group"
                    >
                      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-knw-red/60 to-transparent" />

                      {/* Post Top Meta */}
                      <div className="flex items-center justify-between px-5 pt-4 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-knw-red/15 text-knw-red border-knw-red/40">
                            ● POST
                          </span>
                          {post.goalSlug && (
                            <span className="text-[10px] text-knw-red font-mono hidden sm:inline">
                              ✦ {post.goalSlug}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-knw-muted font-mono">
                          {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {/* Author Header */}
                      <div className="flex items-center justify-between px-5 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="story-ring shrink-0">
                            <img
                              src={authorAvatar}
                              alt={authorName}
                              className="w-11 h-11 rounded-full object-cover bg-black p-[1px]"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-white">{authorName}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                            </div>
                            <p className="text-xs text-knw-red font-semibold leading-tight mt-0.5">
                              {authorCred}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Media Cover Image if present */}
                      {post.imageUrl && (
                        <div className="relative mx-5 rounded-2xl overflow-hidden">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-56 sm:h-64 object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                      )}

                      {/* Title & Description Body */}
                      <div className="px-5 pt-3 pb-4 space-y-1.5">
                        <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                          {post.text}
                        </p>

                        {/* External Link if present */}
                        {post.externalLink?.url && (
                          <div className="pt-2">
                            <a
                              href={post.externalLink.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-knw-red hover:text-knw-redBright underline font-mono"
                            >
                              <span>{post.externalLink.title || 'Open Reference Material'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {/* Tags */}
                        {post.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {post.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-xs font-mono text-knw-red/80 hover:text-knw-red cursor-pointer transition-colors"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Social Reaction Bar */}
                      <div className="flex items-center justify-between px-5 pt-2 pb-3 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleReaction(postId, post.likesCount || 0)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                              reaction.reacted
                                ? 'bg-orange-950/40 text-orange-400 border-orange-700/50 shadow-sm'
                                : 'bg-white/5 text-knw-muted hover:text-orange-400 border-white/10'
                            }`}
                          >
                            <Flame className={`w-4 h-4 ${reaction.reacted ? 'fill-orange-400 text-orange-400' : ''}`} />
                            <span className="font-bold">{reaction.count.toLocaleString()}</span>
                            <span className="hidden sm:inline">Likes</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark(postId)}
                            className={`p-2 rounded-xl border transition-all ${
                              isBookmarked
                                ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                                : 'bg-white/5 border-white/10 text-knw-muted hover:text-yellow-400'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="knw-card rounded-3xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-knw-red/15 text-knw-red flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Community Feed</h4>
                  <p className="text-xs text-knw-muted max-w-sm mx-auto">
                    Educators and mentors will share educational sparks, practice problem breakdowns, and live session updates here.
                  </p>
                </div>
              )}
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
                    <span className="text-xs font-mono uppercase tracking-widest text-knw-red font-bold">
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
                  {loading ? (
                    <div className="py-8 text-center text-xs font-mono text-knw-muted space-y-2">
                      <div className="w-5 h-5 border-2 border-knw-red border-t-transparent rounded-full animate-spin mx-auto" />
                      <p>Loading curricula...</p>
                    </div>
                  ) : filteredGoals.length === 0 ? (
                    <div className="py-6 text-center text-xs font-mono text-knw-muted">
                      No matching curricula found.
                    </div>
                  ) : (
                    filteredGoals.map((goal) => {
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
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-knw-red text-white font-bold">
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
                    })
                  )}
                </div>

                {/* Custom Goal Trigger */}
                <button
                  onClick={() => setIsCustomGoalOpen(true)}
                  className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-knw-red/40 text-knw-red hover:bg-knw-red/10 transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Design Custom Goal with AI</span>
                </button>
              </div>

              {/* Top Industry Advisors Card */}
              <div className="knw-card rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-knw-red font-bold">
                    VERIFIED MENTORS
                  </span>
                  <Link to="/roadmap" className="text-[11px] font-mono text-knw-muted hover:text-white">
                    View All →
                  </Link>
                </div>

                <div className="space-y-3">
                  {availableMentors.length === 0 ? (
                    <div className="py-6 px-3 text-center rounded-2xl bg-knw-surface/50 border border-white/5">
                      <p className="text-xs text-knw-muted font-mono">No mentors with open slots currently.</p>
                      <p className="text-[10px] text-gray-500 mt-1">Check back soon or explore roadmaps.</p>
                    </div>
                  ) : (
                    availableMentors.map((adv) => (
                      <div
                        key={adv._id || adv.teacherId}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-knw-surface border border-white/5 hover:border-knw-red/30 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={adv.avatar}
                            alt={adv.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-knw-red/40 shrink-0"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(adv.name)}&background=2d0000&color=ff4444`;
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white leading-tight truncate">{adv.name}</h4>
                            <p className="text-[10px] text-knw-red font-mono truncate max-w-[130px]">
                              {adv.headline || adv.currentPosition?.jobTitle || 'Verified Mentor'}
                            </p>
                            {adv.nextAvailableSlot && (
                              <p className="text-[9px] text-emerald-400 font-mono">
                                Next: {adv.nextAvailableSlot}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {adv.rating && (
                            <span className="text-xs font-mono text-yellow-400 font-bold block">★ {adv.rating}</span>
                          )}
                          <button
                            onClick={() => setBookingMentor(adv)}
                            className="block text-[10px] font-mono text-knw-red hover:text-white mt-0.5 underline font-bold"
                          >
                            Book Slot
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── 4. POPUP STORY VIEWER MODAL (Instagram Style) ── */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-knw-surface border border-knw-red/40 shadow-red-lg">
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
                  <span className="text-[9px] text-knw-red font-mono block">{activeStory.credential}</span>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* Story Content & Educational Tip */}
            <div className="p-5 space-y-3 relative z-20">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-knw-red px-2 py-0.5 rounded-full bg-knw-red/15 border border-knw-red/30">
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
                    const mentorUser = availableMentors.find(m => m.teacherId === (selected.teacherId?._id || selected.teacherId));
                    setBookingMentor(mentorUser || {
                      _id: selected.teacherId?._id || selected.teacherId,
                      teacherId: selected.teacherId?._id || selected.teacherId,
                      name: selected.author,
                      avatar: selected.avatar,
                      headline: selected.credential,
                      rating: selected.rating,
                      availableSlots: []
                    });
                  }}
                  className="w-full btn-red py-2.5 text-xs font-bold shadow-red flex items-center justify-center gap-2 font-mono"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{activeStory.slotAction || 'Book 1-on-1 Session'}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg knw-glass rounded-3xl p-6 border border-knw-red/40 shadow-red-lg space-y-5">
            <button
              onClick={() => {
                setBookingMentor(null);
                setBookingStatus(null);
              }}
              className="absolute top-4 right-4 text-knw-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={bookingMentor.avatar}
                alt={bookingMentor.name || bookingMentor.author}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-knw-red/60"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(bookingMentor.name || 'Mentor')}&background=2d0000&color=ff4444`;
                }}
              />
              <div>
                <h3 className="text-base font-bold text-white">{bookingMentor.name || bookingMentor.author}</h3>
                <p className="text-xs text-knw-red font-semibold">{bookingMentor.headline || bookingMentor.credential || bookingMentor.pos || 'Faculty Mentor'}</p>
                {bookingMentor.rating && (
                  <span className="text-[10px] text-yellow-400 font-mono">★ {bookingMentor.rating} Rating · Verified Mentor</span>
                )}
              </div>
            </div>

            {/* Status Alert if booking succeeded or failed */}
            {bookingStatus && (
              <div className={`p-3 rounded-2xl text-xs font-mono border ${
                bookingStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}>
                {bookingStatus.message}
              </div>
            )}

            {/* Session Agenda */}
            <div className="p-3 bg-knw-surface rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-mono uppercase text-knw-red font-bold block">1-ON-1 SESSION AGENDA:</span>
              <p className="text-xs text-gray-300">
                Live Concept Discussion, Code & Architecture Review, FAANG Mock Interview Drills, and Exam Strategy.
              </p>
            </div>

            {/* Slots Picker */}
            <div>
              <span className="text-xs font-mono uppercase text-knw-muted font-bold block mb-2">
                SELECT AVAILABLE SLOT:
              </span>
              {loadingSlots ? (
                <div className="py-6 text-center text-xs font-mono text-knw-muted">
                  Checking open slots…
                </div>
              ) : bookingSlots.length === 0 ? (
                <div className="py-6 text-center text-xs font-mono text-knw-muted bg-white/5 rounded-2xl border border-white/5">
                  No open slots currently available for this mentor.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                  {bookingSlots.map((slot) => (
                    <button
                      key={slot._id}
                      disabled={isBooking}
                      onClick={async () => {
                        if (!isAuthenticated) {
                          setBookingStatus({
                            type: 'error',
                            message: 'Please sign in to book a mentorship session.'
                          });
                          return;
                        }
                        setIsBooking(true);
                        setBookingStatus(null);
                        try {
                          await api.post('/bookings', {
                            slotId: slot._id,
                            teacherId: bookingMentor.teacherId || bookingMentor._id,
                            subject: '1-on-1 Guidance Session'
                          });
                          setBookingStatus({
                            type: 'success',
                            message: `Confirmed! Your 1-on-1 session is booked for ${slot.dayOfWeek} at ${slot.startTime}. Meeting room generated.`
                          });
                          setBookingSlots(prev => prev.filter(s => s._id !== slot._id));
                          loadHomeFeed();
                        } catch (err) {
                          if (err.response?.status === 409) {
                            setBookingStatus({
                              type: 'error',
                              message: 'This slot was just booked by another student. Please pick another time.'
                            });
                            setBookingSlots(prev => prev.filter(s => s._id !== slot._id));
                          } else {
                            setBookingStatus({
                              type: 'error',
                              message: err.response?.data?.message || 'Failed to book slot. Please try again.'
                            });
                          }
                        } finally {
                          setIsBooking(false);
                        }
                      }}
                      className="p-2.5 rounded-xl border border-white/10 bg-knw-surface text-xs font-mono text-white hover:border-knw-red hover:bg-knw-red/20 transition-all text-center disabled:opacity-50"
                    >
                      <div className="font-bold text-knw-red">{slot.dayOfWeek}</div>
                      <div className="text-[11px] text-gray-300 mt-0.5">{slot.startTime} - {slot.endTime}</div>
                      {slot.specificDate && (
                        <div className="text-[9px] text-knw-muted">{slot.specificDate}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
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
