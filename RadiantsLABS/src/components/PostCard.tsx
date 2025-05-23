import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Check} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Post, User, Comment } from '../types';
import CommentSection from './CommentSection';
import MessageModal from './MessageModal';
import '../styles/Posts.css';

interface PostCardProps {
  post: Post;
  currentUser: User;
}

function PostCard({ post, currentUser }: PostCardProps) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  
  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.firstName || currentUser.teamName || currentUser.email,
      userAvatar: currentUser.avatar,
      content,
      likes: 0,
      timeAgo: 'just now'
    };
    setComments([...comments, newComment]);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${post.userId}`);
  };

  return (
    <motion.div 
      className="bg-cream-50 rounded-md shadow-sm mb-0.5 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="create p-4">
        <div className="flex justify-between">
          <div 
            className="flex items-center group cursor-pointer"
            onClick={handleProfileClick}
          >
            <div className="w-10 h-10 rounded-full bg-olive-200 flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-blue-400">
              {post.userAvatar ? (
                <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-olive-800 font-medium">
                  {post.userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <span className="font-medium text-olive-900 group-hover:text-blue-400">{post.userName}</span>
                {post.isVerified && (
                  <span className="ml-1 bg-blue-400 rounded-full p-0.5">
                    <Check size={12} className="text-white" />
                  </span>
                )}
              </div>
              <div className="text-olive-500 text-sm">{post.timeAgo}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {currentUser.id !== post.userId && (
              <button 
                onClick={() => setShowMessageModal(true)}
                className="buttonMsg hover:text-olive-700 px-3 py-1 rounded-full hover:bg-cream-100"
              >
                Message
              </button>
            )}
            <button className="text-olive-500 hover:text-olive-700">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-olive-900 whitespace-pre-line">{post.content}</p>
        </div>
        
        {post.image && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img src={post.image} alt="Post content" className="w-full" />
          </div>
        )}
        
        <div className="mt-4 flex items-center text-olive-500 border-cream-100 py-2">
          <button 
            className={`flex items-center mr-6 hover:text-olive-700 ${liked ? 'text-red-500 hover:text-red-600' : ''}`}
            onClick={handleLike}
          >
            <Heart size={18} className={liked ? 'fill-current' : ''} />
            <span className="ml-1">{likes}</span>
          </button>
          
          <button 
            className="flex items-center mr-6 hover:text-olive-700"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={18} />
            <span className="ml-1">{comments.length}</span>
          </button>
          
          <button className="flex items-center hover:text-olive-700">
            <Share2 size={18} />
            <span className="ml-1">{post.shares}</span>
          </button>
        </div>

        {showComments && (
          <CommentSection
            postId={post.id}
            comments={comments}
            currentUser={currentUser}
            onAddComment={handleAddComment}
          />
        )}
      </div>

      {showMessageModal && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          recipient={{
            id: post.userId,
            firstName: post.userName,
            email: '',
            profileType: 'player'
          }}
          currentUser={currentUser}
        />
      )}
    </motion.div>
  );
}

export default PostCard;