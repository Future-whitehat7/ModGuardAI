import { Link } from 'react-router-dom';
import { IMPERSONATION_CHECKOUT_URL } from '../config/platform';

export const ImpersonationThanks = () => {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Impersonation Check</p>
      <h1 className="display mt-4 text-5xl text-ice">Intake received.</h1>
      <p className="measure mt-6 text-lg text-frost">
        Thank you. We’ll email your slot date. The 48-hour clock starts once this intake is complete and payment is received. Submitting the form does not charge you.
      </p>
      <p className="measure mt-4 text-frost">
        If you don’t hear from us within one business day, email{' '}
        <a href="mailto:samuel.fagbamigbe@modguardai.org?subject=Impersonation%20Check">
          samuel.fagbamigbe@modguardai.org
        </a>
        .
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a className="btn-accent" href={IMPERSONATION_CHECKOUT_URL}>
          Buy now
        </a>
        <Link className="btn-ghost" to="/impersonation-check">
          Back to Impersonation Check
        </Link>
      </div>
    </article>
  );
};
