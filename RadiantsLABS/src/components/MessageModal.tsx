import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Message, User } from '../types';
import '../styles/components.css';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: User;
  currentUser: User;
}

function MessageModal({ isOpen, onClose, recipient, currentUser }: MessageModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: recipient.id,
      content: message,
      createdAt: new Date().toISOString(),
      read: false
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="container w-full max-w-lg">
        <div className="border p-4 border-cream-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-olive-900">
            Message {recipient.firstName || recipient.teamName}
          </h3>
          <button onClick={onClose} className="text-olive-500 hover:text-olive-700">
            <X size={20} />
          </button>
        </div>

        <div className="h-96 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.senderId === currentUser.id
                    ? 'bg-blue-400 text-olive-900'
                    : 'bg-cream-100 text-olive-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="borderup p-4 border-t border-cream-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="btn btn-primary"
              disabled={!message.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;