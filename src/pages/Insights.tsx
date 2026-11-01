import { Link } from 'react-router-dom';
import { insightPosts } from '../content/insights';

export const Insights = () => {
  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="measure text-xl text-ice">The patterns change. The public record is the place to read them.</p>
      <ul className="mt-8 divide-y divide-[#E6E6E1] border-y border-[#E6E6E1]">
        {insightPosts.map((post) => (
          <li key={post.slug}>
            <Link className="block py-6" to={`/insights/${post.slug}`}>
              <span className="eyebrow">{post.kicker}</span>
              <span className="mt-2 block text-2xl text-ice">{post.title}</span>
              <span className="mt-2 block max-w-[680px] text-frost">{post.description}</span>
              <time className="mt-2 block font-mono text-xs text-frost" dateTime={post.published}>
                {post.published}
              </time>
            </Link>
          </li>
        ))}
      </ul>
      <Link className="btn-accent mt-8" to="/scamcheck">
        Check a message
      </Link>
    </article>
  );
};
