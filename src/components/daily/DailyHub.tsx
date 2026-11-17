import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adSlots } from '../../config/adSlots';
import { DAILY_CATEGORIES, dailyCategory, sponsoredCard, type DailyCategory, type DailyItem } from '../../lib/daily';
import { SwipeDeck } from './SwipeDeck';
import type { DailyStat } from './useDailyFeed';

type Filter = 'All' | DailyCategory;

function matches(item: DailyItem, filter: Filter) {
  if (filter === 'All') return true;
  return dailyCategory(item) === filter;
}

export function DailyHub({
  items,
  stats,
  asOf,
  showList,
}: {
  items: DailyItem[];
  stats: DailyStat[];
  asOf: string;
  showList: boolean;
}) {
  const [filter, setFilter] = useState<Filter>('All');
  const visible = useMemo(() => items.filter((item) => matches(item, filter)).slice(0, showList ? items.length : 12), [filter, items, showList]);
  const sponsor = sponsoredCard(adSlots['home-between'].sponsor);

  return (
    <div>
      <div className="daily-filters" role="tablist" aria-label="Daily categories">
        {(['All', ...DAILY_CATEGORIES] as Filter[]).map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={filter === category}
            className={filter === category ? 'on' : ''}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {asOf ? <p className="daily-note">Feed time {asOf.slice(0, 16).replace('T', ' ')} UTC</p> : null}
      {stats.length > 0 && filter === 'All' ? (
        <ul className="daily-stats">
          {stats.map((stat) => (
            <li key={stat.label}>
              <a href={stat.url}>
                <span>{stat.value.toLocaleString('en-US')}</span>
                {stat.label}
                {stat.source ? <small>{stat.source}</small> : null}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {visible.length === 0 ? (
        <p className="daily-note">No public items in this category right now.</p>
      ) : (
        <SwipeDeck
          items={sponsor ? [{ kind: 'sponsor' as const, sponsor }, ...visible.map((item) => ({ kind: 'news' as const, item }))] : visible.map((item) => ({ kind: 'news' as const, item }))}
          label="ModGuard Daily stories"
          getKey={(entry) => (entry.kind === 'sponsor' ? 'sponsor' : entry.item.url)}
          render={(entry) => (entry.kind === 'sponsor' ? (
            <article className="daily-story daily-sponsored">
              <p className="daily-kicker">Sponsored</p>
              <h3><a href={entry.sponsor.href}>{entry.sponsor.name}</a></h3>
              <p>{entry.sponsor.message}</p>
            </article>
          ) : (
            <article className="daily-story">
              <p className="daily-kicker">
                <span>{entry.item.source || 'Source'}</span>
                {entry.item.date ? <time dateTime={entry.item.date}>{entry.item.date}</time> : null}
                {dailyCategory(entry.item) ? <span>{dailyCategory(entry.item)}</span> : null}
              </p>
              <h3><a href={entry.item.url}>{entry.item.title}</a></h3>
              {entry.item.summary ? <p>{entry.item.summary}</p> : null}
            </article>
          ))}
        />
      )}
      {showList && visible.length > 0 ? (
        <ul className="daily-list">
          {visible.map((item) => (
            <li key={item.url}>
              <a href={item.url}>
                <span>{item.source}{item.date ? ` · ${item.date}` : ''}</span>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {!showList ? <Link className="offer-link" to="/daily">Open ModGuard Daily</Link> : null}
    </div>
  );
}
