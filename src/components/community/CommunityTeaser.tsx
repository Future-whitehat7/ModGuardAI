import { Link } from 'react-router-dom';

export function CommunityTeaser() {
  return (
    <section className="page-section" aria-labelledby="community-teaser">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <p className="eyebrow">Community</p>
        <h2 id="community-teaser" className="display section-display mt-4 text-ice">Be here before it&apos;s big.</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-frost">
          Five minutes to a badge. Then a build, a campus night, and a public name when the work is confirmed.
        </p>
        <Link className="btn-accent mt-6" to="/community">Open Community</Link>
      </div>
    </section>
  );
}
