import { type ReactNode } from "react";
import { ledger } from "@/lib/ledger-theme";

export function WingsHero({
  title,
  kicker,
  children,
}: {
  title: ReactNode;
  kicker?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="story-beat relative flex min-h-0 flex-col items-center justify-center overflow-visible py-6 pb-6 text-center lg:min-h-[var(--menu-max-h)] lg:py-10 lg:pb-16">
      <div className="relative z-10 w-full max-w-[22rem] px-1">
        {kicker ? <div className="wings-crumb">{kicker}</div> : null}
        <h1
          className="font-display text-[clamp(1.7rem,3.5vw,2.9rem)] font-normal leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: ledger.serif }}
        >
          {title}
        </h1>
        {children}
      </div>
    </section>
  );
}

export function WingsSplit({
  hero,
  children,
  preview,
}: {
  hero: ReactNode;
  children: ReactNode;
  preview?: ReactNode;
}) {
  return (
    <>
      {preview ? <div className="talk-preview-band">{preview}</div> : null}
      <div className="wings-hero-col relative z-10 col-start-1 row-start-1 min-w-0 overflow-visible grid grid-cols-1 lg:border-r" style={{ borderColor: ledger.hairline }}>
        <div className="col-start-1 row-start-1 min-w-0 lg:pr-10">
          {hero}
        </div>
      </div>
      <div
        id="content"
        tabIndex={-1}
        className="wings-main-col relative z-10 col-start-1 row-start-2 min-w-0 pb-8 pt-0 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-[var(--masthead-h)] lg:flex lg:h-[var(--menu-max-h)] lg:flex-col lg:justify-start lg:overflow-y-auto lg:py-6"
      >
        {children}
      </div>
    </>
  );
}
