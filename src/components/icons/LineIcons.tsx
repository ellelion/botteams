import type { ReactNode } from "react";
import { sectionSlug } from "@/lib/bot-icon";

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
  data: (<><ellipse cx="12" cy="6.5" rx="7" ry="2.8"/><path d="M5 6.5v11c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-11"/><path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8"/></>),
  design: (<><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.6"/><path d="M12 4v5M12 15v5M4 12h5M15 12h5"/></>),
  engineering: (<><path d="M9 8.5 4.5 12 9 15.5"/><path d="M15 8.5 19.5 12 15 15.5"/><path d="M13.5 5.5l-3 13"/></>),
  helpdesk: (<><path d="M20 12a8 8 0 1 0-3.2 6.4L20 19.5z"/><path d="M9.8 9.8a2.3 2.3 0 1 1 3 2.2v1.2"/><path d="M12.8 16h.01"/></>),
  infrastructure: (<><rect x="3.5" y="4" width="17" height="6" rx="1.6"/><rect x="3.5" y="14" width="17" height="6" rx="1.6"/><path d="M7 7h.01M7 17h.01"/><path d="M11 7h6M11 17h6"/></>),
  knowledge: (<><path d="M4 5.5A2 2 0 0 1 6 3.5h5v16H6a2 2 0 0 0-2 2z"/><path d="M20 5.5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2z"/></>),
  revenue: (<><path d="M4 19h16"/><path d="M5 15.5l4.5-4.5 3 3 6.5-7"/><path d="M14 7h5v5"/><circle cx="9.5" cy="11" r=".9" fill="currentColor"/></>),
  workplace: (<><path d="M3.5 20h17"/><path d="M5.5 20V9l6.5-4.5L18.5 9v11"/><rect x="9" y="12.5" width="6" height="7.5" rx="1"/><path d="M9 9h6"/></>),
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


/* Facet icons for the connector catalog. Same 24 viewBox, same 1.5 stroke
   and round joins as PACK and BOT, so the page keeps one icon language
   instead of two. Keyed by the category label itself. */
const CATEGORY: Record<string, ReactNode> = {
  "built in": (<><path d="M12 3.5 5 6.5v5.2c0 4 2.8 6.9 7 8.3 4.2-1.4 7-4.3 7-8.3V6.5z"/><path d="M9 12l2.2 2.2L15.5 10"/></>),
  featured: (<><path d="M12 4.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 10.2l5.4-.8z"/></>),
  advertising: (<><path d="M4 10v4a1.5 1.5 0 0 0 1.5 1.5H8l6 4V6l-6 4H5.5A1.5 1.5 0 0 0 4 11.5z"/><path d="M17.5 9a4 4 0 0 1 0 6"/></>),
  analytics: (<><path d="M4 20h16"/><rect x="5.5" y="12" width="3.5" height="5" rx="1"/><rect x="10.5" y="8" width="3.5" height="9" rx="1"/><rect x="15.5" y="4.5" width="3.5" height="12.5" rx="1"/></>),
  developer: (<><path d="M9 8.5 4.5 12 9 15.5"/><path d="M15 8.5 19.5 12 15 15.5"/><path d="M13.5 5.5l-3 13"/></>),
  finance: (<><rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6.5 12h.01M17.5 12h.01"/></>),
  productivity: (<><rect x="4" y="4.5" width="16" height="15" rx="2"/><path d="M8.5 10.5l2 2 4-4.5"/><path d="M8.5 15.5h7"/></>),
  sales: (<><path d="M4 17.5l5.5-5.5 3 3 7-7.5"/><path d="M14.5 7.5h5v5"/></>),
  "business and enterprise": (<><path d="M4 20h16"/><path d="M6 20V6a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 15 6v14"/><path d="M15 20v-8h2.5A1.5 1.5 0 0 1 19 13.5V20"/><path d="M9 8h3M9 11.5h3M9 15h3"/></>),
  "cursor marketplace": (<><path d="M4 9.5 5.5 5h13L20 9.5"/><path d="M4 9.5h16v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z"/><path d="M9.5 20v-5h5v5"/></>),
  "community tools": (<><circle cx="9" cy="8.5" r="2.8"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9.5" r="2.1"/><path d="M20.5 18.5a4 4 0 0 0-3.6-4"/></>),
};

export function CategoryIcon({ name, className = "line-icon" }: { name: string } & IconProps) {
  return <I className={className}>{CATEGORY[name.trim().toLowerCase()] ?? CATEGORY.featured}</I>;
}

export function PackIcon({ slug, className = "line-icon" }: { slug: string } & IconProps) {
  return <I className={className}>{PACK[slug] ?? PACK.product}</I>;
}

/* A section label ("Customer success") rather than a slug, because that is
   what the index and the team files carry. Every one of the 26 sections has
   its own glyph; the fallback is here for a section added before its icon. */
export function SectionIcon({ section, className = "line-icon" }: { section: string } & IconProps) {
  return <I className={className}>{PACK[sectionSlug(section)] ?? PACK.product}</I>;
}

export function BotIcon({ name, className = "line-icon" }: { name?: string } & IconProps) {
  const key = (name || "staff").toLowerCase();
  return <I className={className}>{BOT[key] ?? BOT.staff}</I>;
}
