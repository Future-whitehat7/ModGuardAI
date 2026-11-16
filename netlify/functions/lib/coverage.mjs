import { platformLabel } from './research.mjs';

export const META_ADS_LABEL = 'Meta ads';
export const COVERAGE_INSTRUCTION = 'Checked means a public page returned. A line that says not checked means that platform did not return a public page. This is not a determination and it does not remove an account.';

const LABEL_ORDER = ['Instagram', 'Facebook', 'TikTok', 'X', 'YouTube', 'GitHub', 'Telegram', 'Pinterest', 'Twitch', 'Medium', 'Patreon', 'Meta ads', 'Website'];

function labelRank(value) {
  const label = String(value || '').replace(/ not checked$/, '');
  const index = LABEL_ORDER.indexOf(label);
  return index === -1 ? LABEL_ORDER.length : index;
}

export function sortLabels(values) {
  return [...values].sort((left, right) => labelRank(left) - labelRank(right) || left.localeCompare(right));
}

function submittedLabel(item) {
  const platform = item?.platform;
  if (platform === 'instagram' || platform === 'facebook' || platform === 'tiktok' || platform === 'x' || platform === 'youtube' || platform === 'website') {
    return platformLabel(platform);
  }
  return 'Website';
}

function pageWasRead(item) {
  const status = item?.httpStatus;
  if (!Number.isInteger(status) || status < 200 || status >= 500) return false;
  if (status === 401 || status === 403 || status === 408 || status === 429) return false;
  const signals = Array.isArray(item?.signals) ? item.signals : [];
  if (signals.some((signal) => typeof signal === 'string' && /sign-in page/i.test(signal))) return false;
  return true;
}

export function mergeSubmittedCoverage(items, coverage) {
  const checked = new Set(Array.isArray(coverage?.checked) ? coverage.checked : []);
  const notChecked = new Set(Array.isArray(coverage?.notChecked) ? coverage.notChecked : []);
  const notes = new Set(Array.isArray(coverage?.notes) ? coverage.notes : []);
  for (const item of Array.isArray(items) ? items : []) {
    if (!item?.url) continue;
    const label = submittedLabel(item);
    const phrase = `${label} not checked`;
    if (pageWasRead(item)) {
      if (notChecked.has(phrase)) notes.add(`Similar names were not searched on ${label}.`);
      notChecked.delete(phrase);
      checked.add(label);
    } else if (!checked.has(label)) notChecked.add(phrase);
  }
  return {
    checked: sortLabels([...checked]),
    notChecked: sortLabels([...notChecked]),
    notes: [...notes],
    skipped: Array.isArray(coverage?.skipped) ? coverage.skipped : [],
    partial: coverage?.partial === true,
    instruction: coverage?.instruction || COVERAGE_INSTRUCTION,
  };
}

export function coverageLines(coverage) {
  const checked = Array.isArray(coverage?.checked) ? coverage.checked.filter(Boolean) : [];
  const notChecked = Array.isArray(coverage?.notChecked) ? coverage.notChecked.filter(Boolean) : [];
  const notes = Array.isArray(coverage?.notes) ? coverage.notes.filter(Boolean) : [];
  const lines = [];
  if (checked.length === 0 && notChecked.length === 0) lines.push('No platform was searched for this order.');
  else {
    lines.push(checked.length > 0 ? `Platforms checked: ${checked.join(', ')}.` : 'Platforms checked: none.');
    lines.push(notChecked.length > 0 ? `Platforms not checked: ${notChecked.join('. ')}.` : 'Platforms not checked: none.');
  }
  for (const note of notes) lines.push(String(note));
  if (coverage?.partial) lines.push('The look-alike search stopped early so the time limit would not be exceeded. Coverage is partial.');
  if (coverage?.instruction) lines.push(String(coverage.instruction));
  return lines;
}
