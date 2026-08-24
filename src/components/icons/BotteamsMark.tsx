/*
 * Family letter mark: a single rounded stroke B with the mint accent
 * at the upper bowl. Same path as the ellelion.com catalog BrandMark
 * and as src/app/icon.svg. currentColor follows the wordmark so the
 * stroke flips with the theme; the dot stays #54b9a6.
 */

const B_PATH =
  "M7 5 V19 M7 5 H13 a3.5 3.5 0 0 1 0 7 H7 M7 12 H13.8 a3.5 3.5 0 0 1 0 7 H7";

export function BotteamsMark({
  size = 22,
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
        d={B_PATH}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16.5" cy="8.5" r="1.5" fill="#54b9a6" />
    </svg>
  );
}
