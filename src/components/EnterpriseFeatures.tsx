import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Shield,
  FileText,
  CheckSquare,
  Code,
  Database,
  X,
  ArrowRight,
  Lock,
  Check,
  ExternalLink,
  Video,
  PlayCircle,
  Users,
  Settings,
  Zap,
  BarChart3
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 0 30px rgba(0, 255, 247, 0.15)",
        borderColor: "#00FFF7",
        y: -5
      }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-[#F5F8FA] rounded-xl p-6 border-2 border-transparent cursor-pointer transition-all glow-on-hover flex flex-col h-full"
    >
      <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center mb-4 shadow-md">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>
        {title}
      </h3>
      <p className="text-gray-600 text-sm flex-grow">
        {description}
      </p>
      <motion.div 
        className="flex items-center mt-4 text-blue-600 text-sm font-medium"
        whileHover={{ x: 5 }}
      >
        <span>Learn more</span>
        <ArrowRight className="ml-1 h-4 w-4" />
      </motion.div>
    </motion.div>
  );
};

interface FeatureModalProps {
  feature: {
    title: string;
    icon: React.ReactNode;
    description: string;
    overview: string;
    caseStudy: {
      title: string;
      content: string;
      metrics: Array<{ label: string; value: string }>;
    };
    demo?: {
      type: 'video' | 'interactive';
      content: React.ReactNode;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ feature, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-title-${feature.title}`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg w-10 h-10 flex items-center justify-center mr-3">
                  {feature.icon}
                </div>
                <h2 
                  id={`modal-title-${feature.title}`}
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  {feature.title}
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-500 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Feature Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  Feature Overview
                </h3>
                <p className="text-gray-600">
                  {feature.overview}
                </p>
              </div>
              
              {/* Case Study */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Case Study: {feature.caseStudy.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.caseStudy.content}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {feature.caseStudy.metrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm text-center">
                      <div className="text-xl font-bold text-blue-600 mb-1">{metric.value}</div>
                      <div className="text-sm text-gray-600">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Demo Section (if available) */}
              {feature.demo && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <PlayCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Interactive Demonstration
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    {feature.demo.content}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="mr-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const EnterpriseFeatures: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: "cultural-context",
      title: "Cultural Context Engine",
      description: "Analyze content within cultural frameworks of 50+ regions to ensure appropriate moderation across global audiences.",
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      overview: "Our Cultural Context Engine uses a sophisticated AI model trained on diverse cultural datasets from more than 50 regions worldwide. It provides culturally-aware content analysis that recognizes nuances in different societies, helping to avoid false positives while maintaining appropriate content standards for each market.",
      caseStudy: {
        title: "Global Social Platform",
        content: "A leading social media company implemented our Cultural Context Engine to address their challenge of appropriate content moderation across 37 countries. Prior to implementation, they faced significant criticism for both over-moderation and under-moderation due to misinterpreting cultural contexts.",
        metrics: [
          { label: "Reduction in false positives", value: "73%" },
          { label: "User satisfaction increase", value: "48%" },
          { label: "Moderation efficiency", value: "3.2x" }
        ]
      },
      demo: {
        type: "interactive",
        content: (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md mb-4">
              <div className="relative overflow-hidden rounded-lg border border-gray-300 aspect-video mb-2">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <Globe className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    <option>United States (North America)</option>
                    <option>Japan (Asia)</option>
                    <option>Brazil (South America)</option>
                    <option>Nigeria (Africa)</option>
                    <option>Germany (Europe)</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                  Analyze
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">Interactive demo would allow users to see how the same content is interpreted differently based on regional context.</p>
          </div>
        )
      }
    },
    {
      id: "audit-trail",
      title: "Immutable Audit Trail",
      description: "Comprehensive, tamper-proof record of all content decisions with transparency logs and verification certificates.",
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      overview: "Our Immutable Audit Trail creates a permanent, tamper-proof record of all content moderation decisions. Using blockchain technology, each decision is logged with timestamps, reasoning, confidence scores, and reviewer information, ensuring complete accountability and transparency for regulatory compliance.",
      caseStudy: {
        title: "Financial News Platform",
        content: "A major financial news organization implemented our Immutable Audit Trail to address regulatory requirements and improve trust. They needed to prove their content moderation was fair, consistent, and free from external influence, particularly for market-sensitive information.",
        metrics: [
          { label: "Compliance readiness", value: "100%" },
          { label: "Audit time reduction", value: "87%" },
          { label: "Dispute resolution time", value: "-65%" }
        ]
      },
      demo: {
        type: "interactive",
        content: (
          <div className="space-y-3">
            <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center text-sm">
                  <Lock className="h-4 w-4 text-green-600 mr-1.5" />
                  <span className="font-medium">Decision ID: 78f4d21a9</span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Verified</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-600 space-y-1 sm:space-y-0">
                <span>Timestamp: 2025-01-27 14:32:15 UTC</span>
                <span>Content Hash: 21f48d7cb9e83a...</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div className="bg-white p-2 rounded border border-gray-200">
                <div className="font-medium mb-1">Decision</div>
                <span className="text-green-600">Approved</span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <div className="font-medium mb-1">Confidence</div>
                <span>98.7%</span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <div className="font-medium mb-1">Reviewer</div>
                <span>AI System + Human</span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <div className="font-medium mb-1">Standards Applied</div>
                <span>GDPR, FINRA</span>
              </div>
            </div>
          </div>
        )
      }
    },
    {
      id: "enterprise-security",
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance, end-to-end encryption, and isolated processing environments.",
      icon: <Shield className="h-6 w-6 text-red-600" />,
      overview: "Our Enterprise Security infrastructure is built to meet the most demanding security requirements. With SOC 2 Type II compliance, end-to-end encryption, and isolated processing environments, we ensure your sensitive content and data remain protected throughout the analysis process. All systems undergo regular penetration testing and security audits.",
      caseStudy: {
        title: "Global Financial Institution",
        content: "A top-tier bank with stringent security requirements needed a content moderation system for internal communications and customer-facing materials. Their security team required complete isolation, advanced encryption, and comprehensive access controls to protect sensitive financial information.",
        metrics: [
          { label: "Security compliance", value: "100%" },
          { label: "Data isolation", value: "Complete" },
          { label: "Vulnerability score", value: "0.0" }
        ]
      },
      demo: {
        type: "interactive",
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center text-center">
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">End-to-End Encryption</div>
                <div className="text-xs text-gray-600 mt-1">AES-256 + RSA</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center text-center">
                <Lock className="h-8 w-8 text-blue-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">Isolated Environment</div>
                <div className="text-xs text-gray-600 mt-1">Complete air-gap</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center text-center">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">Role-Based Access</div>
                <div className="text-xs text-gray-600 mt-1">Granular controls</div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-600">
              Security architecture demonstration would be available in a full interactive demo
            </div>
          </div>
        )
      }
    },
    {
      id: "compliance-framework",
      title: "Compliance Framework",
      description: "Automated compliance with GDPR, CCPA, HIPAA, and industry-specific regulations through configurable policies.",
      icon: <CheckSquare className="h-6 w-6 text-green-600" />,
      overview: "Our Compliance Framework provides automated adherence to global regulatory standards. Pre-configured policies ensure your content moderation meets requirements for GDPR, CCPA, HIPAA, and industry-specific regulations. The system includes automated reporting, documentation generation, and verification to streamline your compliance processes.",
      caseStudy: {
        title: "Healthcare Communications Network",
        content: "A healthcare provider network needed to ensure all their digital communications remained HIPAA compliant while still allowing efficient information sharing. Manual review was causing significant delays in critical communications.",
        metrics: [
          { label: "Compliance violations", value: "-100%" },
          { label: "Review time", value: "-87%" },
          { label: "Annual audit costs", value: "-62%" }
        ]
      },
      demo: {
        type: "video",
        content: (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border border-gray-300 aspect-video">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                <Video className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Compliance Framework Demo Video</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <PlayCircle className="h-12 w-12 text-white" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['GDPR', 'CCPA', 'HIPAA', 'FINRA', 'SOC2', 'PCI-DSS', 'FERPA'].map(regulation => (
                <span key={regulation} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {regulation}
                </span>
              ))}
            </div>
          </div>
        )
      }
    },
    {
      id: "ethics-guardrails",
      title: "AI Ethics Guardrails",
      description: "Ethical AI principles implemented as code with transparency, fairness, and accountability built into every decision.",
      icon: <Database className="h-6 w-6 text-orange-600" />,
      overview: "Our AI Ethics Guardrails provide a structured framework to ensure all AI decisions adhere to ethical principles. We've transformed abstract ethical concepts into concrete code implementations that ensure transparency, fairness, accountability, and human oversight throughout the content moderation process. This system automatically identifies and prevents algorithmic bias.",
      caseStudy: {
        title: "Educational Platform",
        content: "A global educational technology company needed to ensure their AI content moderation system was treating all students fairly across cultures, languages, and backgrounds. They required transparent decision-making that could be explained to educators, parents, and students.",
        metrics: [
          { label: "Algorithmic bias", value: "Eliminated" },
          { label: "Decision transparency", value: "100%" },
          { label: "User trust rating", value: "4.9/5.0" }
        ]
      },
      demo: {
        type: "interactive",
        content: (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="h-3 w-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Ethical Decision Breakdown</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-700">Fairness Score</span>
                  <div className="w-2/3 bg-gray-300 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{width: '92%'}}></div>
                  </div>
                  <span className="text-xs font-medium">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-700">Transparency</span>
                  <div className="w-2/3 bg-gray-300 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <span className="text-xs font-medium">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-700">Accountability</span>
                  <div className="w-2/3 bg-gray-300 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{width: '95%'}}></div>
                  </div>
                  <span className="text-xs font-medium">95%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg text-sm">
              <span className="text-blue-800 font-medium">Human-in-the-loop verification</span>
              <span className="text-blue-600">Enabled</span>
            </div>
          </div>
        )
      }
    },
    {
      id: "technical-scalability",
      title: "Technical Scalability",
      description: "Process millions of items per minute with distributed architecture, auto-scaling, and global edge deployment.",
      icon: <Code className="h-6 w-6 text-indigo-600" />,
      overview: "Our Technical Scalability infrastructure enables seamless growth from startup to enterprise scale. With a distributed microservices architecture, automatic horizontal and vertical scaling, and global edge deployments, the system handles millions of content items per minute with consistent performance and reliability.",
      caseStudy: {
        title: "Video Streaming Platform",
        content: "A rapidly growing video streaming platform needed content moderation that could scale with their exponential user growth. Their traffic patterns were highly variable, with 10x spikes during peak hours, and they required global coverage with low latency.",
        metrics: [
          { label: "Processing capacity", value: "10M+/min" },
          { label: "Global latency", value: "<150ms" },
          { label: "Uptime SLA", value: "99.99%" }
        ]
      },
      demo: {
        type: "interactive",
        content: (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border border-gray-300 aspect-video">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-blue-900 to-cyan-900 flex items-center justify-center">
                <div className="w-full px-8">
                  <div className="flex justify-between items-center text-white text-xs mb-2">
                    <span>SYSTEM LOAD</span>
                    <span>AUTO-SCALING: ACTIVE</span>
                  </div>
                  <div className="h-6 bg-black/30 rounded-full overflow-hidden flex">
                    <motion.div
                      animate={{ 
                        width: ["30%", "80%", "50%", "70%", "40%"],
                      }}
                      transition={{ 
                        duration: 5,
                        times: [0, 0.2, 0.5, 0.8, 1],
                        repeat: Infinity, 
                      }}
                      className="bg-gradient-to-r from-green-500 to-cyan-500 h-full rounded-full"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[1, 2, 3].map(region => (
                      <div key={region} className="bg-black/20 p-2 rounded text-white text-xs border border-white/10">
                        <div className="flex justify-between items-center">
                          <span>REGION {region}</span>
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span>NODES:</span>
                          <span>
                            {4 + Math.floor(Math.random() * 8)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="text-gray-700">
                <div className="font-medium">Global Edge Deployment</div>
                <div className="text-xs text-gray-500">12 regions, auto-scaling</div>
              </div>
              <div className="text-right text-gray-700">
                <div className="font-medium">Processing Rate</div>
                <div className="text-xs text-gray-500">12.4M items/minute</div>
              </div>
            </div>
          </div>
        )
      }
    }
  ];

  const handleCardClick = (featureId: string) => {
    setSelectedFeature(featureId);
  };

  const selectedFeatureData = features.find(f => f.id === selectedFeature);

  return (
    <section className="py-24 bg-white" id="enterprise-features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-sora">
            Trusted by Enterprise.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Built for the Future
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-inter">
            Enterprise-grade infrastructure powering content safety at global scale
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={() => handleCardClick(feature.id)}
            />
          ))}
        </div>

        {/* Mobile Scrollable Grid */}
        <div className="md:hidden -mx-4 px-4 flex space-x-4 overflow-x-auto pb-6 snap-x snap-mandatory">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="snap-start scroll-mx-4 flex-shrink-0 w-[85%]"
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                onClick={() => handleCardClick(feature.id)}
              />
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12"
        >
          {[
            { label: "SOC 2 Type II Compliance", icon: <Shield className="h-5 w-5 text-blue-600" /> },
            { label: "ISO 27001 Certified", icon: <CheckSquare className="h-5 w-5 text-blue-600" /> },
            { label: "99.99% Uptime SLA", icon: <BarChart3 className="h-5 w-5 text-blue-600" /> }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              {item.icon}
              <span className="text-gray-600 font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Feature Modal */}
      {selectedFeatureData && (
        <FeatureModal
          feature={selectedFeatureData}
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </section>
  );
};