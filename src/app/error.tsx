"use client";

import Link from "next/link";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
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
        <WingsHero title={en.error.kicker} />
      }
    >
      <div className="idx-empty">
        <p className="idx-empty-title">{en.error.title}</p>
        <p className="idx-empty-body">{en.error.body}</p>
        <nav className="notfound-nav" aria-label={en.error.nav}>
          <button type="button" className="theme-control theme-control-label" onClick={reset}>
            {en.error.retry}
          </button>
          <Link href="/" className="theme-control theme-control-label">{en.error.back}</Link>
          <Link href="/guides" className="theme-control theme-control-label">{en.error.guides}</Link>
        </nav>
      </div>
    </WingsSplit>
  );
}
