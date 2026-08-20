import Image from "next/image";

/*
 * The tiny wings brand mark — theme-adaptive (black wings on the light
 * theme, white on dark, via the global .wings-on-* visibility rules).
 * Decorative: it always sits next to a text label, so it stays aria-hidden.
 *
 * `layoutSize` lets the mark render visually large while only occupying
 * that much height in the row (negative block margins absorb the rest),
 * so enlarging the wings never makes a one-screen page scroll.
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
      className={`relative inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        marginTop: -overflow,
        marginBottom: -overflow,
      }}
      aria-hidden
    >
      <Image
        src="/brand/wings-black.webp"
        alt=""
        fill
        sizes={`${size}px`}
        priority={priority}
        className="wings-on-light object-contain"
      />
      <Image
        src="/brand/wings-white.webp"
        alt=""
        fill
        sizes={`${size}px`}
        priority={priority}
        className="wings-on-dark object-contain"
      />
    </span>
  );
}
