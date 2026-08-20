import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { incrementCopy, readCopyCounts } from "@/lib/copy-counts";

function knownSlug(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "packs", slug + ".md"));
}

export async function GET() {
  return NextResponse.json(readCopyCounts());
}

export async function POST(request: Request) {
  let slug = "";
  try {
    const body = (await request.json()) as { slug?: unknown };
    if (typeof body.slug === "string") slug = body.slug.trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(slug) || !knownSlug(slug)) {
    return NextResponse.json({ error: "Unknown pack" }, { status: 400 });
  }
  const counts = incrementCopy(slug);
  return NextResponse.json({ slug, count: counts.bySlug[slug] ?? 0, total: counts.total, bySlug: counts.bySlug });
}
