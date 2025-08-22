import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Building,
  Globe,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Brain,
  Target,
  Zap,
  Clock,
  Sparkles,
  ExternalLink,
  Calendar,
  Settings,
  BarChart3,
  Lock,
  Eye,
  MessageCircle,
  Upload,
  Download,
  Star,
  Award,
  Lightbulb,
  Code,
  Palette,
  Headphones,
  FileText,
  TrendingUp,
  CheckCircle as Check
} from 'lucide-react';
import { StrategyCallBooking } from './StrategyCallBooking';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface FormData {
  // Step 1: Diagnostic Intake
  industry: string;
  ugcVolume: string;
  volumePeriod: string;
  languages: string[];
  culturalMarkets: string[];
  sensitivityAreas: string[];
  complianceNeeds: string[];
  
  // Step 2: Generated data
  threatProfile?: {
    riskLevel: 'low' | 'medium' | 'high';
    primaryThreats: string[];
    recommendations: Array<{
      feature: string;
      tier: number;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  
  // Step 3: Role mapping
  stakeholders: Array<{
    name: string;
    role: string;
    department: string;
    accessLevel: string;
    responsibilities: string[];
  }>;
  
  // Step 4: Launch preferences
  contentBatch?: File[];
  launchTimeline: string;
  priorityFeatures: string[];
}

export const EnterpriseOnboarding: React.FC<OnboardingProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isStrategyCallOpen, setIsStrategyCallOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activationComplete, setActivationComplete] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    industry: '',
    ugcVolume: '',
    volumePeriod: 'day',
    languages: [],
    culturalMarkets: [],
    sensitivityAreas: [],
    complianceNeeds: [],
    stakeholders: [],
    launchTimeline: '',
    priorityFeatures: []
  });
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);

  const totalSteps = 4;

  const industries = [
    { id: 'news', label: 'News & Media', icon: '📰', risk: 'high' },
    { id: 'social', label: 'Social Media', icon: '📱', risk: 'high' },
    { id: 'education', label: 'Education', icon: '🎓', risk: 'medium' },
    { id: 'corporate', label: 'Corporate Communications', icon: '🏢', risk: 'medium' },
    { id: 'finance', label: 'Financial Services', icon: '💰', risk: 'high' },
    { id: 'politics', label: 'Political Organizations', icon: '🏛️', risk: 'high' },
    { id: 'healthcare', label: 'Healthcare', icon: '🏥', risk: 'medium' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬', risk: 'medium' }
  ];

  const sensitivityOptions = [
    { id: 'misinformation', label: 'Misinformation & Disinformation', severity: 'critical' },
    { id: 'violence', label: 'Violence & Graphic Content', severity: 'high' },
    { id: 'nudity', label: 'Adult Content & Nudity', severity: 'medium' },
    { id: 'hate', label: 'Hate Speech & Harassment', severity: 'high' },
    { id: 'synthetic', label: 'Synthetic Speech & Audio', severity: 'critical' },
    { id: 'deepfakes', label: 'Deepfakes & Visual Manipulation', severity: 'critical' },
    { id: 'spam', label: 'Spam & Promotional Content', severity: 'low' },
    { id: 'privacy', label: 'Privacy Violations & Doxxing', severity: 'high' }
  ];

  const complianceOptions = [
    { id: 'gdpr', label: 'GDPR (EU)', region: 'Europe' },
    { id: 'hipaa', label: 'HIPAA (Healthcare)', region: 'US' },
    { id: 'section230', label: 'Section 230 (US)', region: 'US' },
    { id: 'dsa', label: 'EU Digital Services Act', region: 'Europe' },
    { id: 'coppa', label: 'COPPA (Children)', region: 'US' },
    { id: 'ccpa', label: 'CCPA (California)', region: 'US' },
    { id: 'pipeda', label: 'PIPEDA (Canada)', region: 'Canada' },
    { id: 'lgpd', label: 'LGPD (Brazil)', region: 'Brazil' }
  ];

  const generateThreatProfile = () => {
    setIsGeneratingProfile(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const selectedIndustry = industries.find(i => i.id === formData.industry);
      const riskLevel = selectedIndustry?.risk || 'medium';
      
      const recommendations = [
        {
          feature: 'Real-time visual moderation',
          tier: riskLevel === 'high' ? 2 : 3,
          priority: 'high' as const
        },
        {
          feature: 'Voice manipulation detection',
          tier: formData.sensitivityAreas.includes('synthetic') ? 1 : 2,
          priority: formData.sensitivityAreas.includes('synthetic') ? 'high' as const : 'medium' as const
        },
        {
          feature: 'Cultural context filter',
          tier: formData.culturalMarkets.length > 3 ? 1 : 3,
          priority: formData.culturalMarkets.length > 3 ? 'high' as const : 'medium' as const
        },
        {
          feature: 'API integration',
          tier: 1,
          priority: 'high' as const
        }
      ];

      const primaryThreats = formData.sensitivityAreas.slice(0, 3);

      setFormData(prev => ({
        ...prev,
        threatProfile: {
          riskLevel: riskLevel as 'low' | 'medium' | 'high',
          primaryThreats,
          recommendations
        }
      }));
      
      setIsGeneratingProfile(false);
    }, 3000);
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const nextStep = () => {
    if (currentStep === 1) {
      generateThreatProfile();
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStrategyCallComplete = () => {
    setIsStrategyCallOpen(false);
    // Redirect to enterprise dashboard
    onComplete();
  };

  const handleActivateDeployment = () => {
    setIsActivating(true);
    
    // Simulate deployment activation process
    setTimeout(() => {
      setIsActivating(false);
      setActivationComplete(true);
      
      // After showing success, redirect to dashboard
      setTimeout(() => {
        window.location.href = '/enterprise-dashboard';
        onComplete();
      }, 2000);
    }, 3000);
  };

  const handleTryDashboard = () => {
    window.location.href = '/dashboard';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4 font-sora">
                Diagnostic Intake
              </h2>
              <h3 className="text-xl text-cyan-400 mb-4 font-sora">
                Every platform faces a different threat surface.
              </h3>
              <p className="text-slate-300 font-inter mb-2">
                Let's understand yours.
              </p>
              <p className="text-slate-500 text-sm font-inter">
                ModGuard adapts to your world—not the other way around.
              </p>
            </div>

            <div className="space-y-8">
              {/* Industry Selection */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">Industry</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {industries.map((industry) => (
                    <motion.button
                      key={industry.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => updateFormData('industry', industry.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        formData.industry === industry.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-2xl mb-2">{industry.icon}</div>
                      <div className="text-white font-medium text-sm">{industry.label}</div>
                      <div className={`text-xs mt-1 ${
                        industry.risk === 'high' ? 'text-red-400' :
                        industry.risk === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {industry.risk} risk
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Volume Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-4">
                    Volume of User-Generated Content
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.ugcVolume}
                      onChange={(e) => updateFormData('ugcVolume', e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="e.g., 10,000"
                    />
                    <select
                      value={formData.volumePeriod}
                      onChange={(e) => updateFormData('volumePeriod', e.target.value)}
                      className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="day">per day</option>
                      <option value="week">per week</option>
                      <option value="month">per month</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-white mb-4">
                    Primary Languages
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Portuguese'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => updateFormData('languages', toggleArrayItem(formData.languages, lang))}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          formData.languages.includes(lang)
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sensitivity Areas */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  Content Sensitivity Areas
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sensitivityOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => updateFormData('sensitivityAreas', toggleArrayItem(formData.sensitivityAreas, option.id))}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.sensitivityAreas.includes(option.id)
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{option.label}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          option.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          option.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          option.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {option.severity}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Compliance Needs */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  Compliance Requirements
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {complianceOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateFormData('complianceNeeds', toggleArrayItem(formData.complianceNeeds, option.id))}
                      className={`p-3 rounded-lg text-sm transition-all ${
                        formData.complianceNeeds.includes(option.id)
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-75">{option.region}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4 font-sora">
                AI-Generated Fit Score & Roadmap
              </h2>
            </div>

            {isGeneratingProfile ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"
                />
                <p className="text-slate-300 text-lg">Analyzing your threat surface...</p>
                <p className="text-slate-500 text-sm mt-2">This may take a moment</p>
              </div>
            ) : formData.threatProfile ? (
              <div className="space-y-6">
                {/* Threat Profile Summary */}
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`p-3 rounded-xl ${
                      formData.threatProfile.riskLevel === 'high' ? 'bg-red-500' :
                      formData.threatProfile.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Threat Profile Analysis</h3>
                      <p className="text-slate-300">
                        You're operating in {formData.threatProfile.primaryThreats.length} high-risk verticals
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">ModGuard Recommends:</h4>
                    <div className="space-y-3">
                      {formData.threatProfile.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              rec.priority === 'high' ? 'bg-red-400' :
                              rec.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                            }`} />
                            <span className="text-white font-medium">• {rec.feature}</span>
                          </div>
                          <span className="text-cyan-400 text-sm">Tier {rec.tier}</span>
                        </div>
                      ))}
                      <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-white font-medium">• Slack + API integration within 72 hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button 
                      onClick={() => setIsStrategyCallOpen(true)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Book a Strategy Session
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4 font-sora">
                Role Mapping & Responsibility Customization
              </h2>
              <p className="text-slate-300 font-inter mb-2">
                You don't need another tool. You need clarity across every role.
              </p>
            </div>

            <div className="space-y-6">
              {/* Suggested Role Mappings */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">AI-Recommended Role Assignments</h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-400 font-medium">Jane (Trust & Safety)</span>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Admin</span>
                    </div>
                    <p className="text-slate-300 text-sm">Access to live alerts dashboard</p>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-400 font-medium">Elias (Communications)</span>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Reporter</span>
                    </div>
                    <p className="text-slate-300 text-sm">Auto-reporting for media inquiries</p>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-400 font-medium">Nina (Legal)</span>
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Auditor</span>
                    </div>
                    <p className="text-slate-300 text-sm">Redacted audit trail + export certificates</p>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-400 font-medium">Ravi (Data)</span>
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">Analyst</span>
                    </div>
                    <p className="text-slate-300 text-sm">Moderation analytics API feed</p>
                  </div>
                </div>
              </div>

              {/* Add Custom Stakeholder */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Add Additional Stakeholders</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="Role/Title"
                    className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <select className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>Access Level</option>
                    <option>Admin</option>
                    <option>Reporter</option>
                    <option>Auditor</option>
                    <option>Analyst</option>
                    <option>Viewer</option>
                  </select>
                </div>
                
                <button className="mt-4 bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                  Add Stakeholder
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4 font-sora">
                Vision-Aligned Launch
              </h2>
              <p className="text-xl text-orange-300 mb-4 font-sora">
                This isn't just onboarding. This is the start of your integrity protocol.
              </p>
            </div>

            <div className="space-y-8">
              {/* Content Upload */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Upload Your First Content Batch (Optional)</h3>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 mb-2">Drop files here or click to upload</p>
                  <p className="text-slate-500 text-sm">Test our analysis with your actual content</p>
                </div>
              </div>

              {/* Launch Timeline */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Schedule Compliance Handoff</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Launch Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Implementation Priority</label>
                    <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option>Standard (2-4 weeks)</option>
                      <option>Expedited (1-2 weeks)</option>
                      <option>Emergency (72 hours)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Activation Deck Preview */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center space-x-4 mb-6">
                  <Award className="h-8 w-8 text-yellow-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">ModGuard Activation Deck</h3>
                    <p className="text-slate-300">Custom use-case simulations for your organization</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                    <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="text-white font-medium">Implementation Guide</h4>
                    <p className="text-slate-400 text-sm">Step-by-step setup</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                    <BarChart3 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <h4 className="text-white font-medium">Success Metrics</h4>
                    <p className="text-slate-400 text-sm">KPIs & benchmarks</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                    <MessageCircle className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="text-white font-medium">Support Channels</h4>
                    <p className="text-slate-400 text-sm">Direct access setup</p>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  {/* Activation Status */}
                  {isActivating && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center space-x-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
                        />
                        <span className="text-blue-300">Activating your ModGuard deployment...</span>
                      </div>
                      <div className="mt-2 text-sm text-blue-400">
                        Setting up API endpoints, configuring threat models, and initializing monitoring systems
                      </div>
                    </div>
                  )}

                  {activationComplete && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                        <span className="text-green-300 font-medium">Deployment Activated Successfully!</span>
                      </div>
                      <div className="mt-2 text-sm text-green-400">
                        Redirecting to your enterprise dashboard...
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleActivateDeployment}
                    disabled={isActivating || activationComplete}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isActivating ? 'Activating...' : activationComplete ? 'Activated!' : 'Activate Your ModGuard Deployment Now'}
                  </motion.button>

                  {/* Try Dashboard Button */}
                  <div className="pt-4 border-t border-slate-700/50">
                    <p className="text-slate-400 text-sm mb-3">
                      Want to explore the dashboard first?
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleTryDashboard}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2 mx-auto"
                    >
                      <span>Try Enterprise Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl border border-slate-700/50 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Building className="h-8 w-8 text-cyan-400" />
                <div>
                  <h1 className="text-xl font-bold text-white font-sora">Enterprise Onboarding</h1>
                  <p className="text-slate-400 text-sm">Step {currentStep} of {totalSteps}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/50 p-6">
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Previous</span>
              </button>

              {currentStep < totalSteps && (
                <button
                  onClick={nextStep}
                  disabled={isGeneratingProfile}
                  className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <span>{currentStep === 1 ? 'Analyze Threat Surface' : 'Next'}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Strategy Call Booking Modal */}
      <StrategyCallBooking
        isOpen={isStrategyCallOpen}
        onClose={() => setIsStrategyCallOpen(false)}
        onComplete={handleStrategyCallComplete}
      />
    </>
  );
};