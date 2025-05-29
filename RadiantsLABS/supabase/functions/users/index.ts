import { createClient } from 'npm:@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';
import { withSecurity } from '../../../backend/middleware/security.ts';

import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
// Load environment variables

const env = await config();

const supabaseUrl = env.SUPABASE_URL!;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(withSecurity(async req => {
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

    if (req.method === 'DELETE') {
      // Delete user's teams first (cascade will handle team members)
      const { error: teamsError } = await supabase
        .from('teams')
        .delete()
        .eq('owner_id', user.id);

      if (teamsError) {
        throw teamsError;
      }

      // Delete user's messages
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (messagesError) {
        throw messagesError;
      }

      // Delete user's followers/following relationships
      const { error: followersError } = await supabase
        .from('followers')
        .delete()
        .or(`follower_id.eq.${user.id},following_id.eq.${user.id}`);

      if (followersError) {
        throw followersError;
      }

      // Finally, delete the user's auth account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

      if (deleteError) {
        throw deleteError;
      }

      return new Response(
        JSON.stringify({ message: 'Account deleted successfully' }),
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
}));
