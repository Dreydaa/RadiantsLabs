import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import TeamProfilePage from './pages/TeamProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import PlayerRegistrationPage from './pages/PlayerRegistrationPage';
import DraftSimulatorPage from './pages/DraftSimulatorPage';
import PracticeOrganizerPage from './pages/PracticeOrganizerPage';
import BlueprintPage from './pages/BlueprintPage';
import ProfilePage from './pages/ProfilePage';

// Types
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('radiantsUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('radiantsUser');
      }
    }
    setLoading(false);
  }, []);
  
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('radiantsUser', JSON.stringify(userData));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('radiantsUser');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout user={user} onLogout={logout} />}>
        <Route index element={<HomePage />} />
        <Route 
          path="feed" 
          element={user ? <FeedPage user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="team-profile" 
          element={user ? <TeamProfilePage user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="user-profile" 
          element={user ? <UserProfilePage user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="profile/:userId" 
          element={<ProfilePage id={''} name={''} fullName={''} age={0} role={''} region={''} experience={''} rank={''} avatar={''} isVerified={false} followers={0} following={0} achievements={[]} agents={[]} team={null} />} 
        />
        <Route 
          path="draft-simulator" 
          element={user ? <DraftSimulatorPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="practice-organizer" 
          element={user ? <PracticeOrganizerPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="blueprint" 
          element={user ? <BlueprintPage /> : <Navigate to="/login" replace />} 
        />
      </Route>
      
      <Route path="/" element={<AuthLayout />}>
        <Route 
          path="login" 
          element={user ? <Navigate to="/feed" replace /> : <LoginPage onLogin={login} />} 
        />
        <Route 
          path="signup" 
          element={user ? <Navigate to="/feed" replace /> : <SignupPage onSignup={login} />} 
        />
        <Route 
          path="player-registration" 
          element={
            user ? 
              <PlayerRegistrationPage user={user} /> : 
              <Navigate to="/login" replace />
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;