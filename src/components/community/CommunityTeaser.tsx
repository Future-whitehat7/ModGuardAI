import { Link } from 'react-router-dom';

export function CommunityTeaser() {
  return (
    <section className="page-section" aria-labelledby="community-teaser">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <p className="eyebrow">Community</p>
        <h2 id="community-teaser" className="display section-display mt-4 text-ice">No budget. The first names shape the check.</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-frost">
          Founding Contributor, a hackathon you can host, a five-minute doorway task, and a campus kit a club can run alone. No pay, no equity, no job offer.
        </p>
        <Link className="btn-accent mt-6" to="/community">Open Community</Link>
      </div>
    </section>
  );
}
