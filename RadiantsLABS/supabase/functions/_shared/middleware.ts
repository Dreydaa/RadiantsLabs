import { corsHeaders } from "./cors";

export function withSecurity(handler: (req: Request) => Response | Promise<Response>) {
    return async (req: Request): Promise<Response> => {
        const res = await handler(req);

        const headers = new Headers(res.headers);
        for (const [key, value] of Object.entries(corsHeaders)) {
            headers.set(key, value);
        }
        
        headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' supabase.co wss://*.supabase.co");

        return new Response(res.body, {
            status: res.status,
            statusText: res.statusText,
            headers,
        });
    };
}