import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { ledger } from "@/lib/ledger-theme";
import { APD_HOME, STRIPE_BEST_PRACTICES, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pack format and install notes",
  description: "YAML pack format, 6-seat room cap, sidebar sections, connectors, routines, and uninstall for Grok Bot Teams.",
  alternates: { canonical: `${site.url}/docs` },
};

export default function DocsPage() {
  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 pb-20 pt-12">
        <p className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>Docs</p>
        <h1 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05]" style={{ fontFamily: ledger.serif }}>
          Pack format and install notes
        </h1>
        <p className="mt-3 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label }}>
          Verified on <time dateTime={site.verifiedOn}>{site.verifiedOn}</time>
        </p>
        <div className="mt-10 space-y-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          <p>Packs live as markdown in this repo under packs/, with YAML frontmatter. GitHub is the CMS. There are no accounts and no plugin API on this site.</p>
          <p>Required frontmatter keys: slug, name, tagline, seats, section, status, connectors, agents, rooms, routines. skills is optional. status is pack (installable recipe) or example (format demo).</p>
          <p>Grok Bot rooms cap at 6 seats. Packs here stay at or under that cap.</p>
          <p>Sidebar sections are a human action. In Grok Bot, use Move to → New section and name the section exactly as the pack lists it. The installer prompt cannot create sections.</p>
          <p>Connectors are account-wide. A pack lists connectors that must already be on the account. The prompt never claims one-click OAuth.</p>
          <p>Routines need a confirm card. The prompt pings each owner agent; the human confirms. Nothing is saved until that confirm.</p>
          <p>Skills cannot be attached at agent create time. Add them later, if at all. A pack may point at references such as the <a className="accent-hover underline" href={STRIPE_BEST_PRACTICES} rel="nofollow noopener">stripe-best-practices skill on Skillselion</a> or a plugin in the <a className="accent-hover underline" href={APD_HOME} rel="nofollow noopener">Agent Plugins Directory</a>. Named plugins belong on Agent Plugins Directory; link the directory root when a listing path is unconfirmed. Do not cite /plugins/stripe as official Stripe. Those are named destinations the pack expects, not installs this site performs.</p>
          <p>Uninstall is sidebar delete. Remove the agents and rooms in Grok Bot. There is no remote uninstall from grokbotteams.ai.</p>
          <p>Canonical domain grokbotteams.ai. grokbotteam.ai (no s) is a type-in that should 301 when DNS exists. This repo does not buy or configure DNS.</p>
        </div>
        <p className="mt-12 border-t pt-8 text-[0.82rem] leading-relaxed" style={{ borderColor: ledger.hairline, color: ledger.inkMuted }}>
          {site.entity}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
