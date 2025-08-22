import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Palette,
  Building,
  Shield,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Users,
  BarChart3,
  Globe,
  Target,
  Zap,
  Eye,
  TrendingUp,
  Home
} from 'lucide-react';

interface SolutionData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  challenges: string[];
  solutions: string[];
  outcomes: string[];
  caseStudy?: {
    company: string;
    result: string;
    metric: string;
  };
}

const solutionsData: SolutionData[] = [
  {
    id: 'creators',
    title: 'For Creators',
    subtitle: 'Protect Your Authentic Voice',
    description: 'Safeguard your creative work from unauthorized deepfakes and synthetic reproductions while building trust with your audience through verified authentic content.',
    icon: Palette,
    color: '#FF6B35',
    gradient: 'from-orange-500 to-red-500',
    challenges: [
      'Unauthorized deepfake creation using your likeness',
      'Brand impersonation and voice cloning',
      'Content authenticity verification',
      'Protecting intellectual property rights'
    ],
    solutions: [
      'Real-time monitoring for unauthorized content',
      'Biometric voice and face verification',
      'Content authentication certificates',
      'Automated takedown request generation'
    ],
    outcomes: [
      '95% reduction in unauthorized deepfakes',
      'Verified creator badge and certification',
      'Increased audience trust and engagement',
      'Protected revenue streams'
    ],
    caseStudy: {
      company: 'TikTok Creator Network',
      result: 'Eliminated 98% of unauthorized deepfakes',
      metric: '2.3M creators protected'
    }
  },
  {
    id: 'brands',
    title: 'For Brands & Enterprises',
    subtitle: 'Safeguard Brand Integrity',
    description: 'Protect your brand reputation from deepfake attacks, ensure executive communications are authentic, and maintain customer trust in the digital age.',
    icon: Building,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-500',
    challenges: [
      'CEO and executive deepfake impersonation',
      'Brand reputation damage from fake content',
      'Customer communication fraud',
      'Corporate espionage and disinformation'
    ],
    solutions: [
      'Executive protection monitoring',
      'Brand mention analysis and verification',
      'Customer communication authentication',
      'Crisis response and mitigation tools'
    ],
    outcomes: [
      '100% authentic executive communications',
      'Protected brand reputation score',
      'Reduced fraud-related customer complaints',
      'Enhanced stakeholder confidence'
    ],
    caseStudy: {
      company: 'Fortune 500 Financial Firm',
      result: 'Prevented $12M in fraud attempts',
      metric: '99.7% authentic communication rate'
    }
  },
  {
    id: 'government',
    title: 'For Governments & Policy Makers',
    subtitle: 'Secure Democratic Processes',
    description: 'Ensure election integrity, protect official communications, and combat state-sponsored disinformation campaigns with advanced AI detection systems.',
    icon: Shield,
    color: '#10B981',
    gradient: 'from-green-500 to-teal-500',
    challenges: [
      'Election disinformation and candidate deepfakes',
      'Official statement authenticity',
      'Foreign interference detection',
      'Public trust in government communications'
    ],
    solutions: [
      'Election content monitoring systems',
      'Official communication verification',
      'Multi-language disinformation detection',
      'Real-time threat assessment dashboards'
    ],
    outcomes: [
      'Verified election content integrity',
      'Authenticated government communications',
      'Reduced foreign interference impact',
      'Increased public trust metrics'
    ],
    caseStudy: {
      company: 'European Union Election Commission',
      result: 'Secured 27-nation election process',
      metric: '847 threats detected and mitigated'
    }
  },
  {
    id: 'education',
    title: 'For Educators / Journalists',
    subtitle: 'Ensure Information Accuracy',
    description: 'Verify news sources, authenticate educational content, and teach digital literacy with AI-powered fact-checking and content verification tools.',
    icon: GraduationCap,
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-pink-500',
    challenges: [
      'News source verification and fact-checking',
      'Educational content authenticity',
      'Student-generated content monitoring',
      'Digital literacy education needs'
    ],
    solutions: [
      'Real-time fact-checking integration',
      'Educational content verification tools',
      'Student portal with detection training',
      'Digital literacy curriculum support'
    ],
    outcomes: [
      'Verified news accuracy rates',
      'Authenticated educational materials',
      'Enhanced student digital literacy',
      'Reduced misinformation spread'
    ],
    caseStudy: {
      company: 'Global News Network',
      result: 'Achieved 99.4% source accuracy',
      metric: '500+ newsrooms protected'
    }
  }
];

