import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Activity, Trophy } from 'lucide-react';
import '../styles/components.css';

function HomePage() {
  return (
    <div className="bg-olive-900">
      <section className="relative min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-olive-900 to-olive-800 z-0"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="font-serif text-4xl md:text-6xl text-cream-50 mb-6">
                The Future of <span className="italic">Esports</span> Team Management
              </h1>
              <p className="text-lg text-cream-100 mb-8">
                Connect with top teams, showcase your skills, and take your gaming career to the next level with Radiants Labs.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup" className="btn btn-primary py-3 px-8 text-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary py-3 px-8 text-lg">
                  Sign In
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative">
                <div className="w-full h-96 bg-olive-700 rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="https://live.staticflickr.com/65535/54145546192_d9a34c8270_c.jpg" 
                    alt="Esports Team" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-olive absolute -bottom-6 -left-6 w-48 h-48 bg-cream-50 rounded-lg shadow-lg p-4 flex flex-col justify-center items-center transform rotate-3">
                  <Trophy className="text-olive-900 mb-2" size={32} />
                  <p className="font-medium text-center" >Join Elite Gaming Teams</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-olive-900 mb-4">Why Choose Radiants Labs?</h2>
            <p className="text-olive-700 max-w-2xl mx-auto">
              We provide the tools and platform that esports teams and players need to connect, compete, and succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-14 h-14 rounded-full bg-blue-400 flex items-center justify-center mb-4">
                <Users className="text-olive-900" size={24} />
              </div>
              <h3 className="font-serif text-xl text-olive-900 mb-3">Team Building</h3>
              <p className="text-olive-700">
                Find the perfect teammates based on skill level, play style, and competitive goals.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-14 h-14 rounded-full bg-blue-400 flex items-center justify-center mb-4">
                <Activity className="text-olive-900" size={24} />
              </div>
              <h3 className="font-serif text-xl text-olive-900 mb-3">Performance Tracking</h3>
              <p className="text-olive-700">
                Track your team's progress, analyze match data, and identify areas for improvement.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-14 h-14 rounded-full bg-blue-400 flex items-center justify-center mb-4">
                <Sparkles className="text-olive-900" size={24} />
              </div>
              <h3 className="font-serif text-xl text-olive-900 mb-3">Opportunity Discovery</h3>
              <p className="text-olive-700">
                Connect with sponsors, tournaments, and other opportunities to grow your esports career.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-olive-800">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-cream-50 mb-6">Ready to Elevate Your Gaming Experience?</h2>
              <p className="text-cream-100 mb-8">
                Whether you're a team looking for talented players or a player searching for the right team, Radiants Labs has you covered.
              </p>
              <Link to="/signup" className="btn btn-primary py-3 px-8 text-lg inline-block">
                Join Radiants Labs
              </Link>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="https://live.staticflickr.com/65535/53000113988_b951702c99_c.jpg" 
                alt="Esports Competition" 
                className="w-full max-w-md rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;