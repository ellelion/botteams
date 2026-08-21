import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { ledger } from "@/lib/ledger-theme";
import { APD_HOME, STRIPE_BEST_PRACTICES, XAI_DOCS, XAI_USE_CASE_GALLERY, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Team spec",
  description: "Ellelion recipe format for Grok Bot company teams. Maps onto the Grok Bot nouns xAI documents: Bot, group chat, routine, profile. Not an xAI file format.",
  alternates: { canonical: `${site.url}/docs` },
};

export default function DocsPage() {
  return (
    <div className="page-pad relative flex min-h-dvh flex-col" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="wrap-prose relative z-10 flex-1 pb-[var(--sec-y)] pt-12">
        <p className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>Ellelion recipe</p>
        <h1 className="font-display mt-4 text-[clamp(2.1rem,4.2vw,3.4rem)] font-normal tracking-[-0.03em] leading-[1.05]" style={{ fontFamily: ledger.serif }}>
          Team spec
        </h1>
        <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          This is Ellelion&apos;s recipe format for a company team. It is not an xAI file format. xAI did not author these teams. The YAML below is ours. The nouns it maps onto are xAI&apos;s, documented by them.
        </p>
        <p className="mt-3 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label }}>
          Verified on <time dateTime={site.verifiedOn}>{site.verifiedOn}</time>
        </p>

        <h2 className="mt-20 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Fields</h2>
        <table className="spec-table mt-4">
          <tbody>
            <tr><th><code>name</code></th><td>Team title on the shelf.</td></tr>
            <tr><th><code>tagline</code></th><td>One line for the job of the team.</td></tr>
            <tr><th><code>bots</code></th><td>Count of Bots in the team. Must match the bots list length.</td></tr>
            <tr><th><code>section</code></th><td>Sidebar section name the human creates in Grok Bot.</td></tr>
            <tr><th><code>status</code></th><td><code>team</code> (installable team) or <code>example</code> (format demo).</td></tr>
            <tr><th><code>connectors</code></th><td>Account-wide connectors this team expects already connected. Union of per-Bot lists.</td></tr>
            <tr><th>Bots list <code>agents</code></th><td>Each Bot: <code>name</code> + <code>persona</code> (the job). Optional <code>icon</code>, <code>connectors</code> (subset of the team list), <code>reuse</code>.</td></tr>
            <tr><th>Group chats <code>rooms</code></th><td>Each group chat: <code>name</code> + <code>members</code> (Bot names). Visible label is Group chat.</td></tr>
            <tr><th><code>routines</code></th><td><code>name</code>, owner Bot, <code>schedule</code>, <code>prompt</code>. A routine is owned by one Bot.</td></tr>
            <tr><th><code>skills</code></th><td>Optional. Named later. Skills cannot be attached at Bot create time.</td></tr>
          </tbody>
        </table>

        <h2 className="mt-20 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Published limits we map to</h2>
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
            {" "}tells one Bot when to run a workflow. One Bot can own <strong>up to 50 routines</strong>, and Grok Bot keeps the
            20 most recent runs of each. There is no documented cap on a team as a whole, so this shelf does not invent one.
          </li>
        </ul>

        <h2 className="mt-20 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Two shapes</h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          A <strong>bot</strong> is one Bot doing one job. A <strong>team</strong> is two to six Bots in one group chat. They
          are different files in different folders, and the shelf never adds them up into a single count, because a recipe
          with no group chat is not a team.
        </p>
        <table className="spec-table mt-5">
          <tbody>
            <tr><th /><th>bots/</th><th>teams/</th></tr>
            <tr><th><code>kind</code></th><td><code>bot</code></td><td><code>team</code></td></tr>
            <tr><th><code>bots</code></th><td>Always 1</td><td>2 to 6, matching <code>agents</code></td></tr>
            <tr><th><code>agents</code></th><td>Exactly one</td><td>One per Bot</td></tr>
            <tr><th><code>rooms</code></th><td>Forbidden. Empty or absent</td><td>Required. Each holds 2 to 6 Bots</td></tr>
            <tr><th><code>routines</code></th><td>0 to 50 per owning Bot</td><td>0 to 50 per owning Bot</td></tr>
            <tr><th>Verified</th><td>Never</td><td>When the roster fits the limits</td></tr>
            <tr><th>URL</th><td><code>/bots/&lt;slug&gt;</code></td><td><code>/teams/&lt;slug&gt;</code></td></tr>
          </tbody>
        </table>

        <h2 className="mt-20 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>From xAI</h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          A <strong>From xAI</strong> chip means the job is our write-up of one xAI publishes in its{" "}
          <a className="accent-hover underline underline-offset-2" href={XAI_USE_CASE_GALLERY} rel="nofollow noopener noreferrer">Grok Bot use-case gallery</a>.
          It is sourcing and nothing more. It is not a certification, it is not Verified, and xAI does not review, endorse, or
          endorse anything on this shelf. The title and the category are theirs. The Bot, the connectors, the modes and the
          standing instructions are ours.
        </p>

        <h2 className="mt-20 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Verified</h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          Verified exists for teams only. A team is Verified when it has at least one group chat, every group chat holds two
          to six Bots, the Bot count matches the roster, and Bots plus group chats stay under the account cap of 50.
        </p>
        <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          A bot is never Verified. That is not a downgrade: Verified is a claim about a group chat, and a recipe with one
          Bot does not make one. An empty roster used to slip past this check, which is how 56 one-Bot recipes were once
          counted as teams.
        </p>

        <h2 className="mt-20 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Install notes</h2>
        <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          <p>A team is one markdown file under teams/, and a bot is one under bots/, both with YAML frontmatter. GitHub is the CMS. There are no accounts and no connector API on this site.</p>
          <p>A bot installer creates one Bot and its routines. It never asks for a group chat or a sidebar section, because neither means anything for a single Bot.</p>
          <p>Sidebar sections are a human action. In Grok Bot, use Move to, then New section, and name the section exactly as the team lists it.</p>
          <p>Skills cannot be attached at Bot create time. A team may point at references such as the <a className="accent-hover underline underline-offset-2" href={STRIPE_BEST_PRACTICES} rel="nofollow noopener">stripe-best-practices skill on Skillselion</a> or a plugin in the <a className="accent-hover underline underline-offset-2" href={APD_HOME} rel="nofollow noopener">Agent Plugins Directory</a>. Those are named destinations the team expects, not installs this site performs.</p>
          <p>Uninstall is sidebar delete. Remove the Bots and group chats in Grok Bot. There is no remote uninstall from grokbotteams.ai.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
