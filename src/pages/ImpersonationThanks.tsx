import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ACCESS_TOKEN_KEY, readAccessToken } from '../config/accessToken';

const CONTACT = 'mailto:samuel.fagbamigbe@modguardai.org?subject=Impersonation%20Check';

type Load = 'none' | 'loading' | 'unavailable' | 'ready';
type Report =
  | 'none'
  | 'draft'
  | 'researching'
  | 'research_failed'
  | 'email_failed'
  | 'delivery_ready'
  | 'delivery_approved'
  | 'research_complete';

interface EvidenceItem {
  url?: string;
  platform?: string;
  handle?: string;
  httpStatus?: number | null;
  similarity?: number | null;
  closestOfficial?: string;
  confidence?: string;
  finding?: string;
  reportSteps?: string[];
  displayName?: string;
}

interface Offer {
  title: string;
  description: string;
  price: string;
  link: string;
  placeholder?: boolean;
}

interface ReadyStatus {
  state: string;
  payment: 'verified' | 'unverified';
  payUrl: string | null;
  report: Report;
  tier: '199' | '499';
  research: string;
  emailSent: boolean;
  emailStatus: string;
  offers: Offer[];
  evidence: { summary: string; source?: string; items?: EvidenceItem[] } | null;
}

const REPORTS: readonly Report[] = [
  'none',
  'draft',
  'researching',
  'research_failed',
  'email_failed',
  'delivery_ready',
  'delivery_approved',
  'research_complete',
];

function isReport(value: unknown): value is Report {
  return typeof value === 'string' && (REPORTS as readonly string[]).includes(value);
}

function isReadyStatus(value: unknown): value is ReadyStatus {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.state === 'string'
    && (record.payment === 'verified' || record.payment === 'unverified')
    && (record.payUrl === null || typeof record.payUrl === 'string')
    && isReport(record.report)
    && (record.tier === '199' || record.tier === '499');
}

function linkify(step: string) {
  const parts = step.split(/(https:\/\/[^\s]+)/g);
  return parts.map((part, index) => {
    if (!part.startsWith('https://')) return <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>;
    return (
      <a key={part} href={part} rel="noreferrer">
        {part}
      </a>
    );
  });
}

