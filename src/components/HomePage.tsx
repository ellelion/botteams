import Link from "next/link";
import { TeamIndex } from "@/components/home/TeamIndex";
import { RevealText } from "@/components/home/RevealText";
import { HeroStats } from "@/components/home/HeroStats";
import { StoryBeat } from "@/components/home/StoryBeat";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { WingsSplit } from "@/components/WingsSplit";
import type { IndexQuery } from "@/lib/catalog-query";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import type { Team } from "@/lib/types";
import { site } from "@/lib/site";
import { XTagDialog } from "@/components/XTagDialog";

const CONTRIBUTE_SAMPLE = `---
slug: founder-os
name: Founder OS
tagline: Money and inbox in one founder room.
bots: 2
section: Founder OS
kind: team
status: installable
connectors: [Stripe, Gmail]
bot_roster:
  - name: Founder · Money
    persona: Reads Stripe. Drafts the brief. Never moves funds.
    connectors: [Stripe]
  - name: Founder · Inbox
    persona: Drafts mail. Never sends.
    connectors: [Gmail]
rooms:
  - name: Founder HQ
    members: [Founder · Money, Founder · Inbox]
routines:
  - name: Monday money brief
    owner: Founder · Money
    schedule: Every Monday at 08:00
    prompt: Read Stripe. Draft the weekly money brief. Never move funds.
---`;

