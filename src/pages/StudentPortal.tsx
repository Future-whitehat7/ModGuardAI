import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Shield,
  Globe,
  Heart,
  Zap,
  Users,
  Code,
  Palette,
  Brain,
  Target,
  ArrowRight,
  Play,
  Star,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Lightbulb,
  Award,
  Sparkles
} from 'lucide-react';

export const StudentPortal = () => {
  const [countdown, setCountdown] = useState({ days: 6, hours: 14, minutes: 23, seconds: 45 });
  const [chatOpen, setChatOpen] = useState(false);
  const [userType, setUserType] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I\'m here to help you discover how your unique talents can protect truth at global scale. What\'s your superpower?' }
  ]);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChatResponse = (type: string) => {
    setUserType(type);
    let botResponse = '';
    
    switch(type) {
      case 'designer':
        botResponse = 'The way you see the world could help protect it. Your creative vision could be the difference between truth and deception for millions. Let\'s match your creative gifts to a mission that matters.';
        break;
      case 'engineer':
        botResponse = 'Your code could shield a billion people from misinformation. Every algorithm you write, every system you build, could be the guardian standing between truth and chaos.';
        break;
      case 'strategist':
        botResponse = 'Your strategic mind could shape how humanity navigates the age of AI. Help us build systems that don\'t just detect threats, but prevent them before they spread.';
        break;
      case 'researcher':
        botResponse = 'Your curiosity could unlock the next breakthrough in truth verification. Join us in pushing the boundaries of what\'s possible in AI safety and content authenticity.';
        break;
      default:
        botResponse = 'Whatever your gift, we believe it has a purpose. At ModGuard AI, every talent finds its calling in protecting what matters most: truth itself.';
    }
    
    setChatMessages(prev => [
      ...prev,
      { type: 'user', message: `I'm a ${type}` },
      { type: 'bot', message: botResponse }
    ]);
  };

  const projects = [
    {
      title: 'Real-Time Election Protection',
      description: 'AI system that prevented 847 deepfake videos from spreading during critical election periods',
      impact: 'Protected democratic processes in 12 countries',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Cultural Context Engine',
      description: 'Machine learning model that understands cultural nuances across 50+ regions',
      impact: 'Prevented cultural misunderstandings that could have sparked conflicts',
      icon: Globe,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Youth Safety Protocol',
      description: 'Advanced detection system protecting young users from harmful synthetic content',
      impact: 'Safeguarded over 2.3M young people from psychological manipulation',
      icon: Heart,
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Crisis Response Network',
      description: 'Emergency content verification during natural disasters and humanitarian crises',
      impact: 'Ensured accurate information flow during 23 major crisis events',
      icon: Zap,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const talents = [
    { icon: Code, label: 'Engineer', description: 'Build the algorithms that protect truth' },
    { icon: Palette, label: 'Designer', description: 'Create interfaces that make safety intuitive' },
    { icon: Brain, label: 'Researcher', description: 'Discover new ways to detect deception' },
    { icon: Target, label: 'Strategist', description: 'Shape how we deploy protection globally' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold font-sora bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ModGuard AI
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors font-inter"
              >
                <Shield className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-sora mb-8 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Use Your Talent
              </span>
              <br />
              <span className="text-white">
                to Protect
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                a Billion Lives
              </span>
            </h1>
            
            <p className="text-2xl text-slate-300 mb-12 max-w-4xl mx-auto font-inter leading-relaxed">
              You were given your creativity for a reason. Join us in building a global trust system for the digital age.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-12 py-6 rounded-2xl font-manrope font-bold text-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all glow-on-hover mb-8"
            >
              Start Building Something Bigger Than Yourself
            </motion.button>

            {/* Ripple Effect Visualization */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-slate-300 font-inter">Your work ripples across:</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📰</div>
                    <p className="text-slate-400">Newsrooms</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏫</div>
                    <p className="text-slate-400">Schools</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🗳️</div>
                    <p className="text-slate-400">Elections</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏥</div>
                    <p className="text-slate-400">Hospitals</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Chatbot Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-sora">
              Discover Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Purpose</span>
            </h2>
            <p className="text-xl text-slate-300 font-inter">
              Let's match your unique gifts to a mission that matters
            </p>
          </motion.div>

          {/* Talent Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {talents.map((talent, index) => (
              <motion.button
                key={talent.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleChatResponse(talent.label.toLowerCase())}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all text-center"
              >
                <talent.icon className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">{talent.label}</h3>
                <p className="text-sm text-slate-400">{talent.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Chat Interface */}
          {chatMessages.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50"
            >
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              
              {userType && (
                <div className="mt-6 text-center">
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all">
                    Explore {userType.charAt(0).toUpperCase() + userType.slice(1)} Opportunities
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Impact Cards */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-sora">
              Real Projects. <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Real Impact.</span>
            </h2>
            <p className="text-xl text-slate-300 font-inter">
              See how student contributions are already changing the world
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${project.color} mb-6`}>
                  <project.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 font-sora">
                  {project.title}
                </h3>
                
                <p className="text-slate-300 font-inter mb-6">
                  {project.description}
                </p>

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    <span className="text-cyan-400 font-manrope font-medium">Impact Story</span>
                  </div>
                  <p className="text-white font-inter">{project.impact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose Callout */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-3xl p-12 border border-slate-700/50"
          >
            <blockquote className="text-3xl sm:text-4xl font-bold font-sora mb-8 leading-tight">
              <span className="text-white">"We believe your gifts are not an accident.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                You were born into a generation that must protect the truth.
              </span>
              <br />
              <span className="text-white">ModGuard is where that purpose becomes action."</span>
            </blockquote>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-xl font-manrope font-bold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all"
            >
              Answer the Call. Join the Mission.
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Countdown + Commitment */}
      <section className="py-20 bg-gradient-to-r from-orange-900/20 via-red-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-sora">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Next Gen Builders Cohort
              </span>
            </h2>
            
            <p className="text-2xl text-orange-300 font-manrope font-medium mb-8">
              This is your moment. Ready to leave your fingerprint on something that will outlive you?
            </p>
            
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 border border-orange-500/30 mb-8">
              <p className="text-orange-300 font-manrope font-medium text-lg mb-6">
                Cohort opens in:
              </p>
              
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 font-sora">{countdown.days}</div>
                  <div className="text-slate-400 font-inter">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 font-sora">{countdown.hours}</div>
                  <div className="text-slate-400 font-inter">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 font-sora">{countdown.minutes}</div>
                  <div className="text-slate-400 font-inter">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 font-sora">{countdown.seconds}</div>
                  <div className="text-slate-400 font-inter">Seconds</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-manrope font-bold text-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all"
                >
                  You're Not Too Young to Matter. You're Exactly the Age to Lead.
                </motion.button>
                
                <p className="text-slate-400 text-sm font-inter">
                  Join 2,847 students already building the future of digital truth
                </p>
              </div>
            </div>

            {/* Application Form Preview */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 text-left">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Quick Interest Form</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Future world-changer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Superpower</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>Select your primary talent</option>
                    <option>Engineering & Code</option>
                    <option>Design & UX</option>
                    <option>Research & AI</option>
                    <option>Strategy & Policy</option>
                    <option>Other (I'll explain)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Why does protecting truth matter to you?</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Share what drives you..."
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all">
                  Submit & Join the Movement
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold font-sora bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ModGuard AI
            </span>
          </div>
          <p className="text-slate-400 font-inter mb-6">
            Where purpose meets technology. Where your gifts find their calling.
          </p>
          <div className="flex justify-center space-x-8">
            <Link to="/" className="text-slate-400 hover:text-cyan-400 transition-colors font-inter">Main Site</Link>
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors font-inter">Student Resources</a>
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors font-inter">Mentorship</a>
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors font-inter">Community</a>
          </div>
        </div>
      </footer>
    </div>
  );
};