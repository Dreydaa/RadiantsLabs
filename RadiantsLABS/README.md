# Radiants Labs Technical Documentation

## Overview

Radiants Labs is a comprehensive esports team management platform built with React, TypeScript, and Supabase. The platform enables teams and players to connect, organize practices, create tactical blueprints, and manage their competitive activities.

## Technology Stack

- **Frontend**: React 18.3 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Supabase Edge Functions
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Build Tool**: Vite
- **Testing**: Vitest

## Project Structure

```
radiants-labs/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── CommentSection.tsx    # Comment handling
│   │   ├── CreatePost.tsx        # Post creation
│   │   ├── CreateTeamModal.tsx   # Team creation
│   │   ├── Documentation.tsx     # PDF documentation
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Header.tsx           # Navigation header
│   │   ├── InviteModal.tsx      # Team invitations
│   │   ├── Logo.tsx             # Site logo
│   │   ├── MessageModal.tsx     # Direct messaging
│   │   └── PostCard.tsx         # Post display
│   ├── layouts/          # Page layout components
│   │   ├── AuthLayout.tsx       # Authentication pages
│   │   └── MainLayout.tsx       # Main application
│   ├── pages/            # Page components
│   │   ├── BlueprintPage.tsx    # Strategy creation
│   │   ├── DraftSimulatorPage.tsx # Team drafting
│   │   ├── FeedPage.tsx         # Social feed
│   │   ├── HomePage.tsx         # Landing page
│   │   └── ProfilePage.tsx      # User profiles
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── supabase/
│   ├── functions/       # Edge Functions
│   │   ├── chats/      # Chat management
│   │   ├── messages/   # Direct messaging
│   │   ├── teams/      # Team operations
│   │   └── users/      # User management
│   └── migrations/      # Database migrations
└── public/              # Static assets
```

## Database

# Écrase/actualise le fichier de référence
supabase db dump -f supabase/schema.sql
git add supabase/schema.sql
git commit -m "Mise à jour du schéma"

## Core Features

### 1. Authentication System

The authentication system uses Supabase Auth with email/password. Here's a detailed implementation:

```typescript
// Auth context setup
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userData: UserData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signup = async (email: string, password: string, userData: UserData) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Database Schema

Detailed table relationships and constraints:

```sql
-- Users table relationships
users
  ├── teams (owner_id)
  ├── team_members (user_id)
  ├── messages (sender_id, receiver_id)
  ├── followers (follower_id, following_id)
  ├── blueprints (created_by)
  └── practice_requests (created_by)

-- Teams table relationships
teams
  ├── team_members (team_id)
  ├── practice_requests (team_id)
  └── chat_participants (team_id)

-- Messages system
messages
  ├── sender (user_id)
  └── receiver (user_id)

-- Blueprint system
blueprints
  ├── creator (user_id)
  ├── team (team_id)
  └── shared_with (team_id[])
```

### 3. Component Architecture

Example of component communication using props and context:

```typescript
// PostContext for managing post state
interface PostContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  deletePost: (id: string) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
}

const PostContext = createContext<PostContextType | null>(null);

// PostProvider component
export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = async (post: Post) => {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    setPosts(prev => [data, ...prev]);
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setPosts(prev => prev.map(post => post.id === id ? data : post));
  };

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost, updatePost }}>
      {children}
    </PostContext.Provider>
  );
};
```

### 4. State Management

Example of complex state management with custom hooks:

```typescript
// Custom hook for managing team state
function useTeam(teamId: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // Fetch team details
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamId)
          .single();

        if (teamError) throw teamError;
        setTeam(teamData);

        // Fetch team members
        const { data: membersData, error: membersError } = await supabase
          .from('team_members')
          .select(`
            *,
            user:users(*)
          `)
          .eq('team_id', teamId);

        if (membersError) throw membersError;
        setMembers(membersData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();

    // Subscribe to realtime updates
    const teamSubscription = supabase
      .channel(`team:${teamId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'teams',
        filter: `id=eq.${teamId}`
      }, payload => {
        setTeam(payload.new as Team);
      })
      .subscribe();

    return () => {
      teamSubscription.unsubscribe();
    };
  }, [teamId]);

  return { team, members, loading, error };
}
```

### 5. Edge Functions

Example of a complex edge function for team management:

```typescript
// Team invitation system
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST') {
      const { teamId, userId, role } = await req.json();

      // Check if user is team owner
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('owner_id')
        .eq('id', teamId)
        .single();

      if (teamError || team.owner_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Not authorized to invite members' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('team_invitations')
        .insert({
          team_id: teamId,
          user_id: userId,
          role,
          invited_by: user.id
        })
        .select()
        .single();

      if (inviteError) throw inviteError;

      // Send notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'team_invitation',
          data: {
            team_id: teamId,
            invitation_id: invitation.id
          }
        });

      return new Response(
        JSON.stringify(invitation),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

[Continued in next sections due to length...]