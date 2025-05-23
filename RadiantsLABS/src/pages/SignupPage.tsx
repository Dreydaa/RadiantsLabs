import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from '../types';

interface SignupPageProps {
  onSignup: (user: User) => void;
}

function SignupPage({ onSignup }: SignupPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all fields');
      return;
    }
    
    // Create new user with player profile type
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      firstName,
      lastName,
      profileType: 'player'
    };
    
    // Sign up the user and redirect to player registration
    onSignup(newUser);
    navigate('/player-registration');
  };

  return (
    <motion.div 
      className="max-w-md w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center lg:text-left">
        <h1 className="font-serif text-4xl text-cream-50 mb-3">Create an Account</h1>
        <p className="text-cream-100 mb-8">
          Create an account in order to get access to the Radiant labs and their features.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label htmlFor="email" className="form-label">EMAIL</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">FIRST NAME</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName" className="form-label">LAST NAME</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">PASSWORD</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="mt-6">
          <button type="submit" className="btn btn-primary w-full">
            CREATE ACCOUNT
          </button>
        </div>
        
        <div className="mt-8 pt-4 border-t border-cream-200 text-center">
          <p className="text-olive-700">ALREADY HAVE AN ACCOUNT?</p>
          <Link to="/login" className="text-olive-900 font-medium hover:underline">
            LOG IN
          </Link>
        </div>
      </form>
    </motion.div>
  );
}

export default SignupPage;