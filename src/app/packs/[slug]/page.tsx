import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConnectorRow } from "@/components/ConnectorRow";
import { CopyInstallerButton } from "@/components/CopyInstallerButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { VerifiedChip } from "@/components/VerifiedChip";
import { BotIcon, PackIcon } from "@/components/icons/LineIcons";
import { botIconKey } from "@/lib/bot-icon";
import { installerPrompt } from "@/lib/installer";
import { ledger } from "@/lib/ledger-theme";
import { renderMarkdown } from "@/lib/markdown";
import { en } from "@/lib/messages/en";
import { getPack, listPacks } from "@/lib/packs";
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
  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <JsonLd data={packJsonLd(pack)} />
      <SiteMasthead />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 pb-20 pt-12">
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
          {`${pack.section} · ${pack.bots} bots`}
        </p>
        <div className="mt-5">
          <ConnectorRow names={pack.connectors} labeled size={18} />
        </div>
        <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
          {en.pack.connectorsNote}
        </p>
        {example ? (
          <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            {en.pack.exampleNote}
          </p>
        ) : null}
        <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
          {en.pack.installNote}
        </p>

        <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.pack.agents}</h2>
          <ul className="mt-4">
            {pack.agents.map((agent) => (
              <li key={agent.name} className="hairline-row py-3">
                <div className="flex gap-3">
                  <BotIcon name={botIconKey(agent)} />
                  <div className="min-w-0">
                    <p style={{ fontFamily: ledger.serif }}>
                      {agent.name}
                      {agent.reuse ? ` · ${en.pack.reuse}` : ""}
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

        <div className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <CopyInstallerButton text={prompt} slug={pack.slug} />
          <pre
            className="installer-prompt mt-4 overflow-x-auto p-4 text-[0.72rem] leading-relaxed"
            style={{ fontFamily: ledger.mono }}
          >
            <code>{prompt}</code>
          </pre>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
