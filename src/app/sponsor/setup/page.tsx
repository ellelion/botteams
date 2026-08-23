import type { Metadata } from "next";
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
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finish your listing",
  description: "Submit the tool for the Grok Bot Teams side rail.",
  robots: { index: false, follow: false },
};

const GUIDELINES = [
  "Digital products only.",
  "Public URL, not a shortener, not a competing Grok Bot team or bot directory.",
  "No crypto, no trading signals, no lead-generation.",
  "Title 28 characters or fewer. Short description 52 or fewer. Plain, like the directory.",
  "A simple mark (png, svg, webp, or jpg). Not a landing screenshot, not a person photo, not a watermarked stock ad.",
  "An automated review checks that list, up to three times. After that, our team will review your listing and get back to you shortly.",
];

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

  return (
    <WingsSplit
      hero={
        <WingsHero title={en.sponsor.setupTitle}>
          <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
            {en.sponsor.setupLead}
          </p>
          <p className="home-disclaimer mt-5">{en.notAffiliated}</p>
        </WingsHero>
      }
    >

        {state.kind === "unconfigured" ? (
          <p className="measure mt-8 text-[0.9rem]" style={{ color: ledger.inkMuted }}>
            Setup is not configured on this host.
          </p>
        ) : null}

        {state.kind === "missing" || state.kind === "unpaid" ? (
          <p className="measure mt-8 text-[0.9rem]" style={{ color: ledger.inkMuted }}>
            {en.sponsor.setupMissing}{" "}
            <Link className="accent-hover underline" href="/sponsor">
              {en.sponsor.setupBack}
            </Link>
          </p>
        ) : null}

        {state.kind === "expired" ? (
          <p className="measure mt-8 text-[0.9rem]" style={{ color: ledger.inkMuted }}>
            {en.sponsor.setupExpired}
          </p>
        ) : null}

        {state.kind === "live" ? (
          <p className="spon-paid mt-8" role="status">
            {en.sponsor.setupLive}
          </p>
        ) : null}

        {state.kind === "human" ? (
          <p className="spon-paid mt-8" role="status">
            {en.sponsor.setupHuman}
          </p>
        ) : null}

        {state.kind === "open" ? (
          <>
            <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
              <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
                {en.sponsor.guidelinesTitle}
              </h2>
              <ul className="mt-4">
                {GUIDELINES.map((rule) => (
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