export function HomePage({ teams, query }: { teams: Team[]; query: IndexQuery }) {
  const teamCount = teams.filter((t) => t.kind === "team").length;
  const botCount = teams.filter((t) => t.kind === "bot").length;
  const catalogActive =
    Boolean(query.q.trim()) ||
    query.kind !== "team" ||
    query.category !== "all" ||
    query.integration !== "all";
  return (
    <WingsSplit
      hero={
        <>
          <StoryBeat catalogActive={catalogActive}>
            <div className="relative z-10 w-full max-w-full overflow-x-hidden px-1">
              <p className="home-hero-eyebrow hidden items-center justify-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] lg:flex" style={{ color: ledger.accentText }}>
                <GrokBotMark size={66} animate />
                <RevealText text={en.eyebrow} delay={0.05} step={0.016} className="block" />
              </p>
              <h1 className="font-display mx-auto mt-4 w-full max-w-full text-[clamp(1.7rem,3.5vw,2.9rem)] lg:mt-8 font-normal leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: ledger.serif }}>
                {en.h1}
              </h1>
              <p className="home-hero-manifesto mx-auto mt-3 max-w-md text-[0.9rem] leading-relaxed lg:mt-6 lg:text-[0.95rem]" style={{ color: ledger.inkSoft }}>
                {en.answer}
                <br />
                {en.answerUse}
              </p>
              <p className="home-hero-links mx-auto mt-3 max-w-md text-[0.9rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
                <Link href="/grok-bot" className="accent-hover underline">{en.guideLink}</Link>
                {" · "}
                <Link href="/guides" className="accent-hover underline">{en.guidesLink}</Link>
                {" · "}
                <Link href="/?kind=bot" className="accent-hover underline">{en.onRamp}</Link>
              </p>
              <HeroStats teams={teamCount} bots={botCount} verifiedOn={site.verifiedOn} />
              <p className="home-disclaimer mx-auto mt-5 hidden lg:block">
                {en.notAffiliated}
              </p>
            </div>
            <Link href="/?kind=team" className="home-scroll-cue meta accent-hover absolute inset-x-0 bottom-5 z-10 mx-auto hidden w-max max-w-full lg:inline-flex items-center gap-2 whitespace-nowrap transition-colors lg:bottom-4">
              {en.home.scrollCue} <span aria-hidden>↓</span>
            </Link>
          </StoryBeat>
          <section className="wings-hero-extra relative z-10 mx-auto max-w-xl pb-[var(--sec-y)] pt-[var(--sec-y)] text-center hidden lg:block">
            <h2 className="text-[1.05rem] font-normal tracking-[-0.02em]" style={{ fontFamily: ledger.serif, color: ledger.ink }}>{en.home.howTitle}</h2>
            <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{en.home.howBody}</p>
            <p className="home-contribute-links mt-4">
              <Link className="accent-hover underline" href="/guides/install-a-grok-bot-team">{en.home.howGuide}</Link>
            </p>

            <h2 id="contribute" className="mt-[var(--sec-y)] text-[1.05rem] font-normal tracking-[-0.02em]" style={{ fontFamily: ledger.serif, color: ledger.ink }}>
              {en.home.contributeTitle}
            </h2>
            <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{en.home.contributeBody}</p>
            <p className="mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{en.home.contributeX}</p>
            <pre className="installer-prompt is-whole mt-5 p-4 text-left text-[0.68rem] leading-relaxed" style={{ fontFamily: ledger.mono }}>
              <code>{CONTRIBUTE_SAMPLE}</code>
            </pre>
            <p className="home-contribute-links mt-4">
              <a className="accent-hover underline" href={`${site.github}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" aria-label={`${en.home.contributePr}. ${en.nav.opensNew}`}>
                {en.home.contributePr}
              </a>
              <XTagDialog />
              <a className="accent-hover underline" href={`${site.github}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" aria-label={`${en.home.contributeGuide}. ${en.nav.opensNew}`}>
                {en.home.contributeGuide}
              </a>
              <Link className="accent-hover underline" href="/docs">{en.home.contributeSpec}</Link>
              <Link className="accent-hover underline" href="/api">{en.nav.api}</Link>
            </p>

            <h2 className="mt-[var(--sec-y)] text-[1.05rem] font-normal tracking-[-0.02em]" style={{ fontFamily: ledger.serif, color: ledger.ink }}>
              {en.home.faqTitle}
            </h2>
            <dl className="mt-5 space-y-5 text-left">
              {[
                [en.home.faqWhatQ, en.home.faqWhatA],
                [en.home.faqInstallQ, en.home.faqInstallA],
                [en.home.faqXaiQ, en.home.faqXaiA],
              ].map(([q, a]) => (
                <div key={q}>
                  <dt className="text-[0.92rem] font-medium" style={{ color: ledger.ink }}>{q}</dt>
                  <dd className="mt-1.5 text-[0.88rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{a}</dd>
                </div>
              ))}
            </dl>
            <p className="home-contribute-links mt-4">
              <Link className="accent-hover underline" href="/guides">{en.home.faqGuides}</Link>
            </p>
          </section>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  { "@type": "Question", name: en.home.faqWhatQ, acceptedAnswer: { "@type": "Answer", text: en.home.faqWhatA } },
                  { "@type": "Question", name: en.home.faqInstallQ, acceptedAnswer: { "@type": "Answer", text: en.home.faqInstallA } },
                  { "@type": "Question", name: en.home.faqXaiQ, acceptedAnswer: { "@type": "Answer", text: en.home.faqXaiA } },
                ],
              }),
            }}
          />
        </>
      }
    >
      <TeamIndex teams={teams} query={query} />
      <div className="home-more lg:hidden">
        <details name="home-more">
          <summary>{en.home.howSummary}</summary>
          <p>{en.home.howBody}</p>
          <p className="home-contribute-links">
            <Link className="accent-hover underline" href="/guides/install-a-grok-bot-team">{en.home.howGuide}</Link>
          </p>
        </details>
        <details name="home-more">
          <summary>{en.home.faqSummary}</summary>
          <dl>
            {[
              [en.home.faqWhatQ, en.home.faqWhatA],
              [en.home.faqInstallQ, en.home.faqInstallA],
              [en.home.faqXaiQ, en.home.faqXaiA],
            ].map(([q, a]) => (
              <div key={q}>
                <dt>{q}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </dl>
          <p className="home-contribute-links">
            <Link className="accent-hover underline" href="/guides">{en.home.faqGuides}</Link>
          </p>
        </details>
        <details name="home-more">
          <summary>{en.home.contributeSummary}</summary>
          <p>{en.home.contributeBody}</p>
          <p>{en.home.contributeX}</p>
          <p className="home-contribute-links">
            <a className="accent-hover underline" href={`${site.github}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" aria-label={`${en.home.contributePr}. ${en.nav.opensNew}`}>
              {en.home.contributePr}
            </a>
            <XTagDialog />
            <a className="accent-hover underline" href={`${site.github}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" aria-label={`${en.home.contributeGuide}. ${en.nav.opensNew}`}>
              {en.home.contributeGuide}
            </a>
            <Link className="accent-hover underline" href="/docs">{en.home.contributeSpec}</Link>
            <Link className="accent-hover underline" href="/api">{en.nav.api}</Link>
          </p>
        </details>
      </div>
    </WingsSplit>
  );
}
