import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User } from '../types';
import '../index.css';

interface MainLayoutProps {
  user: User | null;
  onLogout: () => void;
}

function MainLayout({ user, onLogout }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={onLogout} />
      <main className="settingUp flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;