import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { ledger } from "@/lib/ledger-theme";
import {
  SPONSOR_SLOTS_TOTAL,
  filledCount,
  houseAds,
  houseHref,
  openCount,
  paidSlots,
  sponsorHref,
} from "@/data/sponsors";
import { en } from "@/lib/messages/en";
import { listTeams } from "@/lib/teams";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sponsor",
  description:
    "Put your tool in front of people standing up Grok Bot teams. Side rail and a team-page slot. Operated by Ellelion LLC.",
  alternates: { canonical: `${site.url}/sponsor` },
};

export default function SponsorPage() {
  const teams = listTeams().length;
  const filled = filledCount();
  const paid = paidSlots();
  const open = openCount();
  const mail = `mailto:${site.email}?subject=${encodeURIComponent("Sponsoring Grok Bot Teams")}`;

  return (
    <div className="page-pad relative flex min-h-dvh flex-col" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="wrap-data relative z-10 flex-1 pb-[var(--sec-y)] pt-12">
        <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]" style={{ fontFamily: ledger.serif }}>
          Sponsor
        </h1>
        <p className="measure mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          People arrive here about to give a Grok Bot real work, and the first thing every team tells them is which tools
          to connect first. That is the whole audience: operators picking tools, at the moment they pick them.
        </p>
        <p className="measure mt-4 text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
          {filled === 0
            ? `${teams} teams on the shelf and no outside sponsors yet, which is worth saying plainly rather than padding the rail with logos we do not have. The rail below is the whole truth of it.`
            : `${filled} of ${SPONSOR_SLOTS_TOTAL} paying slots taken across ${teams} teams.`}
        </p>

        <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
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
            Pricing is per enquiry while the shelf is young. We would rather quote against real traffic than publish a
            number we cannot yet justify.
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
              <li key={slot.id} className="hairline-row flex flex-wrap items-baseline justify-between gap-3 py-3">
                <a
                  className="accent-hover underline"
                  href={sponsorHref(slot, "sponsor-page")}
                  target="_blank"
                  rel="noopener sponsored"
                  style={{ fontFamily: ledger.serif, letterSpacing: "-0.03em" }}
                >
                  {slot.name}
                </a>
                <span className="text-[0.78rem]" style={{ color: ledger.inkMuted }}>{slot.line}</span>
              </li>
            ))}
            {/* Ours, and labelled ours. They are on the rail so a visitor
                is not reading an empty column, and they take no slot. */}
            {houseAds.map((ad) => (
              <li key={ad.id} className="hairline-row py-3">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <a
                    className="accent-hover"
                    href={houseHref(ad, "sponsor-page")}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    style={{ fontFamily: ledger.serif, letterSpacing: "-0.03em" }}
                  >
                    {ad.name}
                  </a>
                  <span className="chip">{en.sponsor.houseLabel}</span>
                </div>
                <p className="measure mt-1 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{ad.line}</p>
              </li>
            ))}
          </ul>
          {/* One block. Fifteen identical Open rows is not inventory, it
              is a page telling you nobody bought anything. */}
          <div className="spon-open measure">
            <p className="text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
              {en.sponsor.houseNote}
            </p>
            <p className="mt-1 text-[0.85rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
              {en.sponsor.openLine(open, SPONSOR_SLOTS_TOTAL)}
            </p>
            <a className="spon-cta mt-4" href={mail}>{en.sponsor.takeSlot}</a>
          </div>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Rules</h2>
          <ul className="mt-4">
            {[
              "No competing directories of Grok Bot teams or bots.",
              "No crypto, no trading signals, no lead-generation for either.",
              "The tool has to be something a Bot could plausibly use. This is not general display advertising.",
              "We write or edit the one-line description. It has to read like the rest of the shelf.",
              "Anywhere we earn on a click is marked, and the disclosure says so.",
              "No dashboard, no impression counts. You get a placement and an honest answer about traffic when you ask.",
            ].map((rule) => (
              <li key={rule} className="hairline-row measure py-3 text-[0.88rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
                {rule}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>Enquire</h2>
          <p className="measure mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            Mail {site.company} at{" "}
            <a className="accent-hover underline" href={mail}>{site.email}</a> with the tool, the link you want, and the
            placement. We will tell you what the traffic actually is before you pay anything.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
