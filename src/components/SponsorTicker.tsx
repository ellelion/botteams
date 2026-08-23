import {
  type Campaign,
  houseSlots,
  sponsorHref,
  type SponsorSlot,
} from "@/data/sponsors";
import { en } from "@/lib/messages/en";

function Chip({
  slot,
  campaign,
}: {
  slot: SponsorSlot;
  campaign: Campaign;
}) {
  const name = slot.name ?? "Sponsor";
  return (
    <a
      className="spon-chip"
      href={sponsorHref(slot, "rail")}
      target="_blank"
      rel={slot.owned ? "nofollow noopener noreferrer" : "noopener sponsored"}
    >
      {slot.mark ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="spon-chip-mark" src={slot.mark} alt="" width={18} height={18} />
      ) : null}
      <span>{name}</span>
    </a>
  );
}

function ChipRow({
  slots,
  campaign,
  hidden,
}: {
  slots: SponsorSlot[];
  campaign: Campaign;
  hidden?: boolean;
}) {
  const base = slots.length ? slots : houseSlots;
  return (
    <div className="spon-mq-copy" aria-hidden={hidden || undefined}>
      {base.map((slot, i) => (
        <Chip key={`${hidden ? "b" : "a"}-${slot.id}-${i}`} slot={slot} campaign={campaign} />
      ))}
      <a className="spon-chip spon-chip-add" href="/sponsor" tabIndex={hidden ? -1 : undefined}>
        {en.sponsor.addYours}
      </a>
    </div>
  );
}

export function SponsorTicker({
  campaign = "rail",
  slots = houseSlots,
  place = "top",
}: {
  campaign?: Campaign;
  slots?: SponsorSlot[];
  place?: "top" | "bottom";
}) {
  const list = place === "bottom" ? [...slots].reverse() : slots;
  return (
    <div
      className={`spon-mq spon-mq--${place}${place === "bottom" ? " spon-mq--rev" : ""}`}
      aria-label={en.sponsor.listingKicker}
    >
      <span className="spon-mq-label">{en.sponsor.listingKicker}</span>
      <div className="spon-mq-viewport">
        <div className="spon-mq-track">
          <ChipRow slots={list} campaign={campaign} />
          <ChipRow slots={list} campaign={campaign} hidden />
        </div>
      </div>
    </div>
  );
}
