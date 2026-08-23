import { type ReactNode } from "react";
import { WingsVideo } from "@/components/home/WingsVideo";
import { PageWithRails } from "@/components/PageWithRails";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { ledger } from "@/lib/ledger-theme";

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="page-pad relative flex min-h-dvh flex-col" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <PageWithRails>
        <div className="relative flex min-h-0 flex-1 flex-col">
          <main className="home-split relative z-10 grid flex-1 grid-cols-1 items-start gap-3 overflow-x-clip overflow-y-visible lg:gap-6 lg:overflow-clip">
            <div className="wings-persist pointer-events-none absolute inset-x-0 top-0 z-0 h-[32vh] min-h-0 w-full lg:static lg:col-start-1 lg:row-start-1 lg:row-span-1 lg:row-end-2 lg:h-0 lg:min-h-0 lg:sticky lg:top-[var(--masthead-h)] lg:pr-10" aria-hidden>
              <div className="relative h-full w-full lg:h-[calc(100dvh-var(--masthead-h))]">
                <WingsVideo variant="wings-video--altar" />
              </div>
            </div>
            {children}
          </main>
        </div>
      </PageWithRails>
      <SiteFooter />
    </div>
  );
}
