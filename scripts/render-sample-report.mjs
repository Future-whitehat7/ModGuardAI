import { mkdirSync, writeFileSync } from 'node:fs';
import { buildReportModel, buildReportPdf } from '../netlify/functions/lib/report-pdf.mjs';
import { researchIntake } from '../netlify/functions/lib/research.mjs';

const html = `<!doctype html><html><head><title>Example Creat0r</title>
<meta property="og:title" content="Example Creat0r" />
<meta property="og:description" content="Public profile shell used for the sample." />
</head><body>Example</body></html>`;

const research = await researchIntake({
  name: 'Example Creator',
  links: { instagram: 'https://instagram.com/examplecreator' },
  knownFakes: 'https://instagram.com/examplecreat0r\nhttps://www.tiktok.com/@notrealhandle',
}, {
  fetchImpl: async (url) => {
    const href = String(url);
    if (href.includes('examplecreat0r')) {
      return new Response(html, { status: 200, headers: { 'content-type': 'text/html' } });
    }
    return new Response('missing', { status: 404, headers: { 'content-type': 'text/html' } });
  },
  resolveImpl: async () => ['93.184.216.34'],
});

const pdf = await buildReportPdf(buildReportModel({
  orderId: `ord_${'ab'.repeat(16)}`,
  summary: `${research.summary} One possible look-alike was found. It is unverified.`,
  items: research.items,
  generatedAt: '2026-11-10T14:00:00.000Z',
  statusUrl: 'https://example.com/impersonation-check/thanks?access=sample-token',
  lookalikes: [{
    handle: 'examplecreat0r',
    platform: 'YouTube',
    url: 'https://www.youtube.com/@examplecreat0r',
    similarity: 0.93,
    confidence: 'medium',
    label: 'possible, unverified',
  }],
  coverage: {
    checked: ['YouTube', 'TikTok', 'GitHub'],
    skipped: [{ site: 'Patreon', reason: 'self-test' }],
    partial: false,
    uncheckedPlatforms: ['Instagram', 'Facebook', 'X', 'LinkedIn', 'Threads', 'Snapchat'],
    instruction: 'These platforms cannot be checked reliably from this server. Paste a full https profile link for any account on them. This is not a determination and it does not remove an account.',
  },
}));

const directory = '/opt/cursor/artifacts';
mkdirSync(directory, { recursive: true });
const path = `${directory}/account-research-sample.pdf`;
writeFileSync(path, pdf.bytes);
process.stdout.write(`${path}\n`);
