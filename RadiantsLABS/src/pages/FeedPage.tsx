import { useState, useEffect } from 'react';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { User, Post } from '../types';

interface FeedPageProps {
  user: User;
}

function FeedPage({ user }: FeedPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  // Mock data for initial posts
  useEffect(() => {
    setPosts([
      {
        id: '1',
        userId: 'n4rrate',
        userName: 'N4RRATE',
        content: 'Just finished an intense scrim session with @TeamLiquid! The new strategies we\'ve been working on are really coming together. Can\'t wait to showcase them at VCT Americas! 🎯 #VCTAMERICAS #Sentinels',
        likes: 2481,
        comments: 156,
        shares: 89,
        timeAgo: '2h',
        isVerified: true,
        userAvatar: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        id: '2',
        userId: 'fnatic',
        userName: 'FNATIC',
        content: 'Incredible match against @NaVi today! GGs to our opponents - that was some of the highest level Valorant we\'ve played yet. The grind continues! 💪\n\nMatch stats from today\'s series:',
        image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600',
        likes: 5629,
        comments: 342,
        shares: 178,
        timeAgo: '4h',
        isVerified: true,
        userAvatar: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        id: '3',
        userId: 'shroud',
        userName: 'SHROUD',
        content: 'Streaming some Valorant today with the squad! Join in and let\'s have some fun. 🎮 #Valorant #Streaming',
        image: 'https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg?auto=compress&cs=tinysrgb&w=100',
        likes: 1024,
        comments: 208,
        shares: 64,
        timeAgo: '1h',
        isVerified: true,
        userAvatar: 'https://images.pexels.com/photos/654321/pexels-photo-654321.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        id: '4',
        userId: 'tenz',
        userName: 'TENZ',
        content: 'Excited to announce my new in-game settings guide is now live! Check it out to improve your gameplay. 📈🔥 #ValorantGuide',
        likes: 789,
        comments: 97,
        shares: 45,
        timeAgo: '30m',
        isVerified: true,
        userAvatar: 'https://images.pexels.com/photos/987654/pexels-photo-987654.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    ]);
  }, []);

  const handleCreatePost = (content: string, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.firstName || user.teamName || user.email,
      content,
      image,
      likes: 0,
      comments: 0,
      shares: 0,
      timeAgo: 'just now',
      userAvatar: user.avatar
    };
    
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <CreatePost user={user} onPost={handleCreatePost} />
      
      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUser={user} />
        ))}
      </div>
    </div>
  );
}

export default FeedPage;