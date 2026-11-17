import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { countdown, readBoard } from '../src/community/board.ts';
import { emptyProgress, levelProgress, pathSteps, readProgress, recordTask } from '../src/community/progress.ts';
import { pairForDay, votePercent } from '../src/community/play.ts';
import { gulfRegions, regionChoices } from '../src/community/regions.ts';
import { choiceIsRight, labelTask, promptIsReady } from '../src/community/samples.ts';

test('a duel rotates by date and hides a vote percent until votes exist', () => {
  assert.equal(pairForDay('2026-11-01').id, pairForDay('2026-12-01').id);
  assert.notEqual(pairForDay('2026-11-01').id, pairForDay('2026-11-02').id);
  assert.equal(votePercent(null, 0), null);
  assert.equal(votePercent(0, 0), null);
  assert.equal(votePercent(4, 3), 75);
});

test('partner regions feature the Gulf and do not invent a presence', () => {
  assert.deepEqual(gulfRegions, ['UAE', 'Abu Dhabi', 'Dubai', 'Saudi Arabia', 'Qatar']);
  assert.deepEqual(regionChoices, ['UAE', 'Abu Dhabi', 'Dubai', 'Saudi Arabia', 'Qatar', 'Other']);
});

test('the public board ships empty and ignores a nameless row', () => {
  const file = JSON.parse(readFileSync('public/community/board.json', 'utf8'));
  const board = readBoard(file);
  assert.equal(board.contributors.length, 0);
  assert.equal(board.shipped.length, 0);
  assert.equal(board.hackathons.length, 0);
  assert.equal(countdown('', Date.now()), null);
  const named = readBoard({ contributors: [{ name: 'Ada', handle: 'ada', focus: 'prompts' }, { handle: 'nope' }] });
  assert.equal(named.contributors.length, 1);
  assert.equal(named.contributors[0].name, 'Ada');
});

test('a future hackathon date counts down and a past date does not', () => {
  const now = Date.parse('2026-11-17T00:00:00Z');
  assert.equal(countdown('2026-11-18T00:00:00Z', now), '1 day 0 hr');
  assert.equal(countdown('2026-11-16T00:00:00Z', now), null);
});

test('doorway progress stays on this browser and does not invent a public title', () => {
  const first = recordTask(emptyProgress, labelTask.id, '2026-11-17');
  assert.deepEqual(first.tasks, ['label-sms']);
  assert.equal(first.streak, 1);
  const sameDay = recordTask(first, 'flag-post', '2026-11-17');
  assert.equal(sameDay.streak, 1);
  assert.equal(sameDay.tasks.length, 2);
  const nextDay = recordTask(sameDay, 'safety-prompt', '2026-11-18');
  assert.equal(nextDay.streak, 2);
  const afterGap = recordTask(nextDay, 'label-sms', '2026-11-21');
  assert.equal(afterGap.streak, 1);
  assert.equal(choiceIsRight(labelTask, 'Scam'), true);
  assert.equal(choiceIsRight(labelTask, 'Not a scam'), false);
  assert.equal(promptIsReady('too short'), false);
  assert.equal(promptIsReady('Tell the assistant not to invent a safe verdict without the message.'), true);
  assert.equal(readProgress('not json').tasks.length, 0);
  assert.equal(levelProgress(1).name, 'Scout');
  assert.equal(levelProgress(1).done, 1);
  assert.equal(levelProgress(1).next, 'Spotter');
  assert.equal(levelProgress(3).name, 'Spotter');
  assert.equal(pathSteps(0)[0].state, 'now');
  assert.equal(pathSteps(1)[0].state, 'done');
  assert.equal(pathSteps(3)[1].state, 'locked');
  assert.equal(pathSteps(3)[2].state, 'locked');
});
