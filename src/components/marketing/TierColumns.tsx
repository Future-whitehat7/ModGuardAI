import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMPERSONATION_CHECKOUT_URL, protectionTiers, type TierId } from '../../config/platform';

export function TierColumns({ onAsk }: { onAsk: (tier: TierId) => void }) {
  const [starterPrice, setStarterPrice] = useState<'week' | 'month'>('month');

  return (
    <div className="tier-grid">
      {protectionTiers.map((tier) => {
        const featured = tier.id === 'growth';
        const price =
          tier.id === 'starter'
            ? starterPrice === 'week'
              ? '$49/week'
              : '$99/month'
            : tier.prices[0]?.label;
        return (
          <article key={tier.id} id={tier.id} className={`glass tier-card ${featured ? 'tier-featured' : ''}`}>
            <p className="eyebrow">{featured ? 'Live checkout' : tier.name}</p>
            <h2 className="display mt-3 text-4xl text-ice">{tier.name}</h2>
            <p className="mt-3 font-mono text-sm uppercase tracking-[0.12em] text-ice">{price}</p>
            {tier.id === 'starter' && (
              <div className="mt-4 flex gap-2" role="group" aria-label="Starter price">
                <button
                  type="button"
                  className="btn-ghost"
                  aria-pressed={starterPrice === 'week'}
                  onClick={() => setStarterPrice('week')}
                >
                  $49/week
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  aria-pressed={starterPrice === 'month'}
                  onClick={() => setStarterPrice('month')}
                >
                  $99/month
                </button>
              </div>
            )}
            <p className="mt-4 text-ice">{tier.purpose}</p>
            <p className="mt-4 text-sm text-frost">{tier.audience}</p>
            <ul className="mt-4 space-y-3 text-sm text-ice">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {tier.checkout.kind === 'stripe' ? (
              <a className="btn-accent mt-6 w-full" href={IMPERSONATION_CHECKOUT_URL}>
                Pay $199 with Stripe
              </a>
            ) : (
              <button className="btn-accent mt-6 w-full" type="button" onClick={() => onAsk(tier.id)}>
                Ask before you pay
              </button>
            )}
            {tier.checkout.kind === 'stripe' && (
              <p className="mt-3 text-sm text-frost">Payments by Stripe.</p>
            )}
            {tier.checkout.kind === 'pending-stripe' && (
              <p className="mt-3 text-sm text-frost">Checkout link: pending-stripe.</p>
            )}
            {featured && (
              <Link className="mt-3 inline-flex min-h-12 items-center text-sm text-accent" to="/impersonation-check/thanks">
                Paid already? Open intake
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
