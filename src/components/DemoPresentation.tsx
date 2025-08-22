import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize,
  X,
  Shield,
  Globe,
  Brain,
  Target,
  Zap,
  Eye,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Users,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Award,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

interface DemoPresentationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoSlide {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  duration: number;
  background: string;
}

export const DemoPresentation: React.FC<DemoPresentationProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);

  const handleTryDashboard = () => {
    window.location.href = '/dashboard';
  };

  const slides: DemoSlide[] = [
    {
      id: 'intro',
      title: 'ModGuard AI',
      subtitle: 'Defending Reality with AI-Powered Content Moderation',
      duration: 8,
      background: 'from-blue-900 via-purple-900 to-indigo-900',
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-8 flex items-center justify-center">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-2xl text-cyan-100 font-inter">
              Advanced deepfake detection and cultural-aware content moderation
            </p>
            <p className="text-xl text-white/80 font-inter">
              Protecting truth at global scale with 99.2% accuracy
            </p>
            
            {/* Try Dashboard Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTryDashboard}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Try Enterprise Dashboard</span>
              <ExternalLink className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      )
    },
    {
      id: 'problem',
      title: 'The Challenge We Face',
      subtitle: 'Digital misinformation is spreading faster than ever',
      duration: 10,
      background: 'from-red-900 via-orange-900 to-yellow-900',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-6"
            >
              <AlertTriangle className="h-8 w-8 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">847% Increase</h3>
              <p className="text-red-200">in deepfake content since 2023</p>
            </motion.div>
            
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-6"
            >
              <Globe className="h-8 w-8 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">73% of Users</h3>
              <p className="text-orange-200">can't distinguish AI-generated content</p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="relative">
              <div className="w-64 h-64 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full mx-auto flex items-center justify-center border-4 border-red-500/30">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">2.3B</div>
                  <div className="text-red-200">People Affected</div>
                  <div className="text-red-200 text-sm">by misinformation daily</div>
                </div>
              </div>
              
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-400/50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border-2 border-orange-400/50"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: 'solution',
      title: 'Our AI-Powered Solution',
      subtitle: 'Four pillars of digital truth protection',
      duration: 12,
      background: 'from-blue-900 via-cyan-900 to-teal-900',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: Shield,
              title: 'Deepfake Detection',
              description: '99.2% accuracy in identifying synthetic media',
              color: 'from-blue-500 to-cyan-500',
              delay: 0.2
            },
            {
              icon: Globe,
              title: 'Cultural Context',
              description: 'Understanding nuances across 50+ regions',
              color: 'from-cyan-500 to-teal-500',
              delay: 0.4
            },
            {
              icon: Brain,
              title: 'Explainable AI',
              description: 'Transparent decisions with detailed explanations',
              color: 'from-teal-500 to-green-500',
              delay: 0.6
            },
            {
              icon: Target,
              title: 'Threat Forecasting',
              description: 'Predicting emerging threats 72 hours ahead',
              color: 'from-green-500 to-blue-500',
              delay: 0.8
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: feature.delay }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-cyan-100">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'demo-analysis',
      title: 'Live Content Analysis Demo',
      subtitle: 'Watch our AI analyze content in real-time',
      duration: 15,
      background: 'from-purple-900 via-indigo-900 to-blue-900',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Simulated Content Upload */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-bold text-white mb-4">Content Upload</h3>
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">political_speech.mp4</div>
                    <div className="text-gray-400 text-sm">2.3 MB • Video</div>
                  </div>
                </div>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 3 }}
                  className="w-full bg-gray-700 rounded-full h-2 mb-2"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"></div>
                </motion.div>
                <div className="text-purple-300 text-sm">Analyzing content...</div>
              </div>
            </motion.div>

            {/* Analysis Results */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-bold text-white mb-4">Analysis Results</h3>
              
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-300 font-medium">Authentic Content</span>
                  </div>
                  <div className="text-sm text-green-200">Confidence: 96.8%</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">Deepfake Score</span>
                    <span className="text-green-400 font-bold">3.2%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '3.2%' }}
                      transition={{ delay: 3, duration: 1 }}
                      className="bg-green-500 h-2 rounded-full"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">Cultural Sensitivity</span>
                    <span className="text-blue-400 font-bold">Safe</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    No cultural flags detected across 12 regions
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Real-time Metrics */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-lg font-bold text-white mb-6 text-center">Real-time Processing Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Processing Time', value: '127ms', icon: Clock, color: 'text-cyan-400' },
                { label: 'Accuracy Rate', value: '99.2%', icon: Target, color: 'text-green-400' },
                { label: 'Threats Detected', value: '2,847', icon: Shield, color: 'text-red-400' },
                { label: 'Content Analyzed', value: '1.2M', icon: BarChart3, color: 'text-purple-400' }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2 + index * 0.2, type: "spring" }}
                  className="text-center"
                >
                  <metric.icon className={`h-8 w-8 ${metric.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="text-gray-300 text-sm">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: 'impact',
      title: 'Global Impact & Results',
      subtitle: 'Protecting millions of users worldwide',
      duration: 10,
      background: 'from-green-900 via-teal-900 to-blue-900',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: '127M+',
                subtitle: 'Users Protected',
                description: 'Across 50+ countries',
                color: 'from-blue-500 to-cyan-500',
                delay: 0.2
              },
              {
                icon: Shield,
                title: '2.4M+',
                subtitle: 'Threats Blocked',
                description: 'In the last 30 days',
                color: 'from-green-500 to-teal-500',
                delay: 0.4
              },
              {
                icon: TrendingUp,
                title: '99.2%',
                subtitle: 'Accuracy Rate',
                description: 'Industry-leading precision',
                color: 'from-purple-500 to-pink-500',
                delay: 0.6
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: stat.delay }}
                className="text-center"
              >
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${stat.color} mb-4`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.title}</div>
                <div className="text-xl text-cyan-200 mb-2">{stat.subtitle}</div>
                <div className="text-gray-300">{stat.description}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Trusted by Industry Leaders</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
              {['🏛️', '📘', '🔍', '📰', '🏫', '🏥'].map((logo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  className="text-4xl opacity-70 hover:opacity-100 transition-opacity"
                >
                  {logo}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: 'cta',
      title: 'Ready to Defend Digital Truth?',
      subtitle: 'Join the next generation of content safety technology',
      duration: 8,
      background: 'from-purple-900 via-blue-900 to-indigo-900',
      content: (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto mb-8 flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <p className="text-2xl text-cyan-100 font-inter max-w-3xl mx-auto">
              Experience the future of AI-powered content moderation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTryDashboard}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>Try Enterprise Dashboard</span>
                <ExternalLink className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-cyan-400 text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-400/10 transition-all"
              >
                Join the Fellowship
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {[
              { icon: Award, text: '99.9% Uptime SLA' },
              { icon: Zap, text: 'Real-time Processing' },
              { icon: Globe, text: 'Global Deployment' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 text-cyan-200">
                <feature.icon className="h-5 w-5" />
                <span>{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      )
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setSlideProgress(prev => {
          const newProgress = prev + (100 / (slides[currentSlide].duration * 10));
          
          if (newProgress >= 100) {
            if (currentSlide < slides.length - 1) {
              setCurrentSlide(curr => curr + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSlide, isOpen, slides]);

  // Update overall progress
  useEffect(() => {
    const totalProgress = ((currentSlide * 100) + slideProgress) / slides.length;
    setProgress(totalProgress);
  }, [currentSlide, slideProgress, slides.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSlideProgress(0);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setSlideProgress(0);
    }
  };

  const handleSlideSelect = (index: number) => {
    setCurrentSlide(index);
    setSlideProgress(0);
  };

  if (!isOpen) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header Controls */}
      <div className="bg-black/80 backdrop-blur-md border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-cyan-400" />
              <span className="text-white font-bold">ModGuard AI Demo</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlide === 0}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className="p-2 text-white hover:text-cyan-400 transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              
              <button
                onClick={handleNextSlide}
                disabled={currentSlide === slides.length - 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-400">
              {currentSlide + 1} / {slides.length}
            </div>
            
            <button
              onClick={handleTryDashboard}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <span>Try Dashboard</span>
              <ExternalLink className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-800 rounded-full h-1">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          {/* Slide Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideSelect(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-cyan-400' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.background} flex items-center justify-center p-8`}
          >
            <div className="max-w-7xl mx-auto w-full">
              {/* Slide Header */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-sora">
                  {currentSlideData.title}
                </h1>
                {currentSlideData.subtitle && (
                  <p className="text-xl md:text-2xl text-cyan-200 font-inter">
                    {currentSlideData.subtitle}
                  </p>
                )}
              </motion.div>

              {/* Slide Content */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {currentSlideData.content}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden bg-black/80 backdrop-blur-md border-t border-gray-800 p-4">
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
            className="p-3 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack className="h-6 w-6" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          
          <button
            onClick={handleNextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-3 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipForward className="h-6 w-6" />
          </button>
        </div>
        
        <div className="text-center mt-2 text-sm text-gray-400">
          {currentSlide + 1} of {slides.length}
        </div>
        
        <div className="mt-3 text-center">
          <button
            onClick={handleTryDashboard}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
          >
            <span>Try Dashboard</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};