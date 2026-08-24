import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

export function slugTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function PageJump({ items }: { items: string[] }) {
  return (
    <nav className="doc-toc" aria-label={en.nav.onThisPage}>
      <details className="doc-toc-fold">
        <summary className="doc-toc-sum">{en.nav.onThisPage}</summary>
        <div className="doc-jump">
          {items.map((label) => (
            <a key={label} href={`#${slugTitle(label)}`} className="accent-hover underline underline-offset-2">{label}</a>
          ))}
        </div>
      </details>
    </nav>
  );
}

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
        <WingsHero
          title={title}
          kicker={<Breadcrumb parentHref="/" parentLabel={en.nav.directory} current={title} />}
        >
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
    <section className="mt-8" id={slugTitle(title)}>
      <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{title}</h2>
      <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
        {children}
      </div>
    </section>
  );
}
