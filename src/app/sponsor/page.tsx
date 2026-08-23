import type { Metadata } from "next";
import { Suspense } from "react";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { BuySlot } from "@/components/sponsor/BuySlot";
import { PaidNotice } from "@/components/sponsor/PaidNotice";
import { RAIL_PLANS } from "@/lib/rail";
import { railCheckoutReady } from "@/lib/stripe";
import { getRailInventory } from "@/lib/rail-inventory";
import { ledger } from "@/lib/ledger-theme";
import { SPONSOR_SLOTS_TOTAL, sponsorHref } from "@/data/sponsors";
import { en } from "@/lib/messages/en";
import { listTeams } from "@/lib/teams";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sponsor",
  description:
    "Put your tool in front of people standing up Grok Bot teams. Side rail and a team-page slot. Operated by Ellelion LLC.",
  alternates: { canonical: `${site.url}/sponsor` },
};

const ACCEPT = [
  "Digital products only.",
  "Public URL, not a shortener, not a competing Grok Bot team or bot directory.",
  "No crypto, no trading signals, no lead-generation for either.",
];

const NEED = [
  "Title, 28 characters or fewer.",
  "Short description, 52 characters or fewer, as plain as the shelf.",
  "Destination URL.",
  "A simple mark (png, svg, webp, or jpg). Not a landing screenshot, not a person photo, not a watermarked stock ad.",
];

const RULES = [
  "No competing directories of Grok Bot teams or bots.",
  "No crypto, no trading signals, no lead-generation for either.",
  "The tool has to be something a Bot could use. This is not general display advertising.",
  "We may edit the one-liner after it is live, so it reads like the rest of the shelf.",
  "Anywhere we earn on a click is marked, and the disclosure says so.",
  "No dashboard, no impression counts. You get a placement and an honest answer about traffic when you ask.",
];

export default async function SponsorPage() {
  const teams = listTeams().length;
  const { filled, open, paid } = await getRailInventory();
  const canBuy = open > 0 && railCheckoutReady(RAIL_PLANS);
  const mail = `mailto:${site.email}?subject=${encodeURIComponent("Sponsoring Grok Bot Teams")}`;

  return (
    <WingsSplit
      hero={
        <WingsHero title="Sponsor">
          <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
            People arrive here about to give a Grok Bot real work, and the first thing every team tells them is which tools
            to connect first. That is the whole audience: operators picking tools, at the moment they pick them.
          </p>
          <p className="mt-4 text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            {filled === 0
              ? `${teams} teams on the shelf and two house listings on the rail and ten slots open. The rail is the whole truth of it.`
              : `${filled} of ${SPONSOR_SLOTS_TOTAL} slots taken across ${teams} teams.`}
          </p>
          <p className="home-disclaimer mt-5">{en.notAffiliated}</p>
        </WingsHero>
      }
    >

        <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
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
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Placements</h2>
          <dl className="mt-4">
            {[
              ["Side rail", "Logo, name, one line. Rides the team index and every team page. Rotated evenly, never two in a row from the same category."],
              ["Connect first slot", "A single marked slot inside a team page, beside the connectors that team expects. Separate from the rail."],
              ["Promoted team", "A team you actually ship, marked Promoted in the index. It has to be a real, working recipe. We will not list an ad as a team."],
            ].map(([name, note]) => (
              <div key={name} className="hairline-row py-3">
                <dt style={{ fontFamily: ledger.serif }}>{name}</dt>
                <dd className="measure mt-1 text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{note}</dd>
              </div>
            ))}
          </dl>
          <p className="measure mt-4 text-[0.8rem] leading-relaxed" style={{ color: ledger.inkFaint }}>
            The side rail is priced and you can buy it below. The other two are per enquiry: we would rather quote those
            against real traffic than publish a number we cannot yet justify.
          </p>
          <p className="measure mt-3 text-[0.8rem] leading-relaxed" style={{ color: ledger.inkFaint }}>
            {en.sponsor.emptyPlacements}
          </p>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
            {en.sponsor.railTodayTitle}
          </h2>
          <ul className="mt-4">
            {paid.map((slot) => (
              <li key={slot.id} className="hairline-row flex flex-wrap items-center justify-between gap-3 py-3">
                <a
                  className="spon-paid-link accent-hover underline"
                  href={sponsorHref(slot, "sponsor-page")}
                  target="_blank"
                  rel="noopener sponsored"
                  style={{ fontFamily: ledger.serif, letterSpacing: "-0.03em" }}
                >
                  {slot.mark ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="spon-mark" src={slot.mark} alt="" width={18} height={18} />
                  ) : null}
                  {slot.name}
                </a>
                <span className="text-[0.78rem]" style={{ color: ledger.inkMuted }}>{slot.line}</span>
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
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Enquire</h2>
          <p className="measure mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            The side rail is above and you can buy it without talking to us. For the connect first slot or a promoted
            team, mail {site.company} at{" "}
            <a className="accent-hover underline" href={mail}>{site.email}</a> with the tool, the link you want, and the
            placement. We will tell you what the traffic actually is before you pay anything.
          </p>
        </section>
    </WingsSplit>
  );
}
