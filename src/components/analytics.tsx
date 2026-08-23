import { AnalyticsClient } from "@/components/AnalyticsClient";

/*
 * Cookieless OpenPanel, gated on Global Privacy Control. Renders nothing
 * without NEXT_PUBLIC_OPENPANEL_CLIENT_ID so local forks stay silent.
 */
export function Analytics() {
  const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;
  if (!clientId) return null;
  return <AnalyticsClient clientId={clientId} />;
}
