import { platformLabel } from './research.mjs';
import { upsells as defaultOffers } from './upsells.mjs';

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function knownPlatform(platform) {
  if (platform === 'instagram' || platform === 'facebook' || platform === 'tiktok' || platform === 'x' || platform === 'youtube' || platform === 'website') {
    return platform;
  }
  return 'website';
}

function confidenceLabel(level) {
  switch (level) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default: {
      const unexpected = level;
      return unexpected ? 'Low' : 'Low';
    }
  }
}

function linked(text) {
  const safe = escapeHtml(text);
  return safe.replace(/https:\/\/[^\s<]+/g, (url) => `<a href="${url}" style="color:#3f3a34;text-decoration:underline;">${url}</a>`);
}

function layout(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f7f4ef;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffcf8;border:1px solid #e4ddd2;">
        <tr><td style="padding:40px 40px 12px;font-family:Georgia,'Iowan Old Style',Palatino,'Palatino Linotype',serif;color:#1a1a1c;">
          <p style="margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#6f675e;">Automated research</p>
          <h1 style="margin:0;font-weight:400;font-size:32px;line-height:1.15;">${escapeHtml(title)}</h1>
        </td></tr>
        <tr><td style="padding:8px 40px 36px;font-family:Georgia,'Iowan Old Style',Palatino,serif;font-size:16px;line-height:1.55;color:#1a1a1c;">
          ${bodyHtml}
        </td></tr>
      </table>
      <p style="max-width:560px;margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6f675e;">Not a determination. Not a removal. The platform decides.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export function renderConfirmationEmail({ statusUrl }) {
  const link = statusUrl
    ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(statusUrl)}" style="color:#1a1a1c;">Open the private status page</a></p><p style="margin:8px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:#6f675e;word-break:break-all;">${escapeHtml(statusUrl)}</p>`
    : '<p style="margin:24px 0 0;color:#6f675e;">The private link is not available because the site address is not configured.</p>';
  const html = layout(
    'Payment verified',
    `<p style="margin:0;">Payment for this check is verified. Automated research is reading the public pages you submitted. The notes, a data-confidence level for each one, and the platform report steps will follow in a second email, with a PDF attached.</p>
     <p style="margin:16px 0 0;">This is not a determination and it does not remove accounts. You can close this tab. The private page keeps the same notes.</p>
     ${link}`,
  );
  const text = [
    'Payment verified',
    '',
    'Payment for this check is verified. Automated research is reading the public pages you submitted.',
    'The notes will follow in a second email, with a PDF attached.',
    'This is not a determination and it does not remove accounts.',
    statusUrl ? `Private page: ${statusUrl}` : 'The private link is not available because the site address is not configured.',
    '',
    'Not a determination. Not a removal. The platform decides.',
  ].join('\n');
  return { subject: 'Payment verified', html, text };
}

