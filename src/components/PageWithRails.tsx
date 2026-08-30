import { Suspense, type ReactNode } from "react";
import { SponsorRail } from "@/components/SponsorRail";
import { SponsorTicker } from "@/components/SponsorTicker";
import type { Campaign } from "@/data/sponsors";
import { SPONSORSHIPS } from "@/lib/flags";

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
        {SPONSORSHIPS ? <SponsorTicker campaign={campaign} place="bottom" /> : null}
      </div>
      {SPONSORSHIPS ? (
        <Suspense fallback={null}>
          <SponsorRail campaign={campaign} side="right" />
        </Suspense>
      ) : null}
    </div>
  );
}
