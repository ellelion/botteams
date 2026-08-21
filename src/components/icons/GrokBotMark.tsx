/*
 * The Grok Bot face mark. This is our icon for a Bot: wherever the shelf
 * lists a Bot, it wears this, the way x.ai does.
 *
 * The silhouette is xAI's, reproduced for identification on the same
 * footing as the connector marks under /public/connectors. Grok Bot Teams
 * is operated by Ellelion LLC and is not affiliated with xAI.
 *
 * Artwork comes from the clean bezier in x.ai's own defs/clipPath rather
 * than the 3,577-character polygon they render, so this scales without
 * faceting at a fraction of the size.
 *
 * Colour follows x.ai's own hooks: --fg and --bg are set per instance
 * (their Engineering chips run --fg:#EA4045), so one copy of the artwork
 * serves a whole roster of differently tinted Bots.
 *
 * MOTION. x.ai drives the face from bundled JS with three states, which
 * we sampled at 20Hz for 48s off the live page rather than guessed at:
 *
 *   data-state   idle -> curious -> happy
 *   head rotate  -2.9deg .. +18deg   (rests near -1, tilts ~+9 when curious)
 *   head scaleY  0.98 .. 1.02        (a slow breathe; scaleX never moves)
 *   eye scale    1.0 .. 1.17         (grows while engaged)
 *   eye scaleY   down to 0.04        (a full blink, ~5% of frames)
 *   eyes         travel to a second anchor and wander while curious
 *
 * Reproduced here as CSS keyframes on our own rig, so the mark stays a
 * server component with no JS. The head sits in its own group because a
 * rotation has to pivot on the face, not on the SVG box.
 */

const HEAD =
  "M228.541 114.228C228.541 130.133 225.184 145.994 218.738 160.534C212.674 174.217 203.904 186.669 193.065 196.988C155.933 232.34 99.497 238.596 55.5255 212.24C45.097 205.99 35.6851 198.072 27.7451 188.866C19.1926 178.953 12.3686 167.569 7.65781 155.351C2.60712 142.264 0 128.257 0 114.228C0 98.3219 3.35751 82.4611 9.80315 67.9215C15.8672 54.2382 24.6377 41.7862 35.4767 31.4668C72.6081 -3.88483 129.044 -10.1413 173.016 16.2153C183.444 22.4653 192.856 30.3829 200.796 39.5896C209.349 49.5018 216.173 60.8859 220.883 73.1037C225.934 86.1906 228.541 100.198 228.541 114.228Z";

export function GrokBotMark({
  size = 18,
  animate = false,
  className = "",
  style,
}: {
  size?: number;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={`grok-bot-mark${animate ? " grok-bot-mark--live" : ""} ${className}`}
      viewBox="-6 -12 241 250"
      width={size}
      height={size}
      style={style}
      aria-hidden
      focusable="false"
    >
      <g className="grok-bot-mark__face">
        <path className="grok-bot-mark__head" d={HEAD} />
        {/* Eye geometry measured off the live mark in its idle state. */}
        <ellipse className="grok-bot-mark__eye" cx="105.63" cy="94.13" rx="17.7" ry="23.45" />
        <ellipse className="grok-bot-mark__eye" cx="163.48" cy="82.18" rx="15.7" ry="23.4" />
      </g>
    </svg>
  );
}
