export interface InsightSource {
  name: string;
  title: string;
  href: string;
  published: string;
}

export type InsightInline =
  | { kind: 'text'; text: string }
  | { kind: 'link'; text: string; href: string };

export interface InsightBlock {
  heading?: string;
  paragraphs: InsightInline[][];
}

export interface InsightPost {
  slug: string;
  title: string;
  description: string;
  published: string;
  kicker: string;
  blocks: InsightBlock[];
  sources: InsightSource[];
}

const fbi =
  'https://www.fbi.gov/news/press-releases/cryptocurrency-and-ai-scams-bilk-americans-of-billions';
const ic3 = 'https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf';
const ftcRelease =
  'https://www.ftc.gov/news-events/news/press-releases/2026/10/ftc-issues-annual-report-congress-agencys-actions-protect-older-adults';
const ftcReport =
  'https://www.ftc.gov/reports/protecting-older-consumers-2025-2026-report-federal-trade-commission';
const fidoIndex = 'https://fidoalliance.org/passkey-index-2026/';
const fidoSeven = 'https://fidoalliance.org/7-billion-passkeys-and-counting-the-next-chapter-of-passwordless-authentication/';
const verizonNews = 'https://www.verizon.com/about/news/breach-industry-wide-dbir-finds';
const verizonPdf = 'https://www.verizon.com/business/resources/reports/dbir/';
const euCode = 'https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content';

function text(value: string): InsightInline {
  return { kind: 'text', text: value };
}

function link(label: string, href: string): InsightInline {
  return { kind: 'link', text: label, href };
}

