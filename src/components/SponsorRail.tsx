import {
  SPONSOR_SLOTS_TOTAL,
  type Campaign,
  filledCount,
  houseAds,
  houseHref,
  openCount,
  paidSlots,
  sponsorHref,
} from "@/data/sponsors";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";

/*
 * Sponsor rail.
 *
 * It used to render three identical "Open / Take this slot" rows, which
 * is a shelf advertising that nobody wants it. Now it shows the two
 * Ellelion products, each labelled as ours, and then says in one block how
 * many paying slots are open, with one way to buy one.
 *
 * The count is paying only. House ads never move it.
 */

function HouseRow({ ad, campaign }: { ad: (typeof houseAds)[number]; campaign: Campaign }) {
  return (
    <li className="hairline-row py-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <a
          className="accent-hover text-[0.95rem]"
          href={houseHref(ad, campaign)}
          target="_blank"
          rel="nofollow noopener noreferrer"
          /* A type lockup, not a logo. Neither site ships a wordmark file
             here, and drawing one would be inventing their brand. */
          style={{ fontFamily: ledger.serif, letterSpacing: "-0.03em" }}
        >
          {ad.name}
        </a>
        <span className="chip">{en.sponsor.houseLabel}</span>
      </div>
      <p className="mt-1 text-[0.78rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
        {ad.line}
      </p>
    </li>
  );
}

export function SponsorRail({ campaign = "rail" }: { campaign?: Campaign }) {
  const filled = filledCount();
  const paid = paidSlots();
  const open = openCount();

  return (
    <aside className="mt-12 border-t pt-6" style={{ borderColor: ledger.hairline }}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
          {en.sponsor.railTitle}
        </h2>
        <a
          className="accent-hover text-[0.62rem] uppercase tracking-[0.16em] underline"
          href="/sponsor"
          style={{ color: ledger.label }}
        >
          {en.sponsor.railCta(filled, SPONSOR_SLOTS_TOTAL)}
        </a>
      </div>

      <ul className="mt-3">
        {paid.map((slot) => (
          <li key={slot.id} className="hairline-row flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
            <a
              className="accent-hover text-[0.95rem] underline"
              href={sponsorHref(slot, campaign)}
              target="_blank"
              rel="noopener sponsored"
              style={{ fontFamily: ledger.serif, letterSpacing: "-0.03em" }}
            >
              {slot.name}
            </a>
            <span className="text-[0.78rem]" style={{ color: ledger.inkMuted }}>{slot.line}</span>
          </li>
        ))}
        {houseAds.map((ad) => (
          <HouseRow key={ad.id} ad={ad} campaign={campaign} />
        ))}
      </ul>

      {/* One block, not a column of empty rows. */}
      <div className="spon-open measure">
        <p className="text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
          {en.sponsor.houseNote}
        </p>
        <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          {en.sponsor.openLine(open, SPONSOR_SLOTS_TOTAL)}
        </p>
        <a className="spon-cta mt-4" href="/sponsor">{en.sponsor.takeSlot}</a>
      </div>

      {paid.some((s) => s.affiliate) ? (
        <p className="mt-3 text-[0.68rem] leading-relaxed" style={{ color: ledger.inkFaint }}>
          {en.sponsor.disclosure}
        </p>
      ) : null}
    </aside>
  );
}
