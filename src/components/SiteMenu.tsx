"use client";

import { Suspense, useCallback, useId, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SiteNavLinks } from "@/components/SiteNav";
import { en } from "@/lib/messages/en";
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

function MenuLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const kind = useSearchParams().get("kind");
  return <SiteNavLinks className="site-menu-sheet" pathname={pathname} kind={kind} onNavigate={onNavigate} />;
}

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
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
          <div id={panelId} role="dialog" aria-modal="true" aria-label={en.nav.mainAria}>
            <Suspense fallback={<SiteNavLinks className="site-menu-sheet" onNavigate={close} />}>
              <MenuLinks onNavigate={close} />
            </Suspense>
          </div>
        </>
      ) : null}
    </div>
  );
}
