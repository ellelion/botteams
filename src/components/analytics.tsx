import { AnalyticsClient } from "@/components/AnalyticsClient";

/*
 * Cookieless OpenPanel, gated on Global Privacy Control. Renders nothing
 * without NEXT_PUBLIC_OPENPANEL_CLIENT_ID so local forks stay silent.
 */
// Self-hosted OpenPanel since 2026-08-31. Keep in step with connect-src in
// next.config.ts, which must allow this origin or the beacon is blocked
// silently.
const apiUrl =
  process.env.NEXT_PUBLIC_OPENPANEL_API_URL ?? "https://analytics.ellelion.com/api";

export function Analytics() {
  const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;
  if (!clientId) return null;
  return <AnalyticsClient clientId={clientId} apiUrl={apiUrl} />;
}
