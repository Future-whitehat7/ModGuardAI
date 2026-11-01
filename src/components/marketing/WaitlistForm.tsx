import { useState } from 'react';
import type { FormEvent } from 'react';

type Status = 'idle' | 'sending' | 'done' | 'error';

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!response.ok) throw new Error('form');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p className="rise mt-8 text-lg text-ice" role="status">
        You’re on the list. We have your name and email.
      </p>
    );
  }

  return (
    <form
      className="mt-10 grid max-w-xl gap-6"
      name="waitlist"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="form-name" value="waitlist" />
      <p className="hidden">
        <label>
          Don’t fill this out
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className="grid gap-2 text-sm text-frost" htmlFor="waitlist-name">
        Name
        <input id="waitlist-name" className="field" name="name" type="text" autoComplete="name" required />
      </label>
      <label className="grid gap-2 text-sm text-frost" htmlFor="waitlist-email">
        Email
        <input id="waitlist-email" className="field" name="email" type="email" autoComplete="email" required />
      </label>
      <label className="grid gap-2 text-sm text-frost" htmlFor="waitlist-protect">
        What do you want protected? <span className="text-frost">Optional</span>
        <textarea id="waitlist-protect" className="field min-h-28 py-3" name="protect" />
      </label>
      <button className="btn-accent w-full sm:w-auto" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Join the list'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-frost" role="alert">The form did not send. Try again in a moment.</p>
      )}
    </form>
  );
}
