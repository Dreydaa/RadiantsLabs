import { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Image as ImageIcon } from 'lucide-react';

const AGENTS = [
  { id: 'astra', name: 'Astra', image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg' },
  { id: 'breach', name: 'Breach', image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg' },
  { id: 'brimstone', name: 'Brimstone', image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg' },
  { id: 'chamber', name: 'Chamber', image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg' },
  { id: 'cypher', name: 'Cypher', image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg' },
];

const MAPS = [
  { id: 'abyss', name: 'ABYSS', image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg' },
  { id: 'ascent', name: 'ASCENT', image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg' },
  { id: 'bind', name: 'BIND', image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg' },
  { id: 'haven', name: 'HAVEN', image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg' },
];

function DraftSimulatorPage() {
  const [team1Name, setTeam1Name] = useState('Team Name');
  const [team2Name, setTeam2Name] = useState('Team Name');
  const [selectedMap, setSelectedMap] = useState(MAPS[0]);
  const [team1Picks, setTeam1Picks] = useState<string[]>([]);
  const [team2Picks, setTeam2Picks] = useState<string[]>([]);
  const [currentTeam, setCurrentTeam] = useState<1 | 2>(1);
  const [team1Logo, setTeam1Logo] = useState<string | null>(null);
  const [team2Logo, setTeam2Logo] = useState<string | null>(null);

  const handleMapChange = (direction: 'prev' | 'next') => {
    const currentIndex = MAPS.findIndex(map => map.id === selectedMap.id);
    if (direction === 'prev') {
      setSelectedMap(MAPS[currentIndex === 0 ? MAPS.length - 1 : currentIndex - 1]);
    } else {
      setSelectedMap(MAPS[currentIndex === MAPS.length - 1 ? 0 : currentIndex + 1]);
    }
  };

  const handleAgentPick = (agentId: string) => {
    if (currentTeam === 1 && team1Picks.length < 5) {
      setTeam1Picks([...team1Picks, agentId]);
      setCurrentTeam(2);
    } else if (currentTeam === 2 && team2Picks.length < 5) {
      setTeam2Picks([...team2Picks, agentId]);
      setCurrentTeam(1);
    }
  };

  const handleLogoUpload = (team: 1 | 2, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (team === 1) {
          setTeam1Logo(reader.result as string);
        } else {
          setTeam2Logo(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-olive-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Team Names and Logos */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-64">
            <div className="bg-cream-50 rounded-lg p-4 flex items-center">
              {team1Logo ? (
                <img src={team1Logo} alt="Team 1" className="w-10 h-10 mr-3" />
              ) : (
                <label className="w-10 h-10 bg-cream-200 rounded flex items-center justify-center cursor-pointer mr-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogoUpload(1, e)}
                  />
                  <ImageIcon size={20} className="text-olive-600" />
                </label>
              )}
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="bg-transparent text-olive-900 text-lg font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => handleMapChange('prev')} className="text-cream-50">
              <ArrowLeft size={24} />
            </button>
            <div className="text-cream-50 text-4xl font-bold">{selectedMap.name}</div>
            <button onClick={() => handleMapChange('next')} className="text-cream-50">
              <ArrowRight size={24} />
            </button>
          </div>

          <div className="w-64">
            <div className="bg-cream-50 rounded-lg p-4 flex items-center justify-end">
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="bg-transparent text-olive-900 text-lg font-medium text-right focus:outline-none"
              />
              {team2Logo ? (
                <img src={team2Logo} alt="Team 2" className="w-10 h-10 ml-3" />
              ) : (
                <label className="w-10 h-10 bg-cream-200 rounded flex items-center justify-center cursor-pointer ml-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogoUpload(2, e)}
                  />
                  <ImageIcon size={20} className="text-olive-600" />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Agent Picks */}
        <div className="grid grid-cols-12 gap-4">
          {/* Team 1 Picks */}
          <div className="col-span-2 space-y-2">
            {Array(5).fill(null).map((_, index) => (
              <div
                key={`team1-${index}`}
                className={`aspect-[4/3] bg-cream-50 rounded-lg overflow-hidden relative ${
                  currentTeam === 1 && index === team1Picks.length ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                {team1Picks[index] ? (
                  <img
                    src={AGENTS.find(a => a.id === team1Picks[index])?.image}
                    alt="Agent"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Plus size={24} className="text-olive-600" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Map Preview */}
          <div className="col-span-8">
            <div className="aspect-video bg-cream-900 rounded-lg overflow-hidden">
              <img
                src={selectedMap.image}
                alt={selectedMap.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Team 2 Picks */}
          <div className="col-span-2 space-y-2">
            {Array(5).fill(null).map((_, index) => (
              <div
                key={`team2-${index}`}
                className={`aspect-[4/3] bg-cream-50 rounded-lg overflow-hidden relative ${
                  currentTeam === 2 && index === team2Picks.length ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                {team2Picks[index] ? (
                  <img
                    src={AGENTS.find(a => a.id === team2Picks[index])?.image}
                    alt="Agent"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Plus size={24} className="text-olive-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Agent Selection */}
        <div className="mt-8 grid grid-cols-10 gap-4">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleAgentPick(agent.id)}
              disabled={team1Picks.includes(agent.id) || team2Picks.includes(agent.id)}
              className={`aspect-square bg-cream-50 rounded-lg overflow-hidden relative ${
                team1Picks.includes(agent.id) || team2Picks.includes(agent.id)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:ring-2 hover:ring-blue-400'
              }`}
            >
              <img
                src={agent.image}
                alt={agent.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DraftSimulatorPage;