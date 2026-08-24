"use client";

import { useState, type ReactNode } from "react";

/*
 * Phone hero shrinks when the URL already names a search or shelf, so
 * inbound results land in the first screen. Freeze that on first paint.
 * Flipping it while someone is on a category rail collapses the manifesto
 * and throws the focused chip off the glass.
 */
export function StoryBeat({
  catalogActive,
  children,
}: {
  catalogActive: boolean;
  children: ReactNode;
}) {
  const [active] = useState(catalogActive);
  return (
    <section className={`story-beat relative flex min-h-0 flex-col items-center justify-center overflow-x-hidden py-3 pb-3 text-center lg:min-h-[calc(100dvh-var(--masthead-h))] lg:py-10 lg:pb-20${active ? " is-catalog-active" : ""}`}>
      {children}
    </section>
  );
}
