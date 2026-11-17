import { useState } from 'react';
import type { FormEvent } from 'react';

type Status = 'idle' | 'sending' | 'done' | 'error';

export function CommunityForm({
  id,
  formName,
  title,
  lede,
  fields,
}: {
  id: string;
  formName: 'community-join' | 'campus-kit' | 'community-sponsor' | 'community-partner' | 'community-squad' | 'community-sprint';
  title: string;
  lede: string;
  fields: { name: string; label: string; type?: string; required?: boolean; options?: string[]; defaultOption?: string }[];
}) {
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') body.append(key, value);
    });
    body.set('form-name', formName);
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!response.ok) throw new Error('form');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p className="community-note" role="status">
        Got it. We read every one and reply by email.
      </p>
    );
  }

  return (
    <form id={id} className="community-form" name={formName} method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value={formName} />
      <p className="hidden">
        <label>
          Do not fill this in
          <input name="bot-field" />
        </label>
      </p>
      <h3>{title}</h3>
      <p>{lede}</p>
      {fields.map((field) => field.type === 'checks' && field.options ? (
        <fieldset key={field.name} className="check-set">
          <legend>{field.label}</legend>
          {field.options.map((option) => (
            <label key={option} className="check-row">
              <input type="checkbox" name={field.name} value={option} />
              {option}
            </label>
          ))}
        </fieldset>
      ) : (
        <label key={field.name} className={field.type === 'checkbox' ? 'check-row' : undefined}>
          {field.type === 'checkbox' ? (
            <input name={field.name} type="checkbox" value="yes" />
          ) : null}
          {field.label}
          {field.type === 'checkbox' ? null : field.options ? (
            <select name={field.name} required={field.required !== false} defaultValue={field.defaultOption ?? ''}>
              <option value="" disabled>Choose one</option>
              {field.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea name={field.name} required={field.required !== false} maxLength={2000} />
          ) : (
            <input name={field.name} type={field.type ?? 'text'} required={field.required !== false} maxLength={160} />
          )}
        </label>
      ))}
      {status === 'error' ? <p role="alert">The form did not go through. Try again in a moment.</p> : null}
      <button className="btn-accent" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
