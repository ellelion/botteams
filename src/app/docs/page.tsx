import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { ledger } from "@/lib/ledger-theme";
import { APD_HOME, STRIPE_BEST_PRACTICES, XAI_DOCS, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Team spec",
  description: "Ellelion recipe format for Grok Bot company teams. Maps onto official Grok Bot nouns: Bot, group chat, routine, profile. Not an xAI file format.",
  alternates: { canonical: `${site.url}/docs` },
};

export default function DocsPage() {
  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 pb-20 pt-12">
        <p className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>Ellelion recipe</p>
        <h1 className="font-display mt-4 text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05]" style={{ fontFamily: ledger.serif }}>
          Team spec
        </h1>
        <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          This is Ellelion&apos;s recipe format for a company team. It is not an xAI file format. xAI did not author these teams. The YAML below is ours. The nouns it maps onto are official.
        </p>
        <p className="mt-3 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label }}>
          Verified on <time dateTime={site.verifiedOn}>{site.verifiedOn}</time>
        </p>

        <h2 className="mt-14 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Fields</h2>
        <table className="spec-table mt-4">
          <tbody>
            <tr><th><code>name</code></th><td>Team title on the shelf.</td></tr>
            <tr><th><code>tagline</code></th><td>One line for the job of the team.</td></tr>
            <tr><th><code>bots</code></th><td>Count of Bots in the team. Must match the bots list length.</td></tr>
            <tr><th><code>section</code></th><td>Sidebar section name the human creates in Grok Bot.</td></tr>
            <tr><th><code>status</code></th><td><code>pack</code> (installable team) or <code>example</code> (format demo).</td></tr>
            <tr><th><code>connectors</code></th><td>Account-wide connectors this team expects already connected. Union of per-Bot lists.</td></tr>
            <tr><th>Bots list <code>agents</code></th><td>Each Bot: <code>name</code> + <code>persona</code> (the job). Optional <code>icon</code>, <code>connectors</code> (subset of the team list), <code>reuse</code>.</td></tr>
            <tr><th>Group chats <code>rooms</code></th><td>Each group chat: <code>name</code> + <code>members</code> (Bot names). Visible label is Group chat.</td></tr>
            <tr><th><code>routines</code></th><td><code>name</code>, owner Bot, <code>schedule</code>, <code>prompt</code>. A routine is owned by one Bot.</td></tr>
            <tr><th><code>skills</code></th><td>Optional. Named later. Skills cannot be attached at Bot create time.</td></tr>
          </tbody>
        </table>

        <h2 className="mt-14 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Official limits we map to</h2>
        <ul className="mt-4 space-y-3 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          <li>
            <a className="accent-hover underline underline-offset-2" href={XAI_DOCS.overview} rel="nofollow noopener noreferrer">Bot definition</a>: In the Docs and in the Grok Bot app, a Bot = a single persistent, named agent or one AI teammate.
          </li>
          <li>
            A Bot has a name, a job, its own conversation, and working context. Create via New chat, then Create new agent, then Edit Profile (name, title, description, avatar). Cited from the{" "}
            <a className="accent-hover underline underline-offset-2" href={XAI_DOCS.bots} rel="nofollow noopener noreferrer">Bots</a> doc.
          </li>
          <li>
            Group chat is created by selecting{" "}
            <a className="accent-hover underline underline-offset-2" href={XAI_DOCS.chat} rel="nofollow noopener noreferrer">two to six Bots</a>.
          </li>
          <li>
            Account cap: <strong>50 Bots and group chats combined</strong>, from the{" "}
            <a className="accent-hover underline underline-offset-2" href={XAI_DOCS.bots} rel="nofollow noopener noreferrer">Bots</a> doc.
          </li>
          <li>
            A{" "}
            <a className="accent-hover underline underline-offset-2" href={XAI_DOCS.routines} rel="nofollow noopener noreferrer">routine</a>
            {" "}tells one Bot when to run a workflow.
          </li>
        </ul>

        <h2 className="mt-14 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Verified</h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          A team is Verified when its roster fits those published limits: each group chat has at most six Bots (and at least two), the team is honest about account scale (Bots plus group chats stay well under 50), and it never claims fake one-click OAuth. Connectors are listed as already on the account.
        </p>
        <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          Example teams are format demos. They still get Verified-against-limits if they fit, plus an Example label. Installable teams show Installable and Verified.
        </p>

        <h2 className="mt-14 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Install notes</h2>
        <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          <p>A team is one markdown file in this repo under packs/, with YAML frontmatter. GitHub is the CMS. There are no accounts and no plugin API on this site.</p>
          <p>Sidebar sections are a human action. In Grok Bot, use Move to, then New section, and name the section exactly as the team lists it.</p>
          <p>Skills cannot be attached at Bot create time. A team may point at references such as the <a className="accent-hover underline underline-offset-2" href={STRIPE_BEST_PRACTICES} rel="nofollow noopener">stripe-best-practices skill on Skillselion</a> or a plugin in the <a className="accent-hover underline underline-offset-2" href={APD_HOME} rel="nofollow noopener">Agent Plugins Directory</a>. Those are named destinations the team expects, not installs this site performs.</p>
          <p>Uninstall is sidebar delete. Remove the Bots and group chats in Grok Bot. There is no remote uninstall from grokbotteams.ai.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
