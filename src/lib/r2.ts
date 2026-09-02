// Object storage on Cloudflare R2, behind https://cdn.ellelion.com.
//
// Replaces @vercel/blob (removed 2026-09-02). Two reasons here, not one: Blob is
// billed separately from the Vercel projects and survives deleting them, AND
// botteams' BLOB_READ_WRITE_TOKEN pointed at a store that no longer existed —
// the Blob API answered "store_not_found", so storeRailMark would have thrown on
// the first rail purchase. Nothing surfaced it because nobody had bought a rail
// slot yet: the same shape of latent break as the Neon driver bug.
//
// Shared bucket with launchelion; keys are namespaced by prefix ("rail/" here).
//
// Public reads do NOT come through here — they go straight to cdn.ellelion.com,
// which is the bucket's custom domain. These credentials are write-side only and
// are scoped to this one bucket.

import { randomBytes } from "node:crypto";
import { PutObjectCommand, DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";

const PUBLIC_BASE = (process.env.R2_PUBLIC_BASE ?? "https://cdn.ellelion.com").replace(/\/$/, "");
const BUCKET = process.env.R2_BUCKET ?? "ellelion-assets";

let client: S3Client | null = null;

function s3(): S3Client {
  if (!client) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error("R2 is not configured (R2_ACCOUNT_ID / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY)");
    }
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

/** True when R2 credentials are present. Lets callers 503 instead of crashing. */
export function isR2Configured(): boolean {
  return Boolean(process.env.R2_ACCOUNT_ID && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}

/** The public URL for a key. Each path segment is encoded; "/" stays literal. */
export function publicUrl(key: string): string {
  return `${PUBLIC_BASE}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

/** True if a URL points at our own asset host — the check callers use to refuse foreign URLs. */
export function isOwnAssetUrl(url: string): boolean {
  try {
    return new URL(url).origin === new URL(PUBLIC_BASE).origin;
  } catch {
    return false;
  }
}

/**
 * Upload bytes and return the public URL.
 *
 * `pathname` is a desired key like "listings/acme.png". With addRandomSuffix the
 * stem gains a random token before the extension, matching Blob's old shape so
 * existing and new URLs are indistinguishable.
 */
export async function put(
  pathname: string,
  body: Buffer,
  opts: { contentType: string; addRandomSuffix?: boolean },
): Promise<{ url: string; key: string }> {
  let key = pathname.replace(/^\/+/, "");
  if (opts.addRandomSuffix !== false) {
    const dot = key.lastIndexOf(".");
    const suffix = randomBytes(15).toString("base64url").slice(0, 20);
    key = dot > 0 ? `${key.slice(0, dot)}-${suffix}${key.slice(dot)}` : `${key}-${suffix}`;
  }
  await s3().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: opts.contentType,
      // Immutable: every key carries a random suffix, so a URL's bytes never change.
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return { url: publicUrl(key), key };
}

/**
 * Delete by public URL. Ignores URLs that are not ours rather than throwing —
 * callers pass whatever a record happened to hold, including legacy values.
 */
export async function del(urls: string | string[]): Promise<void> {
  const list = (Array.isArray(urls) ? urls : [urls]).filter(isOwnAssetUrl);
  if (list.length === 0) return;
  const keys = list.map((u) => decodeURIComponent(new URL(u).pathname.replace(/^\/+/, "")));
  await s3().send(
    new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: keys.map((Key) => ({ Key })) } }),
  );
}
