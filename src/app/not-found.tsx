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
        </WingsHero>
      }
    >
      <div className="idx-empty">
        <p className="idx-empty-title">{en.notFound.title}</p>
        <p className="idx-empty-body">{en.notFound.body}</p>
        <nav className="notfound-nav" aria-label={en.notFound.nav}>
          <Link href="/" className="theme-control theme-control-label">{en.notFound.back}</Link>
          <Link href="/?kind=bot" className="theme-control theme-control-label">{en.notFound.backBots}</Link>
          <Link href="/connectors" className="theme-control theme-control-label">{en.notFound.connectors}</Link>
          <Link href="/docs" className="theme-control theme-control-label">{en.notFound.spec}</Link>
        </nav>
      </div>
    </WingsSplit>
  );
}
