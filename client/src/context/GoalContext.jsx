import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import {
  DEFAULT_GOAL_SLUG,
  GOAL_REGISTRY,
  PREDEFINED_GOALS,
  getGoalDataByIdOrSlug,
} from '../data/goalRegistry';

const GoalContext = createContext(null);

export const GoalProvider = ({ children }) => {
  const { user, isAuthenticated, refreshUser } = useAuth();

  const getInitialActiveGoal = () => {
    const savedSlug = localStorage.getItem('knwshare_active_goal_slug') || DEFAULT_GOAL_SLUG;
    const goalData = getGoalDataByIdOrSlug(savedSlug);
    return goalData?.goal || PREDEFINED_GOALS[0];
  };

  const [allGoals, setAllGoals] = useState(PREDEFINED_GOALS);
  const [myGoals, setMyGoals] = useState([]);
  const [activeUserGoal, setActiveUserGoal] = useState(null);
  const [activeGoal, setActiveGoal] = useState(getInitialActiveGoal);
  const [loading, setLoading] = useState(true);

  // Fetch all predefined & community goals
  const fetchAllGoals = async () => {
    try {
      const res = await api.get('/goals');
      const apiGoals = res.data?.data || [];

      // Combine API goals with PREDEFINED_GOALS so JEE and Full Stack are always present
      const map = new Map();
      PREDEFINED_GOALS.forEach(g => map.set(g.slug, g));
      apiGoals.forEach(g => {
        const existing = map.get(g.slug);
        if (existing) {
          map.set(g.slug, { ...existing, ...g });
        } else {
          map.set(g.slug || g._id, g);
        }
      });

      const combined = Array.from(map.values());
      // Ensure JEE Mains & Advanced is prioritized at the top
      combined.sort((a, b) => {
        if (a.slug === DEFAULT_GOAL_SLUG) return -1;
        if (b.slug === DEFAULT_GOAL_SLUG) return 1;
        return 0;
      });

      setAllGoals(combined);
      return combined;
    } catch (err) {
      console.error('Error fetching all goals:', err);
      return PREDEFINED_GOALS;
    }
  };

  // Fetch user's enrolled goals
  const fetchMyGoals = async () => {
    if (!isAuthenticated) {
      setMyGoals([]);
      return;
    }
    try {
      const res = await api.get('/goals/my-goals');
      const enrolled = res.data?.data || [];
      setMyGoals(enrolled);

      if (enrolled.length > 0) {
        const savedSlug = localStorage.getItem('knwshare_active_goal_slug');
        // Prioritize matching saved selected slug
        const matchingSavedGoal = savedSlug
          ? enrolled.find(g => (g.goalId?.slug === savedSlug || g.goalId?._id === savedSlug || g.slug === savedSlug))
          : null;

        const active = matchingSavedGoal || enrolled.find(g => g.status === 'active') || enrolled[0];
        setActiveUserGoal(active);

        if (active?.goalId) {
          setActiveGoal(active.goalId);
          if (active.goalId.slug) {
            localStorage.setItem('knwshare_active_goal_slug', active.goalId.slug);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching my goals:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const goals = await fetchAllGoals();
      if (isAuthenticated) {
        await fetchMyGoals();
      } else {
        // For guests / visitors: check localStorage first, or default to JEE Mains & Advanced
        const savedSlug = localStorage.getItem('knwshare_active_goal_slug') || DEFAULT_GOAL_SLUG;
        const matched = goals.find(g => g.slug === savedSlug) || PREDEFINED_GOALS[0];
        setActiveGoal(matched);
      }
      setLoading(false);
    };
    init();
  }, [isAuthenticated]);

  // Select/Enroll in a Goal
  const selectGoal = async ({ goalId, targetDate, hoursPerDay, currentLevel, currentKnowledge }) => {
    const targetGoal = allGoals.find(g => g._id === goalId || g.slug === goalId);
    if (targetGoal?.slug) {
      localStorage.setItem('knwshare_active_goal_slug', targetGoal.slug);
    }

    try {
      const res = await api.post('/goals/select', {
        goalId,
        targetDate,
        hoursPerDay,
        currentLevel,
        currentKnowledge,
      });
      const updatedUserGoal = res.data?.data;
      setActiveUserGoal(updatedUserGoal);
      if (updatedUserGoal?.goalId) {
        setActiveGoal(updatedUserGoal.goalId);
        if (updatedUserGoal.goalId.slug) {
          localStorage.setItem('knwshare_active_goal_slug', updatedUserGoal.goalId.slug);
        }
      } else if (targetGoal) {
        setActiveGoal(targetGoal);
      }
      await fetchMyGoals();
      await refreshUser();
      return updatedUserGoal;
    } catch (apiErr) {
      console.warn('API selectGoal failed, maintaining active goal locally:', apiErr);
      if (targetGoal) {
        setActiveGoal(targetGoal);
      }
      throw apiErr;
    }
  };

  // Create a Custom Goal with AI decomposition
  const createCustomGoal = async ({ title, currentLevel, targetMonths, hoursPerDay }) => {
    const res = await api.post('/goals/custom', {
      title,
      currentLevel,
      targetMonths,
      hoursPerDay,
    });
    const createdUserGoal = res.data.data;
    setActiveUserGoal(createdUserGoal);
    setActiveGoal(createdUserGoal.goalId);
    if (createdUserGoal?.goalId?.slug) {
      localStorage.setItem('knwshare_active_goal_slug', createdUserGoal.goalId.slug);
    }
    await fetchAllGoals();
    await fetchMyGoals();
    await refreshUser();
    return createdUserGoal;
  };

  // Switch Active Goal
  const switchActiveGoal = async (userGoalId) => {
    const res = await api.post('/goals/switch', { userGoalId });
    const switched = res.data.data;
    setActiveUserGoal(switched);
    if (switched?.goalId) {
      setActiveGoal(switched.goalId);
      if (switched.goalId.slug) {
        localStorage.setItem('knwshare_active_goal_slug', switched.goalId.slug);
      }
    }
    await fetchMyGoals();
    await refreshUser();
    return switched;
  };

  // Direct goal preview switch (for browsing before enrolling)
  const setPreviewGoal = (goal) => {
    if (!goal) return;
    setActiveGoal(goal);
    if (goal.slug) {
      localStorage.setItem('knwshare_active_goal_slug', goal.slug);
    }
  };

  return (
    <GoalContext.Provider
      value={{
        allGoals,
        myGoals,
        activeGoal,
        activeUserGoal,
        loading,
        selectGoal,
        createCustomGoal,
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
