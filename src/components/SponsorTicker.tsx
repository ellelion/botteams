"use client";

import {
  type Campaign,
  houseSlots,
  sponsorHref,
  type SponsorSlot,
} from "@/data/sponsors";
import { HideNextIndicator } from "@/components/HideNextIndicator";
import { en } from "@/lib/messages/en";
import { useScrollEdges } from "@/lib/use-scroll-edges";

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
  const rail = useScrollEdges<HTMLDivElement>(base.length);
  return (
    <div
      ref={rail.ref}
      className={`spon-mq-copy scroll-fade${rail.edges.start ? " has-start" : ""}${rail.edges.end ? " has-end" : ""}`}
      style={{
        flex: "0 1 auto",
        minWidth: 0,
        justifyContent: "center",
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
      <div className="spon-mq-row">
        <span className="spon-mq-label">
          {en.sponsor.listingKicker}
        </span>
        <ChipRow slots={list} campaign={campaign} />
      </div>
    </div>
  );
}
