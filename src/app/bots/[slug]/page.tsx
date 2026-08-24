/*
 * A Bot page.
 *
 * Same Ledger chrome as a team, one shape smaller. There is no Verified
 * chip and no group chat block, because a Bot makes neither claim, and
 * Customize locks the roster at one rather than offering to grow a
 * published one-Bot job into a team we invented.
 */
import type { Metadata } from "next";
import { grokRecipeTitle } from "@/lib/grok-names";
import { notFound } from "next/navigation";
import { ConnectorRow } from "@/components/ConnectorRow";
import { WatchControl } from "@/components/ConversationStage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { Customize } from "@/components/team/Customize";
import { ledger } from "@/lib/ledger-theme";
import { renderMarkdown } from "@/lib/markdown";
import { en } from "@/lib/messages/en";
import { getBot, listBots } from "@/lib/teams";
import Link from "next/link";
import { resolveConnector } from "@/lib/connectors";
import { botJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return listBots().map((bot) => ({ slug: bot.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const team = getBot(slug);
  if (!team) return {};
  const title = team.name;
  const description = team.tagline;
  return {
    title,
    description,
    alternates: { canonical: `${site.url}/bots/${team.slug}` },
    openGraph: { title: `${title} · ${site.name}`, description, url: `${site.url}/bots/${team.slug}`, type: "website" },
  };
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function BotPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = getBot(slug);
  if (!team) notFound();
  /* Three neighbours. Category first, but every category currently holds
     exactly one team, so that alone never renders. Fall back to the teams
     sharing the most connectors, which is the more useful question anyway:
     what else would I run with the tools I have already connected. */
  const others = listBots().filter((other) => other.slug !== team.slug);
  const mine = new Set(team.connectors.map((c) => resolveConnector(c).slug));
  const related = [
    ...others.filter((o) => o.section === team.section),
    ...others
      .filter((o) => o.section !== team.section)
      .map((o) => ({ team: o, shared: o.connectors.filter((c) => mine.has(resolveConnector(c).slug)).length }))
      .filter((x) => x.shared > 0)
      .sort((a, b) => b.shared - a.shared || a.team.name.localeCompare(b.team.name))
      .map((x) => x.team),
  ].slice(0, 3);

  const relatedNode = related.length > 0 ? (
    <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
      <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
        {en.bot.relatedTitle}
      </h2>
      <ul className="mt-4">
        {related.map((other) => (
          <li key={other.slug} className="hairline-row py-3">
            <Link href={`/bots/${other.slug}`} className="accent-hover" style={{ fontFamily: ledger.serif }}>
              {grokRecipeTitle(other.kind, other.name)}
            </Link>
            <p className="mt-1 text-[0.8rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{other.tagline}</p>
            <div className="mt-2">
              <ConnectorRow names={other.connectors} labeled size={15} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  ) : null;

  return (
    <WingsSplit
      hero={
        <WingsHero
          title={grokRecipeTitle(team.kind, team.name)}
          kicker={<Breadcrumb parentHref="/?kind=bot" parentLabel={en.bot.allBots} current={team.name} />}
        >
          <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{team.tagline}</p>
          <WatchControl team={team} />
        </WingsHero>
      }
    >
    <>
      <JsonLd data={botJsonLd(team)} />
      <div className="rp-main">
        <Customize
          team={team}
          related={relatedNode}
        >
          {team.body ? (
            <article
              className="team-prose mt-10 border-t pt-8 text-[0.95rem] leading-relaxed"
              style={{ color: ledger.inkSoft }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(team.body) }}
            />
          ) : null}

          {team.contributor || team.scoutedBy ? (
            <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
              <p className="text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
                {team.addedVia ? (
                  <>
                    {en.team.basedOn}{" "}
                    <a className="rp-secondary" href={team.addedVia} target="_blank" rel="noopener noreferrer">
                      {team.contributor}
                    </a>
                  </>
                ) : team.contributor ? (
                  <>
                    {en.team.contributedBy}{" "}
                    <a className="rp-secondary" href={team.contributorUrl} target="_blank" rel="noopener noreferrer">
                      {team.contributor}
                    </a>
                  </>
                ) : null}
                {team.scoutedBy ? <> · {en.team.scoutedBy} {team.scoutedBy}</> : null}
              </p>
            </section>
          ) : null}
          <section className="run-bar">
            <div className="run-bar-copy">
              <h2>{en.team.runName(team.name)}</h2>
              <p>{en.team.runYourselfBody}</p>
            </div>
            <div className="run-bar-act">
              <a
                className="rp-secondary"
                href={`${site.github}/blob/main/bots/${team.slug}.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {en.team.viewSource}
              </a>
            </div>
          </section>
        </Customize>

      </div>
    </>
    </WingsSplit>
  );
}
