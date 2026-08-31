import type { Metadata } from "next";
import { grokRecipeTitle } from "@/lib/grok-names";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { Customize } from "@/components/team/Customize";
import { RelatedRecipes } from "@/components/team/RelatedRecipes";
import { WatchControl } from "@/components/ConversationStage";
import { VerifiedChip } from "@/components/VerifiedChip";
import { RosterShape } from "@/components/RosterShape";
import { ledger } from "@/lib/ledger-theme";
import { renderMarkdown } from "@/lib/markdown";
import { en } from "@/lib/messages/en";
import { getTeam, listTeams } from "@/lib/teams";
import { isVerified } from "@/lib/types";
import { resolveConnector } from "@/lib/connectors";
import { teamJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { recipeOgUrl } from "@/lib/x-mentions/markdown";

/* Prerendered. Next defaults these to on-demand rendering even though
   they read nothing per-request, which makes the origin answer
   `no-store` and leaves the CDN unable to cache any page. */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return listTeams().map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeam(slug);
  if (!team) return {};
  const title = team.name;
  const description = team.tagline;
  const image = recipeOgUrl(team);
  return {
    title,
    description,
    alternates: { canonical: `${site.url}/teams/${team.slug}` },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: `${site.url}/teams/${team.slug}`,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${team.name}: ${team.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description,
      images: [image],
    },
  };
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = getTeam(slug);
  if (!team) notFound();
  /* Three neighbours. Category first, but every category currently holds
     exactly one team, so that alone never renders. Fall back to the teams
     sharing the most connectors, which is the more useful question anyway:
     what else would I run with the tools I have already connected. */
  const others = listTeams().filter((other) => other.slug !== team.slug);
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

  const relatedNode = (
    <RelatedRecipes
      title={en.team.relatedTitle()}
      items={related}
      hrefFor={(other) => `/teams/${other.slug}`}
    />
  );

  return (
    <WingsSplit
      hero={
        <WingsHero
          title={grokRecipeTitle(team.kind, team.name)}
          kicker={<Breadcrumb parentHref="/" parentLabel={en.team.allTeams} current={team.name} />}
        >
          <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{team.tagline}</p>
          {team.kind === "team" ? (
            <div className="wings-hero-extra mt-4 flex flex-col items-center gap-3">
              <VerifiedChip on={isVerified(team)} />
              <RosterShape bots={team.bots} rooms={team.rooms.length} routines={team.routines} />
            </div>
          ) : null}
          <WatchControl team={team} />
        </WingsHero>
      }
    >
    <>
      <JsonLd data={teamJsonLd(team)} />
      <div className="rp-main">
        <Customize
          team={team}
          related={relatedNode}
        >
          <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
            <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.team.section}</h2>
            <p className="mt-3">{team.section}</p>
          </section>

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
                    <a className="accent-hover underline" href={team.addedVia} target="_blank" rel="noopener noreferrer" aria-label={`${team.contributor}. ${en.nav.opensNew}`}>
                      {team.contributor}
                    </a>
                  </>
                ) : team.contributor ? (
                  <>
                    {en.team.contributedBy}{" "}
                    <a className="accent-hover underline" href={team.contributorUrl} target="_blank" rel="noopener noreferrer" aria-label={`${team.contributor}. ${en.nav.opensNew}`}>
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
                href={`${site.github}/blob/main/teams/${team.slug}.md`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${en.team.viewSource}. ${en.nav.opensNew}`}
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
