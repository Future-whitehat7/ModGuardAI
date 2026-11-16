import { mkdirSync, writeFileSync } from 'node:fs';
import { COVERAGE_INSTRUCTION } from '../netlify/functions/lib/coverage.mjs';
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
    if (href.includes('tiktok.com')) {
      const error = new Error('timed out');
      error.name = 'AbortError';
      throw error;
    }
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
    checked: ['YouTube', 'Instagram'],
    notChecked: ['TikTok not checked', 'Meta ads not checked'],
    notes: [],
    skipped: [{ site: 'TikTok', reason: 'self-test' }],
    partial: false,
    instruction: COVERAGE_INSTRUCTION,
  },
}));

const directory = '/opt/cursor/artifacts';
mkdirSync(directory, { recursive: true });
const path = `${directory}/account-research-sample.pdf`;
writeFileSync(path, pdf.bytes);
writeFileSync(`${directory}/account-research-sample.txt`, pdf.text);
process.stdout.write(`${path}\n${pdf.text}\n`);
