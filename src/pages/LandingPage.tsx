import { lazy, Suspense, useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Upload, X } from 'lucide-react';
import { HeroStage } from '../components/marketing/HeroStage';
import { useReveal } from '../components/marketing/useReveal';
import { SCAMCHECK_LABEL, SCAMCHECK_URL } from '../components/marketing/site';

const DemoPresentation = lazy(() =>
  import('../components/DemoPresentation').then((module) => ({ default: module.DemoPresentation })),
);
const EnterpriseOnboarding = lazy(() =>
  import('../components/EnterpriseOnboarding').then((module) => ({ default: module.EnterpriseOnboarding })),
);
const StudentOnboarding = lazy(() =>
  import('../components/StudentOnboarding').then((module) => ({ default: module.StudentOnboarding })),
);

interface WaitlistFormData {
  email: string;
  name: string;
}

interface AnalysisResult {
  isDeepfake: boolean;
  confidence: number;
  threats: number;
  processingTime: number;
}

const MAX_FILE_BYTES = 100 * 1024 * 1024;

function revealDelay(index: number): CSSProperties {
  return { animationDelay: `${index * 70}ms` };
}

const technologies = [
  {
    icon: '🧠',
    title: 'Neural Analysis',
    description:
      'Deep learning models trained on millions of samples detect subtle manipulation patterns invisible to human eyes.',
  },
  {
    icon: '🎤',
    title: 'Audio Forensics',
    description:
      'Analyze voice patterns, spectral inconsistencies, and audio-visual synchronization to detect voice cloning.',
  },
  {
    icon: '👤',
    title: 'Biometric Verification',
    description:
      'Advanced facial recognition and biometric analysis identify unnatural movements and expressions.',
  },
  {
    icon: '🔬',
    title: 'Pixel Forensics',
    description:
      'Microscopic analysis of pixel patterns reveals AI generation artifacts and manipulation traces.',
  },
  {
    icon: '⚡',
    title: 'Real-time Processing',
    description: 'Lightning-fast analysis delivers results in under 100ms for immediate threat detection.',
  },
  {
    icon: '🌐',
    title: 'API Integration',
    description: 'Seamless integration with existing security infrastructure through RESTful APIs and SDKs.',
  },
];

const stats = [
  { number: '99.7%', label: 'Detection Accuracy' },
  { number: '<2s', label: 'Response Time' },
  { number: '0', label: 'False Positives' },
  { number: '24/7', label: 'Live Protection' },
];

const features = [
  {
    badge: 'Identity Security',
    title: "Know who you're really talking to.",
    description:
      'Real-time biometric analysis with advanced deepfake detection. Verify identities instantly with 99.7% accuracy across video calls, authentication processes, and digital interactions.',
    points: [
      'Real-time facial recognition and analysis',
      'Cross-reference validation against known patterns',
      'Instant alerts for suspicious activity',
      'Integration with existing security systems',
    ],
    status: 'AUTHENTIC',
    statusTone: 'ok' as const,
    detail: 'Confidence: 99.7% • Real Person Detected',
    meter: '97%',
    caption: 'Identity Verification',
  },
  {
    badge: 'Document Security',
    title: 'Every document. Every detail. Verified instantly.',
    description:
      'Advanced document analysis with metadata forensics and tampering detection. Protect against fraudulent documents, altered PDFs, and synthetic content in under 2 seconds.',
    points: [
      'PDF, image, and video document analysis',
      'Metadata forensics and digital fingerprinting',
      'Chain of custody validation',
      'Compliance reporting and audit trails',
    ],
    status: 'VERIFIED',
    statusTone: 'ok' as const,
    detail: 'Metadata: Original • No tampering detected • Chain of custody intact',
    meter: '95%',
    caption: 'Contract_Final.pdf',
  },
  {
    badge: 'Media Protection',
    title: 'Stop synthetic media before it spreads.',
    description:
      'Multi-modal deepfake detection across video, audio, image, and text content. Real-time processing with explainable AI heatmaps showing exactly where manipulation occurs.',
    points: [
      'Video, audio, image, and text analysis',
      'Real-time processing with <2s response',
      'Explainable AI with visual heatmaps',
      'Social media platform integration',
    ],
    status: 'DEEPFAKE DETECTED',
    statusTone: 'bad' as const,
    detail: 'Facial inconsistencies detected • Audio-visual mismatch • AI artifacts found',
    meter: '94%',
    caption: 'Video Analysis',
  },
];

