import { PackIndex } from "@/components/home/PackIndex";
import { RevealText } from "@/components/home/RevealText";
import { WingsVideo } from "@/components/home/WingsVideo";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { sponsorSlots } from "../../data/sponsors";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import type { Pack } from "@/lib/packs";
import { site } from "@/lib/site";

export function HomePage({ packs }: { packs: Pack[] }) {
  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="relative z-10 grid flex-1 grid-cols-1 items-start gap-6 overflow-clip lg:grid-cols-[6fr_6fr] lg:gap-14">
        <div className="pointer-events-none col-start-1 row-start-1 row-end-3 sticky top-[var(--masthead-h)] z-0 h-0 w-full self-start lg:row-end-2 lg:pr-16" aria-hidden>
          <div className="relative h-[calc(100dvh-var(--masthead-h))] w-full">
            <WingsVideo variant="wings-video--altar" />
          </div>
        </div>
        <div className="relative z-10 col-start-1 row-start-1 grid grid-cols-1 lg:border-r" style={{ borderColor: ledger.hairline }}>
          <div className="col-start-1 row-start-1 min-w-0 lg:pr-16">
            <section className="story-beat relative flex min-h-[calc(100dvh-var(--masthead-h))] flex-col items-center justify-center py-10 text-center">
              <div className="relative z-10">
                <p className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>
                  <RevealText text={en.eyebrow} delay={0.05} step={0.016} className="block" />
                </p>
                <h1 className="ledger-anim mt-8 text-[clamp(2.2rem,5.4vw,4.1rem)] font-light leading-[0.95] tracking-[-0.02em]" style={{ fontFamily: ledger.serif, animationDelay: "0.55s" }}>
                  {en.h1}
                </h1>
                <p className="ledger-anim mx-auto mt-6 max-w-md text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft, animationDelay: "0.75s" }}>
                  {en.answer}
                </p>
                <p className="ledger-anim mx-auto mt-4 max-w-md text-[0.82rem] leading-relaxed" style={{ color: ledger.inkFaint, animationDelay: "0.9s" }}>
                  {en.entity}
                </p>
                <p className="ledger-anim mx-auto mt-3 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label, animationDelay: "1.05s" }}>
                  {en.verified} <time dateTime={site.verifiedOn}>{site.verifiedOn}</time>
                </p>
              </div>
              <a href="#packs" className="accent-hover ledger-anim absolute bottom-5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[0.6rem] uppercase tracking-[0.22em] transition-colors lg:bottom-4" style={{ color: ledger.inkFaint, animationDelay: "1.2s" }}>
                {en.home.scrollCue} <span className="cue-bob" aria-hidden>↓</span>
              </a>
            </section>
            <section className="relative z-10 mx-auto max-w-xl pb-16 pt-6 text-center">
              <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.home.howTitle}</h2>
              <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{en.home.howBody}</p>
              <p className="mt-4 text-[0.78rem] leading-relaxed" style={{ color: ledger.inkFaint }}>{en.home.typeIn}</p>
              <h2 className="mt-12 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.home.sponsorsTitle}</h2>
              <p className="mt-3 text-[0.78rem]" style={{ color: ledger.inkFaint }}>{en.home.sponsorsNote}</p>
              <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {sponsorSlots.map((slot) => (
                  <li key={slot.id} className="border px-2 py-3 text-[0.55rem] uppercase tracking-[0.16em]" style={{ borderColor: ledger.hairline, color: ledger.label, fontFamily: ledger.mono }}>
                    {slot.id} · {slot.label}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
        <div className="relative z-10 col-start-1 row-start-2 min-w-0 pb-10 pt-4 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-[var(--masthead-h)] lg:flex lg:h-[calc(100dvh-var(--masthead-h))] lg:flex-col lg:justify-center lg:overflow-y-auto lg:py-6">
          <PackIndex packs={packs} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
