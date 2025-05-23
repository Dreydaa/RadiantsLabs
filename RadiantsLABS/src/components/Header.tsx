import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, FileSpreadsheet, Calendar, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { User as UserType } from '../types';
import '../styles/Header.css';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
}

function Header({ user, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
    navigate('/login');
  };

  const navigateToProfile = () => {
    if (user) {
      navigate(`/profile/${user.id}`);
    }
  };

  return (
    <header className="header shadow-md">
      <div className="headerText flex items-center justify-between">
        <Logo />
        
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <Link to="/feed" className="text-cream-50 opacity-80 hover:opacity-100 transition">
                Feed
              </Link>
              <Link to="/draft-simulator" className="text-cream-50 opacity-80 hover:opacity-100 transition flex items-center">
                <FileSpreadsheet size={18} className="mr-2" />
                Draft Simulator
              </Link>
              <Link to="/practice-organizer" className="text-cream-50 opacity-80 hover:opacity-100 transition flex items-center">
                <Calendar size={18} className="mr-2" />
                Practice Organizer
              </Link>
              <Link to="/blueprint" className="text-cream-50 opacity-80 hover:opacity-100 transition flex items-center">
                <Map size={18} className="mr-2" />
                Blueprint
              </Link>
              {user.profileType === 'team' && (
                <Link to="/team-profile" className="text-cream-50 opacity-80 hover:opacity-100 transition">
                  Team Profile
                </Link>
              )}
              <div className="flex items-center cursor-pointer" onClick={navigateToProfile}>
                <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} className="text-olive-900" />
                  )}
                </div>
                <div className="ml-2 text-cream-50">
                  {user.firstName || user.teamName || user.email}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="ml-4 text-cream-100 text-sm hover:underline"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-cream-50 opacity-80 hover:opacity-100 transition">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
        
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? (
            <X className="text-cream-50" />
          ) : (
            <Menu className="text-cream-50" />
          )}
        </button>
      </div>
      
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-olive-800 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {user ? (
                <>
                  <div 
                    className="flex items-center py-2 border-b border-olive-700 cursor-pointer"
                    onClick={navigateToProfile}
                  >
                    <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} className="text-olive-900" />
                      )}
                    </div>
                    <div className="ml-2 text-cream-50">
                      {user.firstName || user.teamName || user.email}
                    </div>
                  </div>
                  <Link to="/feed" className="text-cream-50 py-2" onClick={toggleMenu}>
                    Feed
                  </Link>
                  <Link to="/draft-simulator" className="text-cream-50 py-2 flex items-center" onClick={toggleMenu}>
                    <FileSpreadsheet size={18} className="mr-2" />
                    Draft Simulator
                  </Link>
                  <Link to="/practice-organizer" className="text-cream-50 py-2 flex items-center" onClick={toggleMenu}>
                    <Calendar size={18} className="mr-2" />
                    Practice Organizer
                  </Link>
                  <Link to="/blueprint" className="text-cream-50 py-2 flex items-center" onClick={toggleMenu}>
                    <Map size={18} className="mr-2" />
                    Blueprint
                  </Link>
                  {user.profileType === 'team' && (
                    <Link to="/team-profile" className="text-cream-50 py-2" onClick={toggleMenu}>
                      Team Profile
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="text-cream-100 py-2 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-cream-50 py-2" onClick={toggleMenu}>
                    Login
                  </Link>
                  <Link to="/signup" className="text-cream-50 py-2" onClick={toggleMenu}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;