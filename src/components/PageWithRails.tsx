import { Suspense, type ReactNode } from "react";
import { SponsorRail } from "@/components/SponsorRail";
import { SponsorTicker } from "@/components/SponsorTicker";
import type { Campaign } from "@/data/sponsors";
import { getListingChrome } from "@/lib/rail-inventory";

async function ListingTicker({ campaign }: { campaign: Campaign }) {
  const filled = await getListingChrome();
  if (filled.length === 0) return null;
  return <SponsorTicker campaign={campaign} slots={filled} place="bottom" />;
}

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
        <Suspense fallback={null}>
          <ListingTicker campaign={campaign} />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <SponsorRail campaign={campaign} side="right" />
      </Suspense>
    </div>
  );
}
