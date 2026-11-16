import { Link } from 'react-router-dom';
import { brandImages } from '../components/marketing/brandImages';
import { ImageSlot } from '../components/marketing/ImageSlot';
import { insightPosts } from '../content/insights';

export const Insights = () => {
  return (
    <article className="page-wrap mx-auto w-full max-w-6xl px-4 sm:px-6">
      <p className="eyebrow">Insights</p>
      <h1 className="display section-display mt-4 text-ice">The patterns change. The public record is the place to read them.</h1>
      <ImageSlot image={brandImages.insights} priority />
      <ul className="ledger">
        {insightPosts.map((post) => (
          <li key={post.slug}>
            <Link className="ledger-link" to={`/insights/${post.slug}`}>
              <span className="eyebrow">{post.kicker}</span>
              <span className="ledger-title">{post.title}</span>
              <span className="mt-2 block max-w-[40rem] leading-relaxed text-frost">{post.description}</span>
              <time className="mt-3 block font-mono text-xs text-frost" dateTime={post.published}>
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
