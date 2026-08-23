import type { Metadata } from "next";
import { Suspense } from "react";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { BuySlot } from "@/components/sponsor/BuySlot";
import { PaidNotice } from "@/components/sponsor/PaidNotice";
import { RAIL_PLANS } from "@/lib/rail";
import { railCheckoutReady } from "@/lib/stripe";
import { getRailInventory } from "@/lib/rail-inventory";
import { ledger, ledgerOg } from "@/lib/ledger-theme";
import { SPONSOR_SLOTS_TOTAL, houseSlots, sponsorHref } from "@/data/sponsors";
import { CATALOG_CHECKED_ON, CONNECTOR_CATALOG } from "@/lib/connectors";
import { en } from "@/lib/messages/en";
import { listBots, listTeams } from "@/lib/teams";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const STATS_AS_OF = "23 August 2026";
const STATS_AS_OF_ISO = "2026-08-23";
const HOUSE_COUNT = houseSlots.length;

export const metadata: Metadata = {
  title: "Sponsor",
  description:
    "Put a tool next to 140 Grok Bot teams and 59 one-job Bots on botteams.ai. Twelve rail slots. $1,500, $4,000, or $7,500. Operated by Ellelion LLC.",
  alternates: { canonical: `${site.url}/sponsor` },
};

const ACCEPT = [
  "Digital products only.",
  "Public URL, not a shortener, not a competing Grok Bot team or bot directory.",
  "No crypto, no trading signals, no lead-generation for either.",
];

const NEED = [
  "Title, 28 characters or fewer.",
  "Short description, 52 characters or fewer, as plain as the directory.",
  "Destination URL.",
  "A simple mark (png, svg, webp, or jpg). Not a landing screenshot, not a person photo, not a watermarked stock ad.",
];

const RULES = [
  "No competing directories of Grok Bot teams or bots.",
  "No crypto, no trading signals, no lead-generation for either.",
  "The tool has to be something a Bot could use. This is not general display advertising.",
  "We may edit the one-liner after it is live, so it reads like the rest of the directory.",
  "Anywhere we earn on a click is marked, and the disclosure says so.",
  "No dashboard, no impression counts. You get a placement and an honest answer about traffic when you ask.",
];

