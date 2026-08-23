import { en } from "@/lib/messages/en";

function OfficialSeal() {
  return (
    <svg className="chip-featured-mark" viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.15"
        d="M8 1.35 9.2 2.2l1.55-.35.75 1.4 1.5.55-.05 1.55 1.15 1.1-1.15 1.1.05 1.55-1.5.55-.75 1.4-1.55-.35L8 14.65l-1.2-.85-1.55.35-.75-1.4-1.5-.55.05-1.55-1.15-1.1 1.15-1.1-.05-1.55 1.5-.55.75-1.4 1.55.35L8 1.35z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.15 8.2 7 10.05l3.85-3.85"
      />
    </svg>
  );
}

export function FeaturedChip({ className = "" }: { className?: string }) {
  return (
    <span className={`chip chip-featured ${className}`.trim()} title={en.home.featured}>
      <OfficialSeal />
      {en.home.featured}
    </span>
  );
}
