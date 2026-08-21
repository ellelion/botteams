"use client";

import { useState } from "react";
import { RAIL_PLANS, type RailInterval } from "@/lib/rail";
import { en } from "@/lib/messages/en";

/*
 * Buy a rail slot on the page.
 *
 * Three prices, published. No card fields here: the button opens Stripe's
 * hosted page, which is where the company name, destination and one line
 * are collected too. This component never sees a card number.
 */
export function BuySlot({ soldOut }: { soldOut: boolean }) {
  const [busy, setBusy] = useState<RailInterval | null>(null);
  const [error, setError] = useState("");

  if (soldOut) {
    return <p className="cz-truth">{en.sponsor.soldOut}</p>;
  }

  async function buy(interval: RailInterval) {
    setBusy(interval);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? en.sponsor.buyError);
        setBusy(null);
        return;
      }
      /* assign, not `location.href =`: the compiler treats the property
         write as mutating a value it owns. Same navigation either way. */
      window.location.assign(data.url);
    } catch {
      setError(en.sponsor.buyError);
      setBusy(null);
    }
  }

  return (
    <div className="spon-buy">
      <div className="spon-prices">
        {RAIL_PLANS.map((plan) => (
          <button
            key={plan.interval}
            type="button"
            className="spon-cta"
            onClick={() => buy(plan.interval)}
            disabled={busy !== null}
          >
            {busy === plan.interval ? en.sponsor.opening : `${plan.label} ${plan.display}`}
          </button>
        ))}
      </div>
      <p className="spon-fine">{en.sponsor.buyFine}</p>
      {error ? <p className="spon-error" role="alert">{error}</p> : null}
    </div>
  );
}
