import { timingSafeEqual } from "node:crypto";
import { runMentionWorker } from "@/lib/x-mentions/worker";

export const maxDuration = 300;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  if (!secret || !header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const summary = await runMentionWorker();
    return Response.json({ ok: true, ...summary });
  } catch (error) {
    console.error("[x-mentions] worker failed", error);
    return Response.json({ error: "Mention worker failed" }, { status: 500 });
  }
}
