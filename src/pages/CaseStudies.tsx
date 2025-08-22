import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  Users,
  Globe,
  CheckCircle,
  BarChart3,
  Clock,
  Award,
  Building,
  Newspaper,
  School,
  Briefcase,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const CaseStudyCard = ({ title, client, industry, challenge, solution, results, metrics, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full"
  >
    <div className="flex items-start space-x-4 mb-6">
      <div className={`p-3 rounded-lg ${color}`}>
        <Building className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600">{client}</p>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-2 inline-block">
          {industry}
        </span>
      </div>
    </div>
    
    <div className="space-y-4 mb-6">
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
        <p className="text-gray-600 text-sm">{challenge}</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Solution</h4>
        <p className="text-gray-600 text-sm">{solution}</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Results</h4>
        <p className="text-gray-600 text-sm mb-3">{results}</p>
        
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((metric: any, index: number) => (
            <div key={index} className="text-center bg-gray-50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-600">{metric.value}</div>
              <div className="text-xs text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
      <span>Read Full Case Study</span>
      <ArrowRight className="h-4 w-4" />
    </button>
  </motion.div>
);

export const CaseStudies = () => {
  const caseStudies = [
    {
      title: 'Global News Network Protection',
      client: 'International Broadcasting Corp',
      industry: 'Media & News',
      challenge: 'Rising deepfake threats targeting news credibility during election cycles, with manual verification causing 3-hour delays in breaking news.',
      solution: 'Deployed real-time deepfake detection with cultural context filtering across 15 languages and 23 regions.',
      results: 'Reduced verification time from 3 hours to 8 minutes while maintaining 99.7% accuracy.',
      metrics: [
        { value: '97%', label: 'Time Saved' },
        { value: '99.7%', label: 'Accuracy' },
        { value: '23', label: 'Regions' }
      ],
      color: 'bg-blue-500'
    },
    {
      title: 'Social Media Platform Safety',
      client: 'ConnectGlobal',
      industry: 'Social Media',
      challenge: 'AI-generated harassment content and deepfake profiles overwhelming human moderation teams across 2.1 billion users.',
      solution: 'Implemented automated detection with human-in-the-loop validation and cultural sensitivity algorithms.',
      results: 'Identified 847% more violations while reducing false positives by 73%.',
      metrics: [
        { value: '847%', label: 'More Violations' },
        { value: '73%', label: 'Fewer False Positives' },
        { value: '2.1B', label: 'Users Protected' }
      ],
      color: 'bg-purple-500'
    },
    {
      title: 'Educational Content Verification',
      client: 'EduTech Solutions',
      industry: 'Education',
      challenge: 'AI-generated academic content and deepfake lectures threatening educational integrity across 500+ institutions.',
      solution: 'Custom AI models trained on educational content with academic integrity verification protocols.',
      results: 'Maintained educational standards while enabling legitimate AI-assisted learning.',
      metrics: [
        { value: '500+', label: 'Institutions' },
        { value: '94%', label: 'Accuracy' },
        { value: '67%', label: 'Efficiency Gain' }
      ],
      color: 'bg-green-500'
    },
    {
      title: 'Financial Services Security',
      client: 'SecureBank International',
      industry: 'Financial Services',
      challenge: 'Voice cloning attacks targeting customer service lines, resulting in $2.3M in fraudulent transactions.',
      solution: 'Real-time voice authentication with AI-powered synthetic speech detection and risk scoring.',
      results: 'Eliminated voice cloning fraud while maintaining seamless customer experience.',
      metrics: [
        { value: '100%', label: 'Fraud Prevention' },
        { value: '0.3s', label: 'Detection Time' },
        { value: '$2.3M', label: 'Losses Prevented' }
      ],
      color: 'bg-orange-500'
    },
    {
      title: 'Government Communications',
      client: 'Digital Government Initiative',
      industry: 'Government',
      challenge: 'Protecting official communications from deepfake impersonation while maintaining public transparency.',
      solution: 'Blockchain-verified content authentication with real-time deepfake detection for public communications.',
      results: 'Zero successful deepfake attacks on official channels with full transparency maintained.',
      metrics: [
        { value: '0', label: 'Successful Attacks' },
        { value: '100%', label: 'Transparency' },
        { value: '15', label: 'Agencies Protected' }
      ],
      color: 'bg-red-500'
    },
    {
      title: 'Entertainment Industry Protection',
      client: 'StudioMax Entertainment',
      industry: 'Entertainment',
      challenge: 'Unauthorized deepfake content using celebrity likenesses affecting brand reputation and revenue.',
      solution: 'Proactive content monitoring with biometric identification and automated takedown requests.',
      results: 'Reduced unauthorized content by 89% and protected celebrity brand integrity.',
      metrics: [
        { value: '89%', label: 'Content Reduced' },
        { value: '24/7', label: 'Monitoring' },
        { value: '150+', label: 'Talents Protected' }
      ],
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <a 
            href="/" 
            className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Shield className="h-5 w-5" />
            <span className="font-medium">← Back to Home</span>
          </a>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Case Studies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-world success stories demonstrating how ModGuard AI protects organizations across industries
          </p>
        </motion.div>
      </div>

      {/* Industry Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {[
          { icon: Building, label: 'Organizations Protected', value: '500+', color: 'bg-blue-100 text-blue-600' },
          { icon: Globe, label: 'Countries Served', value: '50+', color: 'bg-green-100 text-green-600' },
          { icon: Shield, label: 'Threats Prevented', value: '2.3M+', color: 'bg-red-100 text-red-600' },
          { icon: Award, label: 'Success Rate', value: '99.2%', color: 'bg-purple-100 text-purple-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center"
          >
            <div className={`inline-flex p-3 rounded-lg mb-4 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {caseStudies.map((study, index) => (
          <motion.div
            key={study.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CaseStudyCard {...study} />
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Join These Success Stories?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          See how ModGuard AI can transform your organization's content safety
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Schedule a Demo
          </button>
          <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center justify-center space-x-2">
            <span>View More Case Studies</span>
            <ExternalLink className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};