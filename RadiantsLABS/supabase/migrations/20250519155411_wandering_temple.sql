/*
  # Add sharing and practice organization features

  1. New Tables
    - `blueprints`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `map_id` (text)
      - `name` (text)
      - `data` (jsonb)
      - `created_at` (timestamp)
      - `shared` (boolean)

    - `drafts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `name` (text)
      - `data` (jsonb)
      - `created_at` (timestamp)
      - `shared` (boolean)

    - `practice_requests`
      - `id` (uuid, primary key)
      - `team_id` (uuid, references teams)
      - `date` (date)
      - `time` (time)
      - `maps` (text[])
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for blueprint and draft sharing
    - Add policies for practice requests
*/

-- Create blueprints table
CREATE TABLE IF NOT EXISTS blueprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  map_id text NOT NULL,
  name text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  shared boolean DEFAULT false
);

-- Create drafts table
CREATE TABLE IF NOT EXISTS drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  shared boolean DEFAULT false
);

-- Create practice requests table
CREATE TABLE IF NOT EXISTS practice_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  maps text[] NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_requests ENABLE ROW LEVEL SECURITY;

-- Blueprint policies
CREATE POLICY "Users can create blueprints"
  ON blueprints
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own blueprints"
  ON blueprints
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR shared = true);

CREATE POLICY "Users can update their own blueprints"
  ON blueprints
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Draft policies
CREATE POLICY "Users can create drafts"
  ON drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own drafts"
  ON drafts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR shared = true);

CREATE POLICY "Users can update their own drafts"
  ON drafts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Practice request policies
CREATE POLICY "Team owners can create practice requests"
  ON practice_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = practice_requests.team_id
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view practice requests"
  ON practice_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team owners can update their practice requests"
  ON practice_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = practice_requests.team_id
      AND teams.owner_id = auth.uid()
    )
  );