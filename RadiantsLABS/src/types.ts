export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileType: 'player' | 'team';
  teamName?: string;
  region?: string;
  status?: string;
  avatar?: string;
  age?: number;
  username?: string;
  role?: string;
  rank?: string;
  followers?: number;
  following?: number;
  teams?: Team[];
}

export interface Team {
  id: string;
  name: string;
  avatar?: string;
  region?: string;
  members: User[];
  owner: User;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  isVerified?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  timeAgo: string;
}

export interface Agent {
  id: string;
  name: string;
  image: string;
  abilities: string[];
}

export interface Map {
  id: string;
  name: string;
  image: string;
}

export interface PracticeSession {
  id: string;
  teamName: string;
  region: string;
  date: string;
  time: string;
  maps: string[];
  rank: string;
  description: string;
}

export interface BlueprintMarker {
  id: string;
  type: string;
  position: { x: number; y: number };
  color: string;
  label?: string;
}

export interface Blueprint {
  id: string;
  mapId: string;
  name: string;
  markers: BlueprintMarker[];
  createdBy: string;
  createdAt: string;
}