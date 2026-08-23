import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

const MAX_BYTES = 400 * 1024;

export type StoredMark = {
  url: string;
  mediaType: string;
  bytes: Uint8Array;
  svgText?: string;
};

export function markMediaType(file: File): string | null {
  if (ALLOWED[file.type]) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".svg")) return "image/svg+xml";
  return null;
}

export async function storeRailMark(file: File, origin: string): Promise<StoredMark | { error: "image_not_a_mark" | "missing_field" }> {
  if (file.size <= 0) return { error: "missing_field" };
  if (file.size > MAX_BYTES) return { error: "image_not_a_mark" };
  const mediaType = markMediaType(file);
  if (!mediaType) return { error: "image_not_a_mark" };

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = ALLOWED[mediaType];
  const id = randomBytes(12).toString("hex");
  const filename = `${id}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "rail");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);

  const svgText = mediaType === "image/svg+xml" ? new TextDecoder().decode(bytes) : undefined;
  if (svgText && /<script/i.test(svgText)) return { error: "image_not_a_mark" };

  return {
    url: `${origin}/uploads/rail/${filename}`,
    mediaType,
    bytes,
    svgText,
  };
}
