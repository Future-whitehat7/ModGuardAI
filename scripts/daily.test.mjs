import assert from 'node:assert/strict';
import test from 'node:test';
import { excerpt, fromBluesky, fromHackerNews, fromReddit, fromX } from '../netlify/functions/lib/buzz.mjs';
import { cleanText, dailyCategory, isPublishable, sponsoredCard } from '../src/lib/daily.ts';
import { buildPrompt } from '../src/lib/prompts.ts';

test('daily categories follow the headline, and an unrelated title stays unlabeled', () => {
  assert.equal(dailyCategory({ title: 'Ransomware crew lists a hospital', summary: '', tag: 'Cyber' }), 'Cybersecurity');
  assert.equal(dailyCategory({ title: 'OpenAI ships a new model', summary: '', tag: 'AI' }), 'AI');
  assert.equal(dailyCategory({ title: 'ChatGPT adds a workspace tool', summary: '', tag: 'AI' }), 'AI tools');
  assert.equal(dailyCategory({ title: 'A bank deployed the checker in production', summary: 'case study', tag: 'AI' }), 'Use cases');
  assert.equal(dailyCategory({ title: 'Quarterly earnings', summary: '', tag: 'Tech' }), null);
  assert.equal(cleanText('Hello&nbsp;world&#8230;'), 'Hello world…');
  assert.equal(isPublishable({ title: 'A school deepfake story about a student that is sexual', summary: '' }), false);
  assert.equal(isPublishable({ title: 'Researchers detect a new deepfake scam', summary: '' }), true);
});

test('buzz rows keep real posts and drop blanks', () => {
  const blue = fromBluesky({
    posts: [{
      uri: 'at://did:plc:abc/app.bsky.feed.post/xyz',
      indexedAt: '2026-11-16T00:00:00.000Z',
      likeCount: 2,
      replyCount: 1,
      repostCount: 0,
      author: { handle: 'ada.bsky.social' },
      record: { text: 'A real public note about phishing.' },
    }, { author: { handle: '' }, record: { text: 'missing' } }],
  });
  assert.equal(blue.length, 1);
  assert.equal(blue[0].url, 'https://bsky.app/profile/ada.bsky.social/post/xyz');
  assert.equal(blue[0].likes, 2);
  assert.equal(blue[0].reposts, 0);

  const reddit = fromReddit({
    data: { children: [{ data: { author: 'sam', title: 'Is this a scam?', selftext: 'The text asked for a code.', permalink: '/r/scams/comments/abc/is_this/', created_utc: 1763330000, score: 4, num_comments: 2 } }] },
  });
  assert.equal(reddit[0].platform, 'Reddit');
  assert.equal(reddit[0].url, 'https://www.reddit.com/r/scams/comments/abc/is_this/');

  const hn = fromHackerNews({
    hits: [
      { author: 'lee', comment_text: 'This phishing page copies the bank login.', story_title: 'Bank alert', objectID: '42', created_at: '2026-11-16T00:00:00.000Z' },
      { author: 'lee', comment_text: 'We are hiring', story_title: 'Who is hiring?', objectID: '43' },
    ],
  });
  assert.equal(hn.length, 1);
  assert.equal(hn[0].url, 'https://news.ycombinator.com/item?id=42');
  assert.equal(excerpt('<p>Hello&amp;nbsp;</p>').includes('<'), false);
});

test('X posts are parsed only from a payload, and the deck has no sponsor until one is configured', () => {
  const posts = fromX({
    data: [{ id: '99', text: 'A public post about phishing.', author_id: '1', created_at: '2026-11-16T00:00:00.000Z', public_metrics: { like_count: 3, reply_count: 1, retweet_count: 0 } }],
    includes: { users: [{ id: '1', username: 'modguard' }] },
  });
  assert.equal(posts[0].url, 'https://x.com/modguard/status/99');
  assert.equal(fromX({}).length, 0);
  assert.equal(sponsoredCard(null), null);
  assert.equal(sponsoredCard({ name: 'Example', href: 'note', message: 'Hi' }), null);
});

test('a prompt includes the chosen task and the supplied context', () => {
  const prompt = buildPrompt('phishing', 'The text says the account closes tonight.');
  assert.match(prompt, /phishing/i);
  assert.match(prompt, /account closes tonight/);
  assert.match(prompt, /Do not invent/);
  const empty = buildPrompt('threat', '   ');
  assert.match(empty, /No extra context/);
});
