import { useState } from 'react';
import { X } from 'lucide-react';
import { Team, User } from '../types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCreateTeam: (team: Team) => void;
}

function CreateTeamModal({ isOpen, onClose, currentUser, onCreateTeam }: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState('');
  const [region, setRegion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamName,
      region,
      members: [currentUser],
      owner: currentUser,
      createdAt: new Date().toISOString()
    };

    onCreateTeam(newTeam);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-cream-50 rounded-lg w-full max-w-lg">
        <div className="p-4 border-b border-cream-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-olive-900">Create New Team</h3>
          <button onClick={onClose} className="text-olive-500 hover:text-olive-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="form-group">
            <label htmlFor="teamName" className="form-label">TEAM NAME</label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
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
              required
              className="w-full"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="btn btn-secondary mr-3">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTeamModal;