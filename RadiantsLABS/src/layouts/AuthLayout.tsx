import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-olive-900 flex">
      <motion.div 
        className="w-full md:w-1/2 p-8 flex flex-col justify-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size="large" className="mb-10 self-center md:self-start" />
        <Outlet />
      </motion.div>
      
      <motion.div 
        className="hidden md:block md:w-1/2 bg-olive-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="h-full flex items-center justify-center p-12">
          <div className="text-cream-50 max-w-md">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Join the Elite Gamers Community</h2>
            <p className="text-lg opacity-80 mb-8">
              Connect with top teams, showcase your skills, and take your gaming career to the next level with Radiants Labs.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthLayout;