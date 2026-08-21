import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConnectorRow } from "@/components/ConnectorRow";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { TeamIcon } from "@/components/icons/LineIcons";
import { FromXaiChip } from "@/components/FromXaiChip";
import { Customize } from "@/components/team/Customize";
import { ledger } from "@/lib/ledger-theme";
import { renderMarkdown } from "@/lib/markdown";
import { en } from "@/lib/messages/en";
import { getTeam, listTeams } from "@/lib/teams";
import Link from "next/link";
import { sectionSlug } from "@/lib/bot-icon";
import { resolveConnector } from "@/lib/connectors";
import { SponsorRail } from "@/components/SponsorRail";
import { teamJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return listTeams().map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeam(slug);
  if (!team) return {};
  const title = team.name;
  const description = team.tagline;
  return {
    title,
    description,
    alternates: { canonical: `${site.url}/teams/${team.slug}` },
    openGraph: { title: `${title} · ${site.name}`, description, url: `${site.url}/teams/${team.slug}`, type: "website" },
  };
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = getTeam(slug);
  if (!team) notFound();
  // Several teams name themselves after their sidebar section ("Bookkeeping",
  // "Partnerships"). Printing both gives the page a stuttered
  // "Partnerships / PARTNERSHIPS · 6 BOTS". Show the section only when it adds a word.
  const sectionEchoesName = team.section.trim().toLowerCase() === team.name.trim().toLowerCase();
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
  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <JsonLd data={teamJsonLd(team)} />
      <SiteMasthead />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 pb-20 pt-12">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label }} aria-label="Breadcrumb">
          <Link href="/#teams" className="accent-hover">{en.team.allTeams}</Link>
          <span aria-hidden>/</span>
          <Link href={`/?category=${sectionSlug(team.section)}#teams`} className="accent-hover">{team.section}</Link>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <TeamIcon slug={team.slug} />
          {team.fromXai ? <FromXaiChip /> : null}
        </div>
        <h1 className="font-display mt-4 text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05]" style={{ fontFamily: ledger.serif }}>
          {team.name}
        </h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          {team.tagline}
        </p>
        <p className="mt-3 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label }}>
          {sectionEchoesName ? en.team.botCount(team.bots) : `${team.section} · ${en.team.botCount(team.bots)}`}
        </p>
        {team.fromXai ? (
          <p className="mt-3 max-w-2xl text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            {en.xai.note}
          </p>
        ) : null}

        <Customize team={team}>
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
                    <a className="accent-hover underline" href={team.addedVia} target="_blank" rel="noopener noreferrer">
                      {team.contributor}
                    </a>
                  </>
                ) : team.contributor ? (
                  <>
                    {en.team.contributedBy}{" "}
                    <a className="accent-hover underline" href={team.contributorUrl} target="_blank" rel="noopener noreferrer">
                      {team.contributor}
                    </a>
                  </>
                ) : null}
                {team.scoutedBy ? <> · {en.team.scoutedBy} {team.scoutedBy}</> : null}
              </p>
            </section>
          ) : null}
        </Customize>

        <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.team.runYourself}</h2>
          <p className="mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{en.team.runYourselfBody}</p>
          <p className="mt-4 text-[0.8rem]">
            <a
              className="accent-hover underline"
              href={`${site.github}/blob/main/teams/${team.slug}.md`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {en.team.viewSource}
            </a>
          </p>
        </section>

        {related.length > 0 ? (
          <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
            <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
              {en.team.relatedTitle()}
            </h2>
            <ul className="mt-4">
              {related.map((other) => (
                <li key={other.slug} className="hairline-row py-3">
                  <Link href={`/teams/${other.slug}`} className="accent-hover" style={{ fontFamily: ledger.serif }}>
                    {other.name}
                  </Link>
                  <p className="mt-1 text-[0.8rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{other.tagline}</p>
                  <div className="mt-2">
                    <ConnectorRow names={other.connectors} labeled size={15} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <SponsorRail campaign="team-page" />
      </main>
      <SiteFooter />
    </div>
  );
}
