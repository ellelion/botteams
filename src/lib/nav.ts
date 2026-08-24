import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

export type NavId = "teams" | "bots" | "connectors" | "guide" | "guides" | "docs" | "api" | "sponsor" | "github";

export type NavItem = {
  href: string;
  label: string;
  /* Masthead only. The phone sheet keeps the full label. */
  short?: string;
  id: NavId;
  external?: boolean;
};

export const MAIN_NAV: NavItem[] = [
  { href: "/", label: en.nav.teams, id: "teams" },
  { href: "/?kind=bot", label: en.nav.bots, id: "bots" },
  { href: "/connectors", label: en.nav.connectorsNav, id: "connectors" },
  { href: "/grok-bot", label: en.nav.guide, short: en.nav.guideShort, id: "guide" },
  { href: "/guides", label: en.nav.guides, id: "guides" },
  { href: "/docs", label: en.nav.docs, id: "docs" },
  { href: "/api", label: en.nav.api, id: "api" },
  { href: "/sponsor", label: en.nav.sponsor, id: "sponsor" },
  { href: site.github, label: en.nav.github, id: "github", external: true },
];

export function isNavCurrent(id: NavId, pathname: string, kind: string | null): boolean {
  switch (id) {
    case "teams":
      if (pathname.startsWith("/teams/")) return true;
      return pathname === "/" && kind !== "bot";
    case "bots":
      if (pathname.startsWith("/bots/")) return true;
      return pathname === "/" && kind === "bot";
    case "connectors":
      return pathname === "/connectors" || pathname.startsWith("/connectors/");
    case "guide":
      return pathname === "/grok-bot" || pathname.startsWith("/grok-bot/");
    case "guides":
      return pathname === "/guides" || pathname.startsWith("/guides/");
    case "docs":
      return pathname === "/docs" || pathname.startsWith("/docs/");
    case "api":
      return pathname === "/api";
    case "sponsor":
      return pathname === "/sponsor" || pathname.startsWith("/sponsor/");
    default:
      return false;
  }
}

export function isFooterCurrent(href: string, pathname: string, kind: string | null): boolean {
  if (href === "/") return isNavCurrent("teams", pathname, kind);
  if (href === "/?kind=bot") return isNavCurrent("bots", pathname, kind);
  if (href === "/connectors") return isNavCurrent("connectors", pathname, kind);
  if (href === "/sponsor") return isNavCurrent("sponsor", pathname, kind);
  if (href === "/docs") return isNavCurrent("docs", pathname, kind);
  if (href === "/grok-bot") return isNavCurrent("guide", pathname, kind);
  if (href === "/guides") return isNavCurrent("guides", pathname, kind);
  if (href === "/api") return isNavCurrent("api", pathname, kind);
  if (href.startsWith("http:") || href.startsWith("https:") || href.startsWith("mailto:")) return false;
  const path = href.split("?")[0];
  if (!path || path === "/") return false;
  return pathname === path || pathname.startsWith(`${path}/`);
}
