import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Filter, Plus, Send } from 'lucide-react';
import { PracticeSession } from '../types';

const RANKS = [
  'Unranked', 'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum',
  'Diamond', 'Ascendant', 'Immortal', 'Radiant'
];

const MOCK_SESSIONS: PracticeSession[] = [
  {
    id: '1',
    teamName: 'Team Alpha',
    region: 'EU',
    date: '2024-03-15',
    time: '15:00',
    maps: ['Haven', 'Pearl', 'Ascent'],
    rank: 'Immortal',
    description: 'Looking for serious practice, Bo3'
  },
  // Add more mock sessions as needed
];

function PracticeOrganizerPage() {
  const [sessions] = useState(MOCK_SESSIONS);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredSessions = sessions.filter(session => {
    if (selectedDate && session.date !== selectedDate) return false;
    if (selectedRegion && !session.region.includes(selectedRegion)) return false;
    if (selectedRank && session.rank !== selectedRank) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="bg-cream-50 rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif text-olive-900">Practice Sessions</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary flex items-center"
              >
                <Filter size={18} className="mr-2" />
                Filters
              </button>
              <button className="btn btn-primary flex items-center">
                <Plus size={18} className="mr-2" />
                Create Session
              </button>
            </div>
          </div>

          {showFilters && (
            <motion.div 
              className="mb-6 p-4 bg-cream-100 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    placeholder="Enter region..."
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Rank
                  </label>
                  <select
                    value={selectedRank}
                    onChange={(e) => setSelectedRank(e.target.value)}
                    className="w-full"
                  >
                    <option value="">All Ranks</option>
                    {RANKS.map(rank => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <motion.div
                key={session.id}
                className="bg-cream-100 p-4 rounded-lg flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-medium text-olive-900 mr-4">
                      {session.teamName}
                    </h3>
                    <span className="text-sm text-olive-600">
                      {session.region}
                    </span>
                  </div>
                  
                  <div className="text-sm text-olive-700">
                    <p>
                      {format(new Date(session.date), 'MMM dd, yyyy')} at {session.time}
                    </p>
                    <p className="mt-1">
                      Maps: {session.maps.join(', ')}
                    </p>
                    <p className="mt-1">
                      {session.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-olive-200 text-olive-800 rounded-full text-sm">
                    {session.rank}
                  </span>
                  <button className="btn btn-primary">
                    <Send size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PracticeOrganizerPage;