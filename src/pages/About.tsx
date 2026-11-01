import { SCAMCHECK_LABEL, SCAMCHECK_URL } from '../components/marketing/site';

export const About = () => {
  return (
    <main className="page-section mx-auto w-full max-w-3xl px-4 sm:px-6">
      <p className="eyebrow">About</p>
      <h1 className="rise display mt-4 text-4xl text-ice sm:text-5xl">
        An AI safety studio
      </h1>
      <div className="rise mt-8 space-y-5 text-lg leading-relaxed text-ice/80">
        <p>
          ModGuard AI is an AI safety studio. The first live tool is ScamCheck, a free AI scam checker for messages, links, and screenshots of texts or emails.
        </p>
        <p>
          A check returns an AI verdict. Links are also compared with known-phishing blocklists from OpenPhish and Phishing Army. ScamCheck includes a newsletter.
        </p>
        <p>
          Other work is in research. This site does not describe unreleased tools, and it does not promise dates.
        </p>
      </div>
      <a href={SCAMCHECK_URL} className="btn-accent mt-8 w-full sm:w-auto">
        {SCAMCHECK_LABEL}
      </a>

      <section id="contact" className="mt-16 border-t border-ice/10 pt-12">
        <p className="eyebrow">Contact</p>
        <h2 className="rise display mt-4 text-3xl text-ice">Use the live tool</h2>
        <p className="rise mt-4 text-lg leading-relaxed text-ice/80">
          ScamCheck is the shipped product. Open it to run a check or join the newsletter.
        </p>
        <a href={SCAMCHECK_URL} className="btn-ghost mt-6 w-full sm:w-auto">
          scamcheck.modguardai.org
        </a>
      </section>
    </main>
  );
};
