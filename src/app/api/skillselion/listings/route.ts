import { NextResponse } from "next/server";
import { mapListing, SKILLSELION_LISTINGS, type SkillselionHit } from "@/lib/skillselion";

export const dynamic = "force-dynamic";

const CACHE_MS = 5 * 60_000;
const MAX_IDS = 20;
const cache = new Map<string, { at: number; hit: SkillselionHit | null }>();

/* Fly listings want x-frontend-secret. skillselion.com/api/upstream is the
   same catalog without shipping that secret into this repo. */
const FALLBACK = "https://skillselion.com/api/upstream/listings";

function listingUrl(base: string, id: string): string {
  return `${base.replace(/\/$/, "")}/${encodeURIComponent(id)}`;
}

async function pull(base: string, id: string, headers: HeadersInit): Promise<unknown | null> {
  try {
    const res = await fetch(listingUrl(base, id), {
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

async function fetchOne(id: string, headers: HeadersInit): Promise<SkillselionHit | null> {
  const cached = cache.get(id);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.hit;

  const body =
    (await pull(SKILLSELION_LISTINGS, id, headers)) ??
    (await pull(FALLBACK, id, { Accept: "application/json" }));

  const hit = body && !Array.isArray(body) && typeof body === "object" ? mapListing(body as never) : null;
  cache.set(id, { at: Date.now(), hit });
  return hit;
}

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("ids")?.trim() ?? "";
  const ids = [...new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))].slice(0, MAX_IDS);
  if (ids.length === 0) {
    return NextResponse.json({ skills: [] as SkillselionHit[] });
  }

  const secret = process.env.SKILLSELION_API_SECRET ?? process.env.API_FRONTEND_SECRET;
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(secret ? { "x-frontend-secret": secret } : {}),
  };

  const skills = (await Promise.all(ids.map((id) => fetchOne(id, headers)))).filter(
    (row): row is SkillselionHit => row !== null,
  );
  return NextResponse.json({ skills }, { headers: { "Cache-Control": "public, max-age=300" } });
}
