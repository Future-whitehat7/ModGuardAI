import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Shield,
  Globe,
  Zap,
  Target,
  CheckCircle,
  Users,
  ArrowRight,
  Brain,
  Eye,
  AlertTriangle,
  Activity,
  BarChart3,
  Lock,
  Sparkles,
  FileText,
  Video,
  Mic,
  Search,
  Camera,
  Crosshair,
  Layers,
  Download,
  Upload,
  Settings,
  Clock,
  Home
} from 'lucide-react';

const featuresData = [
  {
    id: 'deepfake-detection',
    title: 'Deepfake Detection',
    subtitle: 'Advanced AI-powered detection of synthetic video content',
    description: 'State-of-the-art neural networks trained on millions of synthetic media samples to identify deepfakes with 99.2% accuracy across video, audio, and image formats.',
    icon: Shield,
    color: '#EF4444',
    gradient: 'from-red-500 to-orange-500',
    features: [
      'Real-time detection in under 200ms',
      'Multi-modal analysis (video, audio, image)',
      'Confidence scoring with explainable AI',
      'Continuous learning from new threats'
    ],
    accuracy: '99.2%',
    speed: '127ms',
    coverage: '15+ formats'
  },
  {
    id: 'identity-verification',
    title: 'Identity Verification',
    subtitle: 'Biometric verification and identity authentication',
    description: 'Advanced facial recognition and biometric analysis to verify user identities in real-time with high accuracy across video calls and authentication processes.',
    icon: Users,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      'Real-time facial recognition analysis',
      'Cross-reference validation patterns',
      'Instant alerts for suspicious activity',
      'Integration with security systems'
    ],
    accuracy: '99.7%',
    speed: '89ms',
    coverage: 'Global database'
  },
  {
    id: 'document-verification',
    title: 'Document Verification',
    subtitle: 'Advanced document analysis and tampering detection',
    description: 'Comprehensive document analysis with metadata forensics and tampering detection to protect against fraudulent documents and altered files.',
    icon: FileText,
    color: '#10B981',
    gradient: 'from-green-500 to-teal-500',
    features: [
      'PDF, image, and video document analysis',
      'Metadata forensics and fingerprinting',
      'Chain of custody validation',
      'Compliance reporting and audit trails'
    ],
    accuracy: '98.5%',
    speed: '156ms',
    coverage: 'All formats'
  },
  {
    id: 'live-video',
    title: 'Live Video Analysis',
    subtitle: 'Real-time video stream monitoring and analysis',
    description: 'Monitor live video streams for deepfakes and synthetic content with instant detection and alerting capabilities.',
    icon: Video,
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Real-time stream analysis',
      'Instant threat notifications',
      'Low-latency processing',
      'Broadcast integration support'
    ],
    accuracy: '97.8%',
    speed: '45ms',
    coverage: 'Multiple streams'
  },
  {
    id: 'voice-analysis',
    title: 'Voice Analysis',
    subtitle: 'AI-powered voice cloning and synthesis detection',
    description: 'Advanced audio analysis to detect voice cloning, synthetic speech, and audio manipulation attempts.',
    icon: Mic,
    color: '#F59E0B',
    gradient: 'from-yellow-500 to-orange-500',
    features: [
      'Voice cloning detection',
      'Synthetic speech identification',
      'Audio quality analysis',
      'Speaker verification'
    ],
    accuracy: '96.3%',
    speed: '112ms',
    coverage: '25+ languages'
  },
  {
    id: 'forensic-analysis',
    title: 'Forensic Analysis',
    subtitle: 'Deep forensic investigation of digital content',
    description: 'Comprehensive forensic analysis tools for detailed investigation of digital content manipulation and fraud.',
    icon: Search,
    color: '#EC4899',
    gradient: 'from-pink-500 to-purple-500',
    features: [
      'Pixel-level analysis',
      'Metadata examination',
      'Timeline reconstruction',
      'Evidence documentation'
    ],
    accuracy: '99.8%',
    speed: '234ms',
    coverage: 'Comprehensive'
  },
  {
    id: 'cultural-context',
    title: 'Cultural Context AI',
    subtitle: 'Culturally-Aware Content Analysis',
    description: 'Advanced AI that understands cultural nuances, regional sensitivities, and contextual appropriateness across 50+ global markets and languages.',
    icon: Globe,
    color: '#10B981',
    gradient: 'from-green-500 to-teal-500',
    features: [
      'Cultural sensitivity analysis',
      '50+ regional context models',
      'Multi-language processing',
      'Bias detection and mitigation'
    ],
    accuracy: '96.8%',
    speed: '156ms',
    coverage: '50+ regions'
  },
  {
    id: 'real-time-processing',
    title: 'Real-time Processing',
    subtitle: 'Instant Threat Detection & Response',
    description: 'Lightning-fast processing infrastructure that analyzes millions of content pieces per minute with real-time alerts and automated response systems.',
    icon: Zap,
    color: '#FF6B35',
    gradient: 'from-orange-500 to-red-500',
    features: [
      'Sub-second threat detection',
      'Automated response workflows',
      'Real-time dashboard monitoring',
      'Instant alert notifications'
    ],
    accuracy: '99.5%',
    speed: '89ms',
    coverage: '24/7 monitoring'
  },
  {
    id: 'compliance-ethics',
    title: 'Compliance & Ethics',
    subtitle: 'Ethical AI with Regulatory Compliance',
    description: 'Built-in ethical frameworks and automated compliance with GDPR, CCPA, and industry-specific regulations while maintaining transparency and accountability.',
    icon: CheckCircle,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-500',
    features: [
      'Automated compliance checking',
      'Ethical AI decision frameworks',
      'Audit trail generation',
      'Regulatory reporting tools'
    ],
    accuracy: '100%',
    speed: 'Real-time',
    coverage: 'Multi-jurisdiction'
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    subtitle: 'Multi-User Workflow Management',
    description: 'Advanced collaboration tools with role-based access, review queues, version control, and team analytics for seamless content moderation workflows.',
    icon: Users,
    color: '#EC4899',
    gradient: 'from-pink-500 to-purple-500',
    features: [
      'Role-based access control',
      'Collaborative review workflows',
      'Version history tracking',
      'Team performance analytics'
    ],
    accuracy: '99.8%',
    speed: 'Instant',
    coverage: 'Unlimited users'
  }
];

