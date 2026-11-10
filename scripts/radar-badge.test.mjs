import assert from 'node:assert/strict';
import test from 'node:test';
import { radarBadge, radarSummary, toRadarRow } from '../src/lib/radarBadge.ts';

test('news without CVSS, EPSS, or KEV stays a news badge', () => {
  const row = toRadarRow({
    title: 'A public headline',
    url: 'https://example.com/story',
    source: 'Example',
    date: '2026-11-01',
    summary: 'Short summary.',
  });
  assert.ok(row);
  assert.equal(row.badge.kind, 'news');
  assert.equal(row.badge.label, 'News');
  assert.equal(radarBadge({ cvss: null, epss: null, kev: false }).label, 'News');
  assert.equal(radarBadge({ cvss: 11, epss: 2 }).kind, 'news');
});

test('severity badges use only the number or flag on the item', () => {
  assert.equal(radarBadge({ kev: true, cvss: 9.8 }).label, 'KEV');
  assert.equal(radarBadge({ cvss: 7.5 }).label, 'CVSS 7.5');
  assert.equal(radarBadge({ epss: 0.126 }).label, 'EPSS 12.6%');
});

test('rows drop items with no public url and truncate long summaries', () => {
  assert.equal(toRadarRow({ title: 'Missing link', url: '' }), null);
  const summary = radarSummary(`${'word '.repeat(80)}`);
  assert.ok(summary.endsWith('…'));
  assert.ok(summary.length <= 180);
});
