import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Trophy, Globe2, Clock, Users, MessageSquare } from 'lucide-react';
import { Post, User as UserType, Team } from '../types';
import PostCard from '../components/PostCard';
import MessageModal from '../components/MessageModal';
import CreateTeamModal from '../components/CreateTeamModal';
import InviteModal from '../components/InviteModal';
import '../styles/ProfilePage.css';

interface Profile {
  currentUser?: UserType;
  id: string;
  name: string;
  fullName: string;
  age: number;
  role: string;
  region: string;
  experience: string;
  rank: string;
  avatar: string;
  isVerified: boolean;
  followers: number;
  following: number;
  achievements: string[];
  agents: string[];
  team: Team | null;
  isTeam?: boolean;
}

function ProfilePage({ currentUser }: Profile) {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile| null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    // Mock profile data - in a real app, this would fetch from an API
    const mockProfiles: Record<string, Profile> = {
      'n4rrate': {
        id: 'n4rrate',
        name: 'N4RRATE',
        fullName: 'MARSHALL "N4RRATE" MASSEY',
        age: 22,
        role: 'Flex',
        region: 'United States',
        experience: '3 Years',
        rank: 'Radiant',
        avatar: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        followers: 12500,
        following: 245,
        achievements: [
          '2nd - VCT 2025 : Americas Stage 1',
          '2nd - VCT 2025 : Americas Kickoff',
          '5th-6th - VALORANT Masters Madrid 2024',
          '1st - VCT 2024 : EMEA Kickoff'
        ],
        agents: ['Jett', 'Raze', 'Fade', 'Tejo'],
        team: null
      },
      'phantom': {
        id: 'phantom',
        name: 'PHANTOM',
        fullName: 'SARAH "PHANTOM" CHEN',
        age: 20,
        role: 'Duelist',
        region: 'Singapore',
        experience: '2 Years',
        rank: 'Immortal',
        avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        followers: 8900,
        following: 120,
        achievements: ['1st - SEA Championship 2024', '3rd - VCT Pacific League'],
        agents: ['Jett', 'Raze', 'Phoenix'],
        team: null
      },
      'eclipse': {
        id: 'eclipse',
        name: 'ECLIPSE',
        fullName: 'LUCAS "ECLIPSE" SILVA',
        age: 23,
        role: 'Controller',
        region: 'Brazil',
        experience: '4 Years',
        rank: 'Radiant',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        followers: 15200,
        following: 89,
        achievements: ['VCT Americas Champion 2024'],
        agents: ['Omen', 'Brimstone', 'Harbor'],
        team: null
      },
      'frost': {
        id: 'frost',
        name: 'FROST',
        fullName: 'EMMA "FROST" ANDERSON',
        age: 21,
        role: 'Sentinel',
        region: 'Sweden',
        experience: '3 Years',
        rank: 'Radiant',
        avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        followers: 9800,
        following: 145,
        achievements: ['2nd - VCT EMEA League 2024'],
        agents: ['Killjoy', 'Cypher', 'Chamber'],
        team: null
      },
      'blade': {
        id: 'blade',
        name: 'BLADE',
        fullName: 'JAMES "BLADE" WILSON',
        age: 24,
        role: 'Initiator',
        region: 'Canada',
        experience: '5 Years',
        rank: 'Radiant',
        avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        followers: 22100,
        following: 201,
        achievements: ['VCT Champions 2024 Winner'],
        agents: ['Sova', 'Fade', 'Gekko'],
        team: null
      },
      'nova': {
        id: 'nova',
        name: 'NOVA',
        fullName: 'SOFIA "NOVA" RODRIGUEZ',
        age: 19,
        role: 'Duelist',
        region: 'Spain',
        experience: '2 Years',
        rank: 'Immortal',
        avatar: 'https://images.pexels.com/photos/1539935/pexels-photo-1539935.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        followers: 6700,
        following: 230,
        achievements: ['Rookie of the Year 2024'],
        agents: ['Neon', 'Jett', 'Yoru'],
        team: null
      },
      'shadow': {
        id: 'shadow',
        name: 'SHADOW',
        fullName: 'KAI "SHADOW" ZHANG',
        age: 22,
        role: 'Flex',
        region: 'China',
        experience: '3 Years',
        rank: 'Radiant',
        avatar: 'https://images.pexels.com/photos/1547971/pexels-photo-1547971.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        followers: 11300,
        following: 178,
        achievements: ['VCT Pacific League MVP 2024'],
        agents: ['Omen', 'Chamber', 'Viper'],
        team: null
      },
      'storm': {
        id: 'storm',
        name: 'STORM',
        fullName: 'ALEX "STORM" TAYLOR',
        age: 25,
        role: 'IGL',
        region: 'Australia',
        experience: '6 Years',
        rank: 'Radiant',
        avatar: 'https://images.pexels.com/photos/1546912/pexels-photo-1546912.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        followers: 18900,
        following: 145,
        achievements: ['VCT Pacific Champion 2024'],
        agents: ['Brimstone', 'Astra', 'Omen'],
        team: null
      },
      'viper': {
        id: 'viper',
        name: 'VIPER',
        fullName: 'ELENA "VIPER" VOLKOV',
        age: 23,
        role: 'Controller',
        region: 'Russia',
        experience: '4 Years',
        rank: 'Radiant',
        avatar: 'https://images.pexels.com/photos/1544717/pexels-photo-1544717.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        followers: 14200,
        following: 167,
        achievements: ['VCT EMEA Most Valuable Controller 2024'],
        agents: ['Viper', 'Astra', 'Harbor'],
        team: null
      },
      'ace': {
        id: 'ace',
        name: 'ACE',
        fullName: 'DANIEL "ACE" PARK',
        age: 21,
        role: 'Duelist',
        region: 'South Korea',
        experience: '3 Years',
        rank: 'Radiant',
        avatar: 'https://images.pexels.com/photos/1549974/pexels-photo-1549974.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        followers: 25600,
        following: 134,
        achievements: ['VCT Pacific All-Star 2024'],
        agents: ['Jett', 'Chamber', 'Raze'],
        team: null
      }
    };

    setProfile(mockProfiles[userId || '']);

    // Mock posts for the profile
    setPosts([
      {
        id: '1',
        userId: userId || '',
        userName: mockProfiles[userId || '']?.name || '',
        content: 'Just another day of practice! 💪 #VCTAMERICAS',
        likes: 1234,
        comments: 56,
        shares: 12,
        timeAgo: '2h',
        isVerified: true,
        userAvatar: mockProfiles[userId || '']?.avatar
      }
    ]);
  }, [userId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      setProfile({ ...profile, followers: profile.followers + 1 });
    } else {
      setProfile({ ...profile, followers: profile.followers - 1 });
    }
  };

  const handleCreateTeam = (team: Team) => {
    // In a real app, this would make an API call
    console.log('Created team:', team);
  };

  const canSendTeamInvite = () => {
  };

  const canSendPlayerInvite = () => {
  };

  if (!profile) {
    return <div className="flex items-center justify-center h-screen">Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="contanerAd bg-cream-50 rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User size={32} className="text-olive-700" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-serif text-olive-900">
                  {profile.name}
                </h1>
                {profile.isVerified && (
                  <span className="px-3 py-1 bg-blue-400 text-olive-900 rounded-full text-sm">
                    Verified
                  </span>
                )}
                {profile.rank && (
                  <span className="px-3 py-1 bg-blue-400 text-olive-900 rounded-full text-sm">
                    {profile.rank}
                  </span>
                )}
              </div>
              
              <div className="text-olive-600 mb-4">
                {profile.isTeam ? profile.foundedDate : `${profile.fullName} • ${profile.age} years old`}
              </div>
              
              <div className="flex items-center gap-6 text-olive-700">
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>{profile.followers.toLocaleString()} Followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>{profile.following.toLocaleString()} Following</span>
                </div>
                {profile.role && (
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <span>{profile.role}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Globe2 size={18} />
                  <span>{profile.region}</span>
                </div>
                {profile.experience && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{profile.experience}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {currentUser && currentUser.id !== profile.id && (
                <>
                  <button 
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowMessageModal(true)}
                  >
                    <MessageSquare size={18} className="mr-2" />
                    Message
                  </button>
                  {canSendTeamInvite() && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowInviteModal(true)}
                    >
                      <Users size={18} className="mr-2" />
                      Invite to Team
                    </button>
                  )}
                  {canSendPlayerInvite() && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowInviteModal(true)}
                    >
                      <Users size={18} className="mr-2" />
                      Send Player Invitation
                    </button>
                  )}
                </>
              )}
              {currentUser && !profile.isTeam && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateTeamModal(true)}
                >
                  <Users size={18} className="mr-2" />
                  Create Team
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 lg:col-span-8">
          {profile.agents && (
            <motion.div 
              className="contanerAd bg-cream-50 rounded-lg shadow-md p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-serif text-olive-900 mb-4">Agent Pool</h2>
              <div className="grid grid-cols-4 gap-4">
                {profile.agents.map((agent: string) => (
                  <div key={agent} className="bg-cream-100 rounded-lg p-4 text-center">
                    <h3 className="font-medium text-olive-900">{agent}</h3>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} currentUser={currentUser || profile} />
            ))}
          </motion.div>
        </div>

        <div className="contanerAd col-span-12 lg:col-span-4">
          <motion.div 
            className="bg-cream-50 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-serif text-olive-900 mb-4">Achievements</h2>
            <div className="space-y-3">
              {profile.achievements?.map((achievement: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-cream-100 rounded-lg"
                >
                  <Trophy size={18} className="text-olive-700" />
                  <span className="text-olive-900">{achievement}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {showMessageModal && currentUser && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          recipient={profile}
          currentUser={currentUser}
        />
      )}

      {showCreateTeamModal && currentUser && (
        <CreateTeamModal
          isOpen={showCreateTeamModal}
          onClose={() => setShowCreateTeamModal(false)}
          currentUser={currentUser}
          onCreateTeam={handleCreateTeam}
        />
      )}

      {showInviteModal && currentUser && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          sender={currentUser}
          recipient={profile}
          type={currentUser.profileType}
        />
      )}
    </div>
  );
}

export default ProfilePage;