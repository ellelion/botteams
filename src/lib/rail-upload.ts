import { randomBytes } from "node:crypto";
import { del, put } from "@vercel/blob";

const MAX_BYTES = 400 * 1024;

export type SupportedMark = {
  bytes: Uint8Array;
  mediaType: "image/png" | "image/jpeg" | "image/webp";
  extension: "png" | "jpg" | "webp";
};

type MarkError = { error: "image_not_a_mark" | "missing_field" };

function hasPrefix(bytes: Uint8Array, prefix: readonly number[]): boolean {
  return prefix.every((value, index) => bytes[index] === value);
}

export function detectMarkType(bytes: Uint8Array): Pick<SupportedMark, "mediaType" | "extension"> | null {
  if (bytes.length >= 8 && hasPrefix(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mediaType: "image/png", extension: "png" };
  }
  if (bytes.length >= 3 && hasPrefix(bytes, [0xff, 0xd8, 0xff])) {
    return { mediaType: "image/jpeg", extension: "jpg" };
  }
  if (
    bytes.length >= 12 &&
    hasPrefix(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    hasPrefix(bytes.slice(8), [0x57, 0x45, 0x42, 0x50])
  ) {
    return { mediaType: "image/webp", extension: "webp" };
  }
  return null;
}

export async function validateRailMark(file: File): Promise<SupportedMark | MarkError> {
  if (file.size <= 0) return { error: "missing_field" };
  if (file.size > MAX_BYTES) return { error: "image_not_a_mark" };

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = detectMarkType(bytes);
  if (!detected) return { error: "image_not_a_mark" };

  // A declared type may be absent, but it may not contradict the bytes.
  if (file.type && file.type !== detected.mediaType) return { error: "image_not_a_mark" };
  return { bytes, ...detected };
}

export async function storeRailMark(mark: SupportedMark): Promise<string> {
  const id = randomBytes(12).toString("hex");
  const blob = await put(`rail/${id}.${mark.extension}`, Buffer.from(mark.bytes), {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
    contentType: mark.mediaType,
  });
  return blob.url;
}

export async function deleteRailMark(url: string): Promise<void> {
  await del(url);
}
