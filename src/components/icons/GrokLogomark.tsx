/*
 * xAI's Grok logomark, rendered from the official files exactly as they
 * ship. Both variants are copied unaltered into public/brand/grok, with
 * the licence note beside them.
 *
 * Two <img> tags rather than one recoloured SVG, because recolouring is
 * the thing the brand guidelines forbid: Dark is the near-black mark for
 * a light page, Light is the white mark for a dark one, and CSS picks
 * between them. Crawlers and no-JS clients have no data-theme, so they
 * get the light-page variant, the same rule the wings use.
 */
export function GrokLogomark({ className = "" }: { className?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- an 18px
          footer mark is never the LCP element, and next/image would
          re-encode artwork the brand guidelines say to ship unaltered. */}
      <img
        src="/brand/grok/Grok_Logomark_Dark.svg"
        alt=""
        className={`grok-mark grok-mark-on-light ${className}`}
        width={18}
        height={18}
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- an 18px
          footer mark is never the LCP element, and next/image would
          re-encode artwork the brand guidelines say to ship unaltered. */}
      <img
        src="/brand/grok/Grok_Logomark_Light.svg"
        alt=""
        className={`grok-mark grok-mark-on-dark ${className}`}
        width={18}
        height={18}
        aria-hidden
      />
    </>
  );
}