export const Solutions = () => {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const [selectedSolution, setSelectedSolution] = useState<SolutionData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    if (solutionId) {
      const solution = solutionsData.find(s => s.id === solutionId);
      if (solution) {
        setSelectedSolution(solution);
      }
    }
  }, [solutionId]);

  const handleSolutionSelect = (solution: SolutionData) => {
    setSelectedSolution(solution);
    navigate(`/solutions/${solution.id}`, { replace: true });
  };

  const handleBackToOverview = () => {
    setSelectedSolution(null);
    navigate('/solutions', { replace: true });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading solutions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Matching home page design */}
      <header className="fixed top-0 w-full z-50 py-5" style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <nav className="container max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center">
            {/* Logo - Matching home page */}
            <motion.div 
              className="flex items-center flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/" 
                className="logo"
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#1a1a2e',
                  textDecoration: 'none',
                  letterSpacing: '-0.5px'
                }}
              >
                ModGuardAI
              </Link>
            </motion.div>

            {/* Navigation Links */}
            <ul className="hidden lg:flex items-center" style={{ gap: '40px' }}>
              <li>
                <Link
                  to="/features"
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#16d9e3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1a1a2e';
                  }}
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions"
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#16d9e3',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/student-portal"
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#16d9e3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1a1a2e';
                  }}
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#16d9e3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1a1a2e';
                  }}
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#16d9e3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1a1a2e';
                  }}
                >
                  Developers
                </Link>
              </li>
            </ul>

            {/* CTA Button - Matching home page */}
            <div className="hidden lg:flex items-center">
              <motion.button
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  boxShadow: "0 12px 35px rgba(22, 217, 227, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const email = prompt('Enter email:');
                  const password = prompt('Enter password:');
                  
                  if (email && password) {
                    alert('Login successful! Redirecting to dashboard...');
                    window.location.href = '/dashboard';
                  } else {
                    alert('Please enter both email and password');
                  }
                }}
                className="cta-button"
                style={{
                  background: 'linear-gradient(135deg, #16d9e3, #1a1a2e)',
                  color: 'white',
                  padding: '14px 28px',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Login/Dashboard
              </motion.button>
            </div>
          </div>
        </nav>
      </header>

      <div className="flex-1 flex flex-col" style={{ marginTop: '100px' }}>
        {/* Hero Section - Matching home page style */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Home Button - Updated styling */}
              <div className="mb-8">
                <Link 
                  to="/" 
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-8"
              >
                🛡️ Enterprise-Grade Protection
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-gray-900 mb-6"
                style={{
                  fontSize: 'clamp(48px, 8vw, 80px)',
                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: '-2px'
                }}
              >
                Solutions
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-gray-600"
                style={{
                  fontSize: '20px',
                  maxWidth: '700px',
                  margin: '0 auto',
                  lineHeight: 1.7
                }}
              >
                Tailored AI-powered content protection for every industry and use case
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto px-8 pb-20">
          <AnimatePresence mode="wait">
            {!selectedSolution ? (
              // Solutions Overview Grid
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {solutionsData.map((solution, index) => (
                  <motion.div
                    key={solution.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -10,
                      boxShadow: `0 20px 40px ${solution.color}20`,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => handleSolutionSelect(solution)}
                    className="bg-white border border-gray-200 rounded-2xl p-8 cursor-pointer relative overflow-hidden group hover:shadow-xl transition-all"
                  >
                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${solution.gradient} mb-6`}>
                        <solution.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontWeight: 900 }}>
                        {solution.title}
                      </h3>
                      <h4 className="text-lg text-blue-600 mb-4 font-semibold">
                        {solution.subtitle}
                      </h4>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {solution.description}
                      </p>
                      
                      {solution.caseStudy && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
                          <div className="text-sm text-gray-500 mb-1 font-medium">Case Study</div>
                          <div className="text-gray-900 font-semibold">{solution.caseStudy.company}</div>
                          <div className="text-blue-600 text-sm font-medium">{solution.caseStudy.result}</div>
                        </div>
                      )}
                      
                      <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                        <span>Learn More</span>
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // Individual Solution Page
              <motion.div
                key={selectedSolution.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Back Button */}
                <button
                  onClick={handleBackToOverview}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-semibold"
                >
                  <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                  Back to Solutions
                </button>

                {/* Solution Header */}
                <div className="text-center mb-12">
                  <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${selectedSolution.gradient} mb-8`}>
                    <selectedSolution.icon className="h-16 w-16 text-white" />
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontWeight: 900 }}>
                    {selectedSolution.title}
                  </h1>
                  <h2 className="text-2xl text-blue-600 mb-6 font-semibold">
                    {selectedSolution.subtitle}
                  </h2>
                  <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    {selectedSolution.description}
                  </p>
                </div>

                {/* Challenges, Solutions, Outcomes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  {/* Challenges */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-red-600 mb-4" style={{ fontWeight: 900 }}>
                      Challenges
                    </h3>
                    <div className="space-y-3">
                      {selectedSolution.challenges.map((challenge, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm leading-relaxed">{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solutions */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-blue-600 mb-4" style={{ fontWeight: 900 }}>
                      Our Solutions
                    </h3>
                    <div className="space-y-3">
                      {selectedSolution.solutions.map((solution, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm leading-relaxed">{solution}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-green-600 mb-4" style={{ fontWeight: 900 }}>
                      Outcomes
                    </h3>
                    <div className="space-y-3">
                      {selectedSolution.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm leading-relaxed">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Case Study */}
                {selectedSolution.caseStudy && (
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontWeight: 900 }}>
                      Success Story
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2" style={{ fontWeight: 900 }}>
                          {selectedSolution.caseStudy.company}
                        </div>
                        <div className="text-gray-600 font-medium">Client</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2" style={{ fontWeight: 900 }}>
                          {selectedSolution.caseStudy.result}
                        </div>
                        <div className="text-gray-600 font-medium">Achievement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2" style={{ fontWeight: 900 }}>
                          {selectedSolution.caseStudy.metric}
                        </div>
                        <div className="text-gray-600 font-medium">Impact</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 15px 40px rgba(22, 217, 227, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/demo'}
                    className={`bg-gradient-to-r ${selectedSolution.gradient} text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all`}
                    style={{ fontWeight: 700 }}
                  >
                    Try Live Demo
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer - Matching home page style */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="text-2xl font-bold" style={{ fontWeight: 900, color: '#16d9e3' }}>
                  ModGuardAI
                </div>
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
              </ul>
            </div>
            
            {/* Media & Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Media & Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/media" className="text-gray-400 hover:text-white transition-colors">Press & Media</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors">Case Studies</Link></li>
              </ul>
            </div>
            
            {/* Utilities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Utilities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors">API Access</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
                <li><Link to="/earlyaccess" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Compliance</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 ModGuardAI. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link to="/api" className="text-gray-400 hover:text-white transition-colors">API</Link>
              <Link to="/earlyaccess" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};