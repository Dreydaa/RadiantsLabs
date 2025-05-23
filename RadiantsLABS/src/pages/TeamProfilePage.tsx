import { motion } from 'framer-motion';
import { Users, Trophy, Globe2, Plus, Mail } from 'lucide-react';
import { User } from '../types';

interface TeamProfilePageProps {
  user: User;
}

function TeamProfilePage({ user }: TeamProfilePageProps) {
  
  return (
    <div className="mx-auto px-4 py-8">
      <motion.div 
        className="bg-cream-50 rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="containerUp p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.teamName} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Users size={32} className="text-olive-700" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-serif text-olive-900 mb-2">
                {user.teamName || 'Seven'}
              </h1>
              
              <div className="text-olive-600 mb-4">
                26 mars 2024
              </div>
              
              <div className="flex items-center gap-6 text-olive-700">
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Professional Teams</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={18} />
                  <span>Achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe2 size={18} />
                  <span>London, United Kingdom</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="btn btn-secondary">
                <Plus size={18} className="mr-2" />
                Add socials media
              </button>
              <button className="btn btn-primary">
                <Mail size={18} className="mr-2" />
                Contact us
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 lg:col-span-8">
          <motion.div 
            className="containerUp bg-cream-50 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-serif text-olive-900 mb-4">Team</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-olive-800 mb-3">Players (Team 1)</h3>
                <button className="w-full py-4 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
                  Add players
                </button>
              </div>
              
              <div>
                <h3 className="font-medium text-olive-800 mb-3">Additional Components</h3>
                <button className="w-full py-4 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
                  Add another components
                </button>
              </div>
              
              <div>
                <h3 className="font-medium text-olive-800 mb-3">Goals</h3>
                <button className="w-full py-4 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
                  Add your goal(s)
                </button>
              </div>
              
              <div>
                <h3 className="font-medium text-olive-800 mb-3">Preferred Regions</h3>
                <button className="w-full py-4 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
                  Add one or more regions
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-olive-800 mb-3">Commitment Level</h3>
              <button className="w-full py-4 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
                Add a status
              </button>
            </div>
          </motion.div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <motion.div 
            className="containerUp bg-cream-50 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-serif text-olive-900 mb-4">Achievements</h2>
            <button className="w-full py-8 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
              <Trophy size={24} className="mx-auto mb-2" />
              Add achievements
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default TeamProfilePage;