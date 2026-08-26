import { NextResponse } from "next/server";
import { setBoundedCache } from "@/lib/bounded-cache";
import { mapListing, SKILLSELION_LISTINGS, type SkillselionHit } from "@/lib/skillselion";

export const dynamic = "force-dynamic";

const CACHE_MS = 60_000;
const MAX_CACHE_ENTRIES = 250;
const MAX_QUERY_LENGTH = 120;
const cache = new Map<string, { at: number; hits: SkillselionHit[] }>();

/* Fly listings want x-frontend-secret. skillselion.com/api/upstream is the
   same catalog without shipping that secret into this repo. */
const FALLBACK = "https://skillselion.com/api/upstream/listings";

function listingUrl(base: string, q: string): URL {
  const url = new URL(base);
  url.searchParams.set("type", "skill");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "12");
  return url;
}

async function pull(base: string, q: string, headers: HeadersInit): Promise<unknown | null> {
  try {
    const res = await fetch(listingUrl(base, q), {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ skills: [] as SkillselionHit[] });
  }
  if (q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: "q is too long" }, { status: 400 });
  }

  const key = q.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) {
    return NextResponse.json({ skills: hit.hits }, { headers: { "Cache-Control": "public, max-age=60" } });
  }

  const secret = process.env.SKILLSELION_API_SECRET ?? process.env.API_FRONTEND_SECRET;
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(secret ? { "x-frontend-secret": secret } : {}),
  };

  const body =
    (await pull(SKILLSELION_LISTINGS, q, headers)) ??
    (await pull(FALLBACK, q, { Accept: "application/json" }));

  if (body === null) {
    return NextResponse.json(
      { skills: [] as SkillselionHit[], error: "Skillselion listings unavailable" },
      { status: 502 },
    );
  }

  const rows = Array.isArray(body) ? body : [];
  const skills = rows.map(mapListing).filter((row): row is SkillselionHit => row !== null);
  setBoundedCache(cache, key, { at: Date.now(), hits: skills }, MAX_CACHE_ENTRIES);
  return NextResponse.json({ skills }, { headers: { "Cache-Control": "public, max-age=60" } });
}
