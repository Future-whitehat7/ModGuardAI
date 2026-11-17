import { SwipeDeck } from './SwipeDeck';
import type { BuzzPost } from './useDailyFeed';

function when(value: string) {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return '';
  return new Date(time).toISOString().slice(0, 16).replace('T', ' ');
}

function counts(post: BuzzPost) {
  const parts: string[] = [];
  if (typeof post.likes === 'number') parts.push(`${post.likes.toLocaleString('en-US')} likes`);
  if (typeof post.replies === 'number') parts.push(`${post.replies.toLocaleString('en-US')} replies`);
  if (typeof post.reposts === 'number') parts.push(`${post.reposts.toLocaleString('en-US')} reposts`);
  return parts.join(' · ');
}

export function SocialBuzz({ posts }: { posts: BuzzPost[] }) {
  if (!posts.length) return null;
  return (
    <div>
      <p className="daily-note">Public posts from the platform named on each card. These are not ModGuard testimonials.</p>
      <SwipeDeck
        items={posts}
        label="What people are saying"
        getKey={(post) => post.url}
        render={(post) => (
          <article className="buzz-card">
            <p className="daily-kicker">
              <span>{post.platform}</span>
              <span>@{post.author}</span>
              {post.time ? <time dateTime={post.time}>{when(post.time)}</time> : null}
            </p>
            <p className="buzz-text">{post.text}</p>
            {counts(post) ? <p className="daily-note">{counts(post)}</p> : null}
            <a href={post.url}>Open the original</a>
          </article>
        )}
      />
    </div>
  );
}
