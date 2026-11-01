import { useState } from 'react';
import type { FormEvent } from 'react';

const sections = 5;

function fieldValue(field: HTMLInputElement | HTMLTextAreaElement) {
  return field.value.trim();
}

function sectionDone(section: HTMLElement) {
  if (section.dataset.step === '2') {
    return [...section.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')].some(
      (field) => fieldValue(field).length > 0,
    );
  }
  const required = [...section.querySelectorAll<HTMLInputElement>('[required]')];
  if (required.length === 0) {
    return [...section.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')].some(
      (field) => field.type !== 'radio' && field.type !== 'checkbox' && fieldValue(field).length > 0,
    );
  }
  return required.every((field) => {
    if (field.type === 'radio') {
      return Boolean(section.querySelector(`input[name="${field.name}"]:checked`));
    }
    if (field.type === 'checkbox') return field.checked;
    return fieldValue(field).length > 0 && field.checkValidity();
  });
}

export function IntakeForm() {
  const [done, setDone] = useState(0);
  const [error, setError] = useState('');

  const refresh = (form: HTMLFormElement) => {
    const count = [...form.querySelectorAll<HTMLElement>('[data-step]')].filter(sectionDone).length;
    setDone(count);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    form.querySelectorAll('[aria-invalid]').forEach((field) => field.removeAttribute('aria-invalid'));
    const invalid = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')].filter(
      (field) => !field.checkValidity(),
    );
    const accounts = form.querySelector<HTMLElement>('[data-step="2"]');
    const hasLink = accounts ? sectionDone(accounts) : false;
    const badUrls = [...form.querySelectorAll<HTMLInputElement>('input[type="url"]')].filter(
      (field) => field.value.trim() !== '' && !field.checkValidity(),
    );
    if (invalid.length > 0 || !hasLink || badUrls.length > 0) {
      event.preventDefault();
      [...invalid, ...badUrls].forEach((field) => field.setAttribute('aria-invalid', 'true'));
      const firstAccount = accounts?.querySelector<HTMLInputElement>('input');
      if (!hasLink && firstAccount) firstAccount.setAttribute('aria-invalid', 'true');
      setError(
        badUrls.length > 0
          ? 'Use a full https link for each account you add.'
          : !hasLink && invalid.length === 0
            ? 'Add at least one official account link in section 2.'
            : `Please complete the highlighted fields${!hasLink ? ' and add at least one official account link' : ''}.`,
      );
      (invalid[0] ?? badUrls[0] ?? firstAccount)?.focus();
      return;
    }
    setError('');
  };

  return (
    <form
      className="glass intake-form"
      id="intake-form"
      name="impersonation-check"
      method="POST"
      action="/impersonation-check/thanks"
      encType="multipart/form-data"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      noValidate
      onInput={(event) => refresh(event.currentTarget)}
      onChange={(event) => refresh(event.currentTarget)}
      onSubmit={onSubmit}
    >
      <input type="hidden" name="form-name" value="impersonation-check" />
      <p className="honeypot">
        <label>
          Leave this empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <p className="progress-line" aria-live="polite">
        <span className="progress-track" aria-hidden="true">
          <span style={{ width: `${(done / sections) * 100}%` }} />
        </span>
        {done} of {sections} sections complete
      </p>

      <fieldset className="intake-step" data-step="1">
        <legend>1. About you</legend>
        <label className="mt-4 block text-sm text-frost" htmlFor="intake-name">
          Full name or public name
        </label>
        <input id="intake-name" name="name" className="field mt-2" required autoComplete="name" />
        <label className="mt-4 block text-sm text-frost" htmlFor="intake-email">
          Email
        </label>
        <input
          id="intake-email"
          name="email"
          type="email"
          className="field mt-2"
          required
          autoComplete="email"
          aria-describedby="email-hint"
          placeholder="you@example.com"
        />
        <p className="hint" id="email-hint">
          We send your slot date and report here.
        </p>
        <fieldset className="mt-4">
          <legend className="text-sm text-frost">Who is filling this in?</legend>
          <label className="choice">
            <input type="radio" name="role" value="creator" required />
            <span>I’m the creator</span>
          </label>
          <label className="choice">
            <input type="radio" name="role" value="manager" />
            <span>A manager or agent for the creator</span>
          </label>
        </fieldset>
        <fieldset className="mt-4">
          <legend className="text-sm text-frost">Which check?</legend>
          <label className="choice">
            <input type="radio" name="tier" value="199" required defaultChecked />
            <span>$199. Creators with 100K to 1 million followers</span>
          </label>
          <label className="choice">
            <input type="radio" name="tier" value="499" />
            <span>$499. Public figure, or booked through a manager</span>
          </label>
        </fieldset>
      </fieldset>

      <fieldset className="intake-step" data-step="2">
        <legend>2. Your real accounts</legend>
        <p className="hint" id="accounts-hint">
          Official links only. Add at least one.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-frost">
            TikTok <span className="opt">Optional</span>
            <input className="field mt-2" type="url" name="tiktok" placeholder="https://www.tiktok.com/@" aria-describedby="accounts-hint" />
          </label>
          <label className="block text-sm text-frost">
            Instagram <span className="opt">Optional</span>
            <input className="field mt-2" type="url" name="instagram" placeholder="https://instagram.com/" />
          </label>
          <label className="block text-sm text-frost">
            YouTube <span className="opt">Optional</span>
            <input className="field mt-2" type="url" name="youtube" placeholder="https://youtube.com/@" />
          </label>
          <label className="block text-sm text-frost">
            X <span className="opt">Optional</span>
            <input className="field mt-2" type="url" name="x" placeholder="https://x.com/" />
          </label>
          <label className="block text-sm text-frost">
            Facebook <span className="opt">Optional</span>
            <input className="field mt-2" type="url" name="facebook" placeholder="https://facebook.com/" />
          </label>
          <label className="block text-sm text-frost">
            Website or link-in-bio <span className="opt">Optional</span>
            <input className="field mt-2" type="url" name="website" placeholder="https://" />
          </label>
        </div>
        <label className="mt-4 block text-sm text-frost" htmlFor="other-accounts">
          Other accounts <span className="opt">Optional</span>
        </label>
        <input id="other-accounts" className="field mt-2" type="text" name="other" placeholder="Threads, LinkedIn, Telegram" />
      </fieldset>

      <fieldset className="intake-step" data-step="3">
        <legend>3. What to look for</legend>
        <label className="mt-4 block text-sm text-frost" htmlFor="name-variations">
          Name variations, nicknames, common misspellings <span className="opt">Optional</span>
        </label>
        <textarea id="name-variations" className="field mt-2 min-h-24 py-3" name="name_variations" rows={3} />
        <fieldset className="mt-4">
          <legend className="text-sm text-frost">Do you ever DM fans asking for money, investments, or giveaways?</legend>
          <label className="choice">
            <input type="radio" name="dms_for_money" value="no" required />
            <span>No, never</span>
          </label>
          <label className="choice">
            <input type="radio" name="dms_for_money" value="yes" />
            <span>Yes, sometimes</span>
          </label>
        </fieldset>
        <label className="mt-4 block text-sm text-frost" htmlFor="real-offers">
          What you actually sell <span className="opt">Optional</span>
        </label>
        <textarea id="real-offers" className="field mt-2 min-h-24 py-3" name="real_offers" rows={3} aria-describedby="offers-hint" />
        <p className="hint" id="offers-hint">
          Products, courses, or offers, so a fake one stands out.
        </p>
        <label className="mt-4 block text-sm text-frost" htmlFor="known-fakes">
          Fakes you already know about <span className="opt">Optional</span>
        </label>
        <textarea id="known-fakes" className="field mt-2 min-h-24 py-3" name="known_fakes" rows={3} placeholder="Paste links, one per line" />
        <label className="mt-4 block text-sm text-frost" htmlFor="screenshots">
          Screenshots of known fakes <span className="opt">Optional</span>
        </label>
        <input id="screenshots" className="mt-2 block min-h-12" type="file" name="screenshots" accept="image/*" />
        <label className="mt-4 block text-sm text-frost" htmlFor="fan-reports">
          Have fans reported scams using your name? <span className="opt">Optional</span>
        </label>
        <textarea id="fan-reports" className="field mt-2 min-h-24 py-3" name="fan_reports" rows={3} />
      </fieldset>

      <fieldset className="intake-step" data-step="4">
        <legend>4. Priorities <span className="opt">Optional</span></legend>
        <label className="mt-4 block text-sm text-frost" htmlFor="priority-platforms">
          Platforms that matter most
        </label>
        <input id="priority-platforms" className="field mt-2" type="text" name="priority_platforms" placeholder="Instagram first, then TikTok" />
        <label className="mt-4 block text-sm text-frost" htmlFor="sensitive">
          Anything we should handle discreetly
        </label>
        <textarea id="sensitive" className="field mt-2 min-h-24 py-3" name="sensitive" rows={3} />
      </fieldset>

      <fieldset className="intake-step" data-step="5">
        <legend>5. Consent</legend>
        <label className="choice mt-4">
          <input type="checkbox" name="consent_accounts" value="yes" required />
          <span>I confirm these are my accounts, or I’m authorized to act for the creator.</span>
        </label>
        <label className="choice">
          <input type="checkbox" name="consent_deliverable" value="yes" required />
          <span>I understand the deliverable is a findings report and a ready-to-file takedown list, not guaranteed removals. Each platform decides on removals.</span>
        </label>
        <label className="choice">
          <input type="checkbox" name="consent_limits" value="yes" required />
          <span>I understand a search can miss copies, and ModGuard provides risk-reduction guidance, not a guarantee.</span>
        </label>
      </fieldset>

      {error && (
        <p className="form-err" role="alert">
          {error}
        </p>
      )}
      <button className="btn-accent mt-4 w-full" type="submit">
        Start my $199 check
      </button>
      <p className="hint form-foot">
        Submitting this form does not charge you. The 48-hour clock starts once this intake is complete and payment is received.
      </p>
    </form>
  );
}
