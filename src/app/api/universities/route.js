// app/api/universities/route.js
import fetch from "node-fetch";

let cache = {
  // q: { timestamp, data }
};

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    // Use cached response if recent
    const cacheKey = q.toLowerCase();
    const hit = cache[cacheKey];
    if (hit && Date.now() - hit.timestamp < CACHE_TTL_MS) {
      return new Response(JSON.stringify(hit.data), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // Proxy to Hipolabs' API (search by name). Using http endpoint intentionally (Hipolabs uses http).
    // We limit results server-side by forwarding a `name` query param to reduce payload.
    // If you want country filtering add &country=...
    const upstreamUrl = `http://universities.hipolabs.com/search${q ? `?name=${encodeURIComponent(q)}` : ""}`;

    const upstreamRes = await fetch(upstreamUrl, { timeout: 15000 });
    if (!upstreamRes.ok) {
      // Return 502 to client — it's a proxy
      return new Response(JSON.stringify({ message: "Upstream data source unavailable." }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    const raw = await upstreamRes.json();

    // Normalize: reduce to minimal fields and unique names
    const normalized = raw
      .map((u) => ({ name: u.name, country: u.country, domains: u.domains || [], web_pages: u.web_pages || [] }))
      .filter(Boolean)
      // dedupe by name
      .reduce((acc, item) => {
        if (!acc.byName[item.name]) {
          acc.byName[item.name] = item;
          acc.list.push(item);
        }
        return acc;
      }, { byName: {}, list: [] }).list;

    // Cache & return
    cache[cacheKey] = { timestamp: Date.now(), data: normalized };

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": `max-age=${60 * 60}` },
    });
  } catch (err) {
    console.error("API /api/universities error:", err);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
