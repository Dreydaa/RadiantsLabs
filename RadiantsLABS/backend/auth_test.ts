import {
    assertEquals,
    assert,
} from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { handleLogin, handleProfile } from "./auth.ts";

/* helper pour lire un JSON dans la Response */
async function json<T>(res: Response): Promise<T> {
    const txt = await res.text();
    return txt ? (JSON.parse(txt) as T) : (undefined as unknown as T);
}

Deno.test("login + profile happy path", async () => {
    /* 1. simuler le POST /api/login */
    const loginReq = new Request("http://localhost/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "demo@demo.io", password: "secret" }),
    });

    const loginRes = await handleLogin(loginReq);
    assertEquals(loginRes.status, 200);

    /* 2. extraire le cookie sid */
    const setCookie = loginRes.headers.get("set-cookie")!;
    assert(setCookie.includes("sid="), "cookie sid absent");

    /* 3. simuler le GET /api/profile avec le cookie */
    const profileReq = new Request("http://localhost/api/user_profile", {
        headers: { cookie: setCookie },
    });

    const profileRes = await handleProfile(profileReq);
    assertEquals(profileRes.status, 200);

    const profile = await json<{ id: string; fullName: string }>(profileRes);
    assertEquals(profile.fullName, "DemoUser");
});

Deno.test("login refuse mauvais mot de passe", async () => {
    const badReq = new Request("http://localhost/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "demo@demo.io", password: "wrong" }),
    });

    const res = await handleLogin(badReq);
    assertEquals(res.status, 401);
});
