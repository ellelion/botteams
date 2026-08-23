import { en } from "@/lib/messages/en";

/** Exact `OfficialSeal` from prism `apps/web/components/listings/OfficialBadge.tsx`. */
function OfficialSeal() {
  return (
    <svg className="chip-featured-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        d="M12 2.6l2.2 1.7 2.7-.2.9 2.6 2.5 1.2-.6 2.7 1.7 2.1-1.7 2.1.6 2.7-2.5 1.2-.9 2.6-2.7-.2-2.2 1.7-2.2-1.7-2.7.2-.9-2.6-2.5-1.2.6-2.7L2.6 12l1.7-2.1-.6-2.7 2.5-1.2.9-2.6 2.7.2L12 2.6z"
      />
      <g transform="translate(12 12) scale(1.22) translate(-12 -12)">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.6 12.2l2.3 2.3 4.5-5"
        />
      </g>
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
