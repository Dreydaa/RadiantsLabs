import { createClient } from 'npm:@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';
import { withSecurity } from '../_shared/middleware.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CreateTeamBody {
  name: string;
  region: string;
  description: string;
  logo?: string;
}

const VALID_REGIONS = ['NA', 'EU', 'ASIA', 'OCE', 'BR', 'LATAM'];

Deno.serve(withSecurity(async (req) => {
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
      const url = new URL(req.url);
      const teamId = url.pathname.split('/').pop();

      if (!teamId) {
        return new Response(
          JSON.stringify({ error: 'Team ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify team ownership
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('owner_id')
        .eq('id', teamId)
        .single();

      if (teamError || !team) {
        return new Response(
          JSON.stringify({ error: 'Team not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (team.owner_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Forbidden' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Delete team (cascade will handle team members)
      const { error: deleteError } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (deleteError) {
        throw deleteError;
      }

      return new Response(
        JSON.stringify({ message: 'Team deleted successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST') {
      // Check if user already owns a team
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (existingTeam) {
        return new Response(
          JSON.stringify({ error: 'User already owns a team' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const body: CreateTeamBody = await req.json();

      // Validate required fields
      if (!body.name || !body.region || !body.description) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate field constraints
      if (body.name.length < 3 || body.name.length > 50) {
        return new Response(
          JSON.stringify({ error: 'Team name must be between 3 and 50 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!VALID_REGIONS.includes(body.region)) {
        return new Response(
          JSON.stringify({ error: 'Invalid region' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (body.description.length > 500) {
        return new Response(
          JSON.stringify({ error: 'Description must not exceed 500 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create team
      const { data: team, error: createError } = await supabase
        .from('teams')
        .insert({
          name: body.name,
          region: body.region,
          description: body.description,
          logo: body.logo,
          owner_id: user.id
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return new Response(
        JSON.stringify(team),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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