export function renderResultsEmail({ summary, items, statusUrl, offers = defaultOffers }) {
  const blocks = (Array.isArray(items) ? items : []).map((item) => {
    const platform = platformLabel(knownPlatform(item.platform));
    const handle = item.handle ? `@${escapeHtml(item.handle)}` : 'No handle parsed';
    const steps = (Array.isArray(item.reportSteps) ? item.reportSteps : [])
      .map((step) => `<li style="margin:0 0 6px;">${linked(step)}</li>`)
      .join('');
    const similarity = typeof item.similarity === 'number' && item.closestOfficial
      ? `${Math.round(item.similarity * 100)}% character alignment with @${escapeHtml(item.closestOfficial)}`
      : 'No official handle to compare';
    const http = item.httpStatus == null ? 'No HTTP status' : `HTTP ${item.httpStatus}`;
    return `<div style="margin:28px 0 0;padding-top:22px;border-top:1px solid #e4ddd2;">
      <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6f675e;">${escapeHtml(platform)}</p>
      <p style="margin:8px 0 0;font-size:20px;">${handle}</p>
      <p style="margin:6px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#6f675e;">Data confidence ${confidenceLabel(item.confidence)} · ${http} · ${similarity}</p>
      <p style="margin:12px 0 0;">${escapeHtml(item.finding || '')}</p>
      ${item.url ? `<p style="margin:8px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;word-break:break-all;color:#6f675e;">${escapeHtml(item.url)}</p>` : ''}
      <p style="margin:14px 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6f675e;">If you choose to report it</p>
      <ol style="margin:0;padding-left:18px;">${steps}</ol>
    </div>`;
  }).join('');
  const offerBlocks = (Array.isArray(offers) ? offers : []).map((offer) => `<div style="margin:16px 0 0;">
      <p style="margin:0;font-size:16px;">${escapeHtml(offer.title || '')}</p>
      <p style="margin:4px 0 0;color:#3f3a34;">${escapeHtml(offer.description || '')}</p>
      <p style="margin:4px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#6f675e;">${escapeHtml(offer.price || '')}<br>${escapeHtml(offer.link || '')}</p>
    </div>`).join('');
  const link = statusUrl
    ? `<p style="margin:28px 0 0;"><a href="${escapeHtml(statusUrl)}" style="color:#1a1a1c;">Open the same research</a></p><p style="margin:8px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6f675e;word-break:break-all;">${escapeHtml(statusUrl)}</p>`
    : '<p style="margin:28px 0 0;color:#6f675e;">The private link is not available because the site address is not configured.</p>';
  const html = layout(
    'Account research',
    `<p style="margin:0;">${escapeHtml(summary || '')}</p>
     <p style="margin:16px 0 0;">A PDF of the same research is attached. Data confidence is about how much of a public page could be read. It is not a determination, and nothing here removes an account.</p>
     ${blocks}
     ${link}
     ${offerBlocks ? `<div style="margin:36px 0 0;padding-top:22px;border-top:1px solid #e4ddd2;">
       <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6f675e;">Other options</p>
       ${offerBlocks}
     </div>` : ''}`,
  );
  const textLines = [
    'Account research',
    '',
    summary || '',
    '',
    'A PDF of the same research is attached.',
    'Data confidence is about how much of a public page could be read. It is not a determination, and nothing here removes an account.',
    '',
  ];
  for (const item of Array.isArray(items) ? items : []) {
    textLines.push(platformLabel(knownPlatform(item.platform)));
    textLines.push(item.handle ? `@${item.handle}` : 'No handle parsed');
    textLines.push(`Data confidence ${confidenceLabel(item.confidence)}`);
    textLines.push(item.finding || '');
    textLines.push('If you choose to report it:');
    for (const step of item.reportSteps || []) textLines.push(`- ${step}`);
    textLines.push('');
  }
  if (statusUrl) textLines.push(`Private page: ${statusUrl}`, '');
  const offerList = Array.isArray(offers) ? offers : [];
  if (offerList.length > 0) {
    textLines.push('Other options');
    for (const offer of offerList) {
      textLines.push(offer.title || '', offer.description || '', offer.price || '', offer.link || '', '');
    }
  }
  textLines.push('Not a determination. Not a removal. The platform decides.');
  return { subject: 'Account research', html, text: textLines.join('\n') };
}

export function renderOperatorEmail({ order, customerResult }) {
  const intake = order?.intake || {};
  const lines = [
    `Order ${order?.orderId || ''}`,
    `Namespace ${order?.namespace || ''}`,
    `State ${order?.state || ''}`,
    `Customer email result: ${customerResult?.status || 'not_recorded'}${customerResult?.error ? ` (${customerResult.error})` : ''}`,
    '',
    'This is a copy for the operator. The customer email does not wait on a reply.',
    '',
    `Name: ${intake.name || ''}`,
    `Email: ${intake.email || ''}`,
    `Role: ${intake.role || ''}`,
    `Tier: ${intake.tier || ''}`,
    `Known fakes: ${intake.knownFakes || ''}`,
    `Name variations: ${intake.nameVariations || ''}`,
    `DMs for money: ${intake.dmsForMoney || ''}`,
    `Real offers: ${intake.realOffers || ''}`,
    `Fan reports: ${intake.fanReports || ''}`,
    `Priority: ${intake.priority || ''}`,
    `Sensitive: ${intake.sensitive || ''}`,
    `Links: ${JSON.stringify(intake.links || {})}`,
  ];
  const text = lines.join('\n');
  const html = `<pre style="font-family:Georgia,serif;white-space:pre-wrap;font-size:15px;line-height:1.5;color:#1a1a1c;">${escapeHtml(text)}</pre>`;
  return {
    subject: `Paid check ${order?.orderId || ''}`,
    html,
    text,
  };
}
