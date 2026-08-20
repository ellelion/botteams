import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyInstallerButton } from "@/components/CopyInstallerButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { installerPrompt } from "@/lib/installer";
import { ledger } from "@/lib/ledger-theme";
import { renderMarkdown } from "@/lib/markdown";
import { en } from "@/lib/messages/en";
import { getPack, isExample, listPacks } from "@/lib/packs";
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
  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <JsonLd data={packJsonLd(pack)} />
      <SiteMasthead />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 pb-16 pt-10">
        <p className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>{example ? en.home.exampleBadge : en.home.liveBadge}</p>
        <h1 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05]" style={{ fontFamily: ledger.serif }}>{pack.name}</h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{pack.tagline}</p>
        <p className="mt-3 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label }}>{en.verified} <time dateTime={site.verifiedOn}>{site.verifiedOn}</time> · dateModified {site.updatedAt}</p>
        {example ? <p className="mt-4 text-[0.9rem]" style={{ color: ledger.inkMuted }}>{en.pack.exampleNote}</p> : null}
        <p className="mt-4 text-[0.9rem]" style={{ color: ledger.inkMuted }}>{en.pack.installNote}</p>
        <dl className="mt-8 grid grid-cols-2 gap-4 text-[0.8rem]">
          <div><dt style={{ color: ledger.label }}>{en.pack.seats}</dt><dd>{pack.seats}</dd></div>
          <div><dt style={{ color: ledger.label }}>{en.pack.section}</dt><dd>{pack.section}</dd></div>
        </dl>
        <section className="mt-8"><h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.pack.agents}</h2><ul className="mt-3 space-y-3">{pack.agents.map((agent) => <li key={agent.name}><p style={{ fontFamily: ledger.serif }}>{agent.name}{agent.reuse ? ` · ${en.pack.reuse}` : ""}</p><p className="text-[0.85rem]" style={{ color: ledger.inkMuted }}>{agent.persona}</p></li>)}</ul></section>
        <section className="mt-8"><h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.pack.rooms}</h2><ul className="mt-3 space-y-2">{pack.rooms.map((room) => <li key={room.name}>{room.name}: {room.members.join(", ")}</li>)}</ul></section>
        <section className="mt-8"><h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.pack.routines}</h2><ul className="mt-3 space-y-3">{pack.routines.map((routine) => <li key={routine.name}><p>{routine.name} · {routine.owner} · {routine.schedule}</p><p className="text-[0.85rem]" style={{ color: ledger.inkMuted }}>{routine.prompt}</p></li>)}</ul></section>
        <section className="mt-8"><h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.pack.connectors}</h2><p className="mt-3">{pack.connectors.join(", ")}</p></section>
        {pack.body ? <article className="mt-10 space-y-4 text-[0.95rem] leading-relaxed [&_h2]:text-[0.6rem] [&_h2]:uppercase [&_h2]:tracking-[0.26em] [&_a]:underline" style={{ color: ledger.inkSoft }} dangerouslySetInnerHTML={{ __html: renderMarkdown(pack.body) }} /> : null}
        <div className="mt-10"><CopyInstallerButton text={prompt} /></div>
        <pre className="mt-4 overflow-x-auto border p-4 text-[0.72rem] leading-relaxed" style={{ borderColor: ledger.hairline, background: ledger.paperDeep, fontFamily: ledger.mono }}><code>{prompt}</code></pre>
      </main>
      <SiteFooter />
    </div>
  );
}
