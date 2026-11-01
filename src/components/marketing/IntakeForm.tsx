import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { intakeTierRadios, type IntakeTierValue } from '../../config/platform';

type Status = 'editing' | 'sending' | 'done' | 'error';

const steps = ['About you', 'Official accounts', 'What to look for', 'Priorities', 'Consent'] as const;

export function IntakeForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>('editing');
  const [error, setError] = useState('');
  const [tier, setTier] = useState<IntakeTierValue>(intakeTierRadios[0].value);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const panels = [...form.querySelectorAll<HTMLElement>('[data-step]')];
    const current = panels[step];
    const fields = current
      ? [...current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea, select')]
      : [];
    const invalid = fields.find((field) => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    if (step < steps.length - 1) {
      setStep((value) => value + 1);
      return;
    }
    setStatus('sending');
    setError('');
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') body.append(key, value);
    });
    body.set('form-name', 'impersonation-check');
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
      setError('The form did not go through. Try again in a moment.');
    }
  };

  if (status === 'done') {
    return (
      <div className="glass p-6" role="status">
        <p className="eyebrow">Intake complete</p>
        <h2 className="display mt-3 text-3xl text-ice">The 48-hour clock has started.</h2>
        <p className="measure mt-4 text-ice">
          We have your name, email, accounts, and the three consents. We email you within 48 hours of this completed intake.
        </p>
        <Link className="btn-ghost mt-6" to="/">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <form
      className="glass intake-form"
      name="impersonation-check"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      noValidate
      onSubmit={onSubmit}
    >
      <input type="hidden" name="form-name" value="impersonation-check" />
      <p className="hidden">
        <label>
          Do not fill this in
          <input name="bot-field" />
        </label>
      </p>
      <p className="eyebrow">
        Step {step + 1} of {steps.length}: {steps[step]}
      </p>

      <div data-step="0" hidden={step !== 0}>
        <label className="mt-4 block text-sm text-frost" htmlFor="intake-name">
          Name
        </label>
        <input id="intake-name" name="name" className="field mt-2" required autoComplete="name" />
        <label className="mt-4 block text-sm text-frost" htmlFor="intake-email">
          Email
        </label>
        <input id="intake-email" name="email" type="email" className="field mt-2" required autoComplete="email" />
        <label className="mt-4 block text-sm text-frost" htmlFor="intake-receipt">
          Stripe receipt email, if it is different
        </label>
        <input id="intake-receipt" name="stripe-receipt-email" type="email" className="field mt-2" autoComplete="off" />
      </div>

      <div data-step="1" hidden={step !== 1}>
        <p className="measure mt-4 text-frost" id="accounts-hint">
          At least one official profile link. Add the accounts you want compared with copies.
        </p>
        <label className="mt-4 block text-sm text-frost" htmlFor="account-1">
          Official account link
        </label>
        <input id="account-1" name="account-1" type="url" className="field mt-2" required placeholder="https://" aria-describedby="accounts-hint" />
        <label className="mt-4 block text-sm text-frost" htmlFor="account-2">
          Another official link, if you have one
        </label>
        <input id="account-2" name="account-2" type="url" className="field mt-2" placeholder="https://" />
        <label className="mt-4 block text-sm text-frost" htmlFor="account-3">
          A third official link, if you have one
        </label>
        <input id="account-3" name="account-3" type="url" className="field mt-2" placeholder="https://" />
      </div>

      <div data-step="2" hidden={step !== 2}>
        <label className="mt-4 block text-sm text-frost" htmlFor="look-for">
          What should we look for?
        </label>
        <textarea id="look-for" name="look-for" className="field mt-2 min-h-28 py-3" required />
      </div>

      <div data-step="3" hidden={step !== 3}>
        <label className="mt-4 block text-sm text-frost" htmlFor="priorities">
          What should come first?
        </label>
        <textarea id="priorities" name="priorities" className="field mt-2 min-h-28 py-3" required />
        <fieldset className="mt-6">
          <legend className="text-sm text-frost">Which payment choice matches you?</legend>
          <p className="measure mt-2 text-sm text-frost">
            These two choices are the intake radios. Starter, under 100K followers at $49 a week or $99 a month, is not one of them. The $499 choice says public figures and manager bookings. It does not say accounts over 1 million followers.
          </p>
          {intakeTierRadios.map((radio) => (
            <label key={radio.value} className="mt-3 flex min-h-12 items-start gap-3 text-ice">
              <input
                type="radio"
                name="tier"
                value={radio.value}
                checked={tier === radio.value}
                onChange={() => setTier(radio.value)}
                required
              />
              <span>{radio.label}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <div data-step="4" hidden={step !== 4}>
        <fieldset className="mt-4">
          <legend className="text-sm text-frost">Consent</legend>
          <label className="mt-3 flex min-h-12 items-start gap-3 text-ice">
            <input type="checkbox" name="consent-permission" required />
            <span>I am the account holder, or I have their permission to request this check.</span>
          </label>
          <label className="mt-3 flex min-h-12 items-start gap-3 text-ice">
            <input type="checkbox" name="consent-manual" required />
            <span>I understand this is a manual sweep, not a guarantee.</span>
          </label>
          <label className="mt-3 flex min-h-12 items-start gap-3 text-ice">
            <input type="checkbox" name="consent-clock" required />
            <span>I understand the 48-hour clock starts when this intake is complete, not when I pay.</span>
          </label>
        </fieldset>
      </div>

      {error && (
        <p className="mt-4 text-ice" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {step > 0 && (
          <button className="btn-ghost" type="button" onClick={() => setStep((value) => value - 1)}>
            Back
          </button>
        )}
        <button className="btn-accent" type="submit" disabled={status === 'sending'}>
          {step < steps.length - 1 ? 'Continue' : status === 'sending' ? 'Sending…' : 'Submit intake'}
        </button>
      </div>
    </form>
  );
}
