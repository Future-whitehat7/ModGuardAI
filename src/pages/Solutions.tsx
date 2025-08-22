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
  TrendingUp
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading solutions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-8">
              <a 
                href="/" 
                className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Shield className="h-5 w-5" />
                <span className="font-medium">← Back to Home</span>
              </a>
            </div>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Shield className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold text-white font-['Space_Grotesk']">
                ModGuard AI
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Tailored AI-powered content protection for every industry and use case
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
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
                © 2025 ModGuard AI. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                <Link to="/api" className="text-gray-400 hover:text-white transition-colors">API</Link>
                <Link to="/earlyaccess" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
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
                    className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 cursor-pointer relative overflow-hidden group"
                  >
                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${solution.gradient} mb-6`}>
                        <solution.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2 font-['Space_Grotesk']">
                        {solution.title}
                      </h3>
                      <h4 className="text-lg text-cyan-400 mb-4">
                        {solution.subtitle}
                      </h4>
                      <p className="text-slate-300 mb-6">
                        {solution.description}
                      </p>
                      
                      {solution.caseStudy && (
                        <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
                          <div className="text-sm text-slate-400 mb-1">Case Study</div>
                          <div className="text-white font-medium">{solution.caseStudy.company}</div>
                          <div className="text-cyan-400 text-sm">{solution.caseStudy.result}</div>
                        </div>
                      )}
                      
                      <div className="flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
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
                  className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                  Back to Solutions
                </button>

                {/* Solution Header */}
                <div className="text-center mb-12">
                  <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${selectedSolution.gradient} mb-8`}>
                    <selectedSolution.icon className="h-16 w-16 text-white" />
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-4 text-white">
                    {selectedSolution.title}
                  </h1>
                  <h2 className="text-2xl text-cyan-400 mb-6">
                    {selectedSolution.subtitle}
                  </h2>
                  <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                    {selectedSolution.description}
                  </p>
                </div>

                {/* Challenges, Solutions, Outcomes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  {/* Challenges */}
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                    <h3 className="text-xl font-bold text-red-400 mb-4 font-['Space_Grotesk']">
                      Challenges
                    </h3>
                    <div className="space-y-3">
                      {selectedSolution.challenges.map((challenge, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-300 text-sm">{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solutions */}
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4 font-['Space_Grotesk']">
                      Our Solutions
                    </h3>
                    <div className="space-y-3">
                      {selectedSolution.solutions.map((solution, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{solution}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                    <h3 className="text-xl font-bold text-green-400 mb-4 font-['Space_Grotesk']">
                      Outcomes
                    </h3>
                    <div className="space-y-3">
                      {selectedSolution.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <TrendingUp className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Case Study */}
                {selectedSolution.caseStudy && (
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 font-['Space_Grotesk']">
                      Success Story
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-cyan-400 mb-2">
                          {selectedSolution.caseStudy.company}
                        </div>
                        <div className="text-slate-300">Client</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">
                          {selectedSolution.caseStudy.result}
                        </div>
                        <div className="text-slate-300">Achievement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-2">
                          {selectedSolution.caseStudy.metric}
                        </div>
                        <div className="text-slate-300">Impact</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/demo'}
                    className={`bg-gradient-to-r ${selectedSolution.gradient} text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all`}
                  >
                    Try Live Demo
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};