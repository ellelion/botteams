"use client";

import { useEffect, useState } from "react";
import { en } from "@/lib/messages/en";

/*
 * Share what is actually on screen.
 *
 * Copy link takes window.location.href, not the canonical domain: that
 * domain does not resolve yet, so handing someone a dead link would be
 * worse than handing them a localhost or preview one they can actually
 * open. Same href goes into the post.
 *
 * The post carries the disclaimer. We are wearing xAI's contrast, so
 * every place this site travels has to say it is not theirs. No handle
 * to mention, because we do not have one worth claiming.
 */
export function ShareBar({ name }: { name: string }) {
  const [href, setHref] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    /* Once, on mount. The server has no location, so reading it any
       earlier would render one href and hydrate another. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHref(window.location.href);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const text = `${en.h1}\n\n${name}\n\n${en.notAffiliated}`;
  const intent = href
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(href)}`
    : "";

  return (
    <div className="share-bar">
      <button type="button" className="share-btn" onClick={copyLink}>
        {copied ? en.share.copied : en.share.copyLink}
      </button>
      {intent ? (
        <a className="share-btn" href={intent} target="_blank" rel="noopener noreferrer">
          {en.share.postOnX}
        </a>
      ) : null}
      <span className="share-note">{en.notAffiliated}</span>
    </div>
  );
}