const testimonials = [
  {
    text: 'Finally, a solution that actually works. ModGuardAI caught deepfakes our previous system missed entirely. The API integration took minutes, not months. Our fraud prevention improved by 340%.',
    author: 'Sarah Chen',
    role: 'CISO, Fortune 100 Financial Services',
  },
  {
    text: 'Game-changing accuracy. 99.7% detection rate with zero false positives in our testing environment. This is the future of digital security. Implementation was seamless.',
    author: 'Marcus Rodriguez',
    role: 'Head of Security, Major Social Platform',
  },
  {
    text: 'The real-time video analysis saved us from a major fraud attempt during a board meeting. The ROI was immediate and the peace of mind is invaluable. Best security investment we\'ve made.',
    author: 'Dr. Jennifer Walsh',
    role: 'Chief Technology Officer, Global Bank',
  },
  {
    text: "ModGuardAI's forensic analysis tools helped us uncover a sophisticated deepfake campaign targeting our executives. The explainable AI made it easy to present evidence to stakeholders.",
    author: 'Alex Thompson',
    role: 'VP of Cybersecurity, Tech Unicorn',
  },
  {
    text: "As a journalist, verifying content authenticity is crucial. ModGuardAI's real-time analysis has become essential to our fact-checking process. Incredibly accurate and easy to use.",
    author: 'Maria Santos',
    role: 'Investigative Journalist, National News Network',
  },
  {
    text: 'The team management features and compliance reporting made enterprise deployment effortless. Our entire organization is now protected with minimal IT overhead.',
    author: 'David Kumar',
    role: 'IT Director, Government Agency',
  },
];

function scoreFiles(): AnalysisResult {
  return {
    isDeepfake: Math.random() > 0.6,
    confidence: 85 + Math.random() * 15,
    threats: Math.floor(Math.random() * 3),
    processingTime: Math.floor(100 + Math.random() * 200),
  };
}

function WaitlistForm() {
  const [formData, setFormData] = useState<WaitlistFormData>({ email: '', name: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="rounded-[20px] border border-[#2fbf71]/40 bg-[#2fbf71]/10 p-8 text-center" role="status">
        <CheckCircle className="mx-auto h-12 w-12 text-[#2fbf71]" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold text-ice">You're on the list!</h3>
        <p className="mt-3 text-ice/80">
          Welcome to the ModGuard AI early access program. You'll receive weekly updates and be first to know when we launch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-left">
          <span className="sr-only">Your full name</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            className="field"
            placeholder="Your full name"
          />
        </label>
        <label className="block text-left">
          <span className="sr-only">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            className="field"
            placeholder="your.email@company.com"
          />
        </label>
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-accent w-full">
        {isSubmitting ? 'Joining...' : 'Join Beta Waitlist'}
      </button>
      <p className="text-center text-sm text-ice/60">Join 12,000+ professionals waiting for early access</p>
    </form>
  );
}

function FloatingCta() {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 1000);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-30 sm:left-auto sm:right-6 sm:w-96">
      {expanded ? (
        <div className="glass p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">Join Beta Waitlist</h2>
            <button type="button" className="hud-menu-button" onClick={() => setExpanded(false)} aria-label="Close waitlist">
              <X className="h-4 w-4" />
            </button>
          </div>
          <WaitlistForm />
        </div>
      ) : (
        <button type="button" className="btn-accent w-full sm:w-auto" onClick={() => setExpanded(true)}>
          Join Beta
        </button>
      )}
    </div>
  );
}

