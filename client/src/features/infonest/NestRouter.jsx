import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Pages
import { FeedPage } from './pages/FeedPage';
import { ExplorePage } from './pages/ExplorePage';
import { SearchPage } from './pages/SearchPage';
import { CreatorsPage } from './pages/CreatorsPage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LecturePlayerPage } from './pages/LecturePlayerPage';
import { RoadmapsPage } from './pages/RoadmapsPage';
import { RoadmapDetailPage } from './pages/RoadmapDetailPage';
import { GoalsPage } from './pages/GoalsPage';
import { SavedVaultPage } from './pages/SavedVaultPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { MissionsPage } from './pages/MissionsPage';
import { OrbitRoomsPage } from './pages/OrbitRoomsPage';
import { ChallengesPage } from './pages/ChallengesPage';

// Creator Pages
import { CreatorDashboardPage } from './pages/creator/CreatorDashboardPage';
import { CreatorContentPage } from './pages/creator/CreatorContentPage';
import { CreatorStudioPage } from './pages/creator/CreatorStudioPage';
import { CreatePostPage } from './pages/creator/CreatePostPage';
import { CreateCoursePage } from './pages/creator/CreateCoursePage';
import { CreateRoadmapPage } from './pages/creator/CreateRoadmapPage';

/**
 * NestRouter — InfoNest is the PRIMARY shell, mounted at /.
 * KNWshare lives at /knwshare/* and is accessible via the sidebar link.
 */
export default function NestRouter() {
  return (
    <div className="nest-app">
      <AppProvider>
        <Routes>
          {/* Default redirect → Feed */}
          <Route index element={<Navigate to="/feed" replace />} />
          <Route path="home" element={<Navigate to="/feed" replace />} />

          {/* Core InfoNest Routes */}
          <Route path="feed" element={<FeedPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="creators" element={<CreatorsPage />} />
          <Route path="creator/:username" element={<CreatorProfilePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="course/:courseId" element={<CourseDetailPage />} />
          <Route path="course/:courseId/learn" element={<Navigate to="/lecture/lec_1" replace />} />
          <Route path="lecture/:lectureId" element={<LecturePlayerPage />} />
          <Route path="roadmaps" element={<RoadmapsPage />} />
          <Route path="roadmap/:roadmapId" element={<RoadmapDetailPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="missions" element={<MissionsPage />} />
          <Route path="orbit-rooms" element={<OrbitRoomsPage />} />
          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="saved" element={<SavedVaultPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="post/:postId" element={<PostDetailPage />} />

          {/* Creator Workspace */}
          <Route path="creator/dashboard" element={<CreatorDashboardPage />} />
          <Route path="creator/content" element={<CreatorContentPage />} />
          <Route path="creator/studio" element={<CreatorStudioPage />} />
          <Route path="create/post" element={<CreatePostPage />} />
          <Route path="create/course" element={<CreateCoursePage />} />
          <Route path="create/roadmap" element={<CreateRoadmapPage />} />

          {/* Catch-all → Feed */}
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </AppProvider>
    </div>
  );
}
