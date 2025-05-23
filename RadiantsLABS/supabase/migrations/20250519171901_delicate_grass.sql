/*
  # Team Chat System Implementation

  1. New Tables
    - `chats`
      - `id` (uuid, primary key)
      - `type` (text - 'direct' or 'group')
      - `name` (text, for group chats)
      - `created_at` (timestamp)
      - `created_by` (uuid, references users)

    - `chat_participants`
      - `chat_id` (uuid, references chats)
      - `user_id` (uuid, references users)
      - `joined_at` (timestamp)
      - `last_read_at` (timestamp)

    - `chat_messages`
      - `id` (uuid, primary key)
      - `chat_id` (uuid, references chats)
      - `sender_id` (uuid, references users)
      - `content` (text)
      - `file_url` (text, nullable)
      - `file_type` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `status` (text - 'sent', 'delivered', 'read')

  2. Security
    - Enable RLS on all tables
    - Add policies for chat creation and participation
    - Add policies for message management
    - Add policies for read receipts
*/

-- Create chat types enum
CREATE TYPE chat_type AS ENUM ('direct', 'group');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type chat_type NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT valid_group_name CHECK (
    (type = 'group' AND name IS NOT NULL) OR
    (type = 'direct' AND name IS NULL)
  )
);

-- Create chat participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz DEFAULT now(),
  PRIMARY KEY (chat_id, user_id)
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  file_url text,
  file_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status message_status DEFAULT 'sent',
  CONSTRAINT valid_file CHECK (
    (file_url IS NULL AND file_type IS NULL) OR
    (file_url IS NOT NULL AND file_type IS NOT NULL)
  )
);

-- Create indexes
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat policies
CREATE POLICY "Users can create chats"
  ON chats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view their chats"
  ON chats
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.chat_id = id
      AND chat_participants.user_id = auth.uid()
    )
  );

-- Chat participants policies
CREATE POLICY "Chat creators can manage participants"
  ON chat_participants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = chat_id
      AND chats.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can view chat participants"
  ON chat_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants cp
      WHERE cp.chat_id = chat_id
      AND cp.user_id = auth.uid()
    )
  );

-- Chat messages policies
CREATE POLICY "Chat participants can send messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.chat_id = chat_id
      AND chat_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Chat participants can view messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.chat_id = chat_id
      AND chat_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Message senders can update their messages"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid());

-- Functions
CREATE OR REPLACE FUNCTION update_message_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_message_timestamp
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_status();