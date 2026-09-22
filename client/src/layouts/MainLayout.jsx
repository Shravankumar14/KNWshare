import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-knw-bg text-knw-offWhite">
    <Navbar />
    <main className="flex-1 w-full">
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </main>
    <Footer />
  </div>
);
