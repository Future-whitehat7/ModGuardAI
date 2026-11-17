import { DailyHub } from '../components/daily/DailyHub';
import { PromptGenerator } from '../components/daily/PromptGenerator';
import { SocialBuzz } from '../components/daily/SocialBuzz';
import { SponsorDaily } from '../components/daily/SponsorDaily';
import { useDailyFeed } from '../components/daily/useDailyFeed';

export function Daily() {
  const { feed, ready } = useDailyFeed();
  return (
    <article className="page-wrap mx-auto w-full max-w-6xl px-4 sm:px-6">
      <p className="eyebrow">ModGuard Daily</p>
      <h1 className="display section-display mt-4 text-ice">The public record, in one place.</h1>
      <p className="hero-lede">
        Cybersecurity, AI, tools, and use cases from public feeds. Every card links to the original. Nothing here is written by ModGuard.
      </p>
      <section className="daily-block" aria-labelledby="daily-news">
        <h2 id="daily-news" className="display text-4xl text-ice">Today’s reporting</h2>
        {!ready ? <p className="daily-note">Loading the public feed.</p> : null}
        {ready && feed && feed.news.length === 0 ? <p className="daily-note">The public feed is not available right now.</p> : null}
        {ready && feed && feed.news.length > 0 ? (
          <DailyHub items={feed.news} stats={feed.stats} asOf={feed.asOf} showList />
        ) : null}
      </section>
      <section className="daily-block" aria-labelledby="daily-buzz">
        <h2 id="daily-buzz" className="display text-4xl text-ice">What people are saying</h2>
        {ready && feed ? <SocialBuzz posts={feed.posts} /> : null}
        {ready && feed && feed.posts.length === 0 ? <p className="daily-note">Public posts are not available right now.</p> : null}
      </section>
      <section className="daily-block" aria-labelledby="daily-prompt">
        <h2 id="daily-prompt" className="display text-4xl text-ice">Cybersecurity prompt generator</h2>
        <p className="daily-note">Pick a goal, add context, and copy a prompt for the assistant you already use. This page does not send the text to a model.</p>
        <PromptGenerator />
      </section>
      <section className="daily-block" aria-labelledby="daily-sponsor">
        <h2 id="daily-sponsor" className="display text-4xl text-ice">Sponsor ModGuard Daily</h2>
        <p className="daily-note">Placements are labeled. There is no sponsor in the deck until one is agreed.</p>
        <SponsorDaily />
      </section>
    </article>
  );
}
