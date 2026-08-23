"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

function MenuGlyph() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M3 5.5h12M3 9h12M3 12.5h12" />
    </svg>
  );
}

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="site-menu">
      <button
        type="button"
        className="site-menu-button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={en.nav.mainAria}
        onClick={() => setOpen((value) => !value)}
      >
        <MenuGlyph />
      </button>
      {open ? (
        <>
          <button type="button" className="site-menu-scrim" aria-label="Close" onClick={close} />
          <nav id={panelId} className="site-menu-sheet" aria-label={en.nav.mainAria}>
            <Link href="/" scroll={false} className="site-menu-link" onClick={close}>{en.nav.teams}</Link>
            <Link href="/?kind=bot" scroll={false} className="site-menu-link" onClick={close}>{en.nav.bots}</Link>
            <Link href="/connectors" className="site-menu-link" onClick={close}>{en.nav.connectorsNav}</Link>
            <Link href="/docs" className="site-menu-link" onClick={close}>{en.nav.docs}</Link>
            <Link href="/api" className="site-menu-link" onClick={close}>{en.nav.api}</Link>
            <Link href="/sponsor" className="site-menu-link" onClick={close}>{en.nav.sponsor}</Link>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="site-menu-link" onClick={close}>
              <GitHubIcon className="h-[14px] w-[14px]" />
              {en.nav.github}
            </a>
          </nav>
        </>
      ) : null}
    </div>
  );
}
