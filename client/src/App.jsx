import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoalProvider } from './context/GoalContext';
import { NotificationProvider } from './context/NotificationContext';
import { MainLayout } from './layouts/MainLayout';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';

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
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Smart Home route: teachers are redirected to teacher dashboard
const HomeRoute = () => {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated && user?.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" replace />;
  }
  return <GoalSelectionPage />;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GoalProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                {/* PAGE 1: GOAL SELECTION — FRONT PAGE (Teachers redirected to /teacher/dashboard) */}
                <Route index element={<HomeRoute />} />
                
                {/* STUDENT-ONLY PAGES (Teachers redirected to /teacher/dashboard) */}
                <Route
                  path="roadmap"
                  element={
                    <RoleProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                      <RoadmapCareerPage />
                    </RoleProtectedRoute>
                  }
                />

                <Route
                  path="resources"
                  element={
                    <RoleProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                      <ResourcesPage />
                    </RoleProtectedRoute>
                  }
                />

                <Route
                  path="timetable"
                  element={
                    <RoleProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                      <TimetablePage />
                    </RoleProtectedRoute>
                  }
                />

                <Route
                  path="tasks"
                  element={
                    <RoleProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                      <TasksPage />
                    </RoleProtectedRoute>
                  }
                />

                <Route
                  path="progress"
                  element={
                    <RoleProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                      <ProgressPage />
                    </RoleProtectedRoute>
                  }
                />

                {/* Profile & Settings */}
                <Route path="profile" element={<ProfilePage />} />

                {/* TEACHER DASHBOARD (Students redirected to /) */}
                <Route
                  path="teacher/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
                      <TeacherDashboardPage />
                    </RoleProtectedRoute>
                  }
                />

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
