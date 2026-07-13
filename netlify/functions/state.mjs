import { getStore } from "@netlify/blobs";

// Alle starten auf Level 1 (Startwerte sind clientseitig fix)
const DEFAULT_STATE = {
  "fynn-now": "14.00",
  "niklas-now": "1",
  "alex-now": "39.00"
};

const cors = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type"
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  const store = getStore({ name: "progress", consistency: "strong" });

  if (req.method === "GET") {
    const data = await store.get("state", { type: "json" });
    return new Response(JSON.stringify(data || DEFAULT_STATE), { headers: cors });
  }

  if (req.method === "POST") {
    const patch = await req.json();
    const current = (await store.get("state", { type: "json" })) || DEFAULT_STATE;
    const merged = { ...current, ...patch };
    await store.setJSON("state", merged);
    return new Response(JSON.stringify(merged), { headers: cors });
  }

  return new Response("Method Not Allowed", { status: 405, headers: cors });
};

export const config = { path: "/api/state" };
