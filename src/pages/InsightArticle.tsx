import { Link, useParams } from 'react-router-dom';
import { SponsorSlot } from '../components/marketing/SponsorSlot';
import { insightBySlug, type InsightInline } from '../content/insights';

function Inline({ part }: { part: InsightInline }) {
  if (part.kind === 'link') {
    return (
      <a href={part.href}>
        {part.text}
      </a>
    );
  }
  return <>{part.text}</>;
}

export const InsightArticle = () => {
  const { slug = '' } = useParams();
  const post = insightBySlug(slug);

  if (!post) {
    return (
      <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="display text-4xl text-ice">That note is not on this site.</h1>
        <Link className="btn-accent mt-6" to="/insights">
          All insights
        </Link>
      </article>
    );
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="eyebrow">{post.kicker}</p>
      <h1 className="display mt-3 text-4xl text-ice sm:text-5xl">{post.title}</h1>
      <time className="mt-4 block font-mono text-xs text-frost" dateTime={post.published}>
        {post.published}
      </time>
      {post.blocks.map((block) => (
        <section key={block.heading ?? block.paragraphs[0]?.map((part) => part.kind === 'text' ? part.text : part.text).join('')} className="mt-8">
          {block.heading && <h2 className="display text-3xl text-ice">{block.heading}</h2>}
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph.map((part) => (part.kind === 'text' ? part.text : part.href)).join('')} className="measure mt-4 text-lg leading-relaxed text-ice">
              {paragraph.map((part) => (
                <Inline key={part.kind === 'text' ? part.text : part.href} part={part} />
              ))}
            </p>
          ))}
        </section>
      ))}
      <SponsorSlot id="insight-article" />
      <section className="mt-10">
        <h2 className="eyebrow">Sources</h2>
        <ul className="mt-4 space-y-3">
          {post.sources.map((source) => (
            <li key={source.href}>
              <a href={source.href}>
                {source.name}: {source.title}
              </a>
              <span className="mt-1 block font-mono text-xs text-frost">{source.published}</span>
            </li>
          ))}
        </ul>
      </section>
      <Link className="btn-accent mt-8" to="/scamcheck">
        Check a message
      </Link>
    </article>
  );
};
