import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Users,
  Award,
  ArrowRight,
  Mail,
  Calendar,
  Download,
  ExternalLink,
  Zap,
  Globe,
  Brain,
  Target,
  Eye,
  Home,
  Bell,
  Sparkles,
  Gift,
  Crown,
  Heart,
  Rocket
} from 'lucide-react';

interface WaitlistFormData {
  email: string;
  name: string;
  role: string;
  company: string;
  useCase: string;
  updates: string;
  interests: string[];
}

export const EarlyAccess = () => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: '',
    name: '',
    role: '',
    company: '',
    useCase: '',
    updates: 'weekly',
    interests: []
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-2xl"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-8 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to the ModGuard AI Revolution! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            You're now part of an exclusive community of 12,000+ professionals 
            shaping the future of digital authenticity.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">What happens next?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <span className="text-gray-700">Confirmation email sent</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <span className="text-gray-700">{formData.updates === 'weekly' ? 'Weekly' : 'Bi-weekly'} updates begin</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <span className="text-gray-700">Early access invitation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <span className="text-gray-700">Beta launch notification</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <a
              href="https://discord.gg/modguardai"
              className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Join Discord</span>
            </a>
            
            <a
              href="https://twitter.com/modguardai"
              className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              <span>Follow Updates</span>
            </a>
            
            <Link
              to="/student-portal"
              className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Rocket className="h-5 w-5" />
              <span>Join Fellowship</span>
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <Home className="h-5 w-5" />
            <span>Return to Homepage</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">ModGuard AI</span>
          </Link>
          
          <Link
            to="/"
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-8 flex items-center justify-center">
            <Rocket className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Join the <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Digital Defense
            </span> Revolution
          </h1>
          
          <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Be among the first to access the world's most advanced deepfake detection technology
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">VIP Early Access</h3>
              <p className="text-slate-300 text-sm">Get platform access 30 days before public launch</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Gift className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Exclusive Benefits</h3>
              <p className="text-slate-300 text-sm">Free credits, premium features, and special pricing</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Users className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Expert Community</h3>
              <p className="text-slate-300 text-sm">Direct access to AI researchers and industry leaders</p>
            </div>
          </div>
        </motion.div>

        {/* Multi-step Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-white/5 p-6 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Join Beta Waitlist</h2>
              <span className="text-cyan-400 font-medium">Step {currentStep} of {totalSteps}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Tell us about yourself</h3>
                    <p className="text-slate-300">Help us personalize your experience</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Your Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Select your role</option>
                        <option value="ceo">CEO/Founder</option>
                        <option value="cto">CTO/Technical Leader</option>
                        <option value="security">Security Officer</option>
                        <option value="product">Product Manager</option>
                        <option value="developer">Developer/Engineer</option>
                        <option value="researcher">AI Researcher</option>
                        <option value="journalist">Journalist/Editor</option>
                        <option value="educator">Educator/Academic</option>
                        <option value="creator">Content Creator</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Company/Organization</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Your organization"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Use Case & Interests */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">What interests you most?</h3>
                    <p className="text-slate-300">Select all that apply to customize your experience</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-4">Primary Use Case</label>
                    <select
                      value={formData.useCase}
                      onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select primary interest</option>
                      <option value="content-moderation">Content Moderation & Safety</option>
                      <option value="fraud-prevention">Fraud Prevention & Security</option>
                      <option value="identity-verification">Identity Verification</option>
                      <option value="news-verification">News & Media Verification</option>
                      <option value="brand-protection">Brand Protection</option>
                      <option value="compliance">Compliance & Audit</option>
                      <option value="research">Research & Development</option>
                      <option value="education">Education & Training</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-4">Areas of Interest</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { id: 'deepfake-detection', label: 'Deepfake Detection', icon: '🎭' },
                        { id: 'voice-analysis', label: 'Voice Analysis', icon: '🎤' },
                        { id: 'document-verification', label: 'Document Verification', icon: '📄' },
                        { id: 'real-time-analysis', label: 'Real-time Analysis', icon: '⚡' },
                        { id: 'api-integration', label: 'API Integration', icon: '🔗' },
                        { id: 'cultural-context', label: 'Cultural Context', icon: '🌍' },
                        { id: 'enterprise-features', label: 'Enterprise Features', icon: '🏢' },
                        { id: 'ai-ethics', label: 'AI Ethics', icon: '⚖️' },
                        { id: 'research-tools', label: 'Research Tools', icon: '🔬' }
                      ].map((interest) => (
                        <motion.button
                          key={interest.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => toggleInterest(interest.id)}
                          className={`p-4 rounded-lg text-sm transition-all ${
                            formData.interests.includes(interest.id)
                              ? 'bg-cyan-500 text-white'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                        >
                          <div className="text-lg mb-1">{interest.icon}</div>
                          <div className="font-medium">{interest.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preferences & Confirmation */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Almost there!</h3>
                    <p className="text-slate-300">Choose your communication preferences</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-4">Update Frequency</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
                        <input
                          type="radio"
                          value="weekly"
                          checked={formData.updates === 'weekly'}
                          onChange={(e) => setFormData(prev => ({ ...prev, updates: e.target.value }))}
                          className="text-cyan-500"
                        />
                        <div>
                          <div className="text-white font-medium">Weekly Updates</div>
                          <div className="text-slate-400 text-sm">Stay informed with regular insights</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
                        <input
                          type="radio"
                          value="biweekly"
                          checked={formData.updates === 'biweekly'}
                          onChange={(e) => setFormData(prev => ({ ...prev, updates: e.target.value }))}
                          className="text-cyan-500"
                        />
                        <div>
                          <div className="text-white font-medium">Bi-weekly Updates</div>
                          <div className="text-slate-400 text-sm">Less frequent, more curated content</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-cyan-300 mb-4">Your Beta Benefits Include:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "🎯 Priority platform access",
                        "💎 $1,000 in free API credits",
                        "🏆 Exclusive beta user badge",
                        "📚 Advanced training materials",
                        "🤝 Direct access to our team",
                        "🎁 ModGuard AI swag package"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2 text-slate-200">
                          <CheckCircle className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Previous</span>
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!formData.name || !formData.email)) ||
                    (currentStep === 2 && !formData.useCase)
                  }
                  className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5" />
                      <span>Join Beta Waitlist</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">12,000+</div>
              <div className="text-slate-400 text-sm">Beta Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">500+</div>
              <div className="text-slate-400 text-sm">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">50+</div>
              <div className="text-slate-400 text-sm">Countries</div>
            </div>
          </div>
          
          <p className="text-slate-400 text-sm">
            Join industry leaders, researchers, and innovators building the future of digital trust
          </p>
        </motion.div>
      </div>
    </div>
  );
};