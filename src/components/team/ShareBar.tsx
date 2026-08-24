"use client";

import { useEffect, useRef, useState } from "react";
import { en } from "@/lib/messages/en";

export function ShareBar({ name, className = "" }: { name: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function currentHref() {
    return window.location.href;
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(currentHref());
      setFailed(false);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
    }
  }

  function postOnX(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const text = `${en.h1}\n\n${name}\n\n${en.notAffiliated}`;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentHref())}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  }

  const copyLabel = failed ? en.team.copyFail : copied ? en.share.copied : en.share.copyLink;

  return (
    <div className={`share-bar share-bar--inline ${className}`.trim()}>
      <button type="button" className="share-btn" onClick={copyLink}>
        {copyLabel}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied || failed ? copyLabel : ""}
      </span>
      <a className="share-btn" href="https://twitter.com/intent/tweet" target="_blank" rel="noopener noreferrer" onClick={postOnX} aria-label={`${en.share.postOnX}. ${en.nav.opensNew}`}>
        {en.share.postOnX}
      </a>
    </div>
  );
}
