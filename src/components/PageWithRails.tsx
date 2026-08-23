import { Suspense, type ReactNode } from "react";
import { SponsorRail } from "@/components/SponsorRail";
import { SponsorTicker } from "@/components/SponsorTicker";
import type { Campaign } from "@/data/sponsors";

export function PageWithRails({
  children,
  campaign = "rail",
}: {
  children: ReactNode;
  campaign?: Campaign;
}) {
  return (
    <div className="page-rails">
      <div className="page-rails-main">
        {children}
        <SponsorTicker campaign={campaign} place="bottom" />
      </div>
      <Suspense fallback={null}>
        <SponsorRail campaign={campaign} side="right" />
      </Suspense>
    </div>
  );
}
