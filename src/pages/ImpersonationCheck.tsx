import { brandImages } from '../components/marketing/brandImages';
import { ImageSlot } from '../components/marketing/ImageSlot';
import { ImpersonationChecker } from '../components/marketing/ImpersonationChecker';
import { IntakeForm } from '../components/marketing/IntakeForm';

const worries = [
  ['Fake profile', 'A lookalike handle', 'One extra letter, your photo, and your bio, messaging people as you.'],
  ['Cloned page', 'A copied link-in-bio', 'Selling a course or a call you never offered.'],
  ['Scam ad', 'Your face in a paid ad', 'A clip of your video used to push a scheme you do not run.'],
];

const steps = [
  ['1', 'You send what you spotted', 'Suspicious accounts or ads, plus the real accounts they are copying.'],
  ['2', 'We verify each one', 'Within 48 hours of a complete intake and payment, each item you sent is checked.'],
  ['3', 'You get the report steps', 'Evidence, and the exact place on that platform to file a report. The platform decides.'],
];

export const ImpersonationCheck = () => {
  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="eyebrow">Impersonation Check</p>
      <h1 className="display mt-4 max-w-[18ch] text-5xl text-ice sm:text-7xl">
        Send us what you’ve spotted.
      </h1>
      <p className="measure mt-6 text-xl text-frost">
        Send us the suspicious accounts or ads you’ve spotted. Within 48 hours of a complete intake and payment, we verify each one and send you evidence plus the exact platform report steps.
      </p>
      <div className="mt-8">
        <a className="btn-accent" href="#intake">
          Start my check
        </a>
      </div>
      <p className="mt-4 max-w-xl text-sm text-frost">
        $199 one-time for creators with 100K to 1 million followers. This is not the Sponsors Growth tier at $199/month.
      </p>
      <ImageSlot image={brandImages.impersonation} />

      <aside className="glass tier-card mt-10 max-w-xl" aria-label="Price" id="offer">
        <p className="eyebrow">One-time check</p>
        <p className="display mt-3 text-6xl text-ice">$199 one-time</p>
        <p className="mt-4 text-ice">Creators with 100K to 1 million followers.</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ice">
          <li>We verify each suspicious account or ad you send</li>
          <li>Evidence, plus the exact platform report steps</li>
          <li>We do not search for other accounts, and we do not remove them</li>
        </ul>
        <p className="mt-4 text-sm text-ice">
          $499. Over 1 million followers, or public figures booked through a manager.
        </p>
        <p className="mt-4 text-sm text-frost">
          The $199 price is one-time. It is not the Sponsors Growth tier at $199/month. The $499 option is not that monthly Elite price either.
        </p>
        <a className="btn-ghost mt-6 w-full" href="#intake">
          Start my check
        </a>
        <p className="mt-3 text-sm text-frost">
          The form comes first and does not charge you. Pay now is the next step, after intake.
        </p>
      </aside>

      <section className="page-section">
        <p className="eyebrow">What people send</p>
        <h2 className="display mt-4 max-w-[18ch] text-4xl text-ice">Accounts and ads you have already seen.</h2>
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
          Send the ones you have spotted. We verify those. We do not search the platforms for more.
        </p>
      </section>

      <section className="page-section">
        <p className="eyebrow">What you receive</p>
        <h2 className="display mt-4 text-4xl text-ice">Evidence, and where to report it.</h2>
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
            Template. Sample layout, not a client report.
          </figcaption>
          <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Sample report steps">
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
            Each row is an account or ad you sent. If an item is not impersonation, the report says so. We do not remove accounts. Each platform decides.
          </p>
        </figure>
      </section>

      <section className="page-section">
        <p className="eyebrow">The check</p>
        <h2 className="display mt-4 text-4xl text-ice">Within 48 hours of a complete intake and payment.</h2>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="glass p-6">
            <dt className="eyebrow">Price</dt>
            <dd className="mt-3 text-ice">
              $199 one-time for creators with 100K to 1 million followers. $499. Over 1 million followers, or public figures booked through a manager. The $199 one-time check is not the Sponsors Growth tier at $199/month.
            </dd>
          </div>
          <div className="glass p-6">
            <dt className="eyebrow">Turnaround</dt>
            <dd className="mt-3 text-ice">Within 48 hours of a complete intake and payment.</dd>
          </div>
          <div className="glass p-6">
            <dt className="eyebrow">You receive</dt>
            <dd className="mt-3 text-ice">Evidence for each account or ad you sent, plus the exact platform report steps.</dd>
          </div>
          <div className="glass p-6">
            <dt className="eyebrow">Not included</dt>
            <dd className="mt-3 text-ice">A search for accounts you did not send. Guaranteed removals.</dd>
          </div>
        </dl>
      </section>

      <section className="page-section" id="intake">
        <p className="eyebrow">Start here</p>
        <h2 className="display mt-4 text-4xl text-ice">Tell us what you’ve spotted.</h2>
        <p className="measure mt-4 text-lg text-frost">
          The form is the first step. It does not charge you. Pay now is the next page.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-ice">
          <li>Submit this form with your real accounts and the suspicious accounts or ads you’ve spotted.</li>
          <li>On the next page, choose Pay now. The $199 one-time check opens Stripe. The $499 option does not use that link.</li>
          <li>Within 48 hours of a complete intake and payment, we verify each one and send evidence plus the exact platform report steps.</li>
        </ol>
        <div className="mt-8 max-w-3xl">
          <IntakeForm />
        </div>
      </section>

      <section className="page-section" id="free-check">
        <p className="eyebrow">Free handle read</p>
        <h2 className="display mt-3 text-4xl text-ice">Read one handle you paste.</h2>
        <p className="measure mt-4 text-frost">
          This reads the single handle you paste. It does not verify a list, and it is not the paid check.
        </p>
        <div className="mt-6 max-w-3xl">
          <ImpersonationChecker />
        </div>
      </section>

      <section className="page-section">
        <h2 className="display text-4xl text-ice">Two honest answers.</h2>
        <div className="mt-6 max-w-3xl divide-y divide-[#E6E6E1] border-y border-[#E6E6E1]">
          <details className="py-4">
            <summary className="min-h-12 cursor-pointer text-ice">Will you get the accounts removed?</summary>
            <p className="mt-3 text-frost">
              No. You receive evidence and the exact platform report steps. You or your manager file the report, and each platform decides. We do not guarantee removal.
            </p>
          </details>
          <details className="py-4">
            <summary className="min-h-12 cursor-pointer text-ice">Will you search for fake accounts?</summary>
            <p className="mt-3 text-frost">
              No. We verify the suspicious accounts and ads you send. We do not look for others.
            </p>
          </details>
        </div>
      </section>
    </article>
  );
};
