import { ConnectorRow } from "@/components/ConnectorRow";

/** Local brand marks only. Do not hotlink. */
export function ConnectorMarks({ names, size = 16 }: { names: string[]; size?: number }) {
  return <ConnectorRow names={names} size={size} />;
}
