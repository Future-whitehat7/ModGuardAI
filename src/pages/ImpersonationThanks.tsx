import { Link } from 'react-router-dom';
import { IntakeForm } from '../components/marketing/IntakeForm';

export const ImpersonationThanks = () => {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="eyebrow">Payment</p>
      <h1 className="display mt-3 text-4xl text-ice sm:text-5xl">Thank you.</h1>
      <p className="measure mt-4 text-lg text-frost">
        If Stripe sent you here after the $199 payment, the sweep is not started yet. The 48-hour clock starts once this intake is complete. Then we email you within those 48 hours.
      </p>
      <div className="mt-8">
        <IntakeForm />
      </div>
      <Link className="mt-8 inline-flex min-h-12 items-center text-sm text-accent" to="/">
        Back home
      </Link>
    </article>
  );
};
