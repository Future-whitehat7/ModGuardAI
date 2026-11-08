import { useState } from 'react';
import type { FormEvent } from 'react';
import { protectionTiers, type TierId } from '../../config/platform';

type Status = 'idle' | 'sending' | 'done' | 'error';

export function SponsorInquiry({ initialTier = 'starter' }: { initialTier?: TierId }) {
  const [status, setStatus] = useState<Status>('idle');
  const [tier, setTier] = useState<TierId>(initialTier);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') body.append(key, value);
    });
    body.set('form-name', 'sponsor-inquiry');
    body.set('tier', tier);
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!response.ok) throw new Error('form');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p className="glass p-6 text-ice" role="status">
        Inquiry received. We have your name, email, and the tier you asked about. We reply by email. Nothing is reserved until that reply.
      </p>
    );
  }

  return (
    <form
      id="inquiry"
      className="glass p-6"
      name="sponsor-inquiry"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="form-name" value="sponsor-inquiry" />
      <p className="hidden">
        <label>
          Do not fill this in
          <input name="bot-field" />
        </label>
      </p>
      <p className="eyebrow">Inquiry</p>
      <h2 className="display mt-3 text-3xl text-ice">Ask before you pay</h2>
      <p className="measure mt-3 text-frost">
        Starter and Elite do not have a live card payment. Growth does. This form is the pending-stripe path.
      </p>
      <label className="mt-4 block text-sm text-frost" htmlFor="sponsor-name">
        Name
      </label>
      <input id="sponsor-name" name="name" className="field mt-2" required autoComplete="name" />
      <label className="mt-4 block text-sm text-frost" htmlFor="sponsor-email">
        Email
      </label>
      <input id="sponsor-email" name="email" type="email" className="field mt-2" required autoComplete="email" />
      <fieldset className="mt-4">
        <legend className="text-sm text-frost">Tier</legend>
        {protectionTiers.map((item) => (
          <label key={item.id} className="mt-3 flex min-h-12 items-start gap-3 text-ice">
            <input type="radio" name="tier-choice" value={item.id} checked={tier === item.id} onChange={() => setTier(item.id)} />
            <span>
              {item.name}. {item.audience}
            </span>
          </label>
        ))}
      </fieldset>
      <label className="mt-4 block text-sm text-frost" htmlFor="sponsor-message">
        What do you want checked, or where do you want to advertise?
      </label>
      <textarea id="sponsor-message" name="message" className="field mt-2 min-h-28 py-3" required />
      {status === 'error' && (
        <p className="mt-4 text-ice" role="alert">
          The form did not go through. Try again in a moment.
        </p>
      )}
      <button className="btn-accent mt-4" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  );
}
