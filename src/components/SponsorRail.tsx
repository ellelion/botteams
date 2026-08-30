import {
  type Campaign,
  sponsorHref,
  type SponsorSlot,
} from "@/data/sponsors";
import { getListingChrome } from "@/lib/rail-inventory";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";

function SlotRow({ slot, campaign }: { slot: SponsorSlot; campaign: Campaign }) {
  return (
    <li className="side-rail-item">
      <a
        className="spon-paid-link accent-hover text-[0.88rem] underline"
        href={sponsorHref(slot, campaign)}
        target="_blank"
        rel={slot.owned ? "nofollow noopener noreferrer" : "noopener sponsored"}
        style={{ fontFamily: ledger.serif, letterSpacing: "-0.03em" }}
        aria-label={`${slot.name}. ${en.nav.opensNew}`}
      >
        {slot.mark ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="spon-mark" src={slot.mark} alt="" width={18} height={18} />
        ) : null}
        <span className="spon-name">{slot.name}</span>
      </a>
      {slot.line ? (
        <span className="mt-1 block text-[0.72rem] leading-snug" style={{ color: ledger.inkMuted }}>
          {slot.line}
        </span>
      ) : null}
    </li>
  );
}

export async function SponsorRail({
  campaign = "rail",
  side = "stack",
}: {
  campaign?: Campaign;
  side?: "left" | "right" | "stack";
}) {
  const filled = await getListingChrome();
  if (filled.length === 0) return null;

  return (
    <aside
      className={side === "stack" ? "side-rail side-rail--stack" : `side-rail side-rail--${side}`}
      aria-label={en.sponsor.railTitle}
    >
      <div className="side-rail-stick">
        <p className="side-rail-label" style={{ color: ledger.accentText }}>
          {en.sponsor.railTitle}
        </p>
        <ul className="side-rail-list">
          {filled.map((slot) => (
            <SlotRow key={slot.id} slot={slot} campaign={campaign} />
          ))}
        </ul>
      </div>
    </aside>
  );
}
