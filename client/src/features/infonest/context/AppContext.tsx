import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  Post,
  Story,
  Course,
  RoadmapData,
  UserGoal,
  Comment,
  Creator,
  NotificationItem,
  ContentItem,
  ToastNotification,
  KnowledgeTrail,
  KnowledgeTrailItem,
  LearningMission,
  OrbitRoom,
  KnowledgeChallenge,
  KnowledgeProof,
  KnowledgeReactionType
} from '../types';
import {
  CURRENT_USER,
  MOCK_CREATORS,
  MOCK_STORIES,
  MOCK_POSTS,
  MOCK_COURSES,
  MOCK_ROADMAP,
  MOCK_ROADMAPS,
  MOCK_GOALS,
  MOCK_NOTIFICATIONS,
  MOCK_CREATOR_CONTENT,
  MOCK_KNOWLEDGE_TRAILS,
  MOCK_LEARNING_MISSIONS,
  MOCK_ORBIT_ROOMS,
  MOCK_KNOWLEDGE_CHALLENGES,
  MOCK_KNOWLEDGE_PROOFS
} from '../data/mockData';
import { sounds } from '../services/soundManager';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  currentUser: typeof CURRENT_USER;
  creators: Creator[];
  posts: Post[];
  stories: Story[];
  courses: Course[];
  roadmaps: RoadmapData[];
  activeRoadmap: RoadmapData;
  setActiveRoadmap: (rm: RoadmapData) => void;
  goals: UserGoal[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  creatorContent: ContentItem[];
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;

  // Active story and comments drawer
  activeStory: Story | null;
  setActiveStory: (story: Story | null) => void;
  activeCommentsPostId: string | null;
  setActiveCommentsPostId: (postId: string | null) => void;

  // Social interactions
  toggleLikePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  toggleFollowCreator: (creatorId: string) => void;
  addComment: (postId: string, text: string) => void;
  getCommentsForPost: (postId: string) => Comment[];
  createPost: (newPost: Partial<Post>) => void;
  reactToPost: (postId: string, reaction: KnowledgeReactionType) => void;
  saveToVaultFolder: (postId: string, folder: string) => void;

  // Signature InfoNest Features
  knowledgeTrails: KnowledgeTrail[];
  addDropToTrail: (trailId: string, dropTitle: string, dropType: string) => void;
  createKnowledgeTrail: (title: string, category: string, description: string) => void;

  learningMissions: LearningMission[];
  toggleMissionTask: (missionId: string, taskId: string) => void;
  claimMissionReward: (missionId: string) => void;

  orbitRooms: OrbitRoom[];
  joinOrbitRoom: (roomId: string) => void;

  challenges: KnowledgeChallenge[];
  submitChallengeSolution: (challengeId: string) => void;

  knowledgeProofs: KnowledgeProof[];

  activeTrailModalPost: Post | null;
  setActiveTrailModalPost: (post: Post | null) => void;
  activeVaultModalPost: Post | null;
  setActiveVaultModalPost: (post: Post | null) => void;

  // Learning interactions
  enrollInCourse: (courseId: string) => void;
  markLectureComplete: (courseId: string, lectureId: string) => void;
  toggleMilestoneComplete: (roadmapId: string, milestoneId: string) => void;
  cloneRoadmapToMyGoals: (roadmap: RoadmapData) => void;
  logStudyHours: (goalId: string, hours: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteContentItem: (id: string) => void;

  // Audio system
  isMuted: boolean;
  toggleMute: () => void;
  isAmbientPlaying: boolean;
  toggleAmbient: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Role State
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('infonest_role') as UserRole) || 'student';
  });

  const setRole = (newRole: UserRole) => {
    sounds.playSwoop();
    setRoleState(newRole);
    localStorage.setItem('infonest_role', newRole);
  };

  const toggleRole = () => {
    setRole(role === 'student' ? 'creator' : 'student');
  };

  // 2. Data States with LocalStorage Hydration
  const [currentUser, setCurrentUser] = useState<typeof CURRENT_USER>(() => {
    const saved = localStorage.getItem('infonest_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [creators, setCreators] = useState<Creator[]>(MOCK_CREATORS);
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('infonest_posts');
    return saved ? JSON.parse(saved) : MOCK_POSTS;
  });
  const [stories] = useState<Story[]>(MOCK_STORIES);
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('infonest_courses');
    return saved ? JSON.parse(saved) : MOCK_COURSES;
  });
  const [roadmaps, setRoadmaps] = useState<RoadmapData[]>(MOCK_ROADMAPS);
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapData>(MOCK_ROADMAP);
  const [goals, setGoals] = useState<UserGoal[]>(() => {
    const saved = localStorage.getItem('infonest_goals');
    return saved ? JSON.parse(saved) : MOCK_GOALS;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [creatorContent, setCreatorContent] = useState<ContentItem[]>(MOCK_CREATOR_CONTENT);

  // 3. UI and Audio States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('infonest_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('infonest_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('infonest_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('infonest_goals', JSON.stringify(goals));
  }, [goals]);

  // Toast dispatch
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Audio toggles
  const toggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    showToast(muted ? 'Sound effects muted' : 'Sound effects unmuted', 'info');
  };

  const toggleAmbient = () => {
    const playing = sounds.toggleAmbient();
    setIsAmbientPlaying(playing);
    showToast(playing ? 'Space drone ambient sound ON' : 'Ambient sound OFF', 'info');
  };

  // Social interactions
  const toggleLikePost = (postId: string) => {
    sounds.playLike();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );
  };

  const toggleBookmarkPost = (postId: string) => {
    sounds.playClick();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const nextBookmarked = !p.isBookmarked;
          showToast(nextBookmarked ? 'Saved to Knowledge Vault' : 'Removed from Saved', 'info');
          return {
            ...p,
            isBookmarked: nextBookmarked,
            bookmarksCount: nextBookmarked ? p.bookmarksCount + 1 : p.bookmarksCount - 1
          };
        }
        return p;
      })
    );
  };

  const reactToPost = (postId: string, reactionType: KnowledgeReactionType) => {
    sounds.playReaction(reactionType);
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const prevReaction = p.userReaction;
          const reactions = { ...(p.reactions || { insightful: 0, useful: 0, mindOpening: 0, practical: 0, like: 0 }) };

          if (prevReaction === reactionType) {
            reactions[reactionType] = Math.max(0, reactions[reactionType] - 1);
            return {
              ...p,
              userReaction: undefined,
              reactions,
              isLiked: reactionType === 'like' ? false : p.isLiked,
              likesCount: reactionType === 'like' ? Math.max(0, p.likesCount - 1) : p.likesCount
            };
          } else {
            if (prevReaction) {
              reactions[prevReaction] = Math.max(0, reactions[prevReaction] - 1);
            }
            reactions[reactionType] = (reactions[reactionType] || 0) + 1;
            const labels: Record<KnowledgeReactionType, string> = {
              insightful: '🔥 Insightful',
              useful: '💡 Useful',
              mindOpening: '🧠 Mind-opening',
              practical: '⚡ Practical',
              like: '❤️ Like'
            };
            showToast(`Reacted with ${labels[reactionType]}! +5 Knowledge Tokens earned`, 'success');
            return {
              ...p,
              userReaction: reactionType,
              reactions,
              isLiked: reactionType === 'like' ? true : p.isLiked,
              likesCount: reactionType === 'like' && !prevReaction ? p.likesCount + 1 : p.likesCount
            };
          }
        }
        return p;
      })
    );
  };

  const saveToVaultFolder = (postId: string, folder: string) => {
    sounds.playLike();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isBookmarked: true,
            bookmarksCount: p.isBookmarked ? p.bookmarksCount : p.bookmarksCount + 1
          };
        }
        return p;
      })
    );
    showToast(`Added to Knowledge Vault [${folder}]! +10 Knowledge Tokens`, 'success');
  };

  const toggleFollowCreator = (creatorId: string) => {
    sounds.playChime();
    let followed = false;
    let creatorName = '';

    setCreators(prev =>
      prev.map(c => {
        if (c.id === creatorId) {
          followed = !c.isFollowed;
          creatorName = c.name;
          return {
            ...c,
            isFollowed: followed,
            followersCount: followed ? c.followersCount + 1 : c.followersCount - 1
          };
        }
        return c;
      })
    );

    setPosts(prev =>
      prev.map(p => {
        if (p.creator.id === creatorId) {
          return {
            ...p,
            creator: {
              ...p.creator,
              isFollowed: !p.creator.isFollowed,
              followersCount: p.creator.isFollowed ? p.creator.followersCount - 1 : p.creator.followersCount + 1
            }
          };
        }
        return p;
      })
    );

    showToast(followed ? `Following ${creatorName}` : `Unfollowed ${creatorName}`, 'info');
  };

  // Mock comments store
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({
    post_1: [
      {
        id: 'c_1',
        postId: 'post_1',
        user: {
          name: 'Sarah Chen',
          handle: '@sarah_design',
          avatar: MOCK_CREATORS[2].avatar,
          roleBadge: 'VP Design'
        },
        text: 'The slide on Verifier Rewards illustrates the search tree branching better than anything I have seen from NeurIPS this year! Outstanding breakdown Dr. Elena.',
        createdAt: '1h ago',
        likesCount: 42,
        isLiked: true
      },
      {
        id: 'c_2',
        postId: 'post_1',
        user: {
          name: 'Marcus Vance',
          handle: '@marcus_distrib',
          avatar: MOCK_CREATORS[1].avatar,
          roleBadge: 'Principal Architect'
        },
        text: 'How does the inference latency scale when branching depth exceeds 12? Are you caching state tokens across rollouts?',
        createdAt: '35m ago',
        likesCount: 18,
        isLiked: false
      }
    ]
  });

  const addComment = (postId: string, text: string) => {
    sounds.playChime();
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      postId,
      user: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        roleBadge: currentUser.role
      },
      text,
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false
    };

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])]
    }));

    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    showToast('Comment posted to discussion thread');
  };

  const getCommentsForPost = (postId: string): Comment[] => {
    return commentsMap[postId] || [];
  };

  const createPost = (newPostData: Partial<Post>) => {
    sounds.playTriumph();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const created: Post = {
      id: `post_${Date.now()}`,
      creatorId: 'usr_me',
      creator: {
        id: 'usr_me',
        username: currentUser.username,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        coverImage: currentUser.coverImage,
        role: currentUser.role,
        specialty: 'Next-Gen Engineering',
        bio: currentUser.bio,
        followersCount: 1420,
        followingCount: 380,
        studentCount: 420,
        totalLectures: 4,
        rating: 5.0,
        isFollowed: false,
        verified: true,
        knowledgeTokens: currentUser.knowledgeTokens,
        knowledgeScore: currentUser.knowledgeScore,
        expertiseTags: ['Systems', 'AI', 'UI/UX']
      },
      type: newPostData.type || 'thought',
      title: newPostData.title || 'Untitled Post',
      caption: newPostData.caption || '',
      tags: newPostData.tags || ['#Knowledge', '#InfoNest'],
      createdAt: 'Just now',
      likesCount: 1,
      commentsCount: 0,
      bookmarksCount: 0,
      sharesCount: 0,
      isLiked: true,
      isBookmarked: false,
      reactions: {
        insightful: 0,
        useful: 0,
        mindOpening: 0,
        practical: 0,
        like: 1
      },
      userReaction: 'like',
      carouselImages: newPostData.carouselImages,
      lectureData: newPostData.lectureData,
      thoughtData: newPostData.thoughtData,
      roadmapData: newPostData.roadmapData,
      challengeData: newPostData.challengeData,
      researchData: newPostData.researchData,
      diagramUrl: newPostData.diagramUrl
    };

    setPosts(prev => [created, ...prev]);

    // Also append to creator content
    const newContentItem: ContentItem = {
      id: created.id,
      title: created.title,
      type: (created.type === 'lecture' || created.type === 'roadmap') ? created.type : 'post',
      status: 'published',
      date: 'Just now',
      views: 1,
      likes: 1,
      comments: 0
    };
    setCreatorContent(prev => [newContentItem, ...prev]);

    showToast('Drop published to The Nest! 🚀');
  };

  const enrollInCourse = (courseId: string) => {
    sounds.playTriumph();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 }
    });

    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, isEnrolled: true, studentsCount: c.studentsCount + 1 } : c))
    );

    setCurrentUser(u => ({ ...u, enrolledCoursesCount: u.enrolledCoursesCount + 1 }));
    showToast('Enrolled in Masterclass! Course added to your vault.');
  };

  const markLectureComplete = (courseId: string, lectureId: string) => {
    sounds.playTriumph();
    confetti({ particleCount: 75, spread: 60 });

    setCourses(prev =>
      prev.map(course => {
        if (course.id === courseId) {
          let totalLecs = 0;
          let completedLecs = 0;

          const updatedModules = course.modules.map(mod => {
            const updatedLectures = mod.lectures.map(lec => {
              totalLecs++;
              if (lec.id === lectureId) {
                completedLecs++;
                return { ...lec, isCompleted: true };
              }
              if (lec.isCompleted) completedLecs++;
              return lec;
            });
            return { ...mod, lectures: updatedLectures };
          });

          const progressPercent = Math.round((completedLecs / Math.max(1, totalLecs)) * 100);

          return {
            ...course,
            progressPercent,
            modules: updatedModules
          };
        }
        return course;
      })
    );

    setCurrentUser(u => ({ ...u, knowledgeTokens: u.knowledgeTokens + 100 }));
    showToast('Lecture completed! +100 Knowledge Tokens earned.');
  };

  const toggleMilestoneComplete = (roadmapId: string, milestoneId: string) => {
    sounds.playTriumph();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });

    setRoadmaps(prevRoadmaps =>
      prevRoadmaps.map(rm => {
        if (rm.id === roadmapId) {
          const updatedMilestones = rm.milestones.map(m => {
            if (m.id === milestoneId) {
              const nextStatus: 'completed' | 'in-progress' =
                m.status === 'completed' ? 'in-progress' : 'completed';
              return { ...m, status: nextStatus };
            }
            return m;
          });

          const completedMilestones = updatedMilestones.filter(m => m.status === 'completed').length;
          return {
            ...rm,
            completedMilestones,
            milestones: updatedMilestones
          };
        }
        return rm;
      })
    );

    setActiveRoadmap(prev => {
      if (prev.id === roadmapId) {
        const updated = prev.milestones.map(m => {
          if (m.id === milestoneId) {
            const nextStatus: 'completed' | 'in-progress' =
              m.status === 'completed' ? 'in-progress' : 'completed';
            return { ...m, status: nextStatus };
          }
          return m;
        });
        const completedMilestones = updated.filter(m => m.status === 'completed').length;
        return { ...prev, completedMilestones, milestones: updated };
      }
      return prev;
    });

    setCurrentUser(u => ({
      ...u,
      knowledgeTokens: u.knowledgeTokens + 250,
      knowledgeScore: u.knowledgeScore + 15
    }));

    showToast('Milestone achieved! +250 Knowledge Tokens awarded.');
  };

  const cloneRoadmapToMyGoals = (targetRoadmap: RoadmapData) => {
    sounds.playTriumph();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    const newGoal: UserGoal = {
      id: `goal_${Date.now()}`,
      roadmapTitle: targetRoadmap.title,
      roadmapId: targetRoadmap.id,
      targetHoursPerWeek: 10,
      loggedHoursThisWeek: 0,
      targetCompletionDate: '3 Months Target',
      streakDays: 1,
      completedTasks: targetRoadmap.completedMilestones,
      totalTasks: targetRoadmap.totalMilestones,
      weeklyHistory: [0, 0, 0, 0, 0, 0, 0]
    };

    setGoals(prev => [newGoal, ...prev]);
    setCurrentUser(u => ({ ...u, activeRoadmapsCount: u.activeRoadmapsCount + 1 }));
    showToast(`Roadmap "${targetRoadmap.title}" cloned to your learning goals!`);
  };

  const logStudyHours = (goalId: string, hours: number) => {
    sounds.playChime();
    setGoals(prev =>
      prev.map(g => {
        if (g.id === goalId) {
          const nextLogged = g.loggedHoursThisWeek + hours;
          if (nextLogged >= g.targetHoursPerWeek) {
            sounds.playTriumph();
            confetti({ particleCount: 50, spread: 50 });
          }
          return {
            ...g,
            loggedHoursThisWeek: nextLogged
          };
        }
        return g;
      })
    );

    setCurrentUser(u => ({
      ...u,
      knowledgeTokens: u.knowledgeTokens + Math.round(hours * 25)
    }));

    showToast(`Logged +${hours} hr study! Keep the streak going 🔥`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    sounds.playClick();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const deleteContentItem = (id: string) => {
    sounds.playClick();
    setCreatorContent(prev => prev.filter(c => c.id !== id));
    setPosts(prev => prev.filter(p => p.id !== id));
    showToast('Content item archived');
  };

  // ---------------- SIGNATURE INFONEST DOMAIN FEATURES ----------------
  const [knowledgeTrails, setKnowledgeTrails] = useState<KnowledgeTrail[]>(() => {
    const saved = localStorage.getItem('infonest_trails');
    return saved ? JSON.parse(saved) : MOCK_KNOWLEDGE_TRAILS;
  });

  const [learningMissions, setLearningMissions] = useState<LearningMission[]>(() => {
    const saved = localStorage.getItem('infonest_missions');
    return saved ? JSON.parse(saved) : MOCK_LEARNING_MISSIONS;
  });

  const [orbitRooms] = useState<OrbitRoom[]>(MOCK_ORBIT_ROOMS);
  const [challenges, setChallenges] = useState<KnowledgeChallenge[]>(MOCK_KNOWLEDGE_CHALLENGES);
  const [knowledgeProofs] = useState<KnowledgeProof[]>(MOCK_KNOWLEDGE_PROOFS);

  const [activeTrailModalPost, setActiveTrailModalPost] = useState<Post | null>(null);
  const [activeVaultModalPost, setActiveVaultModalPost] = useState<Post | null>(null);

  useEffect(() => {
    localStorage.setItem('infonest_trails', JSON.stringify(knowledgeTrails));
  }, [knowledgeTrails]);

  useEffect(() => {
    localStorage.setItem('infonest_missions', JSON.stringify(learningMissions));
  }, [learningMissions]);

  const addDropToTrail = (trailId: string, dropTitle: string, dropType: string) => {
    sounds.playChime();
    setKnowledgeTrails(prev =>
      prev.map(tr => {
        if (tr.id === trailId) {
          const newItem: KnowledgeTrailItem = {
            id: `ti_${Date.now()}`,
            title: dropTitle,
            type: dropType as any,
            duration: '5 min',
            completed: false
          };
          return {
            ...tr,
            items: [...tr.items, newItem]
          };
        }
        return tr;
      })
    );
    showToast(`Added to Knowledge Trail! +10 Knowledge Tokens`, 'success');
  };

  const createKnowledgeTrail = (title: string, category: string, description: string) => {
    sounds.playTriumph();
    const newTrail: KnowledgeTrail = {
      id: `trail_${Date.now()}`,
      title,
      category,
      description,
      items: [],
      createdAt: 'Just now'
    };
    setKnowledgeTrails(prev => [newTrail, ...prev]);
    showToast(`Created new Knowledge Trail: "${title}"`, 'success');
  };

  const toggleMissionTask = (missionId: string, taskId: string) => {
    sounds.playClick();
    setLearningMissions(prev =>
      prev.map(m => {
        if (m.id === missionId) {
          const updatedTasks = m.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t));
          const completedCount = updatedTasks.filter(t => t.completed).length;
          const allCompleted = completedCount === updatedTasks.length;
          if (allCompleted && !m.completed) {
            sounds.playMissionComplete();
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
            showToast(`Mission Ready to Claim: +${m.rewardTokens} Knowledge Tokens!`, 'success');
          }
          return {
            ...m,
            tasks: updatedTasks,
            progress: completedCount,
            completed: allCompleted
          };
        }
        return m;
      })
    );
  };

  const claimMissionReward = (missionId: string) => {
    sounds.playTriumph();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    let rewardAmt = 80;
    setLearningMissions(prev =>
      prev.map(m => {
        if (m.id === missionId) {
          rewardAmt = m.rewardTokens;
          showToast(`Claimed +${m.rewardTokens} Knowledge Tokens!`, 'success');
          return { ...m, claimed: true };
        }
        return m;
      })
    );
    setCurrentUser(prev => ({
      ...prev,
      knowledgeTokens: prev.knowledgeTokens + rewardAmt
    }));
  };

  const joinOrbitRoom = (roomId: string) => {
    sounds.playChime();
    const room = orbitRooms.find(r => r.id === roomId);
    showToast(`Joined ${room?.name || 'Orbit Room'}! Welcome to the focus sphere.`, 'info');
  };

  const submitChallengeSolution = (challengeId: string) => {
    sounds.playTriumph();
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.65 } });
    setChallenges(prev =>
      prev.map(c => (c.id === challengeId ? { ...c, solved: true, participants: c.participants + 1 } : c))
    );
    setCurrentUser(prev => ({
      ...prev,
      knowledgeTokens: prev.knowledgeTokens + 100
    }));
    showToast('Challenge Solution Submitted! +100 Knowledge Tokens awarded.', 'success');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        currentUser,
        creators,
        posts,
        stories,
        courses,
        roadmaps,
        activeRoadmap,
        setActiveRoadmap,
        goals,
        notifications,
        unreadNotificationsCount,
        creatorContent,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        activeStory,
        setActiveStory,
        activeCommentsPostId,
        setActiveCommentsPostId,
        toggleLikePost,
        toggleBookmarkPost,
        toggleFollowCreator,
        addComment,
        getCommentsForPost,
        createPost,
        reactToPost,
        saveToVaultFolder,
        knowledgeTrails,
        addDropToTrail,
        createKnowledgeTrail,
        learningMissions,
        toggleMissionTask,
        claimMissionReward,
        orbitRooms,
        joinOrbitRoom,
        challenges,
        submitChallengeSolution,
        knowledgeProofs,
        activeTrailModalPost,
        setActiveTrailModalPost,
        activeVaultModalPost,
        setActiveVaultModalPost,
        enrollInCourse,
        markLectureComplete,
        toggleMilestoneComplete,
        cloneRoadmapToMyGoals,
        logStudyHours,
        markNotificationRead,
        markAllNotificationsRead,
        deleteContentItem,
        isMuted,
        toggleMute,
        isAmbientPlaying,
        toggleAmbient
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
