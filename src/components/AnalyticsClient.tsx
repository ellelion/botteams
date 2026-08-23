"use client";

import { OpenPanelComponent } from "@openpanel/nextjs";
import { useEffect, useState } from "react";

export function AnalyticsClient({ clientId }: { clientId: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
    if (gpc) return;
    setAllowed(true);
  }, []);

  if (!allowed) return null;
  return <OpenPanelComponent clientId={clientId} trackScreenViews trackOutgoingLinks />;
}
