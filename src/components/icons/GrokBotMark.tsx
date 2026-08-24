/*
 * The Bot face on this shelf. Colour is --fg (site accent) / --bg. Motion is CSS.
 * Ellelion LLC, not affiliated with xAI.
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
        <ellipse className="grok-bot-mark__eye" cx="105.63" cy="94.13" rx="17.7" ry="23.45" />
        <ellipse className="grok-bot-mark__eye" cx="163.48" cy="82.18" rx="15.7" ry="23.4" />
        <path
          className="grok-bot-mark__smile"
          d="M114.2 141.6C126.4 161.8 151.8 159.4 167.6 128.8C154.2 149.2 130.6 151.4 114.2 141.6Z"
        />
      </g>
    </svg>
  );
}
