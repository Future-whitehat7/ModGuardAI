import { useEffect, useState } from 'react';
import { globalChips } from '../../community/regions';
import { CommunityForm } from './CommunityForm';

interface Squad {
  name: string;
  type: string;
  location: string;
}

export function Squads() {
  const [squads, setSquads] = useState<Squad[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/community/squads.json');
        if (!response.ok) return;
        const data = await response.json() as { squads?: unknown };
        if (!Array.isArray(data.squads)) return;
        setSquads(data.squads.flatMap((item) => {
          if (typeof item !== 'object' || item === null) return [];
          const row = item as Record<string, unknown>;
          if (typeof row.name !== 'string' || !row.name.trim()) return [];
          return [{
            name: row.name.trim(),
            type: typeof row.type === 'string' ? row.type : '',
            location: typeof row.location === 'string' ? row.location : '',
          }];
        }));
      } catch {
        setSquads([]);
      }
    };
    void load();
  }, []);

  return (
    <article className="play-card" id="squads">
      <p className="community-kicker">Guardian squads</p>
      <h3>Up to five people. One campus, city, or country.</h3>
      <ul className="region-chips">
        {globalChips.map((chip) => (
          <li key={chip}>{chip}</li>
        ))}
      </ul>
      {squads.length === 0 ? (
        <p className="community-empty">Be the first squad on the board.</p>
      ) : (
        <ul className="community-board">
          {squads.map((squad) => (
            <li key={squad.name}>
              <strong>{squad.name}</strong>
              <small>{squad.type} {squad.location}</small>
            </li>
          ))}
        </ul>
      )}
      <CommunityForm
        id="squad-form"
        formName="community-squad"
        title="Create or join a squad"
        lede="We read every one and reply by email. A squad appears on the board after it is confirmed."
        fields={[
          { name: 'squad', label: 'Squad name' },
          { name: 'type', label: 'Type', options: ['Campus', 'City', 'Country'] },
          { name: 'location', label: 'Location' },
          { name: 'captain', label: 'Captain name and email' },
        ]}
      />
    </article>
  );
}
