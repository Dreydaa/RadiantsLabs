  /*
    # Add teams and messages functionality

    1. New Tables
      - `teams`
        - `id` (uuid, primary key)
        - `name` (text)
        - `avatar` (text, nullable)
        - `region` (text)
        - `created_at` (timestamp)
        - `owner_id` (uuid, references users)

      - `team_members`
        - `team_id` (uuid, references teams)
        - `user_id` (uuid, references users)
        - `role` (text)
        - `joined_at` (timestamp)

      - `messages`
        - `id` (uuid, primary key)
        - `sender_id` (uuid, references users)
        - `receiver_id` (uuid, references users)
        - `content` (text)
        - `created_at` (timestamp)
        - `read` (boolean)

      - `followers`
        - `follower_id` (uuid, references users)
        - `following_id` (uuid, references users)
        - `created_at` (timestamp)

    2. Security
      - Enable RLS on all tables
      - Add policies for team creation and membership
      - Add policies for messaging
      - Add policies for following
  */

  -- Create teams table
  CREATE TABLE IF NOT EXISTS teams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    avatar text,
    region text,
    created_at timestamptz DEFAULT now(),
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
  );

  -- Create team members table
  CREATE TABLE IF NOT EXISTS team_members (
    team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL,
    joined_at timestamptz DEFAULT now(),
    PRIMARY KEY (team_id, user_id)
  );

  -- Create messages table
  CREATE TABLE IF NOT EXISTS messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    read boolean DEFAULT false
  );

  -- Create followers table
  CREATE TABLE IF NOT EXISTS followers (
    follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (follower_id, following_id)
  );

  -- Enable RLS
  ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
  ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

  -- Teams policies
  CREATE POLICY "Users can create teams"
    ON teams
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

  CREATE POLICY "Team members can view team"
    ON teams
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = teams.id
        AND team_members.user_id = auth.uid()
      )
      OR owner_id = auth.uid()
    );

  -- Team members policies
  CREATE POLICY "Team owners can manage members"
    ON team_members
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM teams
        WHERE teams.id = team_members.team_id
        AND teams.owner_id = auth.uid()
      )
    );

  CREATE POLICY "Users can view team members"
    ON team_members
    FOR SELECT
    TO authenticated
    USING (true);

  -- Messages policies
  CREATE POLICY "Users can send messages"
    ON messages
    FOR INSERT
    TO authenticated
    WITH CHECK (sender_id = auth.uid());

  CREATE POLICY "Users can view their messages"
    ON messages
    FOR SELECT
    TO authenticated
    USING (sender_id = auth.uid() OR receiver_id = auth.uid());

  -- Followers policies
  CREATE POLICY "Users can follow others"
    ON followers
    FOR INSERT
    TO authenticated
    WITH CHECK (follower_id = auth.uid());

  CREATE POLICY "Users can unfollow"
    ON followers
    FOR DELETE
    TO authenticated
    USING (follower_id = auth.uid());

  CREATE POLICY "Anyone can view followers"
    ON followers
    FOR SELECT
    TO authenticated
    USING (true);