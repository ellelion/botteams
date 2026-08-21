import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { ledger } from "@/lib/ledger-theme";
import { site } from "@/lib/site";

/*
 * The chrome every short prose page shares: masthead, one measure of
 * text, the company footer. About, Terms and Privacy are one system, so
 * they are one component rather than three copies that drift.
 */
export function PageShell({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <div className="page-pad relative flex min-h-dvh flex-col" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="wrap-prose relative z-10 flex-1 pb-[var(--sec-y)] pt-12">
        <p className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>{eyebrow}</p>
        <h1
          className="font-display mt-4 text-[clamp(2.1rem,4.2vw,3.4rem)] font-normal leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: ledger.serif }}
        >
          {title}
        </h1>
        <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{lead}</p>
        <p className="mt-3 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label }}>
          Updated <time dateTime={site.updatedAt}>{site.updatedAt}</time>
        </p>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

/** One prose block under a small label. */
export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-20">
      <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{title}</h2>
      <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
        {children}
      </div>
    </section>
  );
}
