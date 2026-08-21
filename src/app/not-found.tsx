import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>{en.notFound.kicker}</p>
        <p className="font-display mt-4 text-[clamp(2.8rem,7vw,4.2rem)] font-light leading-none tracking-[-0.04em]" style={{ fontFamily: ledger.serif }}>404</p>
        <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{en.notFound.body}</p>
        <span className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/#teams" className="theme-control theme-control-label">{en.notFound.back}</Link>
          <Link href="/?kind=bot#teams" className="theme-control theme-control-label">{en.notFound.backBots}</Link>
        </span>
      </main>
      <SiteFooter />
    </div>
  );
}
