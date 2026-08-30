import Image from "next/image";

/*
 * The BT site mark: grey BT with a teal dot on the T bar. No tile, no outline.
 * Decorative: it always sits next to a text label, so it stays aria-hidden.
 *
 * `layoutSize` lets the mark render visually large while only occupying
 * that much height in the row (negative block margins absorb the rest),
 * so enlarging the mark never makes a one-screen page scroll.
 */
export function WingsMark({
  size = 16,
  layoutSize,
  className = "",
  priority = false,
}: {
  size?: number;
  /** Height the mark contributes to layout; defaults to the visual size. */
  layoutSize?: number;
  className?: string;
  /** Set on above-the-fold instances: this mark is the page's LCP element. */
  priority?: boolean;
}) {
  const overflow = layoutSize !== undefined ? (size - layoutSize) / 2 : 0;

  return (
    <span
      className={`wings-mark relative inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        marginTop: -overflow,
        marginBottom: -overflow,
      }}
      aria-hidden
    >
      <Image
        src="/brand/bt-mark.svg"
        alt=""
        fill
        sizes={`${size}px`}
        priority={priority}
        className="object-contain"
      />
    </span>
  );
}
