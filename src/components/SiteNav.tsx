"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { en } from "@/lib/messages/en";
import { MAIN_NAV, isNavCurrent } from "@/lib/nav";

export function SiteNavLinks({
  className = "site-masthead-nav",
  pathname,
  kind,
  onNavigate,
}: {
  className?: string;
  pathname?: string;
  kind?: string | null;
  onNavigate?: () => void;
}) {
  return (
    <nav className={className} aria-label={en.nav.mainAria}>
      {MAIN_NAV.map((item) => {
        const current = pathname ? isNavCurrent(item.id, pathname, kind ?? null) : false;
        if (item.external) {
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className === "site-masthead-nav" ? "accent-hover site-nav-icon" : "site-menu-link"}
              aria-label={`${item.label}. ${en.nav.opensNew}`}
              title={item.label}
              onClick={onNavigate}
            >
              {className === "site-masthead-nav" ? <GitHubIcon className="h-4 w-4" /> : (
                <>
                  <GitHubIcon className="h-[14px] w-[14px]" />
                  {item.label}
                </>
              )}
            </a>
          );
        }
        const masthead = className === "site-masthead-nav";
        const shown = masthead && item.short ? item.short : item.label;
        return (
          <Link
            key={item.id}
            href={item.href}
            scroll={false}
            className={
              masthead
                ? `accent-hover${current ? " is-current" : ""}`
                : `site-menu-link${current ? " is-current" : ""}`
            }
            aria-label={item.short && masthead ? item.label : undefined}
            aria-current={current ? "page" : undefined}
            onClick={onNavigate}
          >
            {shown}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteNavFallback() {
  return <SiteNavLinks />;
}

export function SiteNav() {
  const pathname = usePathname();
  const kind = useSearchParams().get("kind");
  return <SiteNavLinks pathname={pathname} kind={kind} />;
}
