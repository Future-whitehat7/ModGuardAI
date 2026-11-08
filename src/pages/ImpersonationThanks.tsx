import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { payNowHref, readOrderView, type MemoryStore } from '../config/impersonationHandoff';
import { IMPERSONATION_CHECKOUT_URL } from '../config/platform';

const CONTACT = 'mailto:samuel.fagbamigbe@modguardai.org?subject=Impersonation%20Check';

function browserStore(): MemoryStore {
  return {
    getItem(key) {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      sessionStorage.setItem(key, value);
    },
  };
}

export const ImpersonationThanks = () => {
  const [params] = useSearchParams();
  const order = useMemo(() => readOrderView(browserStore(), params.get('tier')), [params]);
  const checkoutHref = order.kind === 'form-started' ? payNowHref(order.tier, IMPERSONATION_CHECKOUT_URL) : null;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Impersonation Check</p>
      {order.kind === 'no-intake' ? (
        <>
          <h1 className="display mt-4 text-5xl text-ice">Form not sent from this browser.</h1>
          <p className="measure mt-6 text-lg text-frost">
            Opening this address does not submit an intake and does not confirm a payment. The $199 one-time check still starts with the form. We verify the accounts and ads you send. We do not search for others, and we do not guarantee removal.
          </p>
          <div className="mt-8">
            <Link className="btn-accent" to="/impersonation-check#intake">
              Back to the form
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="display mt-4 text-5xl text-ice">Form sent from this browser. Payment is not confirmed.</h1>
          <p className="measure mt-6 text-lg text-frost">
            The form passed its checks in this browser and the browser sent it on. This page cannot see a stored intake, a Stripe payment, or a report. The 48-hour clock starts only after a complete intake and payment. We do not remove accounts.
          </p>
          {checkoutHref === null ? (
            <>
              <p className="measure mt-4 text-frost">
                You selected the $499 option: Over 1 million followers, or public figures booked through a manager. That option does not use the $199 one-time Stripe link. Email{' '}
                <a href={CONTACT}>samuel.fagbamigbe@modguardai.org</a>
                {' '}and include the $499 option so payment can be arranged. This page cannot confirm that email or that payment.
              </p>
              <div className="mt-8">
                <a className="btn-accent" href={CONTACT}>
                  Email about the $499 option
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="measure mt-4 text-frost">
                Pay now for the $199 one-time check. That Stripe payment is not the Sponsors Growth tier at $199/month. Opening the link does not mark an order paid.
              </p>
              <div className="mt-8">
                <a className="btn-accent" href={checkoutHref}>
                  Pay now
                </a>
              </div>
            </>
          )}
          <div className="mt-3">
            <Link className="btn-ghost" to="/impersonation-check">
              Back to Impersonation Check
            </Link>
          </div>
        </>
      )}
    </article>
  );
};
