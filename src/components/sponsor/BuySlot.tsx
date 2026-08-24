import Link from "next/link";
import { RAIL_PLANS } from "@/lib/rail";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";
import { StartCheckout } from "@/components/sponsor/StartCheckout";

const FEATURED = "3m" as const;

/*
 * Buy a rail slot on the page.
 *
 * Three prices, published. The middle term is the one the layout
 * recommends: it is cheaper than three one-month buys. Each button
 * posts to checkout; the API redirects the browser to Stripe.
 */
export function BuySlot({ soldOut }: { soldOut: boolean }) {
  if (soldOut) {
    return (
      <p className="cz-truth">
        {en.sponsor.soldOut}{" "}
        <a className="accent-hover underline" href={`mailto:${site.email}`}>{en.sponsor.mailCta}</a>
        {" "}
        {en.sponsor.soldOutAfter}
      </p>
    );
  }

  return (
    <div className="spon-buy">
      <div className="spon-terms">
        {RAIL_PLANS.map((plan) => {
          const hot = plan.interval === FEATURED;
          const save = plan.interval === "3m" || plan.interval === "6m"
            ? en.sponsor.termSave[plan.interval]
            : null;
          return (
            <article
              key={plan.interval}
              className={hot ? "spon-term spon-term-hot" : "spon-term"}
            >
              {save ? <p className="spon-term-tag">{save}</p> : <p className="spon-term-tag spon-term-tag-quiet">{en.sponsor.tryMonth}</p>}
              <h3 className="spon-term-label">{plan.label}</h3>
              <p className="spon-term-price">{plan.display}</p>
              <p className="spon-term-month">{en.sponsor.termMonth[plan.interval]}</p>
              <form action="/api/checkout" method="post">
                <input type="hidden" name="interval" value={plan.interval} />
                <StartCheckout featured={hot} />
              </form>
            </article>
          );
        })}
      </div>
      <p className="spon-fine">
        By paying you confirm you are 18 or older and agree to the{" "}
        <Link className="underline" href="/terms">Terms</Link>
        {" "}and the{" "}
        <Link className="underline" href="/privacy">Privacy policy</Link>
        . Stripe takes the card on their page. A paid row is a paid placement. It is not Verified, it is not a team, and it is not an endorsement.
      </p>
    </div>
  );
}
