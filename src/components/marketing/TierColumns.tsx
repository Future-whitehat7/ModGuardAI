import { useState } from 'react';
import { Link } from 'react-router-dom';
import { protectionTiers, type ProtectionTier, type TierId } from '../../config/platform';

function TierCheckout({
  tier,
  price,
  onAsk,
}: {
  tier: ProtectionTier;
  price: string | undefined;
  onAsk: (tier: TierId) => void;
}) {
  switch (tier.checkout.kind) {
    case 'stripe':
      return (
        <>
          <a className="btn-accent mt-6 w-full" href={tier.checkout.href}>
            Pay {price} with Stripe
          </a>
          <p className="mt-3 text-sm text-frost">Payments by Stripe.</p>
        </>
      );
    case 'pending-stripe':
      return (
        <>
          <button className="btn-accent mt-6 w-full" type="button" onClick={() => onAsk(tier.id)}>
            Ask before you pay
          </button>
        </>
      );
    default: {
      const unreachable: never = tier.checkout;
      return unreachable;
    }
  }
}

export function TierColumns({ onAsk }: { onAsk: (tier: TierId) => void }) {
  const [starterPrice, setStarterPrice] = useState<'week' | 'month'>('month');

  return (
    <div className="tier-grid">
      {protectionTiers.map((tier) => {
        const price =
          tier.id === 'starter'
            ? starterPrice === 'week'
              ? '$49/week'
              : '$99/month'
            : tier.prices[0]?.label;
        return (
          <article key={tier.id} id={tier.id} className="glass tier-card">
            <p className="eyebrow">{tier.name}</p>
            <h2 className="display mt-3 text-4xl text-ice">{tier.name}</h2>
            <p className="tier-price">{price}</p>
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
            <TierCheckout tier={tier} price={price} onAsk={onAsk} />
            {tier.id === 'growth' && (
              <p className="mt-3 text-sm text-frost">
                The $199 one-time Impersonation Check is a different payment.{' '}
                <Link className="text-accent" to="/impersonation-check">
                  Verify suspicious accounts — $199 one-time
                </Link>
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
