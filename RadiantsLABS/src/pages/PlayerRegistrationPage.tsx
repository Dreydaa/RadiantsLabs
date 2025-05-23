import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from '../types';

interface PlayerRegistrationPageProps {
  user: User;
}

const RANKS = [
  'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum',
  'Diamond', 'Ascendant', 'Immortal', 'Radiant'
];

const ROLES = [
  'Duelist', 'Controller', 'Initiator', 'Sentinel', 'Flex'
];

function PlayerRegistrationPage({ user }: PlayerRegistrationPageProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(user.username || '');
  const [region, setRegion] = useState(user.region || '');
  const [role, setRole] = useState(user.role || '');
  const [status, setStatus] = useState(user.status || '');
  const [rank, setRank] = useState(user.rank || '');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Update local storage with new player info
    const updatedUser = {
      ...user,
      username,
      region,
      role,
      status,
      rank
    };
    
    localStorage.setItem('radiantsUser', JSON.stringify(updatedUser));
    navigate('/user-profile');
  };

  return (
    <motion.div 
      className="max-w-md w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center lg:text-left">
        <h1 className="font-serif text-4xl text-cream-50 mb-3">Player Account</h1>
        <p className="text-cream-100 mb-8">
          Complete your player profile to connect with teams and other players
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-3xl font-serif text-olive-900 mb-8">PLAYER ACCOUNT</h2>
        
        <div className="form-group">
          <label htmlFor="username" className="form-label">USERNAME</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="region" className="form-label">REGION</label>
          <input
            type="text"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role" className="form-label">ROLE</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full"
            required
          >
            <option value="">Select a role</option>
            {ROLES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="status" className="form-label">STATUS</label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="rank" className="form-label">RANK</label>
          <select
            id="rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="w-full"
            required
          >
            <option value="">Select your rank</option>
            {RANKS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        
        <div className="mt-8">
          <button type="submit" className="btn btn-primary w-full">
            GO TO YOUR ACCOUNT
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default PlayerRegistrationPage;