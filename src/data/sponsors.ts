export type SponsorSlot = {
  id: string;
  label: "Available";
};

export const sponsorSlots: SponsorSlot[] = Array.from({ length: 15 }, (_, i) => ({
  id: `slot-${i + 1}`,
  label: "Available",
}));
