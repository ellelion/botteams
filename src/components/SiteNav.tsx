"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { en } from "@/lib/messages/en";
import { MAIN_NAV, isNavCurrent } from "@/lib/nav";

export function SiteNav({ className = "site-masthead-nav" }: { className?: string }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const kind = params.get("kind");

  return (
    <nav className={className} aria-label={en.nav.mainAria}>
      {MAIN_NAV.map((item) => {
        const current = isNavCurrent(item.id, pathname, kind);
        if (item.external) {
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="accent-hover site-nav-icon"
              aria-label={item.label}
              title={item.label}
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
          );
        }
        return (
          <Link
            key={item.id}
            href={item.href}
            scroll={false}
            className={`accent-hover${current ? " is-current" : ""}`}
            aria-current={current ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
