import type { ReactNode } from "react";

type IconProps = { className?: string };

function I({ children, className = "line-icon" }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

const PACK: Record<string, ReactNode> = {
  "founder-os": (<><path d="M4 15h16v5H4z"/><path d="M7 15V7l5-3 5 3v8"/></>),
  agency: (<><rect x="3.5" y="7" width="17" height="13" rx="1.5"/><path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7"/></>),
  bookkeeping: (<><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>),
  community: (<><path d="M16 19a4 4 0 0 0-8 0"/><circle cx="12" cy="9" r="3"/><path d="M18.5 18a3.5 3.5 0 0 0-2-5.2"/><circle cx="18" cy="8.5" r="2.2"/><path d="M5.5 18a3.5 3.5 0 0 1 2-5.2"/><circle cx="6" cy="8.5" r="2.2"/></>),
  content: (<><path d="M12 19V6"/><path d="M8 9l4-4 4 4"/><path d="M6 19h12"/></>),
  creator: (<><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M10 9.5v5l5-2.5z"/></>),
  "customer-success": (<><path d="M12 20s7-4.4 7-10a4 4 0 0 0-7-2 4 4 0 0 0-7 2c0 5.6 7 10 7 10z"/></>),
  events: (<><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></>),
  hiring: (<><circle cx="10" cy="8" r="3"/><path d="M3.5 19a6.5 6.5 0 0 1 13 0"/><path d="M18 8v5M15.5 10.5H20.5"/></>),
  "investor-updates": (<><path d="M4 19h16"/><path d="M5 15l5-5 3 3 6-7"/><path d="M14 6h5v5"/></>),
  legal: (<><path d="M12 4v16"/><path d="M5 8h14"/><path d="M6 8l-2 6h4zM18 8l2 6h-4z"/><path d="M8 20h8"/></>),
  onboarding: (<><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></>),
  partnerships: (<><path d="M10 13a4 4 0 1 1-2.8-6.8L9 8"/><path d="M14 11a4 4 0 1 1 2.8 6.8L15 16"/></>),
  product: (<><path d="M12 3 20 8v8l-8 5-8-5V8z"/><path d="M12 12 20 8M12 12v9M12 12 4 8"/></>),
  recruiting: (<><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></>),
  research: (<><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/><path d="M11 8v6M8 11h6"/></>),
  sales: (<><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/></>),
  support: (<><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="5" height="7" rx="1.5"/><rect x="16" y="13" width="5" height="7" rx="1.5"/><path d="M8 17h8"/></>),
};

const BOT: Record<string, ReactNode> = {
  staff: (<><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></>),
  inbox: (<><path d="M4 6h16v12H4z"/><path d="M4 6l8 7 8-7"/></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></>),
  card: (<><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/></>),
  stripe: (<><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/></>),
  pen: (<><path d="M13 5l6 6-9 9H4v-6z"/><path d="M11 7l6 6"/></>),
  search: (<><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></>),
  shield: (<><path d="M12 3 5 6v6c0 4.2 2.8 7.2 7 8.5 4.2-1.3 7-4.3 7-8.5V6z"/></>),
  recap: (<><path d="M8 7h12M8 12h12M8 17h8"/><circle cx="4.5" cy="7" r=".8" fill="currentColor"/><circle cx="4.5" cy="12" r=".8" fill="currentColor"/><circle cx="4.5" cy="17" r=".8" fill="currentColor"/></>),
  pipeline: (<><path d="M4 7h6l3 5 3-5h4"/><path d="M4 17h6l3-5 3 5h4"/></>),
  health: (<><path d="M4 12h4l2-4 4 8 2-4h4"/></>),
  clipboard: (<><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v2H9z"/><path d="M9 10h6M9 14h6"/></>),
  users: (<><circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.2"/><path d="M21 19a4.5 4.5 0 0 0-4-4.4"/></>),
  camera: (<><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M9 7 10.5 4h3L15 7"/><circle cx="12" cy="13" r="3"/></>),
  target: (<><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></>),
};

export function PackIcon({ slug, className = "line-icon" }: { slug: string } & IconProps) {
  return <I className={className}>{PACK[slug] ?? PACK.product}</I>;
}

export function BotIcon({ name, className = "line-icon" }: { name?: string } & IconProps) {
  const key = (name || "staff").toLowerCase();
  return <I className={className}>{BOT[key] ?? BOT.staff}</I>;
}
