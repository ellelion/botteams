import { SPONSOR_SLOTS_TOTAL, filledCount, railSlots, sponsorHref } from "@/data/sponsors";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";

/*
 * Sponsor rail. Restrained on purpose: three slots, hairline rows, no
 * dashed placeholder boxes pretending to be inventory. When nothing is
 * sold the rail says so in one line and links to /sponsor.
 */
export function SponsorRail({ campaign = "rail" as const }: { campaign?: "rail" | "team-page" }) {
  const filled = filledCount();
  const slots = railSlots(Math.min(3, SPONSOR_SLOTS_TOTAL));

  return (
    <aside className="mt-12 border-t pt-6" style={{ borderColor: ledger.hairline }}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
          {en.sponsor.railTitle}
        </h2>
        <a className="accent-hover text-[0.62rem] uppercase tracking-[0.16em] underline" href="/sponsor" style={{ color: ledger.label }}>
          {filled === 0 ? en.sponsor.railEmptyCta : en.sponsor.railCta(filled, SPONSOR_SLOTS_TOTAL)}
        </a>
      </div>
      <ul className="mt-3">
        {slots.map((slot) => (
          <li key={slot.id} className="hairline-row flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
            {slot.href ? (
              <>
                <a
                  className="accent-hover text-[0.85rem] underline"
                  href={sponsorHref(slot, campaign)}
                  target="_blank"
                  rel="noopener sponsored"
                  style={{ fontFamily: ledger.serif }}
                >
                  {slot.name}
                </a>
                <span className="text-[0.74rem]" style={{ color: ledger.inkMuted }}>{slot.line}</span>
              </>
            ) : (
              <>
                <span className="text-[0.85rem]" style={{ color: ledger.inkFaint, fontFamily: ledger.serif }}>
                  {en.sponsor.openSlot}
                </span>
                <a className="accent-hover text-[0.74rem] underline" href="/sponsor" style={{ color: ledger.label }}>
                  {en.sponsor.takeSlot}
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
      {slots.some((s) => s.affiliate) ? (
        <p className="mt-3 text-[0.68rem] leading-relaxed" style={{ color: ledger.inkFaint }}>{en.sponsor.disclosure}</p>
      ) : null}
    </aside>
  );
}
