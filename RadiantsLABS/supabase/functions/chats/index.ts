import { createClient } from 'npm:@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CreateChatBody {
  type: 'direct' | 'group';
  name?: string;
  participantIds: string[];
}

interface SendMessageBody {
  chatId: string;
  content: string;
  fileUrl?: string;
  fileType?: string;
}

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
      const body: CreateChatBody = await req.json();

      // Validate chat creation
      if (!body.type || !body.participantIds || body.participantIds.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid request body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (body.type === 'direct' && body.participantIds.length !== 1) {
        return new Response(
          JSON.stringify({ error: 'Direct chats must have exactly one participant' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (body.type === 'group' && !body.name) {
        return new Response(
          JSON.stringify({ error: 'Group chats must have a name' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create chat
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .insert({
          type: body.type,
          name: body.name,
          created_by: user.id
        })
        .select()
        .single();

      if (chatError) {
        throw chatError;
      }

      // Add participants (including the creator)
      const participants = [...new Set([...body.participantIds, user.id])];
      const { error: participantsError } = await supabase
        .from('chat_participants')
        .insert(
          participants.map(participantId => ({
            chat_id: chat.id,
            user_id: participantId
          }))
        );

      if (participantsError) {
        throw participantsError;
      }

      return new Response(
        JSON.stringify(chat),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'PUT') {
      const url = new URL(req.url);
      const chatId = url.searchParams.get('chatId');
      const messageId = url.searchParams.get('messageId');

      if (!chatId || !messageId) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update last read timestamp
      const { error: updateError } = await supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update message status to 'read'
      const { error: messageError } = await supabase
        .from('chat_messages')
        .update({ status: 'read' })
        .eq('id', messageId)
        .eq('chat_id', chatId);

      if (messageError) {
        throw messageError;
      }

      return new Response(
        JSON.stringify({ message: 'Message marked as read' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    //To make sure error is of type Error
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    //If error if of type String, Number, etc.
    return new Response(
      JSON.stringify({ error: String(error) }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});