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
/*
 * The page title, everywhere. Same clamp, same weight, same tracking,
 * and always the first thing inside <main>, so the H1 lands on the same
 * line whichever page you arrived from. Pages used to differ in both
 * size and offset, and an eyebrow above the H1 on some of them pushed
 * the heading down by a line on those pages only.
 */
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
    <div className="page-pad relative flex min-h-dvh flex-col" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="wrap-prose relative z-10 flex-1 pb-[var(--sec-y)] pt-12">
        <PageTitle>{title}</PageTitle>
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
