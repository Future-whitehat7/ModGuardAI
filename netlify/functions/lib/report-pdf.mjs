import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { platformLabel } from './research.mjs';
import { upsells as defaultOffers } from './upsells.mjs';

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 68;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM = 64;

const paper = rgb(0.973, 0.965, 0.953);
const ink = rgb(0.102, 0.102, 0.11);
const mute = rgb(0.435, 0.412, 0.376);
const line = rgb(0.784, 0.757, 0.71);
const cardFill = rgb(0.992, 0.988, 0.982);
const rule = rgb(0.545, 0.478, 0.392);

function winAnsi(value) {
  return String(value ?? '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');
}

function wrap(text, font, size, width) {
  const source = winAnsi(text).replace(/\s+/g, ' ').trim();
  if (!source) return [''];
  const lines = [];
  let current = '';
  const commit = () => {
    if (current) lines.push(current);
    current = '';
  };
  for (const word of source.split(' ')) {
    const pieces = [];
    if (font.widthOfTextAtSize(word, size) <= width) pieces.push(word);
    else {
      let piece = '';
      for (const character of word) {
        const next = piece + character;
        if (piece && font.widthOfTextAtSize(next, size) > width) {
          pieces.push(piece);
          piece = character;
        } else piece = next;
      }
      if (piece) pieces.push(piece);
    }
    for (const piece of pieces) {
      const next = current ? `${current} ${piece}` : piece;
      if (font.widthOfTextAtSize(next, size) <= width) current = next;
      else {
        commit();
        current = piece;
      }
    }
  }
  commit();
  return lines;
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

function knownPlatform(platform) {
  if (platform === 'instagram' || platform === 'facebook' || platform === 'tiktok' || platform === 'x' || platform === 'youtube' || platform === 'website') {
    return platform;
  }
  return 'website';
}

export function buildReportModel({
  orderId,
  summary,
  items,
  generatedAt,
  statusUrl,
  offers = defaultOffers,
}) {
  return {
    orderId: orderId || '',
    summary: summary || '',
    items: Array.isArray(items) ? items : [],
    generatedAt: generatedAt || new Date().toISOString(),
    statusUrl: statusUrl || '',
    offers: Array.isArray(offers) ? offers : [],
  };
}

export async function buildReportPdf(model) {
  const doc = await PDFDocument.create();
  doc.setTitle('Account research');
  doc.setAuthor('');
  doc.setSubject('Automated public-page research');
  const fonts = {
    serif: await doc.embedFont(StandardFonts.TimesRoman),
    sans: await doc.embedFont(StandardFonts.Helvetica),
  };
  const transcript = [];
  const pages = [];

  const openPage = () => {
    const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: paper });
    page.drawRectangle({ x: MARGIN, y: PAGE_HEIGHT - 42, width: 28, height: 1.2, color: rule });
    const cursor = { page, y: PAGE_HEIGHT - 68 };
    pages.push(cursor);
    return cursor;
  };

  let cursor = openPage();

  const ensure = (height) => {
    if (cursor.y - height < BOTTOM) cursor = openPage();
  };

  const write = (value, { font, size, color, leading, gap = 0, x = MARGIN, width = CONTENT_WIDTH }) => {
    const lines = wrap(value, font, size, width);
    for (const lineText of lines) {
      ensure(leading + 2);
      cursor.page.drawText(lineText, { x, y: cursor.y - size, size, font, color });
      transcript.push(lineText);
      cursor.y -= leading;
    }
    cursor.y -= gap;
    return lines.length;
  };

  const date = String(model.generatedAt).slice(0, 10);
  write('AUTOMATED RESEARCH', { font: fonts.sans, size: 8.5, color: mute, leading: 12, gap: 10 });
  write('Account research', { font: fonts.serif, size: 32, color: ink, leading: 38, gap: 8 });
  write(
    'Notes from public pages. A confidence level says how much of each page could be read. It is not a finding that an account is or is not impersonation, and it is not a removal.',
    { font: fonts.serif, size: 12, color: ink, leading: 17, gap: 14 },
  );
  const ruleY = cursor.y;
  cursor.page.drawRectangle({ x: MARGIN, y: ruleY, width: CONTENT_WIDTH, height: 0.5, color: line });
  cursor.y -= 16;
  write(`Date  ${date}      Reference  ${model.orderId || 'unassigned'}`, {
    font: fonts.sans,
    size: 9,
    color: mute,
    leading: 12,
    gap: 22,
  });

  write('Summary', { font: fonts.serif, size: 16, color: ink, leading: 20, gap: 8 });
  write(model.summary, { font: fonts.serif, size: 12, color: ink, leading: 17, gap: 22 });

  model.items.forEach((item, index) => {
    const platform = platformLabel(knownPlatform(item.platform));
    const handle = item.handle ? `@${item.handle}` : 'No handle parsed';
    const status = item.httpStatus == null ? 'No HTTP status' : `HTTP ${item.httpStatus}`;
    const similarity = typeof item.similarity === 'number' && item.closestOfficial
      ? `${Math.round(item.similarity * 100)}% character alignment with @${item.closestOfficial}`
      : 'No official handle to compare';
    const evidence = `${status}. ${similarity}. ${item.displayName ? `Public title: ${item.displayName}.` : 'No public title.'}`;
    const steps = (Array.isArray(item.reportSteps) && item.reportSteps.length > 0
      ? item.reportSteps
      : ['No platform steps were attached.']
    ).map((step, stepIndex) => `${stepIndex + 1}. ${step}`);
    const inner = CONTENT_WIDTH - 36;
    const findingLines = wrap(item.finding || '', fonts.serif, 11, inner);
    const evidenceLines = wrap(evidence, fonts.sans, 9, inner);
    const urlLines = item.url ? wrap(item.url, fonts.sans, 8, inner) : [];
    const stepLineCount = steps.reduce((sum, step) => sum + wrap(step, fonts.sans, 9, inner).length, 0);
    const urlHeight = urlLines.length > 0 ? urlLines.length * 11 + 10 : 8;
    const cardHeight = 18
      + 14
      + 24
      + 17
      + urlHeight
      + findingLines.length * 15 + 8
      + 13
      + evidenceLines.length * 13 + 8
      + 14
      + stepLineCount * 13 + steps.length * 2
      + 18;
    if (cursor.y - cardHeight < BOTTOM) cursor = openPage();
    const boxBottom = cursor.y - cardHeight;
    cursor.page.drawRectangle({
      x: MARGIN,
      y: boxBottom,
      width: CONTENT_WIDTH,
      height: cardHeight,
      borderColor: line,
      borderWidth: 0.7,
      color: cardFill,
    });
    cursor.page.drawRectangle({ x: MARGIN, y: boxBottom, width: 1.5, height: cardHeight, color: rule });
    cursor.y -= 16;
    const x = MARGIN + 16;
    write(`${String(index + 1).padStart(2, '0')}`, { font: fonts.sans, size: 9, color: mute, leading: 12, gap: 2, x, width: inner });
    write(platform, { font: fonts.serif, size: 18, color: ink, leading: 22, gap: 2, x, width: inner });
    write(`${handle}      Data confidence  ${confidenceLabel(item.confidence)}`, {
      font: fonts.sans,
      size: 9,
      color: mute,
      leading: 13,
      gap: 4,
      x,
      width: inner,
    });
    if (urlLines.length > 0) write(item.url, { font: fonts.sans, size: 8, color: mute, leading: 11, gap: 10, x, width: inner });
    else cursor.y -= 8;
    write(item.finding || '', { font: fonts.serif, size: 11, color: ink, leading: 15, gap: 8, x, width: inner });
    write('Evidence', { font: fonts.sans, size: 8, color: mute, leading: 11, gap: 2, x, width: inner });
    write(evidence, { font: fonts.sans, size: 9, color: ink, leading: 13, gap: 8, x, width: inner });
    write('If you choose to report it', { font: fonts.sans, size: 8, color: mute, leading: 11, gap: 3, x, width: inner });
    for (const step of steps) {
      write(step, { font: fonts.sans, size: 9, color: ink, leading: 13, gap: 2, x, width: inner });
    }
    cursor.y = Math.min(cursor.y, boxBottom) - 18;
    transcript.push('');
  });

  write('Other options', { font: fonts.serif, size: 16, color: ink, leading: 20, gap: 6 });
  write('Placeholder entries follow. They are not offers until the owner replaces the title, the sentence, the price, and the link.', {
    font: fonts.serif,
    size: 11,
    color: mute,
    leading: 15,
    gap: 12,
  });
  for (const offer of model.offers) {
    ensure(72);
    write(offer.title || 'Untitled', { font: fonts.serif, size: 13, color: ink, leading: 17, gap: 3 });
    write(offer.description || '', { font: fonts.serif, size: 11, color: ink, leading: 15, gap: 2 });
    write(`${offer.price || ''}      ${offer.link || ''}`, { font: fonts.sans, size: 9, color: mute, leading: 13, gap: 12 });
  }
  if (model.statusUrl) {
    write('Private page', { font: fonts.sans, size: 8, color: mute, leading: 12, gap: 3 });
    write(model.statusUrl, { font: fonts.sans, size: 9, color: ink, leading: 12, gap: 8 });
  }

  const drawn = doc.getPages();
  drawn.forEach((page, index) => {
    page.drawText('Not a determination. Not a removal. The platform decides.', {
      x: MARGIN,
      y: 34,
      size: 8,
      font: fonts.sans,
      color: mute,
    });
    const label = `${index + 1}  /  ${drawn.length}`;
    const width = fonts.sans.widthOfTextAtSize(label, 8);
    page.drawText(label, { x: PAGE_WIDTH - MARGIN - width, y: 34, size: 8, font: fonts.sans, color: mute });
  });
  transcript.push('Not a determination. Not a removal. The platform decides.');

  const bytes = await doc.save();
  return { bytes, text: transcript.join('\n') };
}
