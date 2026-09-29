import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoalProvider } from './context/GoalContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

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

// Smart Home route:
// - Unauthenticated -> LoginPage only
// - Authenticated -> Role-appropriate dashboard immediately
const HomeRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2A2A2A] border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginPage />;
};

export function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <GoalProvider>
              <NotificationProvider>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    {/* HOME & AUTH: Unauthenticated -> Login page only, Authenticated -> Dashboard */}
                    <Route index element={<HomeRoute />} />
                    <Route path="login" element={<HomeRoute />} />
                    <Route path="register" element={<RegisterPage />} />

                    {/* PROTECTED STUDENT ROUTES */}
                    <Route
                      path="dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <GoalSelectionPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="goals"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <GoalSelectionPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="goal-select"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <GoalSelectionPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="student/*"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <GoalSelectionPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="roadmap"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <RoadmapCareerPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="roadmap/:goalSlug"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <RoadmapCareerPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="career/:goalSlug"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <RoadmapCareerPage initialTab="career" />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="resources"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <ResourcesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="resources/:goalSlug"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <ResourcesPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="timetable"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <TimetablePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="timetable/:goalSlug"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <TimetablePage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="tasks"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <TasksPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="progress"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'expert', 'admin']}>
                          <ProgressPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Profile & Settings (Authenticated users of any role) */}
                    <Route
                      path="profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* TEACHER DASHBOARD (guarded for teacher & admin only) */}
                    <Route
                      path="teacher/*"
                      element={
                        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                          <TeacherDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="teacher/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                          <TeacherDashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </NotificationProvider>
            </GoalProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
