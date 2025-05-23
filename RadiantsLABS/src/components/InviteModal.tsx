import { useState } from 'react';
import { X } from 'lucide-react';
import { User, Team } from '../types';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  sender: User | Team;
  recipient: User;
  type: 'team' | 'player';
}

function InviteModal({ isOpen, onClose, sender, recipient, type }: InviteModalProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would send the invitation
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-cream-50 rounded-lg w-full max-w-lg">
        <div className="p-4 border-b border-cream-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-olive-900">
            {type === 'team' ? 'Send Team Invitation' : 'Send Player Invitation'}
          </h3>
          <button onClick={onClose} className="text-olive-500 hover:text-olive-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-olive-700">
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">MESSAGE (OPTIONAL)</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              className="w-full h-32 resize-none"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="btn btn-secondary mr-3">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteModal;