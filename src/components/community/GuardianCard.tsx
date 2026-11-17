const tiers = [
  { name: 'Scout', locked: false },
  { name: 'Spotter', locked: false },
  { name: 'Analyst', locked: true },
  { name: 'Guardian', locked: true },
  { name: 'Founding Contributor', locked: true },
];

export function GuardianCard() {
  return (
    <div className="guardian-preview">
      <p className="community-kicker">Guardian Card preview</p>
      <ol>
        {tiers.map((tier) => (
          <li key={tier.name} className={tier.locked ? 'locked' : 'open'}>
            <span>{tier.locked ? 'Locked' : 'Open'}</span>
            {tier.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
