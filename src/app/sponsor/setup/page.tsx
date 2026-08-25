import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { SetupForm } from "@/components/sponsor/SetupForm";
import { ledger } from "@/lib/ledger-theme";
import { databaseUrl } from "@/lib/db";
import {
  getPaymentBySessionId,
  isPaymentExpired,
  isSetupOpen,
  upsertPaidSession,
} from "@/lib/rail-db";
import { isRailSessionMeta } from "@/lib/rail";
import { stripe } from "@/lib/stripe";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finish your listing",
  description: "Submit the tool for the botteams.ai side rail.",
  robots: { index: false, follow: false },
};

async function loadSession(sessionId: string) {
  if (!databaseUrl() || !process.env.STRIPE_SECRET_KEY) {
    return { kind: "unconfigured" as const };
  }
  if (!sessionId.startsWith("cs_")) {
    return { kind: "missing" as const };
  }

  let payment = await getPaymentBySessionId(sessionId);
  if (!payment) {
    try {
      const session = await stripe().checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid" && isRailSessionMeta(session.metadata)) {
        payment = await upsertPaidSession(session);
      }
    } catch (error) {
      console.error("[sponsor-setup] could not retrieve session", error);
      return { kind: "missing" as const };
    }
  }

  if (!payment) return { kind: "unpaid" as const };
  if (payment.status === "live") return { kind: "live" as const, remaining: 0 };
  if (payment.status === "needs_human" || payment.status === "hidden" || payment.status === "rejected") {
    return { kind: "human" as const };
  }
  if (isPaymentExpired(payment)) return { kind: "expired" as const };
  if (!isSetupOpen(payment)) return { kind: "unpaid" as const };
  return { kind: "open" as const, remaining: 3 - payment.attempts, sessionId: payment.stripeSessionId };
}

export default async function SponsorSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId = "" } = await searchParams;
  const state = await loadSession(sessionId.trim());
  const mail = `mailto:${site.email}?subject=${encodeURIComponent("Listing setup")}`;

  return (
    <WingsSplit
      hero={
        <WingsHero
          title={en.sponsor.setupTitle}
          kicker={<Breadcrumb parentHref="/sponsor" parentLabel={en.nav.sponsor} current={en.sponsor.setupTitle} />}
        >
          <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
            {en.sponsor.setupLead}
          </p>
          <p className="home-disclaimer mt-5">{en.notAffiliated}</p>
        </WingsHero>
      }
    >

        {state.kind === "unconfigured" ? (
          <div className="idx-empty">
            <p className="idx-empty-title">{en.sponsor.setupOffTitle}</p>
            <p className="idx-empty-body">{en.sponsor.setupOffBody}</p>
            <nav className="notfound-nav" aria-label={en.sponsor.setupBack}>
              <Link href="/sponsor" className="theme-control theme-control-label">{en.sponsor.setupBack}</Link>
            </nav>
          </div>
        ) : null}

        {state.kind === "missing" || state.kind === "unpaid" ? (
          <div className="idx-empty">
            <p className="idx-empty-title">{en.sponsor.setupMissingTitle}</p>
            <p className="idx-empty-body">{en.sponsor.setupMissing}</p>
            <nav className="notfound-nav" aria-label={en.sponsor.setupBack}>
              <Link href="/sponsor" className="theme-control theme-control-label">{en.sponsor.setupBack}</Link>
            </nav>
          </div>
        ) : null}

        {state.kind === "expired" ? (
          <div className="idx-empty">
            <p className="idx-empty-title">{en.sponsor.setupExpiredTitle}</p>
            <p className="idx-empty-body">{en.sponsor.setupExpired}</p>
            <nav className="notfound-nav" aria-label={en.sponsor.setupExpiredTitle}>
              <a className="theme-control theme-control-label" href={mail}>{en.sponsor.mailCta}</a>
              <Link href="/sponsor" className="theme-control theme-control-label">{en.sponsor.setupBack}</Link>
            </nav>
          </div>
        ) : null}

        {state.kind === "live" ? (
          <div>
            <p className="spon-paid mt-8" role="status">
              {en.sponsor.setupLive}
            </p>
            <nav className="notfound-nav" aria-label={en.sponsor.setupNext}>
              <Link href="/" className="theme-control theme-control-label">{en.sponsor.setupSeeDir}</Link>
              <Link href="/sponsor" className="theme-control theme-control-label">{en.sponsor.setupBack}</Link>
            </nav>
          </div>
        ) : null}

        {state.kind === "human" ? (
          <div>
            <p className="spon-paid mt-8" role="status">
              {en.sponsor.setupHuman}
            </p>
            <nav className="notfound-nav" aria-label={en.sponsor.setupNext}>
              <a className="theme-control theme-control-label" href={mail}>{en.sponsor.mailCta}</a>
              <Link href="/sponsor" className="theme-control theme-control-label">{en.sponsor.setupBack}</Link>
            </nav>
          </div>
        ) : null}

        {state.kind === "open" ? (
          <>
            <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
              <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
                {en.sponsor.guidelinesTitle}
              </h2>
              <ul className="mt-4">
                {en.sponsor.guidelines.map((rule) => (
                  <li key={rule} className="hairline-row measure py-3 text-[0.88rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
                    {rule}
                  </li>
                ))}
              </ul>
            </section>
            <SetupForm sessionId={state.sessionId} remaining={state.remaining} />
          </>
        ) : null}
    </WingsSplit>
  );
}
