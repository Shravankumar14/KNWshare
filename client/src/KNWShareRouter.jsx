import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoalProvider } from './context/GoalContext';
import { NotificationProvider } from './context/NotificationContext';
import { MainLayout } from './layouts/MainLayout';

// KNWshare Pages
import { GoalSelectionPage } from './pages/GoalSelectionPage';
import { RoadmapCareerPage } from './pages/RoadmapCareerPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { TimetablePage } from './pages/TimetablePage';
import { TasksPage } from './pages/TasksPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * KNWShareRouter — mounts all KNWshare routes under /knwshare/*
 * Wrapped in its own providers, completely isolated from InfoNest's AppContext.
 */
export default function KNWShareRouter() {
  return (
    <AuthProvider>
      <GoalProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* /knwshare → Goals (home) */}
              <Route index element={<GoalSelectionPage />} />
              <Route path="roadmap" element={<RoadmapCareerPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="timetable" element={<TimetablePage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </GoalProvider>
    </AuthProvider>
  );
}
