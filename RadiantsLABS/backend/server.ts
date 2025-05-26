// Deno v1.37+ – API native HTTP/1.1 & HTTP/2
// import { Deno } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../supabase/functions/_shared/cors.ts";
import { handleLogin, handleProfile } from "./auth.ts";

Deno.serve({port: 8000}, (req: Request) => {
    const url = new URL(req.url);

    if (req.method  === 'OPTIONS') {
        return new Response("ok", {headers: corsHeaders});
    }

    if (url.pathname === '/api/login' && req.method === 'POST') {
        return handleLogin(req);
    }
    if (url.pathname === '/api/profile' && req.method === 'GET') {
        return handleProfile(req);
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
});