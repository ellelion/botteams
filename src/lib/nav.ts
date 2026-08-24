import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

export type NavId = "teams" | "bots" | "connectors" | "docs" | "api" | "sponsor" | "github";

export type NavItem = {
  href: string;
  label: string;
  id: NavId;
  external?: boolean;
};

export const MAIN_NAV: NavItem[] = [
  { href: "/", label: en.nav.teams, id: "teams" },
  { href: "/?kind=bot", label: en.nav.bots, id: "bots" },
  { href: "/connectors", label: en.nav.connectorsNav, id: "connectors" },
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
