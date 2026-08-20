import { resolveConnectors } from "@/lib/connectors";

export function ConnectorRow({
  names,
  labeled = false,
  size = 18,
}: {
  names: string[];
  labeled?: boolean;
  size?: number;
}) {
  const marks = resolveConnectors(names);
  if (marks.length === 0) return null;
  return (
    <ul className="connector-row" aria-label="Connectors already on the account">
      {marks.map((mark) => (
        <li key={mark.slug || mark.name} className="connector-item">
          {mark.src ? (
            <img
              className="connector-mark"
              src={mark.src}
              alt=""
              width={size}
              height={size}
            />
          ) : (
            <span className="connector-fallback" style={{ width: size, height: size }} aria-hidden>
              {mark.name.slice(0, 1)}
            </span>
          )}
          {labeled ? <span className="connector-name">{mark.name}</span> : null}
          {!labeled ? <span className="sr-only">{mark.name}</span> : null}
        </li>
      ))}
    </ul>
  );
}
