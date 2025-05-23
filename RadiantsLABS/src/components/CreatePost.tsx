import { useState, ChangeEvent, FormEvent } from 'react';
import { Image, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '../types';
import '../styles/Posts.css';

interface CreatePostProps {
  user: User;
  onPost: (content: string, image?: string) => void;
}

function CreatePost({ user, onPost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onPost(content, imageUrl);
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
    }
  };
  
  const handleImageUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  return (
    <motion.div 
      className="bg-cream-50 rounded-md shadow-sm mb-0.5 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="create p-4">
        <div className="flex">
          <div className="w-10 h-10 rounded-full bg-olive-200 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt="User" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-olive-800 font-medium">
                {(user.firstName || user.teamName || user.email).charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="ml-3 flex-grow">
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full p-3 text-olive-900 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-olive-400"
                placeholder="Write something..."
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              
              {showImageInput && (
                <motion.div 
                  className="mt-2 flex items-center"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    className="flex-grow p-2 text-olive-900 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={imageUrl}
                    onChange={handleImageUrl}
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowImageInput(false);
                      setImageUrl('');
                    }}
                    className="ml-2 text-olive-500 hover:text-olive-700"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              )}
              
              <div className="mt-3 flex justify-between items-center">
                <div>
                  {!showImageInput && (
                    <button 
                      type="button" 
                      onClick={() => setShowImageInput(true)}
                      className="p-2 text-olive-500 hover:text-olive-700 rounded-full hover:bg-cream-100 transition"
                    >
                      <Image size={18} />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className= {`btn btn-primary px-6 ${!content.trim() ? 'cursor-allowed' : ''}`}
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CreatePost;