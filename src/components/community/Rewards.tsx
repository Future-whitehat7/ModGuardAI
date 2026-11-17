const perks = [
  {
    name: 'Spotted by you',
    run: 'ModGuard',
    detail: 'When a member spots a scam or deepfake pattern that ModGuard adopts, the pattern carries their handle as permanent credit.',
  },
  {
    name: 'The Red Team Seat',
    run: 'Partners',
    detail: 'Top contributors get a credited seat in a partner’s live trust and safety red-team or bug-bash.',
  },
  {
    name: 'Frontier Pass',
    run: 'Partners',
    detail: 'Office hours with AI safety teams, early beta access, and 1:1 mentorship, provided by partners.',
  },
  {
    name: 'Guardian Card',
    run: 'ModGuard',
    detail: 'A status card that climbs Scout, Spotter, Analyst, Guardian, and Founding Contributor, plus a verifiable ModGuard reference letter for a resume.',
  },
];

export function Rewards() {
  return (
    <section id="rewards" className="community-block" aria-labelledby="rewards-title">
      <p className="eyebrow">Rewards and perks</p>
      <h2 id="rewards-title" className="display section-display text-ice">The work should feel like a win.</h2>
      <p className="community-copy">
        Recognition here is access and a record of the work. ModGuard runs two of these. The other two open when a partner brings them. None of them are live yet.
      </p>
      <ul className="perk-grid">
        {perks.map((perk) => (
          <li key={perk.name} className="perk-card">
            <p className="community-kicker">{perk.run === 'ModGuard' ? 'ModGuard-run' : 'Unlocks as partners join'}</p>
            <h3>{perk.name}</h3>
            <p>{perk.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
