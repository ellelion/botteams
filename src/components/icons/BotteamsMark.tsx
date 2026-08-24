/*
 * Family two-letter mark: BT with the mint accent at the T bar.
 * Same path as the ellelion.com catalog BrandMark and as icon.svg.
 * currentColor follows the wordmark; the dot stays #54b9a6.
 */

const BT_PATH =
  "M3 5 V19 M3 5 H6.5 a3.5 3.5 0 0 1 0 7 H3 M6.5 12 a3.5 3.5 0 0 1 0 7 H3 M13.6 5 H21.4 M17.5 5 V19";

export function BotteamsMark({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <path
        d={BT_PATH}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21.4" cy="5" r="1.5" fill="#54b9a6" />
    </svg>
  );
}
