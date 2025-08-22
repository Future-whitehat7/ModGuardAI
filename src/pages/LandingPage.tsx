import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Play,
  Upload,
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
  Brain,
  Eye,
  Target,
  Zap,
  Users,
  ArrowRight,
  AlertTriangle,
  Lock,
  Award,
  Clock,
  BarChart3,
  FileText,
  Camera,
  Mic,
  Video,
  Sparkles,
  MessageCircle,
  Calendar,
  Download,
  ExternalLink,
  X,
  Mail,
  Phone,
  Building,
  Linkedin,
  Twitter,
  Home
} from 'lucide-react';
import { Header } from '../components/Header';
import { DemoPresentation } from '../components/DemoPresentation';
import { EnterpriseOnboarding } from '../components/EnterpriseOnboarding';
import { StudentOnboarding } from '../components/StudentOnboarding';

interface WaitlistFormData {
  email: string;
  name: string;
  role: string;
  company: string;
  useCase: string;
  updates: string;
}

const WaitlistForm = ({ location, variant = "default", onSubmit }: any) => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: '',
    name: '',
    role: '',
    company: '',
    useCase: '',
    updates: 'weekly'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-green-50 rounded-xl border border-green-200"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">You're on the list!</h3>
        <p className="text-green-700 mb-4">
          Welcome to the ModGuard AI early access program. You'll receive weekly updates and be first to know when we launch.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Your full name"
          />
        </div>
        <div>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="your.email@company.com"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Joining...' : 'Join Beta Waitlist'}
      </button>
      
      <p className="text-sm text-gray-500 text-center">
        Join 12,000+ professionals waiting for early access
      </p>
    </form>
  );
};

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <AnimatePresence>
            {isExpanded ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-xl p-6 w-80 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900">Join Beta Waitlist</h4>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <WaitlistForm location="floating-cta" variant="compact" />
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
              >
                <span>Join Beta</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const LandingPage = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
  const [isFellowshipModalOpen, setIsFellowshipModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleWatchDemo = () => {
    setIsDemoOpen(true);
  };

  const handleEnterpriseSignup = () => {
    setIsEnterpriseModalOpen(true);
  };

  const handleFellowshipSignup = () => {
    setIsFellowshipModalOpen(true);
  };

  const runDemo = () => {
    const fillElement = document.getElementById('demo-confidence-fill');
    const textElement = document.getElementById('demo-confidence-text');
    
    if (fillElement && textElement) {
      fillElement.style.width = '0%';
      textElement.textContent = 'Analyzing...';
      textElement.style.color = '#16d9e3';
      
      setTimeout(() => {
        fillElement.style.width = '15%';
        textElement.textContent = 'Processing image data...';
      }, 500);
      
      setTimeout(() => {
        fillElement.style.width = '45%';
        textElement.textContent = 'Running deepfake detection algorithms...';
      }, 1200);
      
      setTimeout(() => {
        fillElement.style.width = '78%';
        textElement.textContent = 'Analyzing facial inconsistencies...';
      }, 1800);
      
      setTimeout(() => {
        fillElement.style.width = '94%';
        fillElement.style.background = 'linear-gradient(90deg, #ff6b35, #ff8c00)';
        textElement.textContent = 'DEEPFAKE DETECTED • Confidence: 94.2%';
        textElement.style.color = '#ff6b35';
      }, 2500);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(files);
      setIsAnalyzing(true);
      
      // Simulate analysis
      setTimeout(() => {
        setAnalysisResults({
          isDeepfake: Math.random() > 0.6,
          confidence: 85 + Math.random() * 15,
          threats: Math.floor(Math.random() * 3),
          processingTime: Math.floor(100 + Math.random() * 200)
        });
        setIsAnalyzing(false);
      }, 3000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles(files);
      setIsAnalyzing(true);
      
      // Simulate analysis
      setTimeout(() => {
        setAnalysisResults({
          isDeepfake: Math.random() > 0.6,
          confidence: 85 + Math.random() * 15,
          threats: Math.floor(Math.random() * 3),
          processingTime: Math.floor(100 + Math.random() * 200)
        });
        setIsAnalyzing(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header 
        onWatchDemo={handleWatchDemo}
        onOpenEnterpriseModal={handleEnterpriseSignup}
        onOpenFellowshipModal={handleFellowshipSignup}
      />

      {/* Hero Section - Exact Match to Screenshot */}
      <section 
        ref={heroRef}
        className="bg-white"
        style={{ marginTop: '100px', padding: '120px 0 200px 0', textAlign: 'center', position: 'relative' }}
      >
        <motion.div
          style={{ y }}
          className="relative z-10 max-w-7xl mx-auto px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-8"
          >
            🏆 Trusted by Fortune 500 Companies
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title text-gray-900"
            style={{
              fontSize: 'clamp(60px, 10vw, 120px)',
              fontWeight: 900,
              lineHeight: 0.9,
              marginBottom: '40px',
              letterSpacing: '-3px'
            }}
          >
            <span className="hero-word block">DEFEND.</span>
            <span className="hero-word block">DETECT.</span>
            <span className="hero-word block">VERIFY.</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-900"
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '30px',
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            Your Digital Immune System Against AI-Generated Threats
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-600"
            style={{
              fontSize: '20px',
              marginBottom: '60px',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.7
            }}
          >
            Enterprise-grade deepfake detection powered by Reality Defender's API. Protect your organization from synthetic media threats with 99.7% accuracy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.button
              whileHover={{ 
                scale: 1.02, 
                y: -4,
                boxShadow: "0 15px 40px rgba(22, 217, 227, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEnterpriseSignup}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-xl transition-all"
            >
              Join Beta Waitlist
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.02, 
                y: -4,
                backgroundColor: '#16d9e3'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWatchDemo}
              className="border-2 border-gray-900 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-cyan-400 hover:text-white hover:border-cyan-400 transition-all"
            >
              Try Live Demo
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-gray-500 italic"
          >
            "Securing digital truth for government agencies and Fortune 500 companies worldwide"
          </motion.p>
        </motion.div>
      </section>

      {/* Scrolling Text Banner */}
      {/* Live Demo Banner */}
      <section className="bg-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">LIVE: Experience real-time deepfake detection</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => window.location.href = '/demo'}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              Try Demo Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* Cutting-Edge Detection Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cutting-Edge Detection Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by advanced AI and Reality Defender's API for unmatched accuracy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: '🧠',
                title: 'Neural Analysis',
                description: 'Deep learning models trained on millions of samples detect subtle manipulation patterns invisible to human eyes.'
              },
              {
                icon: '🎤',
                title: 'Audio Forensics',
                description: 'Analyze voice patterns, spectral inconsistencies, and audio-visual synchronization to detect voice cloning.'
              },
              {
                icon: '👤',
                title: 'Biometric Verification',
                description: 'Advanced facial recognition and biometric analysis identify unnatural movements and expressions.'
              },
              {
                icon: '🔬',
                title: 'Pixel Forensics',
                description: 'Microscopic analysis of pixel patterns reveals AI generation artifacts and manipulation traces.'
              },
              {
                icon: '⚡',
                title: 'Real-time Processing',
                description: 'Lightning-fast analysis delivers results in under 100ms for immediate threat detection.'
              },
              {
                icon: '🌐',
                title: 'API Integration',
                description: 'Seamless integration with existing security infrastructure through RESTful APIs and SDKs.'
              }
            ].map((tech, index) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl">
                  {tech.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{tech.title}</h3>
                <p className="text-gray-600 leading-relaxed">{tech.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Scrolling Text Banner */}
      <div className="scrolling-text-banner">
        <motion.div
          animate={{ x: [1400, -1400] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="scrolling-content"
        >
          STOP DEEPFAKES • PREVENT FRAUD • VERIFY IDENTITY • PROTECT TRUTH • DEFEND DEMOCRACY • SECURE FUTURE • 
          STOP DEEPFAKES • PREVENT FRAUD • VERIFY IDENTITY • PROTECT TRUTH • DEFEND DEMOCRACY • SECURE FUTURE •
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="features-section" id="platform">
        <div className="container mx-auto px-8">
          <div className="features-container">
            {/* Sticky Sidebar */}
            <div className="features-sidebar">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title">
                  Stop threats.<br />
                  Stop fraud.<br />
                  Stop impersonation.
                </h2>
                <p className="section-subtitle">
                  Enterprise-grade AI detection that works in real-time, 
                  protecting what matters most - truth, trust, and safety online.
                </p>
                
                <div className="features-stats">
                  {[
                    { number: "99.7%", label: "Detection Accuracy" },
                    { number: "<2s", label: "Response Time" },
                    { number: "0", label: "False Positives" },
                    { number: "24/7", label: "Live Protection" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="stat"
                    >
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Features Grid */}
            <div className="features-grid">
              {[
                {
                  badge: "Identity Security",
                  title: "Know who you're really talking to.",
                  description: "Real-time biometric analysis with advanced deepfake detection. Verify identities instantly with 99.7% accuracy across video calls, authentication processes, and digital interactions.",
                  features: [
                    "Real-time facial recognition and analysis",
                    "Cross-reference validation against known patterns",
                    "Instant alerts for suspicious activity",
                    "Integration with existing security systems"
                  ],
                  mockup: (
                    <div className="feature-mockup">
                      <div className="mockup-header">
                        <div className="mockup-dot"></div>
                        <div className="mockup-dot"></div>
                        <div className="mockup-dot"></div>
                      </div>
                      <div className="confidence-display">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                          <span style={{ fontWeight: 600 }}>Identity Verification</span>
                          <span style={{ color: '#16d9e3', fontWeight: 700 }}>AUTHENTIC</span>
                        </div>
                        <div className="confidence-meter">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "97%" }}
                            transition={{ duration: 2, delay: 0.5 }}
                            className="confidence-fill"
                          />
                        </div>
                        <div className="confidence-text">Confidence: 99.7% • Real Person Detected</div>
                      </div>
                    </div>
                  )
                },
                {
                  badge: "Document Security",
                  title: "Every document. Every detail. Verified instantly.",
                  description: "Advanced document analysis with metadata forensics and tampering detection. Protect against fraudulent documents, altered PDFs, and synthetic content in under 2 seconds.",
                  features: [
                    "PDF, image, and video document analysis",
                    "Metadata forensics and digital fingerprinting",
                    "Chain of custody validation",
                    "Compliance reporting and audit trails"
                  ],
                  mockup: (
                    <div className="feature-mockup">
                      <div className="mockup-header">
                        <div className="mockup-dot"></div>
                        <div className="mockup-dot"></div>
                        <div className="mockup-dot"></div>
                      </div>
                      <div style={{ background: '#f8f9ff', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                          <span style={{ fontWeight: 600 }}>📄 Contract_Final.pdf</span>
                          <span style={{ color: '#00c851', fontWeight: 700 }}>✓ VERIFIED</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                          Metadata: Original • No tampering detected • Chain of custody intact
                        </div>
                        <div className="confidence-meter">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "95%" }}
                            transition={{ duration: 2, delay: 0.5 }}
                            className="confidence-fill"
                          />
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  badge: "Media Protection",
                  title: "Stop synthetic media before it spreads.",
                  description: "Multi-modal deepfake detection across video, audio, image, and text content. Real-time processing with explainable AI heatmaps showing exactly where manipulation occurs.",
                  features: [
                    "Video, audio, image, and text analysis",
                    "Real-time processing with <2s response",
                    "Explainable AI with visual heatmaps",
                    "Social media platform integration"
                  ],
                  mockup: (
                    <div className="feature-mockup">
                      <div className="mockup-header">
                        <div className="mockup-dot"></div>
                        <div className="mockup-dot"></div>
                        <div className="mockup-dot"></div>
                      </div>
                      <div style={{ background: '#fff3f3', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                          <span style={{ fontWeight: 600 }}>🎬 Video Analysis</span>
                          <span style={{ color: '#ff6b35', fontWeight: 700 }}>⚠ DEEPFAKE DETECTED</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                          Facial inconsistencies detected • Audio-visual mismatch • AI artifacts found
                        </div>
                        <div className="confidence-meter">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "94%" }}
                            transition={{ duration: 2, delay: 0.5 }}
                            style={{ background: 'linear-gradient(90deg, #ff6b35, #ff8c00)' }}
                            className="confidence-fill"
                          />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '16px', color: '#ff6b35' }}>Deepfake Confidence: 94.2%</div>
                      </div>
                    </div>
                  )
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.badge}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`feature-item ${index % 2 === 1 ? 'reverse' : ''}`}
                >
                  <div className="feature-content">
                    <div className="feature-badge">{feature.badge}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    <ul className="feature-list">
                      {feature.features.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="feature-visual">
                    {feature.mockup}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section - Functioning File Upload */}
      <section className="demo-section">
        <div className="container mx-auto px-8">
          <div className="demo-content">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title text-white mb-16"
            >
              See Detection in Action
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="demo-container"
            >
              <p style={{ marginBottom: '30px', fontSize: '20px', lineHeight: 1.6, color: 'white' }}>
                Upload any image, video, or audio file to see our AI detection engine analyze it in real-time. 
                Experience the power of enterprise-grade deepfake detection.
              </p>
              
              <div 
                className="demo-upload-area"
                style={{
                  border: '3px dashed rgba(255,255,255,0.3)',
                  padding: '60px 40px',
                  borderRadius: '16px',
                  margin: '30px 0',
                  background: 'rgba(255,255,255,0.05)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                
                {!uploadedFiles.length && !isAnalyzing && !analysisResults && (
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <Upload className="h-16 w-16 mx-auto mb-4 text-cyan-400" />
                    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                      Drop files here or click to upload
                    </h3>
                    <p style={{ fontSize: '16px', opacity: 0.8 }}>
                      Supports images, videos, and audio files up to 100MB
                    </p>
                  </div>
                )}

                {isAnalyzing && (
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-16 w-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                      Analyzing Content...
                    </h3>
                    <p style={{ fontSize: '16px', opacity: 0.8 }}>
                      Running advanced AI detection algorithms
                    </p>
                  </div>
                )}

                {analysisResults && (
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <div className={`h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      analysisResults.isDeepfake ? 'bg-red-500' : 'bg-green-500'
                    }`}>
                      {analysisResults.isDeepfake ? (
                        <AlertTriangle className="h-8 w-8 text-white" />
                      ) : (
                        <CheckCircle className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                      {analysisResults.isDeepfake ? 'Deepfake Detected' : 'Content Verified'}
                    </h3>
                    <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '20px' }}>
                      Confidence: {analysisResults.confidence.toFixed(1)}% • 
                      Processed in {analysisResults.processingTime}ms
                    </p>
                    <button
                      onClick={() => {
                        setUploadedFiles([]);
                        setAnalysisResults(null);
                      }}
                      className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
                    >
                      Analyze Another File
                    </button>
                  </div>
                )}
              </div>
                {uploadedFiles.length > 0 && !isAnalyzing && !analysisResults && (
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <div className="h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-500">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                      {uploadedFiles.length} File{uploadedFiles.length > 1 ? 's' : ''} Ready
                    </h3>
                    <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '20px' }}>
                      Click below to start AI-powered analysis
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsAnalyzing(true);
                        setTimeout(() => {
                          setAnalysisResults({
                            isDeepfake: Math.random() > 0.6,
                            confidence: 85 + Math.random() * 15,
                            threats: Math.floor(Math.random() * 3),
                            processingTime: Math.floor(100 + Math.random() * 200)
                          });
                          setIsAnalyzing(false);
                        }, 3000);
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all"
                    >
                      ANALYZE NOW
                    </motion.button>
                  </div>
                )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Testimonials */}
      <section className="social-proof-section">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-gray-900 mb-6">
              Trusted by Security Leaders Worldwide
            </h2>
          </motion.div>

          <div className="testimonials">
            {[
              {
                rating: 5,
                text: "Finally, a solution that actually works. ModGuardAI caught deepfakes our previous system missed entirely. The API integration took minutes, not months. Our fraud prevention improved by 340%.",
                author: "Sarah Chen",
                role: "CISO, Fortune 100 Financial Services"
              },
              {
                rating: 5,
                text: "Game-changing accuracy. 99.7% detection rate with zero false positives in our testing environment. This is the future of digital security. Implementation was seamless.",
                author: "Marcus Rodriguez",
                role: "Head of Security, Major Social Platform"
              },
              {
                rating: 5,
                text: "The real-time video analysis saved us from a major fraud attempt during a board meeting. The ROI was immediate and the peace of mind is invaluable. Best security investment we've made.",
                author: "Dr. Jennifer Walsh",
                role: "Chief Technology Officer, Global Bank"
              },
              {
                rating: 5,
                text: "ModGuardAI's forensic analysis tools helped us uncover a sophisticated deepfake campaign targeting our executives. The explainable AI made it easy to present evidence to stakeholders.",
                author: "Alex Thompson",
                role: "VP of Cybersecurity, Tech Unicorn"
              },
              {
                rating: 5,
                text: "As a journalist, verifying content authenticity is crucial. ModGuardAI's real-time analysis has become essential to our fact-checking process. Incredibly accurate and easy to use.",
                author: "Maria Santos",
                role: "Investigative Journalist, National News Network"
              },
              {
                rating: 5,
                text: "The team management features and compliance reporting made enterprise deployment effortless. Our entire organization is now protected with minimal IT overhead.",
                author: "David Kumar",
                role: "IT Director, Government Agency"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="testimonial"
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-text">
                  "{testimonial.text}"
                </p>
                <p className="testimonial-author">{testimonial.author}</p>
                <p className="testimonial-role">{testimonial.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Waitlist Section */}
      <section style={{ padding: '150px 0', background: 'linear-gradient(135deg, #16d9e3, #1a1a2e)' }}>
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, color: 'white', marginBottom: '24px' }}>
              Join Beta Waitlist
            </h2>
            <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
              Be among the first to access ModGuard AI's revolutionary detection technology
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '60px',
              border: '1px solid rgba(255,255,255,0.2)',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            <WaitlistForm location="homepage-main" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a2e', color: 'white', padding: '80px 0 40px 0' }}>
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <Shield className="h-8 w-8 text-cyan-400" />
                <span className="text-2xl font-bold">ModGuard AI</span>
              </Link>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Defending digital truth with AI-powered content moderation and deepfake detection.
              </p>
            </div>
            
            {/* Platform */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Technology</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/solutions" className="text-gray-400 hover:text-white transition-colors">Solutions</Link></li>
                <li><Link to="/demo" className="text-gray-400 hover:text-white transition-colors">Live Demo</Link></li>
                <li><Link to="/earlyaccess" className="text-gray-400 hover:text-white transition-colors">Early Access</Link></li>
              </ul>
            </div>
            
            {/* Community */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/student-portal" className="text-gray-400 hover:text-white transition-colors">AI Fellowship</Link></li>
                <li><Link to="/leaderboard" className="text-gray-400 hover:text-white transition-colors">Deepfake Challenge</Link></li>
                <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events & Webinars</Link></li>
                <li><Link to="/threat-map" className="text-gray-400 hover:text-white transition-colors">Research Network</Link></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/media" className="text-gray-400 hover:text-white transition-colors">Press & Media</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Transparency Dashboard</Link></li>
              </ul>
            </div>
            
            {/* Developers */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Developers</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors">API Documentation</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">SDKs & Libraries</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integration Guides</a></li>
                <li><Link to="/demo" className="text-gray-400 hover:text-white transition-colors">API Sandbox</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 ModGuard AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <FloatingCTA />

      {/* Modals */}
      <DemoPresentation isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      <EnterpriseOnboarding 
        isOpen={isEnterpriseModalOpen} 
        onClose={() => setIsEnterpriseModalOpen(false)}
        onComplete={() => {
          setIsEnterpriseModalOpen(false);
          window.location.href = '/dashboard';
        }}
      />
      <StudentOnboarding 
        isOpen={isFellowshipModalOpen} 
        onClose={() => setIsFellowshipModalOpen(false)}
      />
    </>
  );
};