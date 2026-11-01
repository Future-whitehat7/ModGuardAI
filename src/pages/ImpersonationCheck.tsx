import { Link } from 'react-router-dom';
import { ImageSlot } from '../components/marketing/ImageSlot';
import { ImpersonationChecker } from '../components/marketing/ImpersonationChecker';
import { IntakeForm } from '../components/marketing/IntakeForm';
import { IMPERSONATION_CHECKOUT_URL } from '../config/platform';

export const ImpersonationCheck = () => {
  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="measure text-xl text-ice">A copied account can ask your audience for money in your name.</p>
      <div className="mt-6 max-w-3xl">
        <ImpersonationChecker />
      </div>
      <ImageSlot file="impersonation-tab.svg" label="Impersonation Check" />

      <section className="measure mt-12" id="offer">
        <p className="eyebrow">Growth · $199/month</p>
        <h2 className="display mt-3 text-4xl text-ice">Creators with 100K to 1 million followers</h2>
        <p className="mt-4 text-lg text-frost">
          The live payment is a manual impersonation sweep. A person does the work, so it is not instant. The 48-hour clock starts when intake is complete.
        </p>
        <a className="btn-accent mt-6" href={IMPERSONATION_CHECKOUT_URL}>
          Pay $199 with Stripe
        </a>
        <p className="mt-3 text-sm text-frost">Payments by Stripe.</p>
        <p className="mt-4 text-frost">
          Starter and Elite are not on this payment.{' '}
          <Link className="text-accent" to="/sponsor">
            See those tiers
          </Link>
          .
        </p>
      </section>

      <section className="mt-14 max-w-3xl" id="intake">
        <h2 className="display text-4xl text-ice">Intake</h2>
        <p className="measure mt-4 text-frost">
          Five steps. The 48-hour clock starts when you submit, not when you pay.
        </p>
        <div className="mt-6">
          <IntakeForm />
        </div>
      </section>
    </article>
  );
};
