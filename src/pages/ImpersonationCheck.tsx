import { brandImages } from '../components/marketing/brandImages';
import { ImageSlot } from '../components/marketing/ImageSlot';
import { ImpersonationChecker } from '../components/marketing/ImpersonationChecker';
import { IntakeForm } from '../components/marketing/IntakeForm';
import { IMPERSONATION_CHECKOUT_URL } from '../config/platform';

const worries = [
  ['Fake profile', 'A lookalike handle', 'One extra letter, your photo, and your bio, messaging fans about a giveaway.'],
  ['Cloned page', 'A copied link-in-bio', 'Selling a course or a call you never offered.'],
  ['Scam ad', 'Your face in a paid ad', 'A clip of your video used to push a crypto or investment scheme.'],
];

const steps = [
  ['1', 'You tell us what’s real', 'Your official accounts, name variations, and anything you’ve already spotted.'],
  ['2', 'We sweep five platforms', 'TikTok, Instagram, YouTube, X, and Facebook. Each finding is noted with a date.'],
  ['3', 'You file', 'Each entry has the URL and the report route. The platform decides on removal.'],
];

export const ImpersonationCheck = () => {
  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="eyebrow">Creator Impersonation Check</p>
      <h1 className="display mt-4 max-w-[16ch] text-5xl text-ice sm:text-7xl">
        Someone may already be using your name.
      </h1>
      <p className="measure mt-6 text-xl text-frost">
        Fake accounts copy your photos, message your followers, and ask for money as you. Often the first sign is a fan who has already paid.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a className="btn-accent" href="#intake">
          Start my $199 check
        </a>
        <a className="btn-ghost" href="#free-check">
          Or run the free handle check
        </a>
      </div>
      <p className="mt-4 text-sm text-frost">Results within 48 hours of intake and payment.</p>
      <ImageSlot image={brandImages.impersonation} />

      <div className="mt-10 grid items-start gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section id="free-check">
          <p className="eyebrow">Free check</p>
          <h2 className="display mt-3 text-4xl text-ice">Read one handle first.</h2>
          <p className="measure mt-4 text-frost">
            This automated check reads the handle you paste. It is not the manual sweep.
          </p>
          <div className="mt-6">
            <ImpersonationChecker />
          </div>
        </section>
        <aside className="glass tier-card" aria-label="Price" id="offer">
          <p className="eyebrow">One check</p>
          <p className="display mt-3 text-6xl text-ice">$199</p>
          <p className="mt-4 text-ice">Creators with 100K to 1 million followers.</p>
          <ul className="mt-4 space-y-2 text-sm text-ice">
            <li>TikTok, Instagram, YouTube, X, and Facebook</li>
            <li>Findings report and a ready-to-file takedown list</li>
            <li>One follow-up re-check</li>
          </ul>
          <p className="mt-4 text-sm text-frost">$499 for over 1 million followers, or public figures booked through a manager.</p>
          <a className="btn-accent mt-6 w-full" href={IMPERSONATION_CHECKOUT_URL}>
            Buy now
          </a>
          <p className="mt-3 text-sm text-frost">Payments by Stripe. About 5 checks a week. If this week is full, we email a start date before you need to pay.</p>
        </aside>
      </div>

      <section className="page-section">
        <p className="eyebrow">The worry</p>
        <h2 className="display mt-4 max-w-[18ch] text-4xl text-ice">The fakes are hard to see from inside your own account.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {worries.map(([kind, title, copy]) => (
            <article key={kind} className="glass p-6">
              <p className="eyebrow">{kind}</p>
              <h3 className="display mt-3 text-3xl text-ice">{title}</h3>
              <p className="mt-3 text-frost">{copy}</p>
            </article>
          ))}
        </div>
        <p className="measure mt-8 text-ice">
          We search those five platforms by hand for your name and its variations, so you see what your audience is seeing.
        </p>
      </section>

      <section className="page-section">
        <p className="eyebrow">The fix</p>
        <h2 className="display mt-4 text-4xl text-ice">A list of what to report, and where.</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map(([index, title, copy]) => (
            <li key={index} className="glass p-6">
              <p className="font-mono text-[11px] text-frost">{index}</p>
              <h3 className="display mt-3 text-3xl text-ice">{title}</h3>
              <p className="mt-3 text-frost">{copy}</p>
            </li>
          ))}
        </ol>
        <figure className="glass mt-8 p-6">
          <figcaption className="text-sm text-frost">
            Template. Sample layout, not a real client report.
          </figcaption>
          <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Sample takedown list">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-frost">
                  <th scope="col" className="py-3 pr-4 font-medium">Platform</th>
                  <th scope="col" className="py-3 pr-4 font-medium">URL or handle</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Type</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Report route</th>
                  <th scope="col" className="py-3 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#E6E6E1]">
                  <td className="py-3 pr-4">[platform]</td>
                  <td className="py-3 pr-4">[@handle]</td>
                  <td className="py-3 pr-4">Fake profile</td>
                  <td className="py-3 pr-4">Impersonation form</td>
                  <td className="py-3">High</td>
                </tr>
                <tr className="border-t border-[#E6E6E1]">
                  <td className="py-3 pr-4">[platform]</td>
                  <td className="py-3 pr-4">[url]</td>
                  <td className="py-3 pr-4">Scam ad</td>
                  <td className="py-3 pr-4">Ad report</td>
                  <td className="py-3">Medium</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-frost">
            Plus a short summary and one follow-up re-check. If we find nothing, the report says so. We don’t remove accounts.
          </p>
        </figure>
      </section>

      <section className="page-section">
        <p className="eyebrow">Act now</p>
        <h2 className="display mt-4 text-4xl text-ice">Results within 48 hours.</h2>
        <p className="measure mt-4 text-lg text-frost">
          The clock starts once intake is complete and payment is received. We take about 5 checks a week. If this week is full, we give you a start date before you pay.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="glass p-6">
            <dt className="eyebrow">Price</dt>
            <dd className="mt-3 text-ice">$199 for creators with 100K to 1 million followers. $499 for over 1 million followers, or public figures booked through a manager.</dd>
          </div>
          <div className="glass p-6">
            <dt className="eyebrow">Turnaround</dt>
            <dd className="mt-3 text-ice">48 hours after intake and payment.</dd>
          </div>
          <div className="glass p-6">
            <dt className="eyebrow">You receive</dt>
            <dd className="mt-3 text-ice">A findings report and a ready-to-file takedown list.</dd>
          </div>
          <div className="glass p-6">
            <dt className="eyebrow">Not included</dt>
            <dd className="mt-3 text-ice">Guaranteed removals.</dd>
          </div>
        </dl>
      </section>

      <section className="page-section" id="intake">
        <p className="eyebrow">Start here</p>
        <h2 className="display mt-4 text-4xl text-ice">Tell us what’s really yours.</h2>
        <p className="measure mt-4 text-lg text-frost">
          About 10 minutes. Real links and name variations make the copies easier to spot.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-ice">
          <li>Submit this form.</li>
          <li>We email your slot date. Pay with Buy now when the slot is open.</li>
          <li>The report follows within 48 hours of intake and payment.</li>
        </ol>
        <div className="mt-8 max-w-3xl">
          <IntakeForm />
        </div>
      </section>

      <section className="page-section">
        <h2 className="display text-4xl text-ice">Two honest answers.</h2>
        <div className="mt-6 max-w-3xl divide-y divide-[#E6E6E1] border-y border-[#E6E6E1]">
          <details className="py-4">
            <summary className="min-h-12 cursor-pointer text-ice">Will you get the fakes removed?</summary>
            <p className="mt-3 text-frost">No. You get the takedown list. You or your manager file it, and each platform decides.</p>
          </details>
          <details className="py-4">
            <summary className="min-h-12 cursor-pointer text-ice">Will you find every fake?</summary>
            <p className="mt-3 text-frost">No one can promise that. We search public content by hand as of the delivery date.</p>
          </details>
        </div>
      </section>
    </article>
  );
};
