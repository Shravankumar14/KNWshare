import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const GoalContext = createContext(null);

export const GoalProvider = ({ children }) => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [allGoals, setAllGoals] = useState([]);
  const [myGoals, setMyGoals] = useState([]);
  const [activeUserGoal, setActiveUserGoal] = useState(null);
  const [activeGoal, setActiveGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all predefined & community goals
  const fetchAllGoals = async () => {
    try {
      const res = await api.get('/goals');
      setAllGoals(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error('Error fetching all goals:', err);
      return [];
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
      setMyGoals(res.data.data);

      if (res.data.data.length > 0) {
        // If user has activeGoal ref, find it; otherwise fallback to first enrolled
        const active = res.data.data.find(g => g.status === 'active') || res.data.data[0];
        setActiveUserGoal(active);
        setActiveGoal(active.goalId);
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
      } else if (goals.length > 0) {
        // For guests / landing page visitors: default preview goal is Full Stack Development
        const defaultGoal = goals.find(g => g.slug === 'full-stack-development') || goals[0];
        setActiveGoal(defaultGoal);
      }
      setLoading(false);
    };
    init();
  }, [isAuthenticated]);

  // Select/Enroll in a Goal
  const selectGoal = async ({ goalId, targetDate, hoursPerDay, currentLevel, currentKnowledge }) => {
    const res = await api.post('/goals/select', {
      goalId,
      targetDate,
      hoursPerDay,
      currentLevel,
      currentKnowledge,
    });
    const updatedUserGoal = res.data.data;
    setActiveUserGoal(updatedUserGoal);
    setActiveGoal(updatedUserGoal.goalId);
    await fetchMyGoals();
    await refreshUser();
    return updatedUserGoal;
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
    setActiveGoal(switched.goalId);
    await fetchMyGoals();
    await refreshUser();
    return switched;
  };

  // Direct goal preview switch (for browsing before enrolling)
  const setPreviewGoal = (goal) => {
    setActiveGoal(goal);
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
