import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoalProvider } from './context/GoalContext';
import { NotificationProvider } from './context/NotificationContext';
import { MainLayout } from './layouts/MainLayout';

// Pages
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

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GoalProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                {/* PAGE 1: GOAL SELECTION — FRONT PAGE */}
                <Route index element={<GoalSelectionPage />} />
                
                {/* PAGE 2: ROADMAP + CAREER GUIDANCE */}
                <Route path="roadmap" element={<RoadmapCareerPage />} />

                {/* PAGE 3: RESOURCES */}
                <Route path="resources" element={<ResourcesPage />} />

                {/* PAGE 4: TIMETABLE & GENERATOR SUB-PAGE */}
                <Route path="timetable" element={<TimetablePage />} />

                {/* PAGE 5: TASKS & RESCHEDULER */}
                <Route path="tasks" element={<TasksPage />} />

                {/* PAGE 6: PROGRESS TRACKING */}
                <Route path="progress" element={<ProgressPage />} />

                {/* Profile & Settings */}
                <Route path="profile" element={<ProfilePage />} />

                {/* Auth */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </GoalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
