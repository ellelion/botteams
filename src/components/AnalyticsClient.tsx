"use client";

import { OpenPanelComponent } from "@openpanel/nextjs";
import { useSyncExternalStore } from "react";

const subscribeToPrivacySetting = () => () => {};

function analyticsAllowed(): boolean {
  return !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
}

export function AnalyticsClient({ clientId, apiUrl }: { clientId: string; apiUrl: string }) {
  const allowed = useSyncExternalStore(subscribeToPrivacySetting, analyticsAllowed, () => false);

  if (!allowed) return null;
  return (
    <OpenPanelComponent
      clientId={clientId}
      apiUrl={apiUrl}
      trackScreenViews
      trackOutgoingLinks
    />
  );
}
