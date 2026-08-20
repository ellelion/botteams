import Link from "next/link";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import { isExample, type Pack } from "@/lib/packs";

export function PackIndex({ packs }: { packs: Pack[] }) {
  return (
    <div id="packs">
      <h2 className="ledger-anim mb-1 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText, animationDelay: "0.2s" }}>
        {en.home.indexTitle}
      </h2>
      <div className="divide-y" style={{ borderColor: ledger.hairline }}>
        {packs.map((pack, i) => (
          <div key={pack.slug} className="border-0 border-b" style={{ borderColor: ledger.hairline }}>
            <PackRow pack={pack} i={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PackRow({ pack, i }: { pack: Pack; i: number }) {
  const example = isExample(pack);
  return (
    <div className="group relative py-[0.35rem] ledger-anim" style={{ animationDelay: `${0.28 + i * 0.05}s` }}>
      <Link href={`/packs/${pack.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">{pack.name}, {pack.tagline}</span>
      </Link>
      <span className="pointer-events-none relative z-10 grid w-full grid-cols-[1.5rem_1fr_auto] gap-x-3 gap-y-[0.2rem] sm:gap-x-4">
        <span className="row-start-1 flex items-center text-[0.62rem] tabular-nums leading-none" style={{ color: ledger.numeral, height: 19 }}>
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className="row-start-1 min-w-0 flex items-center text-[0.95rem] leading-none transition-colors sm:text-[1.05rem] group-hover:italic" style={{ fontFamily: ledger.serif, height: 19 }}>
          {pack.name}
          <span className="ml-2 inline-block translate-x-0 text-[0.7rem] opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" style={{ color: ledger.accentText }}>↗</span>
        </span>
        <span className="row-start-1 flex shrink-0 items-center justify-end pt-0.5">
          {example ? (
            <span className="text-[0.55rem] uppercase tracking-[0.18em]" style={{ color: ledger.label, fontFamily: ledger.mono }}>{en.home.exampleBadge}</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[0.55rem] uppercase tracking-[0.18em]" style={{ color: ledger.green, fontFamily: ledger.mono }}>
              <span className="ledger-pulse inline-block h-[6px] w-[6px] rounded-full" style={{ background: ledger.green }} aria-hidden />
              {en.home.liveBadge}
            </span>
          )}
        </span>
        <span className="row-start-2 col-start-2 min-w-0 break-words text-[0.62rem] tracking-wide" style={{ color: ledger.inkFaint, fontFamily: ledger.mono }}>
          {pack.section} · {pack.seats} {en.pack.seats}
        </span>
        <span className="row-start-3 col-start-2 col-end-4 min-w-0 whitespace-normal break-words text-[0.68rem] leading-[1.55]" style={{ color: ledger.inkMuted }}>
          {pack.tagline}
        </span>
      </span>
    </div>
  );
}
