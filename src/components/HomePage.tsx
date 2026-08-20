import { Suspense } from "react";
import Link from "next/link";
import { PackIndex } from "@/components/home/PackIndex";
import { WingsVideo } from "@/components/home/WingsVideo";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { sponsorSlots } from "@/data/sponsors";
import { en } from "@/lib/messages/en";
import type { Pack } from "@/lib/types";
import { site } from "@/lib/site";
import { packsAddedSeries } from "@/lib/stats";

export function HomePage({ packs }: { packs: Pack[] }) {
  const added = packsAddedSeries(30);
  return (
    <div className="site-shell">
      <SiteMasthead />
      <div className="page-main">
        <section className="hero">
          <WingsVideo variant="wings-video--altar" />
          <div className="relative z-10 flex flex-col items-center">
            <p className="eyebrow">{en.eyebrow}</p>
            <h1>{en.h1}</h1>
            <p className="lede">{en.answer}</p>
            <div className="hero-actions">
              <a href="#packs" className="btn-primary">{en.home.scrollCue}</a>
              <Link href="/docs" className="btn-secondary">{en.home.specCta}</Link>
            </div>
          </div>
        </section>
        <Suspense fallback={<p className="eyebrow">Loading packs</p>}>
          <PackIndex packs={packs} added={added} verifiedOn={site.verifiedOn} />
        </Suspense>
        <section className="mx-auto mt-20 max-w-xl text-center">
          <h2 className="section-title">{en.home.howTitle}</h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed" style={{ color: "var(--muted)" }}>{en.home.howBody}</p>
          <p className="mt-4 text-[0.88rem] leading-relaxed" style={{ color: "var(--muted)" }}>{en.home.typeIn}</p>
          <h2 className="mt-16 text-[1.2rem] font-medium tracking-[-0.03em]">{en.home.sponsorsTitle}</h2>
          <p className="mt-3 text-[0.88rem]" style={{ color: "var(--muted)" }}>{en.home.sponsorsNote}</p>
          <p className="mt-4 text-[0.78rem]" style={{ color: "var(--muted)" }}>
            {sponsorSlots.map((slot, i) => (
              <span key={slot.id}>
                {i > 0 ? " · " : null}
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
            {" · "}
            {en.home.available}
          </p>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
