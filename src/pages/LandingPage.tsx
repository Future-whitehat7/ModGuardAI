import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Header } from '../components/Header';
import { Shield, Globe, Zap, Users, Brain, Eye, CheckCircle, ArrowRight, Upload, PlayCircle, AlertTriangle, Clock, TrendingUp, Code, GraduationCap as Graduation, Building, School, Newspaper, Target, Award, Fingerprint, Scan, Activity, Lock, Layers, Cpu, Database, Network, Radar, Crosshair } from 'lucide-react';
import { DemoPresentation } from '../components/DemoPresentation';
import { EnterpriseOnboarding } from '../components/EnterpriseOnboarding';
import { FellowshipOnboarding } from '../components/FellowshipOnboarding';

export const LandingPage: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
  const [isFellowshipModalOpen, setIsFellowshipModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scanProgress, setScanProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Track mouse movement for energy flow effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Biometric scanning animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const openDemo = () => setIsDemoOpen(true);
  const closeDemo = () => setIsDemoOpen(false);
  
  const openEnterpriseModal = () => setIsEnterpriseModalOpen(true);
  const closeEnterpriseModal = () => setIsEnterpriseModalOpen(false);
  
  const openFellowshipModal = () => setIsFellowshipModalOpen(true);
  const closeFellowshipModal = () => setIsFellowshipModalOpen(false);

  const handleEnterpriseComplete = () => {
    closeEnterpriseModal();
  };

  return (
    <div className="overflow-hidden bg-slate-900">
      {/* Enhanced Navigation Header */}
      <Header 
        onWatchDemo={openDemo}
        onOpenEnterpriseModal={openEnterpriseModal}
        onOpenFellowshipModal={openFellowshipModal}
      />

      {/* Hero Section with Dramatic AI Visual */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 25%, #334155 50%, #1E293B 75%, #0F172A 100%)' }}
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, #00D4FF 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, #FF6B35 1px, transparent 1px),
                linear-gradient(90deg, transparent 48%, rgba(0, 212, 255, 0.1) 50%, transparent 52%)
              `,
              backgroundSize: '60px 60px, 40px 40px, 100px 100px'
            }}
            animate={{
              backgroundPosition: [
                '0% 0%, 0% 0%, 0% 0%',
                '100% 100%, -100% -100%, 100% 0%'
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Energy Flow Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Orange Energy Streams */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`orange-${i}`}
              className="absolute w-1 h-32 bg-gradient-to-b from-transparent via-orange-400 to-transparent opacity-30"
              style={{
                left: `${15 + i * 15}%`,
                top: '10%',
                transform: `rotate(${mousePosition.x * 0.1 + i * 30}deg)`
              }}
              animate={{
                scaleY: [0.5, 1.5, 0.5],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Blue Energy Streams */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`blue-${i}`}
              className="absolute w-1 h-48 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40"
              style={{
                right: `${10 + i * 20}%`,
                bottom: '20%',
                transform: `rotate(${-mousePosition.y * 0.1 + i * 45}deg)`
              }}
              animate={{
                scaleY: [1, 2, 1],
                opacity: [0.3, 0.9, 0.3]
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Central AI Entity Visual */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-left lg:text-left"
            >
              {/* Brand Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md mb-6"
              >
                <Shield className="h-4 w-4 text-cyan-400 mr-2" />
                <span className="text-cyan-400 text-sm font-medium">Enterprise-Grade AI Protection</span>
              </motion.div>

              {/* Main Headlines */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl lg:text-8xl font-bold mb-4"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <span className="block text-white">ModGuard</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  AI
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-3xl lg:text-4xl font-bold text-orange-400 mb-6 tracking-wider"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                DEEPFAKE GUARDIAN
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl lg:text-2xl text-slate-300 mb-6 font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                AI-Powered Deepfake Detection & Cultural Context Analysis
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Protect your digital integrity with cutting-edge AI that detects synthetic media, 
                understands cultural context, and ensures real-time threat intelligence across all platforms.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {/* Primary CTA - Upload & Detect */}
                <motion.button
                  onClick={openEnterpriseModal}
                  className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative z-10 flex items-center justify-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload & Detect</span>
                  </div>
                  
                  {/* Animated Border */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-cyan-400/50"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.button>

                {/* Secondary CTA - Explore API */}
                <motion.button
                  onClick={openDemo}
                  className="relative px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-medium text-lg rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <PlayCircle className="h-5 w-5" />
                    <span>View Live Demo</span>
                  </div>
                  
                  {/* Wireframe Border Effect */}
                  <div className="absolute inset-0 rounded-xl border border-cyan-400/0 group-hover:border-cyan-400/50 transition-colors duration-300" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Dramatic AI Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative h-96 lg:h-[600px]"
            >
              {/* Central AI Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative w-80 h-80 lg:w-96 lg:h-96"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                  {/* Outer Energy Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  {/* Middle Energy Ring */}
                  <motion.div
                    className="absolute inset-8 rounded-full border-2 border-orange-400/40"
                    animate={{
                      scale: [1.1, 1, 1.1],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Inner Core */}
                  <motion.div
                    className="absolute inset-16 rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-500/30 to-purple-600/20 backdrop-blur-md border border-white/20"
                    animate={{
                      boxShadow: [
                        '0 0 40px rgba(0, 212, 255, 0.3)',
                        '0 0 80px rgba(255, 107, 53, 0.4)',
                        '0 0 40px rgba(0, 212, 255, 0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {/* AI Eye/Core */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"
                        animate={{
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            '0 0 20px rgba(0, 212, 255, 0.5)',
                            '0 0 40px rgba(0, 212, 255, 0.8)',
                            '0 0 20px rgba(0, 212, 255, 0.5)'
                          ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Eye className="h-12 w-12 text-white" />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Biometric Scanning Elements */}
              <div className="absolute inset-0">
                {/* Corner Scanning Brackets */}
                {[
                  { position: 'top-4 left-4', rotate: 0 },
                  { position: 'top-4 right-4', rotate: 90 },
                  { position: 'bottom-4 right-4', rotate: 180 },
                  { position: 'bottom-4 left-4', rotate: 270 }
                ].map((corner, i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${corner.position} w-8 h-8`}
                    style={{ transform: `rotate(${corner.rotate}deg)` }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                  >
                    <div className="w-full h-2 bg-gradient-to-r from-cyan-400 to-transparent" />
                    <div className="w-2 h-full bg-gradient-to-b from-cyan-400 to-transparent" />
                  </motion.div>
                ))}

                {/* Scanning Lines */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div 
                    className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    style={{ top: `${scanProgress}%` }}
                  />
                  <div 
                    className="absolute inset-y-0 w-0.5 bg-gradient-to-b from-transparent via-orange-400 to-transparent"
                    style={{ left: `${scanProgress}%` }}
                  />
                </motion.div>
              </div>

              {/* Floating Data Elements */}
              <div className="absolute inset-0">
                {[
                  { icon: Fingerprint, pos: 'top-8 right-16', delay: 0 },
                  { icon: Shield, pos: 'bottom-12 left-8', delay: 1 },
                  { icon: Brain, pos: 'top-16 left-12', delay: 2 },
                  { icon: Radar, pos: 'bottom-8 right-12', delay: 1.5 }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${item.pos} p-3 bg-white/5 backdrop-blur-md rounded-xl border border-cyan-400/30`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      y: [-10, 0, -10]
                    }}
                    transition={{ 
                      duration: 4, 
                      delay: item.delay, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <item.icon className="h-6 w-6 text-cyan-400" />
                  </motion.div>
                ))}
              </div>

              {/* Wireframe Network Connections */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="wireframe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#FF6B35" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                
                {/* Animated Connection Lines */}
                <motion.path
                  d="M50,50 Q200,100 350,150 T500,200"
                  stroke="url(#wireframe-gradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="10,5"
                  animate={{
                    strokeDashoffset: [0, -100]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.path
                  d="M150,300 Q250,200 400,250 T600,300"
                  stroke="url(#wireframe-gradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,4"
                  animate={{
                    strokeDashoffset: [0, 100]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </svg>
            </motion.div>
          </div>

          {/* Real-time Metrics Display */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { 
                value: '99.2%', 
                label: 'Detection Accuracy', 
                icon: Target,
                gradient: 'from-cyan-400 to-blue-500'
              },
              { 
                value: '127ms', 
                label: 'Avg. Response Time', 
                icon: Zap,
                gradient: 'from-orange-400 to-red-500'
              },
              { 
                value: '50+', 
                label: 'Cultural Contexts', 
                icon: Globe,
                gradient: 'from-purple-400 to-pink-500'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Background Energy Flow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {stat.value}
                    </div>
                    <div className="text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {stat.label}
                    </div>
                  </div>
                </div>

                {/* Scanning Line Effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    delay: index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Background Particle System */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
        {/* Section Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Enterprise-Grade AI Protection
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Advanced synthetic media detection with cultural intelligence and real-time threat response
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Brain, 
                title: 'Deepfake Detection',
                description: 'Advanced neural networks identify synthetic video, audio, and images with 99.2% accuracy and explainable AI reasoning.',
                gradient: 'from-cyan-400 to-blue-500',
                borderGlow: 'border-cyan-400/30'
              },
              { 
                icon: Globe, 
                title: 'Cultural Context AI',
                description: 'Analyze content within 50+ cultural frameworks to ensure appropriate moderation across global audiences.',
                gradient: 'from-green-400 to-teal-500',
                borderGlow: 'border-green-400/30'
              },
              { 
                icon: Zap, 
                title: 'Real-time Processing',
                description: 'Lightning-fast analysis with 127ms average response time and 99.9% uptime for mission-critical applications.',
                gradient: 'from-orange-400 to-red-500',
                borderGlow: 'border-orange-400/30'
              },
              { 
                icon: AlertTriangle, 
                title: 'Threat Intelligence',
                description: 'Comprehensive database of emerging deepfake patterns with predictive detection and early warning systems.',
                gradient: 'from-purple-400 to-pink-500',
                borderGlow: 'border-purple-400/30'
              },
              { 
                icon: Lock, 
                title: 'Compliance & Ethics',
                description: 'Built-in ethical guidelines and regulatory compliance for GDPR, CCPA, and industry-specific standards.',
                gradient: 'from-blue-400 to-indigo-500',
                borderGlow: 'border-blue-400/30'
              },
              { 
                icon: Users, 
                title: 'Team Collaboration',
                description: 'Multi-user workflows with review queues, version history, and collaborative decision-making tools.',
                gradient: 'from-emerald-400 to-cyan-500',
                borderGlow: 'border-emerald-400/30'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className={`relative group p-8 bg-white/5 backdrop-blur-md rounded-2xl border ${feature.borderGlow} hover:border-opacity-60 transition-all duration-500 overflow-hidden`}
              >
                {/* Background Energy Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Wireframe Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id={`grid-${index}`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#grid-${index})`} />
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {feature.description}
                  </p>

                  {/* Scanning Line Effect */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100`}
                    initial={{ x: '-100%' }}
                    whileInView={{ x: '100%' }}
                    transition={{
                      duration: 1.5,
                      delay: index * 0.2,
                      ease: "easeInOut"
                    }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Showcase */}
      <section className="py-24 bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Tailored <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Purpose-built AI protection for every industry and use case
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Users,
                title: 'For Creators',
                subtitle: 'Protect Your Authentic Voice',
                description: 'Content verification, copyright protection, and identity safeguarding for digital creators.',
                features: ['Identity Verification', 'Content Authentication', 'Copyright Protection', 'Deepfake Alerts'],
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Building,
                title: 'For Brands & Enterprises',
                subtitle: 'Safeguard Brand Integrity',
                description: 'Corporate deepfake monitoring, reputation management, and employee protection.',
                features: ['Brand Monitoring', 'Executive Protection', 'Corporate Security', 'Compliance Tools'],
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Graduation,
                title: 'For Governments & Policy Makers',
                subtitle: 'Secure Democratic Processes',
                description: 'Election integrity, public communication verification, and citizen protection.',
                features: ['Election Security', 'Public Communication', 'Citizen Protection', 'Policy Compliance'],
                gradient: 'from-green-500 to-teal-500'
              },
              {
                icon: School,
                title: 'For Educators / Journalists',
                subtitle: 'Ensure Information Accuracy',
                description: 'News verification, educational content authenticity, and information integrity.',
                features: ['News Verification', 'Educational Content', 'Source Authentication', 'Fact Checking'],
                gradient: 'from-orange-500 to-red-500'
              }
            ].map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${solution.gradient} mb-6`}>
                    <solution.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {solution.title}
                  </h3>
                  
                  <h4 className={`text-lg font-semibold mb-4 bg-gradient-to-r ${solution.gradient} bg-clip-text text-transparent`}>
                    {solution.subtitle}
                  </h4>
                  
                  <p className="text-slate-300 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {solution.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {solution.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-cyan-400" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 px-6 bg-white/10 backdrop-blur-md rounded-lg text-white font-medium hover:bg-white/20 transition-all duration-300 group/btn">
                    <div className="flex items-center justify-center space-x-2">
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Transparency Dashboard */}
      <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Live <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Transparency</span> Dashboard
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Real-time metrics demonstrating our commitment to ethical AI and transparent operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Real-time Metrics */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 h-full">
                <h3 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Global Detection Activity
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Threats Detected', value: '2,847', change: '+12%', color: 'text-red-400' },
                    { label: 'Content Analyzed', value: '127K', change: '+8%', color: 'text-cyan-400' },
                    { label: 'Clean Content', value: '97.8%', change: '+2%', color: 'text-green-400' },
                    { label: 'Response Time', value: '127ms', change: '-5%', color: 'text-orange-400' }
                  ].map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <div className={`text-2xl font-bold ${metric.color} mb-1`}>
                        {metric.value}
                      </div>
                      <div className="text-slate-400 text-sm mb-2">{metric.label}</div>
                      <div className="text-xs text-green-400">{metric.change}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Simulated Real-time Chart */}
                <div className="relative h-32 bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-end justify-between h-full">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
                        style={{ width: '6%' }}
                        animate={{
                          height: [`${20 + Math.random() * 60}%`, `${30 + Math.random() * 50}%`]
                        }}
                        transition={{
                          duration: 2 + Math.random(),
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ethics & Compliance Status */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Ethics Score
                </h3>
                
                <div className="relative">
                  <svg className="w-32 h-32 mx-auto">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#ethics-gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 56 * 0.08 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="ethics-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00D4FF" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">92%</div>
                      <div className="text-sm text-slate-400">Ethical AI</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Compliance Status
                </h3>
                
                <div className="space-y-3">
                  {[
                    { name: 'GDPR', status: 'Compliant', color: 'text-green-400' },
                    { name: 'CCPA', status: 'Compliant', color: 'text-green-400' },
                    { name: 'SOC 2', status: 'Verified', color: 'text-blue-400' },
                    { name: 'ISO 27001', status: 'Certified', color: 'text-purple-400' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-300">{item.name}</span>
                      <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Innovation */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Community & <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Innovation</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Join our global community of researchers, developers, and innovators protecting digital truth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* AI Fellowship */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-2xl border border-purple-400/20 p-8 hover:border-purple-400/40 transition-all duration-500"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <Graduation className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    AI Fellowship Program
                  </h3>
                  <p className="text-purple-300">Shaping the next generation of AI guardians</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Join our student-focused AI research initiative working on real-world deepfake detection projects 
                with mentorship and career development opportunities.
              </p>
              
              <div className="space-y-3 mb-6">
                {[
                  'Research Projects',
                  'Mentorship Program',
                  'Career Development',
                  'Global Community'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={openFellowshipModal}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Apply to Join Fellowship
              </button>
            </motion.div>

            {/* Deepfake Challenge */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-md rounded-2xl border border-orange-400/20 p-8 hover:border-orange-400/40 transition-all duration-500"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Global Deepfake Challenge
                  </h3>
                  <p className="text-orange-300">Test your detection skills</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Participate in our global competition for deepfake detection algorithms. 
                Compete on our live leaderboard and contribute to community-driven innovation.
              </p>
              
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">12,847</div>
                    <div className="text-slate-400 text-sm">Participants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">67</div>
                    <div className="text-slate-400 text-sm">Countries</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 px-6 bg-white/10 backdrop-blur-md text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300">
                  View Leaderboard
                </button>
                <button className="py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300">
                  Take Challenge
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Dramatic Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 via-transparent to-orange-500/5" />
          
          {/* Energy Streams */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
              style={{ left: `${10 + i * 12}%` }}
              animate={{
                opacity: [0, 1, 0],
                scaleY: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Ready to Defend
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Digital Reality?
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Join the organizations setting the gold standard for content authenticity and digital trust. 
              Protect what matters most with AI that understands context, culture, and consequence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* Primary CTA */}
              <motion.button
                onClick={openEnterpriseModal}
                className="relative px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold text-xl rounded-2xl overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative z-10 flex items-center space-x-3">
                  <Upload className="h-6 w-6" />
                  <span>Start Enterprise Trial</span>
                </div>
                
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Pulse Border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-cyan-400/50"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                onClick={openFellowshipModal}
                className="relative px-10 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-medium text-xl rounded-2xl hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-3">
                  <Graduation className="h-6 w-6" />
                  <span>Join AI Fellowship</span>
                </div>
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-16 flex flex-wrap justify-center items-center gap-8"
            >
              {[
                { label: 'SOC 2 Compliant', icon: Shield },
                { label: '99.9% Uptime SLA', icon: Activity },
                { label: 'Global Deployment', icon: Globe },
                { label: '24/7 Support', icon: Clock }
              ].map((trust, index) => (
                <div key={index} className="flex items-center space-x-2 text-slate-400">
                  <trust.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{trust.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <DemoPresentation isOpen={isDemoOpen} onClose={closeDemo} />
      
      <EnterpriseOnboarding 
        isOpen={isEnterpriseModalOpen} 
        onClose={closeEnterpriseModal} 
        onComplete={handleEnterpriseComplete} 
      />
      
      <FellowshipOnboarding 
        isOpen={isFellowshipModalOpen} 
        onClose={closeFellowshipModal} 
        onComplete={() => closeFellowshipModal()} 
      />
    </div>
  );
};

export default LandingPage;