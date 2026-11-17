import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { emptyHireCopy, principle, readHireLog } from '../src/give-back/log.ts';

test('the public hire log ships empty and a private partner stays unlabeled', () => {
  const file = JSON.parse(readFileSync('public/give-back/hires.json', 'utf8'));
  const log = readHireLog(file);
  assert.equal(log.hires.length, 0);
  assert.match(log.updated, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(principle.includes('$'), false);
  assert.equal(emptyHireCopy, 'No hires yet. An entry appears here only after a partner confirms a hire and the member agrees to be listed.');
  const named = readHireLog({
    updated: '2026-11-17',
    hires: [{ date: '2026-11-17', partner: '', privatePartner: true, role: 'Analyst', region: 'Remote', confirmedBy: 'Both' }],
  });
  assert.equal(named.hires.length, 1);
  assert.equal(named.hires[0].privatePartner, true);
});
