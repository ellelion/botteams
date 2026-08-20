export type SponsorSlot = {
  id: string;
  label: "Available";
};

export const sponsorSlots: SponsorSlot[] = Array.from({ length: 15 }, (_, i) => ({
  id: `slot-${String(i + 1).padStart(2, "0")}`,
  label: "Available",
}));