export default async function SponsorPage() {
  const teams = listTeams();
  const bots = listBots();
  const teamCount = teams.length;
  const botCount = bots.length;
  const fromXai = bots.filter((bot) => bot.fromXai).length;
  const connectors = CONNECTOR_CATALOG.length;
  const { open, slots } = await getRailInventory();
  const canBuy = open > 0 && railCheckoutReady(RAIL_PLANS);
  const mail = `mailto:${site.email}?subject=${encodeURIComponent("Sponsoring Grok Bot Teams")}`;

  const faqs = [
    { q: en.sponsor.faqPriceQ, a: en.sponsor.faqPriceA },
    { q: en.sponsor.faqMonthQ, a: en.sponsor.faqMonthA },
    { q: en.sponsor.faqShownQ, a: en.sponsor.faqShownA },
    { q: en.sponsor.faqRefuseQ, a: en.sponsor.faqRefuseA },
    { q: en.sponsor.faqCopyQ, a: en.sponsor.faqCopyA },
  ];

  return (
    <WingsSplit
      hero={
        <WingsHero title={en.sponsor.pageH1}>
          <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
            {en.sponsor.answer(teamCount, botCount, SPONSOR_SLOTS_TOTAL, HOUSE_COUNT, open, STATS_AS_OF)}
          </p>
          <p className="home-disclaimer mt-5">{en.notAffiliated}</p>
        </WingsHero>
      }
    >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />

        <section className="border-t-0 pt-0" aria-labelledby="spon-facts">
          <h2 id="spon-facts" className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
            {en.sponsor.factsTitle}
          </h2>
          <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-8 min-[900px]:grid-cols-4 min-[900px]:gap-x-10">
            {[
              { label: "Teams", value: String(teamCount), note: en.sponsor.factTeams(teamCount) },
              { label: "Bots", value: String(botCount), note: en.sponsor.factBots(botCount, fromXai) },
              {
                label: "Open slots",
                value: `${open} of ${SPONSOR_SLOTS_TOTAL}`,
                note: en.sponsor.factSlots(open, SPONSOR_SLOTS_TOTAL),
              },
              {
                label: "Connectors",
                value: String(connectors),
                note: en.sponsor.factConnectors(connectors, CATALOG_CHECKED_ON),
              },
            ].map((fact, i) => (
              <div
                key={fact.label}
                className={`min-w-0${i > 0 ? " min-[900px]:border-l min-[900px]:border-solid min-[900px]:pl-8" : " min-[900px]:pr-2"}`}
                style={i > 0 ? { borderColor: ledger.hairline } : undefined}
              >
                <dt className="sr-only">{fact.label}</dt>
                <dd className="m-0 min-w-0">
                  <strong
                    className="block text-[clamp(1.55rem,3.2vw,2.15rem)] font-medium leading-none tracking-[-0.04em]"
                    style={{ fontFamily: ledger.serif, color: ledger.ink }}
                  >
                    {fact.value}
                  </strong>
                  <span className="mt-2 block text-[0.75rem] leading-snug pr-1" style={{ color: ledger.inkSoft }}>
                    {fact.note}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Placements</h2>
          <dl className="mt-4">
            {[
              ["Side rail", `Logo, name, one line. Rides the team index and every team page. Rotated evenly, never two in a row from the same category. ${en.sponsor.placementPrice}`],
              ["Connect first slot", "A single marked slot inside a team page, beside the connectors that team expects. Separate from the rail. Price on enquiry."],
              ["Promoted team", "A team you actually ship, marked Promoted in the index. It has to be a real, working recipe. We will not list an ad as a team. Price on enquiry."],
            ].map(([name, note]) => (
              <div key={name} className="hairline-row py-3">
                <dt style={{ fontFamily: ledger.serif }}>{name}</dt>
                <dd className="measure mt-1 text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{note}</dd>
              </div>
            ))}
          </dl>
          <p className="measure mt-4 text-[0.8rem] leading-relaxed" style={{ color: ledger.inkFaint }}>
            {en.sponsor.emptyPlacements}
          </p>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
            {en.sponsor.railTodayTitle}
          </h2>
          <ul className="mt-4">
            {slots.map((slot) => (
              <li key={slot.id} className="hairline-row py-3">
                <a
                  className="spon-paid-link accent-hover"
                  href={sponsorHref(slot, "sponsor-page")}
                  target="_blank"
                  rel={slot.owned ? "nofollow noopener noreferrer" : "noopener sponsored"}
                  style={{ fontFamily: ledger.serif, letterSpacing: "-0.03em" }}
                >
                  {slot.mark ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="spon-mark" src={slot.mark} alt="" width={18} height={18} />
                  ) : null}
                  <span className="underline">{slot.name}</span>
                </a>
                {slot.line ? (
                  <span className="mt-1.5 block text-[0.78rem] leading-snug" style={{ color: ledger.inkMuted }}>
                    {slot.line}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="spon-open measure">
            <p className="text-[0.85rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
              {en.sponsor.openLine(open, SPONSOR_SLOTS_TOTAL)}
            </p>
            <Suspense fallback={null}>
              <PaidNotice />
            </Suspense>
            {canBuy ? (
              <BuySlot soldOut={false} />
            ) : open <= 0 ? (
              <BuySlot soldOut />
            ) : (
              <p className="spon-fine">
                Card checkout is not switched on yet. Mail{" "}
                <a className="accent-hover underline" href={mail}>{site.email}</a> and we will invoice you.
              </p>
            )}
          </div>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
            {en.sponsor.acceptTitle}
          </h2>
          <ul className="mt-4">
            {ACCEPT.map((rule) => (
              <li key={rule} className="hairline-row measure py-3 text-[0.88rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
                {rule}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
            {en.sponsor.needTitle}
          </h2>
          <p className="measure mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            {en.sponsor.needLead}
          </p>
          <ul className="mt-4">
            {NEED.map((rule) => (
              <li key={rule} className="hairline-row measure py-3 text-[0.88rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
                {rule}
              </li>
            ))}
          </ul>
          <p className="measure mt-4 text-[0.85rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
            {en.sponsor.reviewLead}
          </p>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Rules</h2>
          <ul className="mt-4">
            {RULES.map((rule) => (
              <li key={rule} className="hairline-row measure py-3 text-[0.88rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
                {rule}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
            {en.sponsor.faqTitle}
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {faqs.map((item) => (
              <li
                key={item.q}
                className="px-6 py-6 sm:px-7 sm:py-7"
                style={{
                  background: ledgerOg.paperDeep,
                  borderRadius: "var(--r-card)",
                  boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.06)",
                }}
              >
                <p
                  className="text-[1.05rem] font-semibold leading-snug tracking-[-0.02em]"
                  style={{ color: ledgerOg.ink }}
                >
                  {item.q}
                </p>
                <p
                  className="mt-2.5 text-[0.92rem] leading-relaxed"
                  style={{ color: ledgerOg.inkSoft }}
                >
                  {item.a}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Enquire</h2>
          <p className="measure mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            The side rail is above and you can buy it without talking to us. For the connect first slot or a promoted
            team, mail {site.company} at{" "}
            <a className="accent-hover underline" href={mail}>{site.email}</a> with the tool, the link you want, and the
            placement. We will tell you what the traffic actually is before you pay anything.
          </p>
          <p className="mt-6 text-[0.72rem]" style={{ color: ledger.inkFaint }}>
            <time dateTime={STATS_AS_OF_ISO}>{en.sponsor.updated(STATS_AS_OF)}</time>
          </p>
        </section>
    </WingsSplit>
  );
}
