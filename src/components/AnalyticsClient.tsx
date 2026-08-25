"use client";

import { OpenPanelComponent } from "@openpanel/nextjs";
import { useSyncExternalStore } from "react";

const subscribeToPrivacySetting = () => () => {};

function analyticsAllowed(): boolean {
  return !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
}

export function AnalyticsClient({ clientId }: { clientId: string }) {
  const allowed = useSyncExternalStore(subscribeToPrivacySetting, analyticsAllowed, () => false);

  if (!allowed) return null;
  return <OpenPanelComponent clientId={clientId} trackScreenViews trackOutgoingLinks />;
}
