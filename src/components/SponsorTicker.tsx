import {
  type Campaign,
  houseSlots,
  sponsorHref,
  type SponsorSlot,
} from "@/data/sponsors";
import { HideNextIndicator } from "@/components/HideNextIndicator";
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
      style={{ height: 20, fontSize: "0.58rem", padding: "0 6px 0 5px" }}
    >
      {slot.mark ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="spon-chip-mark" src={slot.mark} alt="" width={12} height={12} />
      ) : null}
      <span>{name}</span>
    </a>
  );
}

function ChipRow({
  slots,
  campaign,
}: {
  slots: SponsorSlot[];
  campaign: Campaign;
}) {
  const base = slots.length ? slots : houseSlots;
  return (
    <div
      className="spon-mq-copy"
      style={{
        flex: 1,
        minWidth: 0,
        justifyContent: "safe center",
        overflowX: "auto",
        gap: 6,
        paddingRight: 0,
      }}
    >
      {base.map((slot, i) => (
        <Chip key={`${slot.id}-${i}`} slot={slot} campaign={campaign} />
      ))}
      <a
        className="spon-chip spon-chip-add"
        href="/sponsor"
        style={{ height: 20, fontSize: "0.58rem", padding: "0 6px" }}
      >
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
    <div className={`spon-mq spon-mq--${place}`} aria-label={en.sponsor.listingKicker}>
      {place === "bottom" ? <HideNextIndicator /> : null}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "0 10px",
          gap: 8,
        }}
      >
        <span
          className="spon-mq-label"
          style={{
            position: "static",
            flex: "none",
            boxShadow: "none",
            background: "transparent",
            padding: 0,
            fontSize: "0.5rem",
            letterSpacing: "0.14em",
          }}
        >
          {en.sponsor.listingKicker}
        </span>
        <ChipRow slots={list} campaign={campaign} />
      </div>
    </div>
  );
}
