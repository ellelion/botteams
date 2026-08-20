import { sponsorSlots } from "@/data/sponsors";

export function SponsorRail() {
  return (
    <aside className="mt-20 border-t border-line pt-10">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-mute">Sponsors</p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {sponsorSlots.map((slot) => (
          <li
            key={slot.id}
            className="flex h-16 items-center justify-center rounded-lg border border-dashed border-line bg-card text-[12px] text-mute"
          >
            {slot.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
