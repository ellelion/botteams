"use client";

import { useCallback, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { en } from "@/lib/messages/en";
import { MAIN_NAV, isNavCurrent } from "@/lib/nav";
import { useDialogChrome } from "@/lib/use-dialog-chrome";

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      {open ? (
        <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" />
      ) : (
        <path d="M3 5.5h12M3 9h12M3 12.5h12" />
      )}
    </svg>
  );
}

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const kind = useSearchParams().get("kind");
  const close = useCallback(() => setOpen(false), []);

  useDialogChrome({ open, rootRef, onClose: close });

  return (
    <div className="site-menu" ref={rootRef}>
      <button
        type="button"
        className="site-menu-button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={open ? en.nav.closeMenu : en.nav.openMenu}
        onClick={() => setOpen((value) => !value)}
      >
        <MenuGlyph open={open} />
      </button>
      {open ? (
        <>
          <button type="button" className="site-menu-scrim" aria-label={en.nav.closeMenu} onClick={close} />
          <nav id={panelId} className="site-menu-sheet" role="dialog" aria-modal="true" aria-label={en.nav.mainAria}>
            {MAIN_NAV.map((item) => {
              const current = isNavCurrent(item.id, pathname, kind);
              if (item.external) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-menu-link"
                    onClick={close}
                  >
                    <GitHubIcon className="h-[14px] w-[14px]" />
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  scroll={false}
                  className={`site-menu-link${current ? " is-current" : ""}`}
                  aria-current={current ? "page" : undefined}
                  onClick={close}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </>
      ) : null}
    </div>
  );
}
