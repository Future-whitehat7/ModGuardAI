import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CONTACT = 'mailto:samuel.fagbamigbe@modguardai.org?subject=Impersonation%20Check';
const ACCESS_TOKEN_KEY = 'impersonation-access-token';

type Load = 'none' | 'loading' | 'unavailable' | 'ready';

interface ReadyStatus {
  state: string;
  payment: 'verified' | 'unverified';
  payUrl: string | null;
  report: string;
  tier: '199' | '499';
  evidence: { summary: string } | null;
}

function isReadyStatus(value: unknown): value is ReadyStatus {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.state === 'string'
    && (record.payment === 'verified' || record.payment === 'unverified')
    && (record.payUrl === null || typeof record.payUrl === 'string')
    && typeof record.report === 'string'
    && (record.tier === '199' || record.tier === '499');
}

export const ImpersonationThanks = () => {
  const [load, setLoad] = useState<Load>('loading');
  const [status, setStatus] = useState<ReadyStatus | null>(null);

  useEffect(() => {
    let token = '';
    try {
      token = sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
    } catch {
      token = '';
    }
    if (!token) {
      setLoad('none');
      return;
    }
    const controller = new AbortController();
    fetch('/api/order-status', {
      headers: { authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload: unknown = await response.json();
        if (!response.ok || !isReadyStatus(payload)) {
          setLoad('unavailable');
          return;
        }
        setStatus(payload);
        setLoad('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoad('unavailable');
      });
    return () => controller.abort();
  }, []);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Impersonation Check</p>
      {renderStatus(load, status)}
    </article>
  );
};

function renderStatus(load: Load, status: ReadyStatus | null) {
  switch (load) {
    case 'loading':
      return <h1 className="display mt-4 text-5xl text-ice">Checking the order record.</h1>;
    case 'none':
      return (
        <>
          <h1 className="display mt-4 text-5xl text-ice">No intake is confirmed.</h1>
          <p className="measure mt-6 text-lg text-frost">
            Opening this address does not submit an intake and does not confirm a payment. The $199 one-time check still starts with the form. We verify the accounts and ads you send. We do not search for others, and we do not guarantee removal.
          </p>
          <div className="mt-8">
            <Link className="btn-accent" to="/impersonation-check#intake">
              Back to the form
            </Link>
          </div>
        </>
      );
    case 'unavailable':
      return (
        <>
          <h1 className="display mt-4 text-5xl text-ice">The order record is not available.</h1>
          <p className="measure mt-6 text-lg text-frost">
            This page cannot confirm an intake or a payment right now. Nothing on this screen marks an order paid.
          </p>
          <div className="mt-8">
            <Link className="btn-accent" to="/impersonation-check#intake">
              Back to the form
            </Link>
          </div>
        </>
      );
    case 'ready':
      return status ? <ReadyOrder status={status} /> : null;
    default: {
      const unexpected: never = load;
      return unexpected;
    }
  }
}

function ReadyOrder({ status }: { status: ReadyStatus }) {
  const paid = status.payment === 'verified';
  return (
    <>
      <h1 className="display mt-4 text-5xl text-ice">
        {status.report === 'delivery_ready'
          ? 'A reviewed report is ready.'
          : paid
            ? 'Payment verified. The report is not automatic.'
            : 'Intake stored. Payment is not verified.'}
      </h1>
      <p className="measure mt-6 text-lg text-frost">
        {status.report === 'delivery_ready'
          ? 'An operator filed this evidence and approved it for release. Email was not sent from this page.'
          : paid
            ? 'Stripe’s signed event matched this stored intake and the $199 one-time price. An operator still has to review the evidence before a report is delivered. We do not remove accounts.'
            : 'The intake is stored on the server. A browser address is not payment. The 48-hour clock starts only after a complete intake and a verified payment. We do not remove accounts.'}
      </p>
      {status.payUrl && !paid ? (
        <div className="mt-8">
          <a className="btn-accent" href={status.payUrl}>
            Pay now
          </a>
          <p className="measure mt-4 text-sm text-frost">
            Pay now for the $199 one-time check. That Stripe payment is not the Sponsors Growth tier at $199/month. Opening the link does not mark an order paid.
          </p>
        </div>
      ) : null}
      {!status.payUrl && status.tier === '499' && !paid ? (
        <div className="mt-8">
          <p className="measure text-frost">
            You selected the $499 option: Over 1 million followers, or public figures booked through a manager. That option does not use the $199 one-time Stripe link. Email{' '}
            <a href={CONTACT}>samuel.fagbamigbe@modguardai.org</a>. This page cannot confirm that email or a payment.
          </p>
          <a className="btn-accent mt-8" href={CONTACT}>
            Email about the $499 option
          </a>
        </div>
      ) : null}
      {paid && status.evidence?.summary ? (
        <section className="glass mt-8 p-6">
          <p className="eyebrow">Operator report</p>
          <p className="mt-3 text-ice">{status.evidence.summary}</p>
        </section>
      ) : null}
      {paid && !status.evidence ? (
        <p className="measure mt-4 text-frost">No reviewed evidence report has been filed yet.</p>
      ) : null}
      <div className="mt-3">
        <Link className="btn-ghost" to="/impersonation-check">
          Back to Impersonation Check
        </Link>
      </div>
    </>
  );
}
