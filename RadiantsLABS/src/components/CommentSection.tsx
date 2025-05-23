import { useState } from "react";
import { User, Heart, MessageCircle, Share2 } from "lucide-react";
import { Comment, User as UserType } from "../types";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUser: UserType;
  onAddComment: (content: string) => void;
}

function CommentSection({
  comments,
  currentUser,
  onAddComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };
  const [liked] = useState(false);
  
  

  
  return (
    <div className="mt-4  border-cream-100 pt-4">
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-olive-200 flex items-center justify-center flex-shrink-0">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.firstName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User size={16} className="text-olive-700" />
          )}
        </div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-cream-100 text-olive-900 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-olive-200 flex items-center justify-center flex-shrink-0">
              {comment.userAvatar ? (
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User size={16} className="text-olive-700" />
              )}
            </div>
            <div className="flex-1">
              <div className="bg-cream-100 rounded-lg px-4 py-2">
                <div className="font-medium text-olive-900">
                  {comment.userName}
                </div>
                <p className="text-olive-800">{comment.content}</p>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-olive-600">

                <div className="mt-4 flex items-center text-olive-500 border-cream-100 py-2">
                  <button
                    className={`flex items-center mr-6 hover:text-olive-700 ${
                      liked ? "text-red-500 hover:text-red-600" : ""
                    }`}
                  >
                    <Heart size={18} className={liked ? "fill-current" : ""} />
                    <span className="ml-1">{liked}</span>
                  </button>

                  <button
                    className="flex items-center mr-6 hover:text-olive-700"
                  >
                    <MessageCircle size={18} />
                    <span className="ml-1">{comments.length}</span>
                  </button>

                  <button className="flex items-center hover:text-olive-700">
                    <Share2 size={18} />
                  </button>
                </div>
                <span>{comment.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
