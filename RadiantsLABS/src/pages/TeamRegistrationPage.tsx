import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from '../types';

interface TeamRegistrationPageProps {
  user: User;
}

function TeamRegistrationPage({ user }: TeamRegistrationPageProps) {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState(user.teamName || '');
  const [region, setRegion] = useState(user.region || '');
  const [status, setStatus] = useState(user.status || '');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to an API
    
    // Update local storage with new team info
    const updatedUser = {
      ...user,
      teamName,
      region,
      status
    };
    
    localStorage.setItem('radiantsUser', JSON.stringify(updatedUser));
    
    // Navigate back to team profile
    navigate('/team-profile');
  };

  return (
    <motion.div 
      className="max-w-md w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center lg:text-left">
        <h1 className="font-serif text-4xl text-cream-50 mb-3">Team Account</h1>
        <p className="text-cream-100 mb-8">
          Complete your team profile to connect with players and other teams
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-3xl font-serif text-olive-900 mb-8">TEAM ACCOUNT</h2>
        
        <div className="form-group">
          <label htmlFor="teamName" className="form-label">TEAM NAME</label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full"
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
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status" className="form-label">STATUT</label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full"
          />
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

export default TeamRegistrationPage;