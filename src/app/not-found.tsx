import Link from "next/link";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";

export default function NotFound() {
  return (
    <WingsSplit
      hero={
        <WingsHero title="404">
          <p className="mt-4 text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>{en.notFound.kicker}</p>
          <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>{en.notFound.body}</p>
        </WingsHero>
      }
    >
      <span className="flex flex-wrap gap-3 pt-6">
        <Link href="/" className="theme-control theme-control-label">{en.notFound.back}</Link>
        <Link href="/?kind=bot" className="theme-control theme-control-label">{en.notFound.backBots}</Link>
      </span>
    </WingsSplit>
  );
}
