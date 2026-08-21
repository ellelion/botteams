/*
 * Leaves this site. A square with an arrow out of it, drawn in
 * currentColor so it takes the colour of the link it follows rather than
 * becoming a second accent.
 *
 * Decorative: every use sits directly after the link text, which already
 * names the destination, so it stays aria-hidden.
 */
export function ExternalLinkIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}
