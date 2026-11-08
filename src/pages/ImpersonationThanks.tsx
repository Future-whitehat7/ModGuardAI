import { useSearchParams, Link } from 'react-router-dom';
import { IMPERSONATION_CHECKOUT_URL } from '../config/platform';

const CONTACT = 'mailto:samuel.fagbamigbe@modguardai.org?subject=Impersonation%20Check';

function selectedTier(queryTier: string | null): '199' | '499' {
  if (queryTier === '499' || queryTier === '199') return queryTier;
  try {
    const stored = sessionStorage.getItem('impersonation-check-tier');
    if (stored === '499' || stored === '199') return stored;
  } catch {
    // sessionStorage can be unavailable. The $199 one-time path is the labeled default.
  }
  return '199';
}

export const ImpersonationThanks = () => {
  const [params] = useSearchParams();
  const tier = selectedTier(params.get('tier'));
  const eliteOption = tier === '499';

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Impersonation Check</p>
      <h1 className="display mt-4 text-5xl text-ice">Intake received.</h1>
      <p className="measure mt-6 text-lg text-frost">
        Thank you. This form did not charge you. Within 48 hours of a complete intake and payment, we verify each account or ad you sent and send evidence plus the exact platform report steps. We do not remove accounts.
      </p>
      {eliteOption ? (
        <>
          <p className="measure mt-4 text-frost">
            You selected the $499 option: Over 1 million followers, or public figures booked through a manager. That option does not use the $199 one-time Stripe link. Email{' '}
            <a href={CONTACT}>samuel.fagbamigbe@modguardai.org</a>
            {' '}and include the $499 option so payment can be arranged.
          </p>
          <div className="mt-8">
            <Link className="btn-ghost" to="/impersonation-check">
              Back to Impersonation Check
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="measure mt-4 text-frost">
            Pay now for the $199 one-time check. That Stripe payment is not the Sponsors Growth tier at $199/month. The 48-hour clock starts once this intake is complete and this payment is received.
          </p>
          <p className="measure mt-4 text-sm text-frost">
            If you selected the $499 option — Over 1 million followers, or public figures booked through a manager — do not use this link. Email{' '}
            <a href={CONTACT}>samuel.fagbamigbe@modguardai.org</a>.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="btn-accent" href={IMPERSONATION_CHECKOUT_URL}>
              Pay now
            </a>
            <Link className="btn-ghost" to="/impersonation-check">
              Back to Impersonation Check
            </Link>
          </div>
        </>
      )}
    </article>
  );
};
