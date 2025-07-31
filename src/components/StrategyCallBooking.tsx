import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Building,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Users,
  Brain,
  Sparkles,
  Target,
  Award
} from 'lucide-react';

interface StrategyCallBookingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  industry: string;
  teamSize: string;
  contentVolume: string;
  primaryChallenges: string[];
  urgency: string;
  budget: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
}

export const StrategyCallBooking: React.FC<StrategyCallBookingProps> = ({ 
  isOpen, 
  onClose, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [aiResponse, setAiResponse] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    industry: '',
    teamSize: '',
    contentVolume: '',
    primaryChallenges: [],
    urgency: '',
    budget: '',
    preferredDate: '',
    preferredTime: '',
    timezone: 'PST'
  });

  const totalSteps = 4;

  const industries = [
    'News & Media', 'Social Media Platform', 'E-commerce', 'Financial Services',
    'Healthcare', 'Education', 'Government', 'Entertainment', 'Other'
  ];

  const challenges = [
    'Deepfake Detection', 'Content Moderation at Scale', 'Cultural Sensitivity',
    'Regulatory Compliance', 'Brand Safety', 'Crisis Management', 'API Integration',
    'Real-time Analysis', 'Multi-language Support', 'Custom Model Training'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  // AI Agent Responses
  const getAiResponse = (step: number, data: FormData) => {
    switch (step) {
      case 1:
        return `Hello ${data.name}! I'm Alex, your ModGuard AI strategy consultant. I see you're from ${data.company} in the ${data.industry} industry. Based on your role as ${data.role}, I'm already identifying some key areas where ModGuard AI can transform your content safety operations. Let's dive deeper into your specific challenges.`;
      
      case 2:
        const volumeInsight = data.contentVolume === 'high' ? 
          'With high-volume content, you\'ll benefit significantly from our real-time processing capabilities.' :
          'Your content volume is perfect for our advanced analysis features.';
        
        return `${volumeInsight} I notice you selected ${data.primaryChallenges.join(', ')} as primary challenges. These are exactly the areas where we've seen 300% efficiency improvements with similar ${data.industry} companies. Our AI models are specifically trained for these scenarios.`;
      
      case 3:
        const urgencyResponse = data.urgency === 'immediate' ?
          'Given your immediate timeline, I recommend our Express Implementation package. We can have you operational within 72 hours.' :
          'Perfect timing! This allows us to implement a comprehensive solution with custom training.';
        
        return `${urgencyResponse} Based on your budget range and requirements, I'm already crafting a tailored proposal that will deliver ROI within the first quarter. Let's schedule our strategy session to finalize your custom ModGuard deployment.`;
      
      default:
        return 'Thank you for providing all the details. I\'m excited to discuss how ModGuard AI will revolutionize your content safety operations!';
    }
  };

  // Simulate AI typing effect
  const simulateAiTyping = (response: string) => {
    setIsAiTyping(true);
    setAiResponse('');
    
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < response.length) {
        setAiResponse(prev => prev + response[index]);
        index++;
      } else {
        clearInterval(typingInterval);
        setIsAiTyping(false);
      }
    }, 30);
  };

  const updateFormData = (key: string, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    
    // Trigger AI response when key fields are filled
    if ((key === 'role' && value) || (key === 'industry' && value)) {
      setTimeout(() => {
        const response = getAiResponse(currentStep, newData);
        simulateAiTyping(response);
      }, 500);
    }
  };

  const toggleChallenge = (challenge: string) => {
    const updated = formData.primaryChallenges.includes(challenge)
      ? formData.primaryChallenges.filter(c => c !== challenge)
      : [...formData.primaryChallenges, challenge];
    updateFormData('primaryChallenges', updated);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      
      // Trigger AI response for next step
      setTimeout(() => {
        const response = getAiResponse(currentStep + 1, formData);
        simulateAiTyping(response);
      }, 800);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Simulate booking confirmation
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Let's Get Acquainted</h2>
              <p className="text-slate-300">Tell us about yourself and your organization</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Work Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateFormData('company', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => updateFormData('role', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select your role</option>
                  <option value="CEO/Founder">CEO/Founder</option>
                  <option value="CTO">CTO</option>
                  <option value="VP Engineering">VP Engineering</option>
                  <option value="Head of Trust & Safety">Head of Trust & Safety</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Security Officer">Security Officer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Industry *</label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateFormData('industry', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Understanding Your Challenges</h2>
              <p className="text-slate-300">Help us tailor the perfect solution for your needs</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Team Size</label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => updateFormData('teamSize', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select team size</option>
                    <option value="1-10">1-10 people</option>
                    <option value="11-50">11-50 people</option>
                    <option value="51-200">51-200 people</option>
                    <option value="201-1000">201-1000 people</option>
                    <option value="1000+">1000+ people</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Content Volume</label>
                  <select
                    value={formData.contentVolume}
                    onChange={(e) => updateFormData('contentVolume', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select volume</option>
                    <option value="low">&lt; 10K items/month</option>
                    <option value="medium">10K - 100K items/month</option>
                    <option value="high">100K - 1M items/month</option>
                    <option value="enterprise">1M+ items/month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4 text-center">Primary Challenges (Select all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {challenges.map(challenge => (
                    <motion.button
                      key={challenge}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => toggleChallenge(challenge)}
                      className={`p-3 rounded-lg text-sm transition-all ${
                        formData.primaryChallenges.includes(challenge)
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {challenge}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Project Scope & Timeline</h2>
              <p className="text-slate-300">Let's align on your implementation needs</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4 text-center">Implementation Urgency</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'immediate', label: 'Immediate (< 1 month)', color: 'from-red-500 to-orange-500' },
                    { value: 'soon', label: 'Soon (1-3 months)', color: 'from-yellow-500 to-orange-500' },
                    { value: 'planning', label: 'Planning (3+ months)', color: 'from-green-500 to-teal-500' }
                  ].map(option => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => updateFormData('urgency', option.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.urgency === option.value
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-full mx-auto mb-3`} />
                      <div className="text-white font-medium text-sm">{option.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-slate-300 mb-2 text-center">Budget Range (Annual)</label>
                <select
                  value={formData.budget}
                  onChange={(e) => updateFormData('budget', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select budget range</option>
                  <option value="under-50k">Under $50K</option>
                  <option value="50k-100k">$50K - $100K</option>
                  <option value="100k-250k">$100K - $250K</option>
                  <option value="250k-500k">$250K - $500K</option>
                  <option value="500k+">$500K+</option>
                  <option value="enterprise">Enterprise (Custom)</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Schedule Your Strategy Session</h2>
              <p className="text-slate-300">Choose your preferred time for a personalized consultation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Date</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => updateFormData('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Time</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => updateFormData('preferredTime', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => updateFormData('timezone', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="PST">Pacific (PST)</option>
                  <option value="MST">Mountain (MST)</option>
                  <option value="CST">Central (CST)</option>
                  <option value="EST">Eastern (EST)</option>
                  <option value="GMT">GMT</option>
                  <option value="CET">Central European (CET)</option>
                </select>
              </div>
            </div>

            {/* Call Preview */}
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Your Strategy Session Will Include:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">Custom threat assessment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">ROI projection analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">Implementation roadmap</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">Live platform demo</span>
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
              <Shield className="h-8 w-8 text-cyan-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Strategy Call Booking</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Form - Centered */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>

            {/* AI Agent Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 sticky top-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Alex</h3>
                    <p className="text-slate-400 text-sm">Strategy Consultant</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 min-h-[200px]">
                  {aiResponse && (
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {aiResponse}
                    </p>
                  )}
                  {isAiTyping && (
                    <div className="flex items-center space-x-1 mt-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  )}
                </div>

                {/* Value Props */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="h-4 w-4 text-yellow-400" />
                    <span className="text-slate-300">99.2% accuracy rate</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    <span className="text-slate-300">127ms response time</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">50+ cultural contexts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/50 p-6">
          <div className="flex justify-center">
            <div className="flex justify-between w-full max-w-md">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>Previous</span>
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <span>Next</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Strategy Call</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};