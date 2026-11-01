const FEEDS = [
  ['The Hacker News', 'https://feeds.feedburner.com/TheHackersNews', 'Cyber'],
  ['BleepingComputer', 'https://www.bleepingcomputer.com/feed/', 'Cyber'],
  ['CISA', 'https://www.cisa.gov/cybersecurity-advisories/all.xml', 'Cyber'],
  ['Krebs on Security', 'https://krebsonsecurity.com/feed/', 'Cyber'],
  ['Dark Reading', 'https://www.darkreading.com/rss.xml', 'Cyber'],
  ['SecurityWeek', 'https://www.securityweek.com/feed/', 'Cyber'],
  ['The Record', 'https://therecord.media/feed', 'Cyber'],
  ['TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/feed/', 'AI'],
  ['The Verge AI', 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', 'AI'],
  ['MIT Technology Review', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', 'AI'],
  ['Google News · deepfake', 'https://news.google.com/rss/search?q=deepfake&hl=en-US&gl=US&ceid=US:en', 'Deepfake'],
  ['Google News · AI scam', 'https://news.google.com/rss/search?q=%22AI+scam%22&hl=en-US&gl=US&ceid=US:en', 'Scam'],
  ['Google News · voice cloning', 'https://news.google.com/rss/search?q=%22voice+cloning+fraud%22&hl=en-US&gl=US&ceid=US:en', 'Deepfake'],
  ['BBC Technology', 'https://feeds.bbci.co.uk/news/technology/rss.xml', 'Tech'],
];

const DAY = 86400000;

function decode(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decode(match[1]) : '';
}

function linkOf(block) {
  const text = tag(block, 'link');
  if (text.startsWith('http')) return text;
  const href = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  return href ? href[1] : '';
}

async function load(url, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      method,
      body,
      signal: controller.signal,
      headers: { 'user-agent': 'ModGuardAI-Site/1.0', accept: 'application/json,application/rss+xml,text/xml,*/*' },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function classify(feedTag, title) {
  if (/\b(deepfakes?|voice[- ]clon)/i.test(title)) return 'Deepfake';
  if (/\b(scams?|phishing|fraud)\b/i.test(title)) return 'Scam';
  if (feedTag !== 'Tech') return feedTag;
  if (/\b(cyber|hack(?:ed|ing)?|ransomware|malware|breach|vulnerabilit(?:y|ies))\b/i.test(title)) return 'Cyber';
  if (/\b(AI|LLM|ChatGPT|OpenAI|generative|machine learning)\b/i.test(title)) return 'AI';
  return null;
}

function feedItems(xml, source, feedTag) {
  if (!xml) return [];
  const parts = (/<entry[\s>]/i.test(xml) ? xml.split(/<entry[\s>]/i) : xml.split(/<item[\s>]/i)).slice(1, 7);
  return parts.map((block) => {
    const title = tag(block, 'title');
    const topic = classify(feedTag, title);
    if (!topic) return null;
    const url = linkOf(block);
    const rawDate = tag(block, 'pubDate') || tag(block, 'updated') || tag(block, 'published');
    const time = Date.parse(rawDate);
    const summaryText = tag(block, 'description') || tag(block, 'summary') || tag(block, 'content');
    const summary = summaryText.length > 420 ? `${summaryText.slice(0, 417).trim()}…` : summaryText;
    return {
      title,
      url,
      source,
      summary,
      tag: topic,
      date: Number.isNaN(time) ? rawDate : new Date(time).toISOString().slice(0, 10),
      time: Number.isNaN(time) ? null : time,
    };
  }).filter((item) => item && item.title && item.url.startsWith('http'));
}

export async function collectThreats(now = Date.now()) {
  const asOf = new Date(now).toISOString();
  const weekStart = now - 7 * DAY;
  const monthStart = new Date(now - 30 * DAY).toISOString().slice(0, 10);
  const nvdStart = new Date(weekStart).toISOString().slice(0, 19);
  const nvdEnd = new Date(now).toISOString().slice(0, 19);
  const stats = [];
  const skipped = [];

  const [kevText, nvdText, feodoText, ...feeds] = await Promise.all([
    load('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'),
    load(`https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=1&startIndex=0&pubStartDate=${nvdStart}.000&pubEndDate=${nvdEnd}.999`),
    load('https://feodotracker.abuse.ch/downloads/ipblocklist.json'),
    ...FEEDS.map(([, url]) => load(url)),
  ]);

  if (kevText) {
    try {
      const kev = JSON.parse(kevText);
      const rows = Array.isArray(kev.vulnerabilities) ? kev.vulnerabilities : [];
      const total = Number.isInteger(kev.count) ? kev.count : rows.length;
      const added = rows.filter((row) => typeof row.dateAdded === 'string' && row.dateAdded >= monthStart).length;
      const released = typeof kev.dateReleased === 'string' ? kev.dateReleased : asOf;
      stats.push({
        label: 'Known exploited vulnerabilities',
        value: total,
        source: 'CISA KEV',
        url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
        asOf: released,
      });
      stats.push({
        label: `KEV entries added since ${monthStart}`,
        value: added,
        source: 'CISA KEV dateAdded',
        url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
        asOf: released,
      });
    } catch {
      skipped.push('CISA KEV');
    }
  } else skipped.push('CISA KEV');

  if (nvdText) {
    try {
      const nvd = JSON.parse(nvdText);
      if (Number.isInteger(nvd.totalResults)) {
        stats.push({
          label: 'CVEs published in the last 7 days',
          value: nvd.totalResults,
          source: 'NVD API 2.0',
          url: 'https://services.nvd.nist.gov/rest/json/cves/2.0',
          asOf: typeof nvd.timestamp === 'string' ? nvd.timestamp : asOf,
        });
      }
    } catch {
      skipped.push('NVD');
    }
  } else skipped.push('NVD');

  if (feodoText) {
    try {
      const rows = JSON.parse(feodoText);
      const online = Array.isArray(rows) ? rows.filter((row) => row.status === 'online').length : 0;
      stats.push({
        label: 'Online botnet C2 hosts',
        value: online,
        source: 'abuse.ch Feodo Tracker',
        url: 'https://feodotracker.abuse.ch/',
        asOf,
      });
    } catch {
      skipped.push('Feodo Tracker');
    }
  } else skipped.push('Feodo Tracker');

  const seen = new Set();
  const items = [];
  FEEDS.forEach(([source, , feedTag], index) => {
    const parsed = feedItems(feeds[index], source, feedTag);
    if (!parsed.length) {
      skipped.push(source);
      return;
    }
    parsed.forEach((item) => {
      const titleKey = item.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);
      const urlKey = item.url.replace(/[?#].*$/, '');
      if (seen.has(titleKey) || seen.has(urlKey)) return;
      seen.add(titleKey);
      seen.add(urlKey);
      items.push(item);
    });
  });
  items.sort((a, b) => (b.time ?? 0) - (a.time ?? 0));
  const seenUrl = new Set();
  const picked = [];
  const bySource = new Map();
  items.forEach((item) => {
    const list = bySource.get(item.source) ?? [];
    list.push(item);
    bySource.set(item.source, list);
  });
  bySource.forEach((list) => {
    const newest = list[0];
    picked.push(newest);
    seenUrl.add(newest.url);
  });
  items.forEach((item) => {
    if (picked.length >= 24 || seenUrl.has(item.url)) return;
    picked.push(item);
    seenUrl.add(item.url);
  });
  picked.sort((a, b) => (b.time ?? 0) - (a.time ?? 0));
  const headlines = picked.map(({ time, ...item }) => item);

  skipped.push('URLhaus and ThreatFox require an API key, so they are omitted.');
  skipped.push('VentureBeat and Reuters did not return a public feed, so they are omitted.');

  return { asOf, stats, items: headlines, skipped };
}
