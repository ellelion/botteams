import { connection } from "next/server";
import { databaseUrl } from "@/lib/db";
import { listLivePayingSlots } from "@/lib/rail-db";
import { SPONSOR_SLOTS_TOTAL, houseSlots, type SponsorSlot } from "@/data/sponsors";

export type RailInventory = {
  filled: number;
  open: number;
  slots: SponsorSlot[];
  paid: SponsorSlot[];
};

const houseHrefs = new Set(houseSlots.map((s) => (s.href ?? "").replace(/\/$/, "")));

function pack(paid: SponsorSlot[]): RailInventory {
  const slots = [...houseSlots, ...paid];
  const filled = slots.length;
  return {
    filled,
    open: Math.max(0, SPONSOR_SLOTS_TOTAL - filled),
    slots,
    paid,
  };
}

export async function getRailInventory(): Promise<RailInventory> {
  try {
    await connection();
    let paid: SponsorSlot[] = [];
    if (databaseUrl()) {
      const rows = await listLivePayingSlots();
      paid = rows
        .filter((row) => !houseHrefs.has(row.href.replace(/\/$/, "")))
        .map((row) => ({
          id: row.id,
          name: row.name,
          line: row.line,
          href: row.href,
          mark: row.markUrl,
        }));
    }
    return pack(paid);
  } catch {
    return pack([]);
  }
}

export async function openPayingCount(): Promise<number> {
  const inventory = await getRailInventory();
  return inventory.open;
}

export async function filledSlotCount(): Promise<number> {
  const inventory = await getRailInventory();
  return inventory.filled;
}
