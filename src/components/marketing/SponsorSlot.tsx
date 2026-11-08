import { Link } from 'react-router-dom';
import { adSlots, sponsorPath, type AdSlotId } from '../../config/adSlots';

export function SponsorSlot({ id }: { id: AdSlotId }) {
  const slot = adSlots[id];
  const sponsor = slot.sponsor;

  if (sponsor) {
    return (
      <aside className="glass sponsor-slot" aria-label="Sponsored">
        <p className="eyebrow">Sponsored</p>
        <a className="mt-3 inline-flex min-h-12 items-center text-ice" href={sponsor.href}>
          {sponsor.name}
        </a>
        <p className="mt-2 text-frost">{sponsor.message}</p>
      </aside>
    );
  }

  return (
    <aside className="glass sponsor-slot" aria-label="Sponsored">
      <p className="eyebrow">Sponsored</p>
      <p className="mt-3 text-ice">This spot is open.</p>
      <Link className="mt-3 inline-flex min-h-12 items-center text-sm text-accent" to={sponsorPath}>
        Sponsor this spot
      </Link>
    </aside>
  );
}