const FeatureCard = ({ feature, index, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
    whileHover={{ 
      scale: 1.02, 
      y: -10,
      boxShadow: `0 20px 40px ${feature.color}20`,
      transition: { duration: 0.2 }
    }}
    onClick={() => onSelect(feature.id)}
    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 cursor-pointer relative overflow-hidden group hover:shadow-xl transition-all"
  >
    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
      <feature.icon className="h-8 w-8 text-white" />
    </div>
    
    <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Space_Grotesk']">
      {feature.title}
    </h3>
    <p className="text-gray-600 mb-6">
      {feature.subtitle}
    </p>
    
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="text-center bg-gray-50 rounded-lg p-3">
        <div className="text-lg font-bold text-gray-900">{feature.accuracy}</div>
        <div className="text-xs text-gray-600">Accuracy</div>
      </div>
      <div className="text-center bg-gray-50 rounded-lg p-3">
        <div className="text-lg font-bold text-gray-900">{feature.speed}</div>
        <div className="text-xs text-gray-600">Speed</div>
      </div>
      <div className="text-center bg-gray-50 rounded-lg p-3">
        <div className="text-lg font-bold text-gray-900">{feature.coverage}</div>
        <div className="text-xs text-gray-600">Coverage</div>
      </div>
    </div>
    
    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
      <span>Learn More</span>
      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
    </div>
  </motion.div>
);

const FeatureDetail = ({ feature, onBack }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-12"
  >
    {/* Back Button */}
    <button
      onClick={onBack}
      className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
    >
      <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
      Back to All Features
    </button>

    {/* Feature Header */}
    <div className="text-center mb-12">
      <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-8`}>
        <feature.icon className="h-16 w-16 text-white" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-4 text-white">
        {feature.title}
      </h1>
      <h2 className="text-2xl text-cyan-400 mb-6">
        {feature.subtitle}
      </h2>
      <p className="text-xl text-slate-300 max-w-4xl mx-auto">
        {feature.description}
      </p>
    </div>

    {/* Technical Specs */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 text-center">
        <div className="text-3xl font-bold text-cyan-400 mb-2">
          {feature.accuracy}
        </div>
        <div className="text-slate-300">Accuracy Rate</div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 text-center">
        <div className="text-3xl font-bold text-green-400 mb-2">
          {feature.speed}
        </div>
        <div className="text-slate-300">Response Time</div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 text-center">
        <div className="text-3xl font-bold text-purple-400 mb-2">
          {feature.coverage}
        </div>
        <div className="text-slate-300">Coverage</div>
      </div>
    </div>

    {/* Features */}
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8">
      <h3 className="text-2xl font-bold text-white mb-6 font-['Space_Grotesk']">
        Key Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feature.features.map((featureItem, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
            <span className="text-slate-300">{featureItem}</span>
          </motion.div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="text-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = '/demo'}
        className={`bg-gradient-to-r ${feature.gradient} text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all`}
      >
        Try {feature.title}
      </motion.button>
    </div>
  </motion.div>
);

export const Features = () => {
  const { featureId } = useParams();
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    if (featureId) {
      const feature = featuresData.find(f => f.id === featureId);
      if (feature) {
        setSelectedFeature(feature);
      } else {
        setSelectedFeature(null);
      }
    } else {
      setSelectedFeature(null);
    }
  }, [featureId]);

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
    navigate(`/features/${feature.id}`, { replace: true });
  };

  const handleBackToOverview = () => {
    setSelectedFeature(null);
    navigate('/features', { replace: true });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors" />
                <span className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</span>
              </Link>
              <span className="text-gray-400">|</span>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">ModGuard AI Features</span>
              </div>
            </div>
            
            <Link
              to="/demo"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Try Live Demo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatePresence mode="wait">
          {!selectedFeature ? (
            // Features Overview
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Page Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] mb-6">
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    ModGuard AI
                  </span>
                  <br />
                  <span className="text-gray-900">Features</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Advanced AI-powered content moderation and deepfake detection capabilities
                </p>
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuresData.map((feature, index) => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    index={index}
                    onSelect={(id) => {
                      const selectedFeature = featuresData.find(f => f.id === id);
                      handleFeatureSelect(selectedFeature);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            // Individual Feature Detail
            <FeatureDetail
              key={selectedFeature.id}
              feature={selectedFeature}
              onBack={handleBackToOverview}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-cyan-400" />
                <span className="text-xl font-bold">ModGuard AI</span>
              </Link>
              <p className="text-gray-400 text-sm">
                Defending digital truth with AI-powered content moderation and deepfake detection.
              </p>
            </div>
            
            {/* Technology */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Technology</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/solutions" className="text-gray-400 hover:text-white transition-colors">Solutions</Link></li>
                <li><Link to="/demo" className="text-gray-400 hover:text-white transition-colors">Try Live Demo</Link></li>
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
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compliance</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 ModGuard AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link to="/api" className="text-gray-400 hover:text-white transition-colors">API</Link>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};