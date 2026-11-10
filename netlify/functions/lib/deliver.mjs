import { buildReportPdf, buildReportModel } from './report-pdf.mjs';
import { renderConfirmationEmail, renderOperatorEmail, renderResultsEmail } from './report-email.mjs';
import { deliveryConfigured } from './resend.mjs';
import { upsells } from './upsells.mjs';

export function statusUrlFor(config, accessToken) {
  if (!config?.publicSiteUrl || !accessToken) return '';
  const url = new URL('/impersonation-check/thanks', config.publicSiteUrl.endsWith('/') ? config.publicSiteUrl : `${config.publicSiteUrl}/`);
  url.searchParams.set('access', accessToken);
  return url.toString();
}

function recorded(status, extra = {}) {
  return {
    status,
    sent: status === 'sent',
    error: extra.error || null,
    id: extra.id || null,
    at: extra.at || null,
  };
}

async function sendOrSkip({ config, mailer, message, now }) {
  if (!deliveryConfigured(config)) return recorded('skipped_unconfigured', { at: now });
  if (!message.to) return recorded('skipped_no_recipient', { at: now });
  if (!mailer) return recorded('failed', { error: 'mailer_missing', at: now });
  const result = await mailer.send(message);
  if (!result?.ok) return recorded('failed', { error: result?.error || 'send_failed', at: now });
  return recorded('sent', { id: result.id, at: now });
}

export async function sendConfirmation({ order, accessToken, config, mailer, now }) {
  const rendered = renderConfirmationEmail({ statusUrl: statusUrlFor(config, accessToken) });
  return sendOrSkip({
    config,
    mailer,
    now,
    message: {
      kind: 'confirmation',
      to: order.intake?.email || '',
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    },
  });
}

export async function sendResults({ order, accessToken, config, mailer, now }) {
  const evidence = order.evidence;
  if (!evidence?.summary || !Array.isArray(evidence.items) || evidence.items.length === 0) {
    return recorded('failed', { error: 'evidence_missing', at: now });
  }
  const model = buildReportModel({
    orderId: order.orderId,
    summary: evidence.summary,
    items: evidence.items,
    generatedAt: new Date(now).toISOString(),
    statusUrl: statusUrlFor(config, accessToken),
    offers: upsells,
  });
  let pdf;
  try {
    pdf = await buildReportPdf(model);
  } catch {
    return recorded('failed', { error: 'pdf_failed', at: now });
  }
  const rendered = renderResultsEmail({
    summary: model.summary,
    items: model.items,
    statusUrl: model.statusUrl,
    offers: model.offers,
  });
  return sendOrSkip({
    config,
    mailer,
    now,
    message: {
      kind: 'results',
      to: order.intake?.email || '',
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      attachments: [{
        filename: 'account-research.pdf',
        contentBase64: Buffer.from(pdf.bytes).toString('base64'),
      }],
      pdfText: pdf.text,
    },
  });
}

function summarizeOperator(recipients, now) {
  if (recipients.length === 0) return { ...recorded('skipped_no_recipient', { at: now }), recipients: [] };
  const statuses = recipients.map((item) => item.status);
  let status = 'failed';
  if (statuses.every((item) => item === 'skipped_unconfigured')) status = 'skipped_unconfigured';
  else if (statuses.every((item) => item === 'skipped_no_recipient')) status = 'skipped_no_recipient';
  else if (statuses.every((item) => item === 'sent')) status = 'sent';
  else if (statuses.some((item) => item === 'sent')) status = 'partial';
  return {
    status,
    sent: status === 'sent',
    error: status === 'sent' || status.startsWith('skipped') ? null : 'operator_recipient_failed',
    id: null,
    at: now,
    recipients,
  };
}

export async function sendOperatorCopy({ order, customerResult, config, mailer, now, alreadySent = [] }) {
  const accepted = Array.isArray(config?.operatorEmails) ? config.operatorEmails : [];
  const rejected = Array.isArray(config?.operatorEmailsRejected) ? config.operatorEmailsRejected : [];
  if (accepted.length === 0 && rejected.length === 0) {
    return { ...recorded('skipped_no_recipient', { at: now }), recipients: [] };
  }
  const rendered = renderOperatorEmail({ order, customerResult });
  const prior = new Set(alreadySent.map((email) => email.toLowerCase()));
  const recipients = rejected.map((email) => ({ to: email, status: 'failed', error: 'invalid_address', id: null }));
  for (const email of accepted) {
    if (prior.has(email.toLowerCase())) {
      recipients.push({ to: email, status: 'sent', error: null, id: null });
      continue;
    }
    const result = await sendOrSkip({
      config,
      mailer,
      now,
      message: {
        kind: 'operator',
        to: email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      },
    });
    recipients.push({ to: email, status: result.status, error: result.error, id: result.id });
  }
  return summarizeOperator(recipients, now);
}
