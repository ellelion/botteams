import type { ReactNode } from "react";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { ledger } from "@/lib/ledger-theme";
import { site } from "@/lib/site";

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1
      className="font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-normal leading-[1.05] tracking-[-0.03em]"
      style={{ fontFamily: ledger.serif }}
    >
      {children}
    </h1>
  );
}

export function PageShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <WingsSplit
      hero={
        <WingsHero title={title}>
          <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{lead}</p>
          <p className="meta mt-3">
            Updated <time dateTime={site.updatedAt}>{site.updatedAt}</time>
          </p>
        </WingsHero>
      }
    >
      {children}
    </WingsSplit>
  );
}

export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{title}</h2>
      <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
        {children}
      </div>
    </section>
  );
}
