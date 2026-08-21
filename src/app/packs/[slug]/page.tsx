import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConnectorRow } from "@/components/ConnectorRow";
import { CopyInstallerButton } from "@/components/CopyInstallerButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { VerifiedChip } from "@/components/VerifiedChip";
import { PackIcon } from "@/components/icons/LineIcons";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { botMarkStyle } from "@/lib/bot-icon";
import { installerPrompt } from "@/lib/installer";
import { ledger } from "@/lib/ledger-theme";
import { renderMarkdown } from "@/lib/markdown";
import { en } from "@/lib/messages/en";
import { getPack, listPacks } from "@/lib/packs";
import Link from "next/link";
import { sectionSlug } from "@/lib/bot-icon";
import { resolveConnector } from "@/lib/connectors";
import { SponsorRail } from "@/components/SponsorRail";
import { isExample, isVerified } from "@/lib/types";
import { packJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return listPacks().map((pack) => ({ slug: pack.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pack = getPack(slug);
  if (!pack) return {};
  const title = pack.name;
  const description = pack.tagline;
  return {
    title,
    description,
    alternates: { canonical: `${site.url}/teams/${pack.slug}` },
    openGraph: { title: `${title} · ${site.name}`, description, url: `${site.url}/teams/${pack.slug}`, type: "website" },
  };
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function PackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pack = getPack(slug);
  if (!pack) notFound();
  const prompt = installerPrompt(pack);
  const example = isExample(pack);
  const verified = isVerified(pack);
  // Several teams name themselves after their sidebar section ("Bookkeeping",
  // "Partnerships"). Printing both gives the page a stuttered
  // "Partnerships / PARTNERSHIPS · 6 BOTS". Show the section only when it adds a word.
  const sectionEchoesName = pack.section.trim().toLowerCase() === pack.name.trim().toLowerCase();
  /* Three neighbours. Category first, but every category currently holds
     exactly one team, so that alone never renders. Fall back to the teams
     sharing the most connectors, which is the more useful question anyway:
     what else would I run with the tools I have already connected. */
  const others = listPacks().filter((other) => other.slug !== pack.slug);
  const mine = new Set(pack.connectors.map((c) => resolveConnector(c).slug));
  const related = [
    ...others.filter((o) => o.section === pack.section),
    ...others
      .filter((o) => o.section !== pack.section)
      .map((o) => ({ team: o, shared: o.connectors.filter((c) => mine.has(resolveConnector(c).slug)).length }))
      .filter((x) => x.shared > 0)
      .sort((a, b) => b.shared - a.shared || a.team.name.localeCompare(b.team.name))
      .map((x) => x.team),
  ].slice(0, 3);
  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <JsonLd data={packJsonLd(pack)} />
      <SiteMasthead />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 pb-20 pt-12">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label }} aria-label="Breadcrumb">
          <Link href="/#teams" className="accent-hover">{en.pack.allTeams}</Link>
          <span aria-hidden>/</span>
          <Link href={`/?category=${sectionSlug(pack.section)}#teams`} className="accent-hover">{pack.section}</Link>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <PackIcon slug={pack.slug} />
          <p className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>
            {example ? en.home.exampleBadge : en.home.liveBadge}
          </p>
          {verified ? <VerifiedChip /> : null}
        </div>
        <h1 className="font-display mt-4 text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05]" style={{ fontFamily: ledger.serif }}>
          {pack.name}
        </h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          {pack.tagline}
        </p>
        <p className="mt-3 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label }}>
          {sectionEchoesName ? `${pack.bots} bots` : `${pack.section} · ${pack.bots} bots`}
        </p>

        {/* Connect first, then copy. Both live above the fold: the shelf sells
            one paste, so the action must not sit below three screens of roster. */}
        <div className="mt-7 border-t pt-6" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
            {en.pack.connectFirst}
          </h2>
          <div className="mt-3">
            <ConnectorRow names={pack.connectors} labeled size={18} />
          </div>
          <div className="mt-5">
            <CopyInstallerButton text={prompt} />
          </div>
          <div className="mt-5 grid gap-2 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            <p>{en.pack.connectorsNote}</p>
            {example ? <p>{en.pack.exampleNote}</p> : null}
            <p>{en.pack.installNote}</p>
          </div>
        </div>

        <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.pack.agents}</h2>
          <ul className="mt-4">
            {pack.agents.map((agent, i) => (
              <li key={agent.name} className="hairline-row py-3">
                <div className="flex gap-3">
                  <GrokBotMark size={19} animate className="mt-0.5" style={botMarkStyle(i)} />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-2" style={{ fontFamily: ledger.serif }}>
                      <span>
                        {agent.name}
                        {agent.reuse ? ` · ${en.pack.reuse}` : ""}
                      </span>
                      <span className="bot-tag">{en.pack.botTag}</span>
                    </p>
                    <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
                      {agent.persona}
                    </p>
                    {agent.connectors.length > 0 ? (
                      <div className="mt-2">
                        <ConnectorRow names={agent.connectors} labeled size={16} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.pack.rooms}</h2>
          <ul className="mt-4">
            {pack.rooms.map((room) => (
              <li key={room.name} className="hairline-row py-3">
                <p style={{ fontFamily: ledger.serif }}>{room.name}</p>
                <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
                  {room.members.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.pack.routines}</h2>
          <ul className="mt-4">
            {pack.routines.map((routine) => (
              <li key={routine.name} className="hairline-row py-3">
                <p style={{ fontFamily: ledger.serif }}>{routine.name}</p>
                <p className="mt-1 text-[0.62rem] uppercase tracking-[0.14em]" style={{ color: ledger.label }}>
                  {en.pack.ownerBot} {routine.owner} · {routine.schedule}
                </p>
                <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
                  {routine.prompt}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.pack.section}</h2>
          <p className="mt-3">{pack.section}</p>
        </section>

        {pack.body ? (
          <article
            className="pack-prose mt-10 border-t pt-8 text-[0.95rem] leading-relaxed"
            style={{ color: ledger.inkSoft }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(pack.body) }}
          />
        ) : null}

        {pack.contributor || pack.scoutedBy ? (
          <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
            <p className="text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
              {pack.addedVia ? (
                <>
                  {en.pack.basedOn}{" "}
                  <a className="accent-hover underline" href={pack.addedVia} target="_blank" rel="noopener noreferrer">
                    {pack.contributor}
                  </a>
                </>
              ) : pack.contributor ? (
                <>
                  {en.pack.contributedBy}{" "}
                  <a className="accent-hover underline" href={pack.contributorUrl} target="_blank" rel="noopener noreferrer">
                    {pack.contributor}
                  </a>
                </>
              ) : null}
              {pack.scoutedBy ? <> · {en.pack.scoutedBy} {pack.scoutedBy}</> : null}
            </p>
          </section>
        ) : null}

        <div className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="mb-4 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
            {en.pack.promptTitle}
          </h2>
          <CopyInstallerButton text={prompt} />
          <pre
            className="installer-prompt mt-4 overflow-x-auto p-4 text-[0.72rem] leading-relaxed"
            style={{ fontFamily: ledger.mono }}
          >
            <code>{prompt}</code>
          </pre>
        </div>
        <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.pack.runYourself}</h2>
          <p className="mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{en.pack.runYourselfBody}</p>
          <p className="mt-4 text-[0.8rem]">
            <a
              className="accent-hover underline"
              href={`${site.github}/blob/main/packs/${pack.slug}.md`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {en.pack.viewSource}
            </a>
          </p>
        </section>

        {related.length > 0 ? (
          <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
            <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
              {en.pack.relatedTitle()}
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
