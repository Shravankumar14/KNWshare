import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import {
  DEFAULT_GOAL_SLUG,
  PREDEFINED_GOALS,
  resolveCanonicalGoalSlug,
  getGoalDataByIdOrSlug,
} from '../data/goalRegistry';

const GoalContext = createContext(null);

export const GoalProvider = ({ children }) => {
  const { user, isAuthenticated, refreshUser } = useAuth();

  const getSavedSlug = () => {
    const saved = localStorage.getItem('knwshare_active_goal_slug');
    return saved ? resolveCanonicalGoalSlug(saved) : null;
  };

  const [selectedGoalSlug, setSelectedGoalSlugState] = useState(getSavedSlug);
  const [allGoals, setAllGoals] = useState(PREDEFINED_GOALS);
  const [myGoals, setMyGoals] = useState([]);
  const [activeUserGoal, setActiveUserGoal] = useState(null);
  const [userGoalProfile, setUserGoalProfile] = useState(null);
  const [activeGoal, setActiveGoal] = useState(() => {
    const initialSlug = localStorage.getItem('knwshare_active_goal_slug');
    if (!initialSlug) return null;
    const staticEntry = getGoalDataByIdOrSlug(initialSlug);
    return staticEntry?.goal || null;
  });
  const [loading, setLoading] = useState(true);

  // Helper to set selected goal slug cleanly
  const setSelectedGoalSlug = useCallback((rawSlug) => {
    if (!rawSlug) return;
    const canonical = resolveCanonicalGoalSlug(rawSlug);
    setSelectedGoalSlugState(canonical);
    localStorage.setItem('knwshare_active_goal_slug', canonical);

    // Update activeGoal object if available in allGoals
    setAllGoals((currentGoals) => {
      const matched = currentGoals.find(
        (g) => g.slug === canonical || (canonical === 'jee-main-advanced' && g.slug === 'jee-mains-advanced')
      );
      if (matched) {
        setActiveGoal(matched);
      } else {
        const fallbackStatic = getGoalDataByIdOrSlug(canonical);
        if (fallbackStatic?.goal) {
          setActiveGoal(fallbackStatic.goal);
        }
      }
      return currentGoals;
    });
  }, []);

  // Fetch all active goals from backend
  const fetchAllGoals = async () => {
    try {
      const res = await api.get('/goals');
      const apiGoals = res.data?.data || [];

      if (apiGoals.length > 0) {
        // Merge with predefined goals for guaranteed icons/descriptions
        const goalMap = new Map();
        PREDEFINED_GOALS.forEach((g) => goalMap.set(resolveCanonicalGoalSlug(g.slug), g));
        apiGoals.forEach((g) => {
          const canonical = resolveCanonicalGoalSlug(g.slug);
          const existing = goalMap.get(canonical);
          goalMap.set(canonical, existing ? { ...existing, ...g } : g);
        });

        const merged = Array.from(goalMap.values());
        merged.sort((a, b) => (a.order || 0) - (b.order || 0));
        setAllGoals(merged);

        // Re-sync activeGoal
        const currentSavedSlug = localStorage.getItem('knwshare_active_goal_slug') || DEFAULT_GOAL_SLUG;
        const matched = merged.find((g) => resolveCanonicalGoalSlug(g.slug) === resolveCanonicalGoalSlug(currentSavedSlug));
        if (matched) {
          setActiveGoal(matched);
        }
        return merged;
      }
      return PREDEFINED_GOALS;
    } catch (err) {
      console.warn('API /goals returned error, using predefined goals:', err.message);
      return PREDEFINED_GOALS;
    }
  };

  // Fetch user's enrolled goals and goal profile
  const fetchMyGoals = async () => {
    if (!isAuthenticated) {
      setMyGoals([]);
      setActiveUserGoal(null);
      setUserGoalProfile(null);
      return;
    }

    try {
      // 1. Fetch enrolled goals first
      const res = await api.get('/goals/my-goals').catch(() => null);
      const enrolled = res?.data?.data || [];
      setMyGoals(enrolled);

      if (enrolled.length > 0) {
        const matchingSaved = enrolled.find((g) => {
          const gSlug = resolveCanonicalGoalSlug(g.goalId?.slug || g.slug);
          return gSlug === selectedGoalSlug;
        });
        const active = matchingSaved || enrolled[0];
        setActiveUserGoal(active);

        if (active?.goalId) {
          setActiveGoal(active.goalId);
          const canonical = resolveCanonicalGoalSlug(active.goalId.slug);
          setSelectedGoalSlugState(canonical);
          localStorage.setItem('knwshare_active_goal_slug', canonical);

          // Fetch profile for this active goal
          const profileRes = await api.get(`/users/me/goal-profile/${canonical}`).catch(() => null);
          if (profileRes?.data?.data) {
            setUserGoalProfile(profileRes.data.data);
          } else {
            setUserGoalProfile(null);
          }
        }
      } else {
        // Brand new student with no enrolled goals
        setActiveUserGoal(null);
        setActiveGoal(null);
        setUserGoalProfile(null);
        localStorage.removeItem('knwshare_active_goal_slug');
      }
    } catch (err) {
      console.error('Error fetching my goals:', err);
      setActiveUserGoal(null);
      setActiveGoal(null);
      setUserGoalProfile(null);
    }
  };

  // Initialize
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      await fetchAllGoals();
      if (isAuthenticated) {
        await fetchMyGoals();
      }
      if (mounted) setLoading(false);
    };
    init();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, selectedGoalSlug]);

  // Select/Enroll in a Goal
  const selectGoal = async ({ goalId, targetDate, hoursPerDay, currentLevel, daysPerWeek, targetTimelineWeeks }) => {
    const targetGoal = allGoals.find((g) => g._id === goalId || g.slug === goalId);
    const canonicalSlug = resolveCanonicalGoalSlug(targetGoal?.slug || goalId);
    setSelectedGoalSlug(canonicalSlug);

    if (isAuthenticated) {
      try {
        // Save both to UserGoalProfile and legacy selectGoal
        await api.post('/users/me/goal-profile', {
          goalId: targetGoal?._id || goalId,
          goalSlug: canonicalSlug,
          level: currentLevel || 'beginner',
          hoursPerDay: Number(hoursPerDay) || 2,
          daysPerWeek: Number(daysPerWeek) || 6,
          targetTimelineWeeks: Number(targetTimelineWeeks) || 24
        });

        const res = await api.post('/goals/select', {
          goalId: targetGoal?._id || goalId,
          targetDate: targetDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          hoursPerDay: Number(hoursPerDay) || 2,
          currentLevel: currentLevel || 'beginner'
        });

        await fetchMyGoals();
        await refreshUser();
        return res.data?.data;
      } catch (err) {
        console.warn('Backend selectGoal error:', err.message);
      }
    }

    if (targetGoal) {
      setActiveGoal(targetGoal);
    }
    return targetGoal;
  };

  // Switch Active Goal
  const switchActiveGoal = async (userGoalId) => {
    try {
      const res = await api.post('/goals/switch', { userGoalId });
      const switched = res.data?.data;
      setActiveUserGoal(switched);
      if (switched?.goalId) {
        setActiveGoal(switched.goalId);
        const canonical = resolveCanonicalGoalSlug(switched.goalId.slug);
        setSelectedGoalSlug(canonical);
      }
      await fetchMyGoals();
      await refreshUser();
      return switched;
    } catch (err) {
      console.error('Error switching goal:', err);
    }
  };

  // Direct goal switch
  const setPreviewGoal = (goal) => {
    if (!goal) return;
    setActiveGoal(goal);
    const canonical = resolveCanonicalGoalSlug(goal.slug);
    setSelectedGoalSlug(canonical);
  };

  return (
    <GoalContext.Provider
      value={{
        selectedGoalSlug,
        setSelectedGoalSlug,
        allGoals,
        myGoals,
        activeGoal,
        activeUserGoal,
        userGoalProfile,
        loading,
        selectGoal,
        switchActiveGoal,
        setPreviewGoal,
        refreshGoals: fetchAllGoals,
        refreshMyGoals: fetchMyGoals,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoal must be used within a GoalProvider');
  }
  return context;
};