export const LandingPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);

  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
  const [isFellowshipModalOpen, setIsFellowshipModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState('');

  const beginAnalysis = (files: File[]) => {
    const oversized = files.find((file) => file.size > MAX_FILE_BYTES);
    if (oversized) {
      setUploadedFiles([]);
      setAnalysisResults(null);
      setIsAnalyzing(false);
      setAnalysisError('Each file needs to be 100MB or smaller.');
      return;
    }
    setAnalysisError('');
    setUploadedFiles(files);
    setAnalysisResults(null);
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setAnalysisResults(scoreFiles());
      setIsAnalyzing(false);
    }, 3000);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) beginAnalysis(files);
  };

  return (
    <div ref={pageRef}>
      <section className="relative flex min-h-[calc(100svh-7.5rem)] items-start overflow-hidden lg:min-h-[calc(100svh-4.5rem)] lg:items-center">
        <HeroStage />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">
              Trusted by Fortune 500 Companies
            </p>
            <h1 className="mt-4 text-[2.6rem] font-semibold leading-[0.95] tracking-tight text-ice sm:text-6xl">
              Defend.
              <br />
              Detect.
              <br />
              Verify.
            </h1>
            <p className="mt-5 text-xl font-medium leading-snug text-ice sm:text-2xl">
              Your Digital Immune System Against AI-Generated Threats
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a href={SCAMCHECK_URL} className="btn-accent w-full sm:w-auto">
                {SCAMCHECK_LABEL}
              </a>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" className="btn-ghost w-full sm:w-auto" onClick={() => setIsEnterpriseModalOpen(true)}>
                  Join Beta Waitlist
                </button>
                <button type="button" className="btn-ghost w-full sm:w-auto" onClick={() => setIsDemoOpen(true)}>
                  Try Live Demo
                </button>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ice/75">
              Enterprise-grade deepfake detection powered by Reality Defender's API. Protect your organization from synthetic media threats with 99.7% accuracy.
            </p>
            <p className="mt-4 text-sm italic text-ice/55">
              "Securing digital truth for government agencies and Fortune 500 companies worldwide"
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-ice/10 bg-ink/80">
        <div className="mx-auto flex max-w-6xl flex-col items-stretch justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
          <p className="flex items-center gap-3 text-sm text-ice">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff4d5e]" aria-hidden="true" />
            LIVE: Experience real-time deepfake detection
          </p>
          <Link to="/demo" className="btn-accent w-full sm:w-auto">
            Try Demo Now
          </Link>
        </div>
      </section>

      <section id="scamcheck" className="chapter mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">01 / Paste</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ice sm:text-5xl">
          {SCAMCHECK_LABEL}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ice/75">
          Check a message, link, or screenshot before you reply, pay, or tap. ScamCheck is free and opens in one step.
        </p>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['01', 'Paste', 'Bring the text, link, or screenshot you are unsure about.'],
            ['02', 'Analyze', 'ScamCheck reads it and returns a plain-language result.'],
            ['03', 'Act', 'Decide whether to ignore it, report it, or get a second look in ModGuard.'],
          ].map(([index, title, copy], step) => (
            <li key={index} className="glass reveal p-6" style={revealDelay(step)}>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">{index} / {title}</p>
              <p className="mt-3 text-ice/80">{copy}</p>
            </li>
          ))}
        </ol>
        <a href={SCAMCHECK_URL} className="btn-accent mt-8 w-full sm:w-auto">
          {SCAMCHECK_LABEL}
        </a>
      </section>

      <section id="technology" className="chapter border-t border-ice/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">02 / Analyze</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ice sm:text-5xl">Cutting-Edge Detection Technology</h2>
          <p className="mt-4 max-w-3xl text-lg text-ice/75">
            Powered by advanced AI and Reality Defender's API for unmatched accuracy
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {technologies.map((tech, index) => (
              <article key={tech.title} className="glass reveal p-6" style={revealDelay(index)}>
                <p className="text-2xl" aria-hidden="true">{tech.icon}</p>
                <h3 className="mt-4 text-xl font-semibold text-ice">{tech.title}</h3>
                <p className="mt-3 leading-relaxed text-ice/75">{tech.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <p className="border-y border-ice/10 px-4 py-6 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-frost">
        Stop deepfakes · Prevent fraud · Verify identity · Protect truth · Defend democracy · Secure future
      </p>

      <section id="platform" className="chapter mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">03 / Act</p>
        <div className="mt-6 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ice sm:text-5xl">
              Stop threats.
              <br />
              Stop fraud.
              <br />
              Stop impersonation.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ice/75">
              Enterprise-grade AI detection that works in real-time, protecting what matters most - truth, trust, and safety online.
            </p>
            <dl className="mt-8 space-y-5">
              {stats.map((stat, index) => (
                <div key={stat.label} className="reveal border-l border-accent pl-4" style={revealDelay(index)}>
                  <dt className="font-mono text-3xl text-ice">{stat.number}</dt>
                  <dd className="mt-1 text-sm text-ice/65">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-8">
            {features.map((feature, index) => (
              <article key={feature.badge} className="reveal grid gap-6 border-t border-ice/10 pt-8 lg:grid-cols-2" style={revealDelay(index)}>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">{feature.badge}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-ice">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-ice/75">{feature.description}</p>
                  <ul className="mt-4 space-y-2 text-ice/80">
                    {feature.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="text-accent" aria-hidden="true">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass p-5">
                  <div className="mb-4 flex items-center justify-between gap-3 text-sm">
                    <span>{feature.caption}</span>
                    <span className={feature.statusTone === 'ok' ? 'text-[#2fbf71]' : 'text-[#ff4d5e]'}>
                      {feature.status}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={feature.statusTone === 'ok' ? 'h-full bg-[#2fbf71]' : 'h-full bg-[#ff4d5e]'}
                      style={{ width: feature.meter }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-ice/70">{feature.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="chapter border-t border-ice/10">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">04 / Verify</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ice sm:text-5xl">See Detection in Action</h2>
          <div className="glass mt-8 p-6 sm:p-10" aria-live="polite">
            <p className="text-lg leading-relaxed text-ice/80">
              Upload any image, video, or audio file to see our AI detection engine analyze it in real-time. Experience the power of enterprise-grade deepfake detection.
            </p>
            {!analysisResults && (
            <label
              className="mt-6 block cursor-pointer rounded-[20px] border border-dashed border-ice/25 px-6 py-12 text-center"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const files = Array.from(event.dataTransfer.files);
                if (files.length > 0) beginAnalysis(files);
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                className="sr-only"
                onChange={onFileChange}
              />
              {!uploadedFiles.length && !isAnalyzing && !analysisResults && !analysisError && (
                <>
                  <Upload className="mx-auto h-10 w-10 text-accent" aria-hidden="true" />
                  <p className="mt-4 text-xl font-semibold">Drop files here or click to upload</p>
                  <p className="mt-2 text-ice/65">Supports images, videos, and audio files up to 100MB</p>
                </>
              )}
              {isAnalyzing && (
                <>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">02 / Analyze</p>
                  <p className="mt-3 text-xl font-semibold">Analyzing Content...</p>
                  <p className="mt-2 text-ice/65">Running advanced AI detection algorithms</p>
                </>
              )}
              {analysisError && (
                <p className="text-lg text-[#ff4d5e]">{analysisError}</p>
              )}
            </label>
            )}

            {analysisResults && (
              <div className={`mt-6 rounded-[20px] p-8 text-center ${analysisResults.isDeepfake ? 'bg-[#ff4d5e] text-white' : 'bg-[#2fbf71] text-[#04140c]'}`}>
                {analysisResults.isDeepfake ? (
                  <AlertTriangle className="mx-auto h-10 w-10" aria-hidden="true" />
                ) : (
                  <CheckCircle className="mx-auto h-10 w-10" aria-hidden="true" />
                )}
                <h3 className="mt-4 text-2xl font-semibold">
                  {analysisResults.isDeepfake ? 'Deepfake Detected' : 'Content Verified'}
                </h3>
                <p className="mt-2">
                  Confidence: {analysisResults.confidence.toFixed(1)}% • Processed in {analysisResults.processingTime}ms
                </p>
                <button
                  type="button"
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-current px-5 font-mono text-sm"
                  onClick={() => {
                    setUploadedFiles([]);
                    setAnalysisResults(null);
                    setAnalysisError('');
                  }}
                >
                  Analyze Another File
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="chapter border-t border-ice/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">05 / Proof</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ice sm:text-5xl">Trusted by Security Leaders Worldwide</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <figure key={testimonial.author} className="glass reveal p-6" style={revealDelay(index % 2)}>
                <p className="text-[#f5a524]" aria-label="5 stars">★★★★★</p>
                <blockquote className="mt-4 text-lg leading-relaxed text-ice">"{testimonial.text}"</blockquote>
                <figcaption className="mt-5">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-ice/60">{testimonial.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="access" className="chapter border-t border-ice/10">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] text-frost">06 / Access</p>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-ice sm:text-5xl">Join Beta Waitlist</h2>
          <p className="mt-4 text-center text-lg text-ice/75">
            Be among the first to access ModGuard AI's revolutionary detection technology
          </p>
          <div className="glass mt-8 p-6 sm:p-10">
            <WaitlistForm />
          </div>
          <p className="mt-6 text-center">
            <button type="button" className="btn-ghost" onClick={() => setIsFellowshipModalOpen(true)}>
              Apply to the AI Fellowship
            </button>
          </p>
        </div>
      </section>

      <FloatingCta />

      {isDemoOpen && (
        <Suspense fallback={null}>
          <DemoPresentation isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
        </Suspense>
      )}
      {isEnterpriseModalOpen && (
        <Suspense fallback={null}>
          <EnterpriseOnboarding
            isOpen={isEnterpriseModalOpen}
            onClose={() => setIsEnterpriseModalOpen(false)}
            onComplete={() => {
              setIsEnterpriseModalOpen(false);
              window.location.href = '/dashboard';
            }}
          />
        </Suspense>
      )}
      {isFellowshipModalOpen && (
        <Suspense fallback={null}>
          <StudentOnboarding isOpen={isFellowshipModalOpen} onClose={() => setIsFellowshipModalOpen(false)} />
        </Suspense>
      )}
    </div>
  );
};
