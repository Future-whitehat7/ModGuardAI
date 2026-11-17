import { useEffect, useState } from 'react';
import {
  counting,
  eligible,
  emptyHireCopy,
  emptyLog,
  partnerLabel,
  principle,
  readHireLog,
  type HireLog,
} from '../give-back/log';

export function GiveBack() {
  const [log, setLog] = useState<HireLog>(emptyLog);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/give-back/hires.json');
        if (!response.ok) return;
        setLog(readHireLog(await response.json()));
      } catch {
        setLog(emptyLog);
      }
    };
    void load();
  }, []);

  return (
    <article className="page-wrap give-back-page mx-auto w-full max-w-3xl px-4 sm:px-6">
      <p className="eyebrow">Give back</p>
      <h1 className="display section-display mt-4 text-ice">The hiring principle.</h1>
      <p className="mt-6 text-lg leading-relaxed text-ice">{principle}</p>

      <section className="mt-14" aria-labelledby="eligible-title">
        <h2 id="eligible-title" className="display text-3xl text-ice">Who is eligible</h2>
        <ul className="mt-5 space-y-3 text-base leading-relaxed text-ice">
          {eligible.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="count-title">
        <h2 id="count-title" className="display text-3xl text-ice">How the 1–2% is counted</h2>
        <ul className="mt-5 space-y-3 text-base leading-relaxed text-ice">
          {counting.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="log-title">
        <h2 id="log-title" className="display text-3xl text-ice">Hire log</h2>
        <p className="mt-3 text-sm text-frost">Last updated {log.updated || '2026-11-17'}.</p>
        <div className="hire-scroll mt-5">
          <table className="hire-log" aria-label="Confirmed Give back hires">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Partner</th>
                <th scope="col">Role type</th>
                <th scope="col">Region</th>
                <th scope="col">Confirmed by</th>
              </tr>
            </thead>
            <tbody>
              {log.hires.length === 0 ? (
                <tr>
                  <td colSpan={5}>{emptyHireCopy}</td>
                </tr>
              ) : log.hires.map((hire) => (
                <tr key={`${hire.date}-${hire.role}-${hire.region}`}>
                  <td>{hire.date}</td>
                  <td>{partnerLabel(hire)}</td>
                  <td>{hire.role}</td>
                  <td>{hire.region}</td>
                  <td>{hire.confirmedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
