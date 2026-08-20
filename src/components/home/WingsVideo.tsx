"use client";

import { useEffect, useRef, useState } from "react";

/* A touch above natural speed: the wings beat livelier without reading
   as sped-up footage. Tune here; both theme clips follow. */
const WINGS_SPEED = 1.35;

/*
 * Ambient wings loop — one clip per theme, gated by the global
 * .wings-on-* visibility rules. The base .wings-video CSS anchors it
 * absolutely inside the nearest positioned ancestor and edge-masks the
 * clip; `variant` classes reposition/resize it per composition.
 *
 * LCP contract: a lightweight still poster (~50KB webp) renders in the
 * server HTML and paints early; the ~560KB video mounts only after idle
 * and crossfades over it. Both assets are square and share one sizing
 * box, so the late video is never a LARGER paint than the poster —
 * meaning it can never take over as the LCP element (which it did at
 * 3.2s on mobile when it loaded eagerly). Reduced-motion users keep the
 * still poster and never download the video at all.
 */
export function WingsVideo({ variant = "" }: { variant?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    ref.current
      ?.querySelectorAll("video")
      .forEach((v) => (v.playbackRate = WINGS_SPEED));
  }, [ready]);

  return (
    <div
      ref={ref}
      className={`wings-video z-0 ${ready ? "wings-live" : ""} ${variant}`}
      aria-hidden
    >
      {/* Poster stills: the early, cheap paint. One per theme. */}
      {/* fetchpriority high: this poster IS the page's LCP element, and
          both imgs download regardless (display:none does not stop <img>
          fetches), so prioritising costs no extra bytes. */}
      <img
        className="wings-on-dark wings-poster"
        src="/brand/wings-white.webp"
        alt=""
        width={640}
        height={640}
        fetchPriority="high"
      />
      <img
        className="wings-on-light wings-poster"
        src="/brand/wings-black.webp"
        alt=""
        width={640}
        height={640}
        fetchPriority="high"
      />
      {ready ? (
        <>
          <video
            className="wings-on-dark wings-video-fade"
            src="/brand/wings-white.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
          />
          <video
            className="wings-on-light wings-video-fade"
            src="/brand/wings-black.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
          />
        </>
      ) : null}
    </div>
  );
}
