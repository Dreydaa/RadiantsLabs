import { createClient } from 'npm:@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';
import { withSecurity } from '../_shared/middleware.ts';

import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
// Load environment variables

const env = await config();

const supabaseUrl = env.SUPABASE_URL!;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CreateChatBody {
  type: 'direct' | 'group';
  name?: string;
  participantIds: string[];
}

export const handler = withSecurity(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonError('No authorization header', 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return jsonError('Unauthorized', 401);
    }

    // POST = Création d'un chat
    if (req.method === 'POST') {
      const body: CreateChatBody = await req.json();

      if (!body.type || !body.participantIds || body.participantIds.length === 0) {
        return jsonError('Invalid request body', 400);
      }

      if (body.type === 'direct' && body.participantIds.length !== 1) {
        return jsonError('Direct chats must have exactly one participant', 400);
      }

      if (body.type === 'group' && !body.name) {
        return jsonError('Group chats must have a name', 400);
      }

      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .insert({
          type: body.type,
          name: body.name,
          created_by: user.id
        })
        .select()
        .single();

      if (chatError) throw chatError;

      const participants = [...new Set([...body.participantIds, user.id])];
      const { error: participantsError } = await supabase
        .from('chat_participants')
        .insert(participants.map(participantId => ({
          chat_id: chat.id,
          user_id: participantId
        })));

      if (participantsError) throw participantsError;

      return new Response(JSON.stringify(chat), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // PUT = Marquer un message comme lu
    if (req.method === 'PUT') {
      const url = new URL(req.url);
      const chatId = url.searchParams.get('chatId');
      const messageId = url.searchParams.get('messageId');

      if (!chatId || !messageId) {
        return jsonError('Missing required parameters', 400);
      }

      const { error: updateError } = await supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      const { error: messageError } = await supabase
        .from('chat_messages')
        .update({ status: 'read' })
        .eq('id', messageId)
        .eq('chat_id', chatId);

      if (messageError) throw messageError;

      return jsonSuccess({ message: 'Message marked as read' });
    }

    return jsonError('Method not allowed', 405);

  } catch (error) {
    return jsonError(error instanceof Error ? error.message : String(error), 500);
  }
});

// Utilitaires de réponse JSON
function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function jsonSuccess(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Serveur principal
Deno.serve(handler);
