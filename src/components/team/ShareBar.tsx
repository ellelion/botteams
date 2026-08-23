"use client";

import { useEffect, useState } from "react";
import { en } from "@/lib/messages/en";

export function ShareBar({ name, className = "" }: { name: string; className?: string }) {
  const [href, setHref] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHref(window.location.href);
  }, []);

  const text = `${en.h1}\n\n${name}\n\n${en.notAffiliated}`;
  const intent = href
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(href)}`
    : "";

  if (!intent) return null;
  return (
    <div className={`share-bar share-bar--inline ${className}`.trim()}>
      <a className="share-btn" href={intent} target="_blank" rel="noopener noreferrer">
        {en.share.postOnX}
      </a>
    </div>
  );
}
