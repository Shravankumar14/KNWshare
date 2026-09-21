import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-knw-bg text-knw-offWhite">
    <Navbar />
    <main className="flex-1 w-full">
      <Outlet />
    </main>
    <Footer />
  </div>
);
