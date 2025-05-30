import { corsHeaders } from "../supabase/functions/_shared/cors.ts";
import { create, getNumericDate, verify, Payload } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const SECRETKEY = Deno.env.get("JWT_SECRET_KEY") ?? crypto.randomUUID();
// Génère un JWT token (pour authentifier l'utilisateur)
const JWT_KEY: CryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRETKEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
);  //Ajout clé secrète pour authentifier la signature admin
//mock user
export const USERS = [
    {
        id: "1",
        email: "demo@demo.io",
        password: "secret",
        firstName: "Demo",
        lastName: "User",
        profileType: "player", // requis côté front
        region: "EU",
        rank: "Platinum",
        avatar: "https://api.dicebear.com/6.x/personas/svg?seed=Demo",
    },
];
export async function handleLogin(req: Request): Promise<Response> {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }
    const { email, password } = (await req.json()) as {
        email?: string;
        password?: string;
    };

    //Ici, regarde dans la const USERS mockée + haut. Dans app réelle, 
    const user = USERS.find((u) => u.email === email && u.password === password);
    // Mot de passe ou identifiant incorrect -> retourne 401 Unauthorized
    if (!user) {
        return new Response("Invalid credentials", { status: 401, headers: corsHeaders });
    }

    const jwt = await create({ alg: "HS256", typ: "JWT" }, {
        sub: user.id,
        email: user.email,
        exp: getNumericDate(60 * 60 * 24), // 24 h
    }, JWT_KEY);

    return new Response(JSON.stringify({ ok: true }), {
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

    try {
        //vérification de la validité du token
        const payload = (await verify(jwt, JWT_KEY)) as Payload & { sub: string };
        const user = USERS.find((u) => u.id === payload.sub);
        if (!user) {
            throw new Error("Unknown user")
        };

        //Si pas d'erreur d'utilisateur inconnu ou de token invalide, on renvoie le profil
        return new Response(JSON.stringify({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileType: user.profileType,
            region: user.region,
            rank: user.rank,
            avatar: user.avatar,
        }), {
            headers: { ...corsHeaders, "content-type": "application/json" },
        });
    } catch {
        return new Response("Invalid or expired token", { status: 401, headers: corsHeaders });
    }
}