export const insightPosts: InsightPost[] = [
  {
    slug: 'older-adults-fraud-losses-2025',
    title: 'Older adults reported about $3 billion in fraud losses in 2025',
    description:
      'The FTC’s October 2026 report to Congress says adults 60 and over reported about $3 billion in fraud losses for 2025, with investment scams over $1 billion.',
    published: '2026-10-28',
    kicker: 'Fraud trends',
    blocks: [
      {
        paragraphs: [
          [
            text('The loss is not abstract. People 60 and over reported about $3 billion stolen in 2025. The Federal Trade Commission put that figure in its '),
            link('19 October 2026 report to Congress', ftcRelease),
            text('. The same release says reported losses for that age group were about $600 million in 2020.'),
          ],
          [
            text('Investment scams were a large part of the jump. The FTC says reported investment-scam losses by older adults rose 42% in 2025, to over $1 billion, and that people often said the approach started on social media.'),
          ],
        ],
      },
      {
        heading: 'What the count does not say',
        paragraphs: [
          [
            text('These are reports to the Consumer Sentinel Network, not a census of every theft. The FTC also says older adults reported losing money at lower rates than younger adults, while the median reported loss was higher. For people 80 and over, the median reported loss was $2,000.'),
          ],
          [
            text('The release adds an estimate that the overall cost of fraud to older adults in 2025 could be as high as $119.5 billion. That is the FTC’s estimate of unreported harm, not the $3 billion that people actually filed.'),
          ],
          [
            text('The full report is '),
            link('Protecting Older Consumers 2025–2026', ftcReport),
            text('. A message that creates panic is the moment to check it, before the transfer.'),
          ],
        ],
      },
    ],
    sources: [
      {
        name: 'Federal Trade Commission',
        title: 'FTC Issues Annual Report to Congress on Agency’s Actions to Protect Older Adults',
        href: ftcRelease,
        published: '2026-10-19',
      },
      {
        name: 'Federal Trade Commission',
        title: 'Protecting Older Consumers 2025-2026',
        href: ftcReport,
        published: '2026-10',
      },
    ],
  },
  {
    slug: 'ic3-2025-ai-and-impersonation',
    title: 'The FBI counted nearly $893 million in AI-related scam complaints',
    description:
      'The 2025 IC3 report, released in April 2026, records 22,364 artificial-intelligence complaints and nearly $21 billion in reported cyber-enabled losses.',
    published: '2026-10-29',
    kicker: 'Impersonation',
    blocks: [
      {
        paragraphs: [
          [
            text('On 6 April 2026 the FBI released the '),
            link('2025 Internet Crime Report', fbi),
            text('. Reported losses were nearly $21 billion. IC3 received 1,008,597 complaints, up from 859,532 in 2024. People over 60 reported about $7.7 billion, up 37% from 2024.'),
          ],
          [
            text('For the first time, the report has a section on artificial intelligence: 22,364 complaints, costing Americans nearly $893 million. The FBI says the tactics include fake social profiles, voice clones, identification documents, and believable videos of public figures or loved ones.'),
          ],
        ],
      },
      {
        heading: 'Where the money went',
        paragraphs: [
          [
            text('Cryptocurrency complaints were 181,565, totaling more than $11 billion. About 453,000 complaints were cyber-enabled fraud, with losses exceeding $17.7 billion. Investment fraud was nearly 49% of scam-related losses.'),
          ],
          [
            text('A copied voice or a copied profile is already in that complaint file. The report itself is the '),
            link('2025 IC3 Annual Report (PDF)', ic3),
            text('.'),
          ],
        ],
      },
    ],
    sources: [
      {
        name: 'Federal Bureau of Investigation',
        title: 'Cryptocurrency and AI Scams Bilk Americans of Billions',
        href: fbi,
        published: '2026-04-06',
      },
      {
        name: 'FBI Internet Crime Complaint Center',
        title: '2025 IC3 Annual Report',
        href: ic3,
        published: '2026',
      },
    ],
  },
  {
    slug: 'passkeys-sign-in-share-2026',
    title: 'Passkeys were 36% of successful sign-ins in the 2026 FIDO index',
    description:
      'On 15 October 2026 the FIDO Alliance said passkeys were used in 36% of successful sign-ins across 15 consumer services, and estimated 7 billion passkeys in use.',
    published: '2026-10-22',
    kicker: 'Identity',
    blocks: [
      {
        paragraphs: [
          [
            text('The '),
            link('Passkey Index 2026', fidoIndex),
            text(', published 15 October 2026, says more than one in three successful sign-ins now use a passkey: 36%, up from 26% in the 2025 index. Passkey sign-ins succeeded 93% of the time, against 78% for traditional MFA, and were nearly three times faster, saving an average of 27 seconds.'),
          ],
          [
            text('The same day FIDO '),
            link('estimated 7 billion passkeys in use worldwide', fidoSeven),
            text('. The index draws on 15 consumer services, up from nine: Abanca, Amazon, Banesco, JPMorgan Chase, CVS, Google, KDDI, LY Corporation, Mercari, Microsoft, NTT DOCOMO, PayPal, Shopify, TikTok, and WhatsApp.'),
          ],
          [
            text('FIDO also says every participant that measures phishing reported fewer successful attacks after deploying passkeys. The year-on-year comparison is directional, because the set of participants changed. A password that can be phished is still the thing a copied login page is built to steal.'),
          ],
        ],
      },
    ],
    sources: [
      {
        name: 'FIDO Alliance',
        title: 'Passkey Index 2026',
        href: fidoIndex,
        published: '2026-10-15',
      },
      {
        name: 'FIDO Alliance',
        title: '7 Billion Passkeys and Counting',
        href: fidoSeven,
        published: '2026-10-15',
      },
    ],
  },
  {
    slug: 'dbir-2026-vulnerability-exploitation',
    title: 'Vulnerability exploits led breach entry in the 2026 Verizon DBIR',
    description:
      'Verizon’s 19 May 2026 DBIR briefing says 31% of breaches started with vulnerability exploitation, ahead of stolen credentials for the first time in 19 years.',
    published: '2026-10-30',
    kicker: 'Breaches',
    blocks: [
      {
        paragraphs: [
          [
            text('Verizon’s '),
            link('19 May 2026 briefing', verizonNews),
            text(' on the 2026 Data Breach Investigations Report says 31% of breaches started with exploitation of a software flaw. Verizon says that is the first time in 19 years of the report that this beat stolen credentials.'),
          ],
          [
            text('The same briefing says breaches involving a third party were 48% of breaches, up 60%. Frequent use of unapproved AI tools at work went from 15% to 45% of employees in a year. Mobile social engineering, meaning fake texts and voice calls, had a success rate 40% higher than email phishing in the figures Verizon published.'),
          ],
          [
            text('Verizon notes the report uses 2025 incident data. The entry-point finding is in the '),
            link('2026 DBIR', verizonPdf),
            text('. A stolen password is no longer the only front door the data describes.'),
          ],
        ],
      },
    ],
    sources: [
      {
        name: 'Verizon',
        title: 'Vulnerability exploitation top breach entry point, 2026 DBIR finds',
        href: verizonNews,
        published: '2026-05-19',
      },
      {
        name: 'Verizon',
        title: '2026 Data Breach Investigations Report',
        href: verizonPdf,
        published: '2026-05-19',
      },
    ],
  },
  {
    slug: 'eu-labeling-rules-for-deepfakes',
    title: 'Labeling deepfakes has been an EU legal duty since August 2026',
    description:
      'Article 50 of the EU AI Act has applied since 2 August 2026. It requires marking of AI-generated content and labeling of deepfakes. The Code of Practice is voluntary.',
    published: '2026-10-31',
    kicker: 'Platform rules',
    blocks: [
      {
        paragraphs: [
          [
            text('The European Commission says the transparency duties in Article 50 of the AI Act have applied since 2 August 2026. They cover marking and detection of AI-generated content, and labeling of deepfakes and certain AI-generated publications. The Commission’s page on the '),
            link('Code of Practice on Transparency of AI-generated Content', euCode),
            text(' is the primary description.'),
          ],
          [
            text('The code is voluntary. The underlying Article 50 duties are legal obligations. The Commission and the AI Board have said the code is an adequate voluntary way to demonstrate compliance. Providers who do not sign it have to show that their own measures are adequate.'),
          ],
          [
            text('The code has two sections: marking and detection for providers, and labeling of deepfakes and AI-generated text for deployers. A platform that hosts a synthetic clip of a person is inside that duty when the Act applies to it. This note does not interpret whether a given company is in scope.'),
          ],
        ],
      },
    ],
    sources: [
      {
        name: 'European Commission',
        title: 'Code of Practice on Transparency of AI-generated Content',
        href: euCode,
        published: '2026',
      },
    ],
  },
];

export function insightBySlug(slug: string): InsightPost | undefined {
  return insightPosts.find((post) => post.slug === slug);
}
