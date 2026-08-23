import { OpenPanelComponent } from "@openpanel/nextjs";

/*
 * Cookieless OpenPanel. Renders nothing without NEXT_PUBLIC_OPENPANEL_CLIENT_ID
 * so local forks stay silent. Do not add a cookie-writing tracker here.
 */
export function Analytics() {
  const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;
  if (!clientId) return null;

  return <OpenPanelComponent clientId={clientId} trackScreenViews trackOutgoingLinks />;
}
