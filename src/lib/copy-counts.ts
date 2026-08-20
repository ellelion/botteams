import fs from "node:fs";
import path from "node:path";

export type CopyCounts = { total: number; bySlug: Record<string, number> };

const FILE = path.join(process.cwd(), "data", "copy-counts.json");

function empty(): CopyCounts {
  return { total: 0, bySlug: {} };
}

export function readCopyCounts(): CopyCounts {
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf8")) as CopyCounts;
    if (!raw || typeof raw.total !== "number" || typeof raw.bySlug !== "object") return empty();
    return { total: raw.total, bySlug: raw.bySlug ?? {} };
  } catch {
    return empty();
  }
}

export function incrementCopy(slug: string): CopyCounts {
  const counts = readCopyCounts();
  counts.bySlug[slug] = (counts.bySlug[slug] ?? 0) + 1;
  counts.total = Object.values(counts.bySlug).reduce((sum, n) => sum + n, 0);
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(counts, null, 2) + "\n");
  return counts;
}
