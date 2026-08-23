import { NextResponse } from "next/server";
import { mapListing, SKILLSELION_LISTINGS, type SkillselionHit } from "@/lib/skillselion";

export const dynamic = "force-dynamic";

const CACHE_MS = 60_000;
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
  const res = await fetch(listingUrl(base, q), { headers, cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ skills: [] as SkillselionHit[] });
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
  cache.set(key, { at: Date.now(), hits: skills });
  return NextResponse.json({ skills }, { headers: { "Cache-Control": "public, max-age=60" } });
}
