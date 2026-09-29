import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ChatbotWidget } from '../components/chat/ChatbotWidget';
import { useAuth } from '../context/AuthContext';

export const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-knw-bg text-knw-offWhite">
      <Navbar />
      <main className="flex-1 w-full">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      {isAuthenticated && <Footer />}
      {isAuthenticated && <ChatbotWidget />}
    </div>
  );
};

export default MainLayout;