export const ImpersonationThanks = () => {
  const [params] = useSearchParams();
  const queryAccess = params.get('access');
  const [load, setLoad] = useState<Load>('loading');
  const [status, setStatus] = useState<ReadyStatus | null>(null);

  useEffect(() => {
    let stored = '';
    try {
      stored = sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
    } catch {
      stored = '';
    }
    const token = readAccessToken(queryAccess, stored);
    if (queryAccess?.trim()) {
      try {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, queryAccess.trim());
      } catch {
        // The query string still carries the token.
      }
    }
    if (!token) {
      setLoad('none');
      return;
    }
    const controller = new AbortController();
    let timer = 0;
    let stopped = false;
    const pull = () => {
      fetch('/api/order-status', {
        headers: { authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
        .then(async (response) => {
          const payload: unknown = await response.json();
          if (stopped) return;
          if (!response.ok || !isReadyStatus(payload)) {
            setLoad('unavailable');
            return;
          }
          setStatus(payload);
          setLoad('ready');
          if (payload.report === 'researching' || payload.research === 'needed' || payload.research === 'running') {
            timer = window.setTimeout(pull, 4000);
          }
        })
        .catch(() => {
          if (!stopped && !controller.signal.aborted) setLoad('unavailable');
        });
    };
    pull();
    return () => {
      stopped = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [queryAccess]);

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
            Opening this address does not submit an intake and does not confirm a payment. The $199 one-time check still starts with the form. Automated research reads the public pages you send. It does not decide that an account is impersonation, and it does not remove accounts.
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

function headline(status: ReadyStatus) {
  switch (status.report) {
    case 'delivery_ready':
    case 'delivery_approved':
    case 'research_complete':
    case 'email_failed':
      return 'The research is ready.';
    case 'researching':
      return 'Payment verified. Research is running.';
    case 'research_failed':
      return 'Payment verified. Research did not finish.';
    case 'draft':
    case 'none':
      return status.payment === 'verified'
        ? 'Payment verified. The report is not ready.'
        : 'Intake stored. Payment is not verified.';
    default: {
      const unexpected: never = status.report;
      return unexpected;
    }
  }
}

function ReadyOrder({ status }: { status: ReadyStatus }) {
  const paid = status.payment === 'verified';
  const items = status.evidence?.items ?? [];
  const automated = status.evidence?.source !== 'operator';
  return (
    <>
      <h1 className="display mt-4 text-5xl text-ice">{headline(status)}</h1>
      <p className="measure mt-6 text-lg text-frost">{bodyCopy(status, paid)}</p>
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
      {status.evidence ? (
        <section className="mt-8 space-y-4">
          <div className="glass p-6">
            <p className="eyebrow">{automated ? 'Automated research' : 'Operator notes'}</p>
            <p className="mt-3 text-ice">{status.evidence.summary}</p>
            <p className="mt-3 text-sm text-frost">
              {automated
                ? 'Data confidence is about how much of a public page could be read. It is not a determination that an account is impersonation.'
                : 'An operator replaced the automated notes. This is still not a removal.'}
            </p>
          </div>
          {items.map((item, index) => (
            <article className="glass p-6" key={`${item.url || 'item'}-${index}`}>
              <p className="eyebrow">{item.platform || 'Account'} · data confidence {item.confidence || 'low'}</p>
              <h2 className="display mt-3 text-3xl text-ice">{item.handle ? `@${item.handle}` : 'No handle parsed'}</h2>
              <p className="mt-3 text-sm text-frost">
                {item.httpStatus == null ? 'No HTTP status' : `HTTP ${item.httpStatus}`}
                {typeof item.similarity === 'number' && item.closestOfficial
                  ? ` · ${Math.round(item.similarity * 100)}% character alignment with @${item.closestOfficial}`
                  : ' · No official handle to compare'}
                {item.displayName ? ` · Public title: ${item.displayName}` : ''}
              </p>
              {item.url ? <p className="mt-2 break-all text-sm text-frost">{item.url}</p> : null}
              <p className="mt-4 text-ice">{item.finding}</p>
              <p className="eyebrow mt-4">If you choose to report it</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-frost">
                {(item.reportSteps ?? []).map((step) => (
                  <li key={step}>{linkify(step)}</li>
                ))}
              </ol>
            </article>
          ))}
        </section>
      ) : null}
      {paid && !status.evidence && status.report !== 'researching' ? (
        <p className="measure mt-4 text-frost">No research has been stored yet.</p>
      ) : null}
      {(status.offers ?? []).length > 0 ? (
        <section className="mt-8">
          <h2 className="display text-3xl text-ice">Other options</h2>
          <p className="mt-3 text-sm text-frost">Placeholder entries. They are not offers until the title, sentence, price, and link are replaced.</p>
          <div className="mt-4 space-y-3">
            {(status.offers ?? []).map((offer) => (
              <article className="glass p-6" key={offer.link}>
                <h3 className="text-ice">{offer.title}</h3>
                <p className="mt-2 text-frost">{offer.description}</p>
                <p className="mt-2 text-sm text-frost">{offer.price}</p>
                <a className="mt-3 inline-flex text-sm text-ice" href={offer.link} rel="noreferrer">
                  {offer.link}
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <div className="mt-8">
        <Link className="btn-ghost" to="/impersonation-check">
          Back to Impersonation Check
        </Link>
      </div>
    </>
  );
}

function bodyCopy(status: ReadyStatus, paid: boolean) {
  switch (status.report) {
    case 'delivery_ready':
    case 'delivery_approved':
    case 'research_complete':
      return status.emailStatus === 'sent' || status.emailSent
        ? 'The same research was emailed, with a PDF attached. You can close this tab and reopen it from that email. Nothing here removes an account. The platform decides any report you file.'
        : 'The research is stored on this page. The results email was not sent because email is not configured. Nothing here removes an account.';
    case 'email_failed':
      return 'The research is on this page. The results email did not send, so the failure is recorded and can be retried. Nothing here removes an account.';
    case 'researching':
      return 'Payment is verified. Automated research is reading the public pages you submitted. This page updates when the notes are stored. The email also brings you back here if you close the tab. This is not a determination and it does not remove accounts.';
    case 'research_failed':
      return 'Payment is verified. Automated research did not finish. The failure is recorded. This page does not invent a finding, and it does not remove accounts.';
    case 'draft':
    case 'none':
      return paid
        ? 'Stripe’s signed event matched this stored intake and the $199 one-time price. Automated research has not stored notes yet. We do not remove accounts.'
        : 'The intake is stored on the server. A browser address is not payment. Automated research starts only after a verified payment. We do not remove accounts.';
    default: {
      const unexpected: never = status.report;
      return unexpected;
    }
  }
}
