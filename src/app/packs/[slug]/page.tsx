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
  const title = `${pack.name} pack`;
  const description = pack.tagline;
  return {
    title,
    description,
    alternates: { canonical: `${site.url}/packs/${pack.slug}` },
    openGraph: { title: `${title} · ${site.name}`, description, url: `${site.url}/packs/${pack.slug}`, type: "website" },
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
    <div className="site-shell">
      <JsonLd data={packJsonLd(pack)} />
      <SiteMasthead />
      <main className="page-main max-w-2xl pb-20 pt-16">
        <div className="flex flex-wrap items-center gap-2">
          <PackIcon slug={pack.slug} />
          {verified ? <VerifiedChip /> : null}
          <span className="chip">{example ? en.home.exampleBadge : en.home.liveBadge}</span>
        </div>
        <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.4rem)] font-medium tracking-[-0.045em] leading-[1.05]">
          {pack.name}
        </h1>
        <p className="mt-4 text-[1.08rem] leading-relaxed" style={{ color: "var(--muted)" }}>
          {pack.tagline}
        </p>
        <p className="mt-3 pack-card-meta">
          {pack.section} · {pack.bots} bots
        </p>
        <div className="mt-5">
          <ConnectorRow names={pack.connectors} labeled size={18} />
        </div>
        <p className="mt-4 text-[0.92rem] leading-relaxed" style={{ color: "var(--muted)" }}>
          {en.pack.connectorsNote}
        </p>
        {example ? (
          <p className="mt-4 text-[0.92rem] leading-relaxed" style={{ color: "var(--muted)" }}>
            {en.pack.exampleNote}
          </p>
        ) : null}
        <p className="mt-4 text-[0.92rem] leading-relaxed" style={{ color: "var(--muted)" }}>
          {en.pack.installNote}
        </p>

        <section className="mt-12">
          <h2 className="text-[1.2rem] font-medium tracking-[-0.03em]">{en.pack.agents}</h2>
          <ul className="mt-2">
            {pack.agents.map((agent) => (
              <li key={agent.name} className="bot-row">
                <div className="flex gap-3">
                  <BotIcon name={botIconKey(agent)} />
                  <div className="min-w-0">
                    <p className="font-medium tracking-[-0.02em]">
                      {agent.name}
                      {agent.reuse ? ` · ${en.pack.reuse}` : ""}
                    </p>
                    <p className="mt-1 text-[0.9rem] leading-relaxed" style={{ color: "var(--muted)" }}>
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

        <section className="mt-10">
          <h2 className="text-[1.2rem] font-medium tracking-[-0.03em]">{en.pack.rooms}</h2>
          <ul className="mt-2">
            {pack.rooms.map((room) => (
              <li key={room.name} className="bot-row">
                <p className="font-medium tracking-[-0.02em]">{room.name}</p>
                <p className="mt-1 text-[0.9rem] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {room.members.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-[1.2rem] font-medium tracking-[-0.03em]">{en.pack.routines}</h2>
          <ul className="mt-2">
            {pack.routines.map((routine) => (
              <li key={routine.name} className="bot-row">
                <p className="font-medium tracking-[-0.02em]">{routine.name}</p>
                <p className="mt-1 pack-card-meta">
                  {en.pack.ownerBot} {routine.owner} · {routine.schedule}
                </p>
                <p className="mt-1 text-[0.9rem] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {routine.prompt}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-[1.2rem] font-medium tracking-[-0.03em]">{en.pack.section}</h2>
          <p className="mt-3">{pack.section}</p>
        </section>

        {pack.body ? (
          <article
            className="pack-prose mt-10 text-[0.95rem] leading-relaxed"
            style={{ color: "var(--ink-soft)" }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(pack.body) }}
          />
        ) : null}

        <div className="mt-12">
          <CopyInstallerButton text={prompt} slug={pack.slug} />
          <pre className="installer-prompt mt-4 overflow-x-auto p-4">
            <code>{prompt}</code>
          </pre>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
