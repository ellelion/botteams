"use client";

import Link from "next/link";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <WingsSplit
      hero={
        <WingsHero title={en.error.kicker}>
          <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{en.error.body}</p>
        </WingsHero>
      }
    >
      <div className="idx-empty">
        <p className="idx-empty-title">{en.error.title}</p>
        <nav className="notfound-nav" aria-label={en.error.nav}>
          <button type="button" className="theme-control theme-control-label" onClick={reset}>
            {en.error.retry}
          </button>
          <Link href="/" className="theme-control theme-control-label">{en.error.back}</Link>
        </nav>
      </div>
    </WingsSplit>
  );
}
