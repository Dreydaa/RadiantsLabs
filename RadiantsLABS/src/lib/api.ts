//lien serveur deno du backend
const BASE = "http://localhost:8000";
export const api = <T>(p: string, i: RequestInit = {}) =>
    fetch(BASE + p, { credentials: "include", ...i })
        .then(async r => (r.ok ? (r.status === 204 ? null : (await r.json() as T))
            : Promise.reject(await r.text())));
