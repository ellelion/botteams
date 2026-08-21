import { Suspense } from "react";
import Link from "next/link";
import { TeamIndex } from "@/components/home/TeamIndex";
import { RevealText } from "@/components/home/RevealText";
import { WingsVideo } from "@/components/home/WingsVideo";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { SponsorRail } from "@/components/SponsorRail";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import type { Team } from "@/lib/types";
import { site } from "@/lib/site";
import { teamsAddedSeries } from "@/lib/stats";


/* Abridged Founder OS front matter. Real fields, real values, trimmed to
   the shape a contributor has to get right. */
const CONTRIBUTE_SAMPLE = `---
slug: founder-os
name: Founder OS
tagline: Money, inbox, and a chief of staff in one founder room.
bots: 3
section: Founder OS
status: team
connectors: [Stripe, Gmail, Calendar, Ramp, Notion]
agents:
  - name: Chief of Staff
    persona: Coordinates the founder week. Keeps Founder HQ honest.
    connectors: [Calendar, Notion]
rooms:
  - name: Founder HQ
    members: [Chief of Staff, Founder · Money, Founder · Inbox]
routines:
  - name: Monday money brief
    owner: Founder · Money
    schedule: Every Monday at 08:00
    prompt: Read Stripe. Draft the weekly money brief. Never move funds.
---`;

export function HomePage({ teams }: { teams: Team[] }) {
  const added = teamsAddedSeries(30);
  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="relative z-10 grid flex-1 grid-cols-1 items-start gap-6 overflow-clip lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="pointer-events-none col-start-1 row-start-1 row-end-2 relative z-0 h-0 w-full min-w-0 self-start lg:sticky lg:top-[var(--masthead-h)] lg:pr-16" aria-hidden>
          <div className="relative h-[calc(100dvh-var(--masthead-h))] w-full">
            <WingsVideo variant="wings-video--altar" />
          </div>
        </div>
        <div className="relative z-10 col-start-1 row-start-1 min-w-0 overflow-hidden grid grid-cols-1 lg:border-r" style={{ borderColor: ledger.hairline }}>
          <div className="col-start-1 row-start-1 min-w-0 overflow-hidden lg:pr-16">
            <section className="story-beat relative flex min-h-[calc(100dvh-var(--masthead-h))] flex-col items-center justify-center overflow-hidden py-10 pb-20 text-center">
              <div className="relative z-10 w-full max-w-full overflow-hidden px-1">
                <p className="flex items-center justify-center gap-2 text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>
                  <GrokBotMark size={22} animate />
                  <RevealText text={en.eyebrow} delay={0.05} step={0.016} className="block" />
                </p>
                <h1 className="font-display ledger-anim mx-auto mt-8 w-full max-w-full text-balance text-[clamp(1.65rem,3.4vw,2.75rem)] font-light leading-[1.05] tracking-[-0.02em]" style={{ fontFamily: ledger.serif, animationDelay: "0.55s" }}>
                  {en.h1}
                </h1>
                <p className="ledger-anim mx-auto mt-6 max-w-md text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft, animationDelay: "0.75s" }}>
                  {en.answer}
                </p>
                <p className="ledger-anim mx-auto mt-4 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label, animationDelay: "0.95s" }}>
                  {en.verified} <time dateTime={site.verifiedOn}>{site.verifiedOn}</time>
                </p>
              </div>
              <a href="#teams" className="accent-hover ledger-anim absolute bottom-5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[0.6rem] uppercase tracking-[0.22em] transition-colors lg:bottom-4" style={{ color: ledger.inkFaint, animationDelay: "1.15s" }}>
                {en.home.scrollCue} <span className="cue-bob" aria-hidden>↓</span>
              </a>
            </section>
            <section className="relative z-10 mx-auto max-w-xl pb-16 pt-6 text-center">
              <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.home.howTitle}</h2>
              <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{en.home.howBody}</p>
              <p className="mt-4 text-[0.78rem] leading-relaxed" style={{ color: ledger.inkFaint }}>{en.home.typeIn}</p>

              <h2 id="contribute" className="mt-14 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
                {en.home.contributeTitle}
              </h2>
              <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{en.home.contributeBody}</p>
              <pre className="installer-prompt is-whole mt-5 p-4 text-left text-[0.68rem] leading-relaxed" style={{ fontFamily: ledger.mono }}>
                <code>{CONTRIBUTE_SAMPLE}</code>
              </pre>
              <p className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.72rem]">
                <a className="accent-hover underline" href={`${site.github}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">
                  {en.home.contributePr}
                </a>
                <a className="accent-hover underline" href={`${site.github}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">
                  {en.home.contributeGuide}
                </a>
                <Link className="accent-hover underline" href="/docs">{en.home.contributeSpec}</Link>
                <Link className="accent-hover underline" href="/api">{en.nav.api}</Link>
              </p>
            </section>
          </div>
        </div>
        <div className="relative z-10 col-start-1 row-start-2 min-w-0 pb-10 pt-4 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-[var(--masthead-h)] lg:flex lg:h-[calc(100dvh-var(--masthead-h))] lg:flex-col lg:justify-start lg:overflow-y-auto lg:py-6">
          <Suspense fallback={<p className="eyebrow">Loading teams</p>}>
            <TeamIndex teams={teams} added={added} verifiedOn={site.verifiedOn} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
