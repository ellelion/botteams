import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { ledger } from "@/lib/ledger-theme";
import { DEFAULT_LIMIT, MAX_LIMIT } from "@/lib/api-teams";
import { PARAMS } from "@/lib/openapi";
import { listTeams } from "@/lib/teams";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "API",
  description:
    "Public read-only JSON API for the Grok Bot Teams shelf. No key, no auth, CORS open. Filter, paginate, or sync the whole catalog.",
  alternates: { canonical: `${site.url}/api` },
};

/*
 * This page is the contract, and it renders entirely on the server. A bot
 * handed this URL should be able to read every endpoint, parameter, and
 * response shape without running a line of JavaScript.
 */
export default function ApiDocsPage() {
  const total = listTeams().length;
  const base = site.url;


  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 pb-20 pt-12">
        <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]" style={{ fontFamily: ledger.serif }}>
          API
        </h1>
        <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          Every team on this shelf is readable as JSON. No key, no account, no rate limit worth mentioning. CORS is open,
          so a browser or an agent can call it directly. {total} teams today.
        </p>
        <p className="mt-4 text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
          A team is a recipe, not a bot: named Bots, one group chat, standing routines, and the connectors the account
          needs first. The installer prompt ships in the payload, so a client never has to scrape this site to get it.
        </p>

        <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Endpoints</h2>
          <dl className="mt-4">
            {[
              ["GET /api/teams", "Filtered and paginated. The endpoint you want in almost every case."],
              ["GET /openapi.json", "The same contract as OpenAPI 3.1, built from the types the route returns."],
            ].map(([route, note]) => (
              <div key={route} className="hairline-row py-3">
                <dt className="text-[0.82rem]" style={{ fontFamily: ledger.mono, color: ledger.ink }}>{route}</dt>
                <dd className="mt-1 text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{note}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[0.8rem] leading-relaxed" style={{ color: ledger.inkFaint }}>
            There is no per-team endpoint. <code style={{ fontFamily: ledger.mono }}>/api/teams/&lt;slug&gt;</code> returns 404 by
            design. Filter the collection instead.
          </p>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Machine contract</h2>
          <p className="mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            OpenAPI 3.1, generated from the same types this endpoint returns rather than written alongside them, so it
            cannot drift from the response. Defaults on this page and in the document come from one list.
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8rem]">
            <a className="accent-hover underline" href="/openapi.json">Download OpenAPI 3.1 (JSON)</a>
            <a className="accent-hover underline" href="/openapi.yaml">YAML</a>
          </p>
          <p className="mt-3 text-[0.8rem] leading-relaxed" style={{ color: ledger.inkFaint }}>
            Default limit {DEFAULT_LIMIT}, maximum {MAX_LIMIT}. Values outside the range clamp rather than error.
          </p>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Parameters</h2>
          <table className="spec-table mt-4">
            <tbody>
              {/* Read from the same list the OpenAPI document is built
                  from, so this table cannot describe a parameter the spec
                  does not, or miss one it does. */}
              {PARAMS.map((p) => (
                <tr key={p.name}>
                  <th><code>{p.name}</code></th>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Examples</h2>
          <pre className="installer-prompt mt-4 overflow-x-auto p-4 text-[0.72rem] leading-relaxed" style={{ fontFamily: ledger.mono }}>
            <code>{[
              `# five teams that expect Stripe`,
              `curl "${base}/api/teams?integration=Stripe&limit=5"`,
              ``,
              `# search, alphabetical`,
              `curl "${base}/api/teams?q=inbox&sort=name"`,
              ``,
              `# one category`,
              `curl "${base}/api/teams?category=Engineering"`,
              ``,
              `# every team, one page`,
              `curl "${base}/api/teams?limit=100"`,
            ].join("\n")}</code>
          </pre>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Sync</h2>
          <p className="mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            Cursor mode walks oldest first, so a team added after your last sync always lands after your cursor. A page
            never shifts underneath you. Start at <code style={{ fontFamily: ledger.mono }}>cursor=start</code>, store{" "}
            <code style={{ fontFamily: ledger.mono }}>sync.nextCursor</code>, and keep the same filters on every call.
          </p>
          <pre className="installer-prompt mt-4 overflow-x-auto p-4 text-[0.72rem] leading-relaxed" style={{ fontFamily: ledger.mono }}>
            <code>{[
              `curl "${base}/api/teams?cursor=start&limit=100"`,
              ``,
              `{`,
              `  "version": 1,`,
              `  "teams": [ ... ],`,
              `  "sync": { "returned": 26, "hasMore": false, "nextCursor": null },`,
              `  "filters": { "q": null, "category": null, "integration": null, "sort": "oldest" },`,
              `  "links": { "self": "...", "next": null, "previous": null }`,
              `}`,
            ].join("\n")}</code>
          </pre>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Team shape</h2>
          <pre className="installer-prompt mt-4 overflow-x-auto p-4 text-[0.72rem] leading-relaxed" style={{ fontFamily: ledger.mono }}>
            <code>{[
              `{`,
              `  "slug": "founder-os",`,
              `  "name": "Founder OS",`,
              `  "tagline": "Money, inbox, and a chief of staff in one founder room.",`,
              `  "category": "Founder OS",`,
              `  "status": "team",`,
              `  "bots": 3,`,
              `  "addedAt": "2026-08-21T03:57:51.000Z",`,
              `  "connectors": ["Stripe", "Gmail", "Calendar", "Ramp", "Notion"],`,
              `  "agents":   [{ "name": "...", "persona": "...", "connectors": [...] }],`,
              `  "rooms":    [{ "name": "Founder HQ", "members": [...] }],`,
              `  "routines": [{ "name": "...", "owner": "...", "schedule": "...", "prompt": "..." }],`,
              `  "installer": "# Grok Bot Teams installer ...",`,
              `  "contributor": null,`,
              `  "contributorUrl": null,`,
              `  "scoutedBy": null,`,
              `  "sourceUrl": null,`,
              `  "url": null,`,
              `  "detailUrl": "${base}/teams/founder-os"`,
              `}`,
            ].join("\n")}</code>
          </pre>
          <p className="mt-4 text-[0.8rem] leading-relaxed" style={{ color: ledger.inkFaint }}>
            <code style={{ fontFamily: ledger.mono }}>addedAt</code> is the date stated in the team file and nothing else.
            It is never inferred and never invented. A file that does not state one reports null and sorts last.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
