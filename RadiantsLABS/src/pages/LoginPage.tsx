import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from '../types';
import {api} from "../lib/api";

interface LoginPageProps {
  onLogin: (me: User) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    //appel api pour check les informations du user
    try {
      await api("/api/login", {
        method: "POST",
        credentials: "include",   // indispensable pour envoyer/recevoir le cookie
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const me = await api<User | null>("/api/profile");
      if (!me) {
        throw new Error("Profile not found");
      }
      onLogin(me);
      navigate("/user-profile", {replace: true});
    }
    catch (err) {
      setError(String(err));
    }
  };

  return (
    <motion.div 
      className="max-w-md w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center lg:text-left">
        <h1 className="font-serif text-4xl text-cream-50 mb-3">Welcome Back</h1>
        <p className="text-cream-100 mb-8">
          Sign back in to your account to access Radiants Labs and all their features
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-3xl font-serif text-olive-900 mb-6">YOUR ACCOUNT</h2>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">EMAIL</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
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
          />
        </div>
        
        <div className="mt-8">
          <button type="submit" className="btn btn-primary w-full">
            LOG IN
          </button>
        </div>
        
        <div className="mt-12 pt-4 border-t border-cream-200 text-center">
          <p className="text-olive-700">CREATE AN ACCOUNT?</p>
          <Link to="/signup" className="text-olive-900 font-medium hover:underline">
            SIGN UP
          </Link>
        </div>
      </form>
    </motion.div>
  );
}

export default LoginPage;