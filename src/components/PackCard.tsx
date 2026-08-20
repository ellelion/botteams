import Link from "next/link";
import { isExample, type Pack } from "@/lib/packs";

export function PackCard({ pack }: { pack: Pack }) {
  const example = isExample(pack);
  return (
    <article className="flex flex-col rounded-xl border border-line bg-card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[16px] font-medium tracking-[-0.01em] text-ink">{pack.name}</h2>
        <p className="text-[12px] text-mute">{example ? "Example" : pack.seats + " seats"}</p>
      </div>
      <p className="mt-3 flex-1 text-[14px] leading-6 text-mute">{pack.tagline}</p>
      <div className="mt-6 flex items-center justify-between gap-3">
        <Link
          href={"/packs/" + pack.slug}
          className="inline-flex h-8 w-fit items-center rounded-lg bg-ink px-3 text-[13px] font-medium text-canvas"
        >
          Install
        </Link>
        {example ? <p className="text-[12px] text-mute">{pack.seats} seats</p> : null}
      </div>
    </article>
  );
}
