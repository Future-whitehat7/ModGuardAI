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
  Sparkles
} from 'lucide-react';

interface FeatureData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  benefits: string[];
  technicalSpecs: {
    accuracy: string;
    speed: string;
    coverage: string;
  };
  demo?: React.ReactNode;
}

const featuresData: FeatureData[] = [
  {
    id: 'deepfake-detection',
    title: 'Deepfake Detection',
    subtitle: 'Advanced Synthetic Media Identification',
    description: 'State-of-the-art neural networks trained on millions of synthetic media samples to identify deepfakes with 99.2% accuracy across video, audio, and image formats.',
    icon: Shield,
    color: '#00D4FF',
    gradient: 'from-cyan-500 to-blue-500',
    benefits: [
      'Real-time detection in under 200ms',
      'Multi-modal analysis (video, audio, image)',
      'Confidence scoring with explainable AI',
      'Continuous learning from new threats'
    ],
    technicalSpecs: {
      accuracy: '99.2%',
      speed: '127ms',
      coverage: '15+ formats'
    }
  },
  {
    id: 'cultural-context',
    title: 'Cultural Context AI',
    subtitle: 'Culturally-Aware Content Analysis',
    description: 'Advanced AI that understands cultural nuances, regional sensitivities, and contextual appropriateness across 50+ global markets and languages.',
    icon: Globe,
    color: '#10B981',
    gradient: 'from-green-500 to-teal-500',
    benefits: [
      'Cultural sensitivity analysis',
      '50+ regional context models',
      'Multi-language processing',
      'Bias detection and mitigation'
    ],
    technicalSpecs: {
      accuracy: '96.8%',
      speed: '156ms',
      coverage: '50+ regions'
    }
  },
  {
    id: 'real-time-processing',
    title: 'Real-time Processing',
    subtitle: 'Instant Threat Detection & Response',
    description: 'Lightning-fast processing infrastructure that analyzes millions of content pieces per minute with real-time alerts and automated response systems.',
    icon: Zap,
    color: '#FF6B35',
    gradient: 'from-orange-500 to-red-500',
    benefits: [
      'Sub-second threat detection',
      'Automated response workflows',
      'Real-time dashboard monitoring',
      'Instant alert notifications'
    ],
    technicalSpecs: {
      accuracy: '99.5%',
      speed: '89ms',
      coverage: '24/7 monitoring'
    }
  },
  {
    id: 'threat-intelligence',
    title: 'Threat Intelligence',
    subtitle: 'Comprehensive Threat Database',
    description: 'Global threat intelligence network that identifies emerging patterns, tracks threat actors, and provides predictive analytics for proactive defense.',
    icon: Target,
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-pink-500',
    benefits: [
      'Global threat pattern analysis',
      'Predictive threat modeling',
      'Actor attribution systems',
      'Collaborative intelligence sharing'
    ],
    technicalSpecs: {
      accuracy: '94.7%',
      speed: '234ms',
      coverage: 'Global network'
    }
  },
  {
    id: 'compliance-ethics',
    title: 'Compliance & Ethics',
    subtitle: 'Ethical AI with Regulatory Compliance',
    description: 'Built-in ethical frameworks and automated compliance with GDPR, CCPA, and industry-specific regulations while maintaining transparency and accountability.',
    icon: CheckCircle,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-500',
    benefits: [
      'Automated compliance checking',
      'Ethical AI decision frameworks',
      'Audit trail generation',
      'Regulatory reporting tools'
    ],
    technicalSpecs: {
      accuracy: '100%',
      speed: 'Real-time',
      coverage: 'Multi-jurisdiction'
    }
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    subtitle: 'Multi-User Workflow Management',
    description: 'Advanced collaboration tools with role-based access, review queues, version control, and team analytics for seamless content moderation workflows.',
    icon: Users,
    color: '#EC4899',
    gradient: 'from-pink-500 to-purple-500',
    benefits: [
      'Role-based access control',
      'Collaborative review workflows',
      'Version history tracking',
      'Team performance analytics'
    ],
    technicalSpecs: {
      accuracy: '99.8%',
      speed: 'Instant',
      coverage: 'Unlimited users'
    }
  }
];

export const Features = () => {
  const { featureId } = useParams();
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Performance optimization - mark as loaded
    setIsLoaded(true);
    
    // If specific feature is requested, show it
    if (featureId) {
      const feature = featuresData.find(f => f.id === featureId);
      if (feature) {
        setSelectedFeature(feature);
      }
    }
  }, [featureId]);

  const handleFeatureSelect = (feature: FeatureData) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
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
            <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ModGuard AI
              </span>
              <br />
              <span className="text-white">Features</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Advanced AI-powered content moderation and deepfake detection capabilities
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <AnimatePresence mode="wait">
            {!selectedFeature ? (
              // Features Overview Grid
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {featuresData.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -10,
                      boxShadow: `0 20px 40px ${feature.color}20`,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => handleFeatureSelect(feature)}
                    className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 cursor-pointer relative overflow-hidden group"
                  >
                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4 font-['Space_Grotesk']">
                        {feature.title}
                      </h3>
                      <p className="text-slate-300 mb-6">
                        {feature.description.substring(0, 120)}...
                      </p>
                      
                      <div className="flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                        <span>Learn More</span>
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // Individual Feature Page
              <motion.div
                key={selectedFeature.id}
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
                  Back to Features
                </button>

                {/* Feature Header */}
                <div className="text-center mb-12">
                  <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${selectedFeature.gradient} mb-8`}>
                    <selectedFeature.icon className="h-16 w-16 text-white" />
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-4 text-white">
                    {selectedFeature.title}
                  </h1>
                  <h2 className="text-2xl text-cyan-400 mb-6">
                    {selectedFeature.subtitle}
                  </h2>
                  <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                    {selectedFeature.description}
                  </p>
                </div>

                {/* Technical Specs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      {selectedFeature.technicalSpecs.accuracy}
                    </div>
                    <div className="text-slate-300">Accuracy Rate</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {selectedFeature.technicalSpecs.speed}
                    </div>
                    <div className="text-slate-300">Response Time</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {selectedFeature.technicalSpecs.coverage}
                    </div>
                    <div className="text-slate-300">Coverage</div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 font-['Space_Grotesk']">
                    Key Benefits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedFeature.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-r ${selectedFeature.gradient} text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all`}
                  >
                    Try {selectedFeature.title}
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