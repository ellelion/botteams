import Link from "next/link";
import { ConnectorRow } from "@/components/ConnectorRow";
import { VerifiedChip } from "@/components/VerifiedChip";
import { PackIcon } from "@/components/icons/LineIcons";
import { en } from "@/lib/messages/en";
import { isExample, isVerified, type Pack } from "@/lib/types";

export function PackCard({ pack }: { pack: Pack }) {
  const example = isExample(pack);
  const verified = isVerified(pack);
  return (
    <article className="pack-card">
      <div className="pack-card-top">
        <PackIcon slug={pack.slug} />
        <span className="inline-flex flex-wrap justify-end gap-1.5">
          {verified ? <VerifiedChip /> : null}
          <span className="chip">{example ? en.home.exampleBadge : en.home.liveBadge}</span>
        </span>
      </div>
      <h3>
        <Link href={"/teams/" + pack.slug}>{pack.name}</Link>
      </h3>
      <p className="text-[0.92rem] leading-relaxed" style={{ color: "var(--muted)" }}>{pack.tagline}</p>
      <ConnectorRow names={pack.connectors} size={16} />
      <p className="pack-card-meta">{pack.section} · {pack.bots} bots</p>
    </article>
  );
}
