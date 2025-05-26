import { corsHeaders } from "../supabase/functions/_shared/cors.ts";
import { create, getNumericDate, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const SECRETKEY = Deno.env.get("JWT_SECRET_KEY") ?? crypto.randomUUID();

export async function handleLogin(req: Request): Promise<Response> {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }
    const { username, _password } = await req.json();

    // TODO: vérifier email/password auprès de Supabase -> if password == "password"(userID)
    const userId = "demo-id"; // retourne l’id réel si ok
    // Mot de passe ou identifiant incorrect -> retourne 401 Unauthorized
    if (!userId) {
        return new Response("Invalid credentials", { status: 401, headers: corsHeaders });
    }

    // Génère un JWT token (pour authentifier l'utilisateur)
    const jwt = await create({ alg: "HS256", typ: "JWT" },
        {
            sub: userId, //sub=subject
            username,
            exp: getNumericDate(60 * 60 * 24), // Format 24h
        }, SECRETKEY);  //Ajout clé secrète pour authentifier la signature admin

    return new Response("OK", {
        headers: {
            ...corsHeaders,
            //Cookie d'auth envoyé au navigateur qui expire dans 24h
            "set-cookie": [
                `sid=${jwt}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24}`,
            ].join(""),
        },
    });
}

export async function handleProfile(req: Request): Promise<Response> {
    const jwt = req.headers.get("cookie")?.match(/sid=([^;]+)/)?.[1];
    //check existence du token
    if (!jwt) {
        return new Response("Unauthenticated", { status: 401, headers: corsHeaders });
    }

    //check si token invalide ou expiré
    try {
        const payload = await verify(jwt, SECRETKEY, "HS256");
        return new Response(JSON.stringify({ id: payload.sub, email: payload.email }), {
            headers: { ...corsHeaders, "content-type": "application/json" },
        });
    } catch {
        return new Response("Invalid token", { status: 401, headers: corsHeaders });
    }
}