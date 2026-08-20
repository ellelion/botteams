/*
 * Character cascade: each letter materialises out of a blur, in sequence.
 * Chosen over a typewriter because it echoes the brand's own blur-to-sharp
 * motif (the wings emblem, the stealth veils) instead of borrowing a
 * terminal trope.
 *
 * Server-rendered and CSS-only. The text is real text in the HTML, so
 * crawlers and no-JS clients read it normally; the animation is a pure
 * enhancement and is skipped entirely under prefers-reduced-motion.
 * Words are inline-block so a line never breaks mid-word.
 */
export function RevealText({
  text,
  delay = 0,
  step = 0.028,
  className,
}: {
  text: string;
  /** Seconds before the first character starts. */
  delay?: number;
  /** Seconds between characters. */
  step?: number;
  className?: string;
}) {
  let index = 0;
  const words = text.split(" ");

  return (
    <span className={className}>
      {/* The accessible copy: one clean string for screen readers. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, w) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {[...word].map((char, c) => (
              <span
                key={c}
                className="reveal-char inline-block"
                style={{ animationDelay: `${delay + index++ * step}s` }}
              >
                {char}
              </span>
            ))}
            {w < words.length - 1 ? (
              <span
                className="reveal-char inline-block"
                style={{ animationDelay: `${delay + index++ * step}s` }}
              >
                &nbsp;
              </span>
            ) : null}
          </span>
        ))}
      </span>
    </span>
  );
}
