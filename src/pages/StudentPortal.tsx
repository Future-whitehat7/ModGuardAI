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
  Sparkles,
  Home,
  Upload,
  Calendar,
  Book,
  Headphones,
  Coffee,
  Rocket,
  Eye,
  TrendingUp,
  Building,
  GraduationCap,
  Mic,
  Camera,
  FileText,
  Mail,
  Phone
} from 'lucide-react';

export const StudentPortal = () => {
  const [countdown, setCountdown] = useState({ days: 6, hours: 14, minutes: 23, seconds: 45 });
  const [chatOpen, setChatOpen] = useState(false);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    superpower: '',
    motivation: ''
  });
  const [submitted, setSubmitted] = useState(false);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.superpower || !formData.motivation) {
      alert('Please fill in all required fields');
      return;
    }
    
    setSubmitted(true);
    
    // Simulate processing
    setTimeout(() => {
      alert('Welcome to the ModGuard AI Fellowship! Redirecting to your dashboard...');
      // In a real app, this would redirect to the fellowship dashboard
      window.location.href = '/fellowship/dashboard';
    }, 2000);
  };

  const projects = [
    {
      title: 'Real-Time Election Protection',
      description: 'AI system that prevented 847 deepfake videos from spreading during critical election periods',
      impact: 'Protected democratic processes in 12 countries',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      student: 'Alex Chen - Stanford CS'
    },
    {
      title: 'Cultural Context Engine',
      description: 'Machine learning model that understands cultural nuances across 50+ regions',
      impact: 'Prevented cultural misunderstandings that could have sparked conflicts',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      student: 'Priya Patel - MIT AI Lab'
    },
    {
      title: 'Youth Safety Protocol',
      description: 'Advanced detection system protecting young users from harmful synthetic content',
      impact: 'Safeguarded over 2.3M young people from psychological manipulation',
      icon: Heart,
      color: 'from-green-500 to-teal-500',
      student: 'Maria Santos - Berkeley'
    },
    {
      title: 'Crisis Response Network',
      description: 'Emergency content verification during natural disasters and humanitarian crises',
      impact: 'Ensured accurate information flow during 23 major crisis events',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      student: 'David Kim - Harvard'
    }
  ];

  const talents = [
    { icon: Code, label: 'Engineer', description: 'Build the algorithms that protect truth', count: '847 students' },
    { icon: Palette, label: 'Designer', description: 'Create interfaces that make safety intuitive', count: '423 students' },
    { icon: Brain, label: 'Researcher', description: 'Discover new ways to detect deception', count: '612 students' },
    { icon: Target, label: 'Strategist', description: 'Shape how we deploy protection globally', count: '289 students' }
  ];

  const missionTracks = [
    { id: 'ai-ethics', title: 'AI Ethics & Alignment', icon: '⚖️', participants: 234 },
    { id: 'cultural-insight', title: 'Cultural Signal Mapping', icon: '🌍', participants: 189 },
    { id: 'ux-design', title: 'Trust UX Design', icon: '🎨', participants: 156 },
    { id: 'cybersecurity', title: 'Threat Intelligence', icon: '🛡️', participants: 203 },
    { id: 'storytelling', title: 'Narrative Defense', icon: '📖', participants: 145 },
    { id: 'engineering', title: 'Systems Engineering', icon: '⚙️', participants: 278 }
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
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
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
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/fellowship/dashboard"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all rounded-lg"
              >
                <Building className="h-4 w-4" />
                <span>Fellowship Dashboard</span>
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

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <motion.a
                href="#apply-section"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-12 py-6 rounded-2xl font-manrope font-bold text-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all glow-on-hover"
              >
                Answer the Call
              </motion.a>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-cyan-400 text-cyan-400 px-12 py-6 rounded-2xl font-manrope font-bold text-xl hover:bg-cyan-400/10 transition-all"
              >
                Watch Fellowship Stories
              </motion.button>
            </div>

            {/* Global Impact Stats */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-10 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Current Fellowship Impact</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">2,847</div>
                    <p className="text-slate-400">Active Fellows</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">47</div>
                    <p className="text-slate-400">Universities</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">127M</div>
                    <p className="text-slate-400">Lives Protected</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">23</div>
                    <p className="text-slate-400">Countries</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Student Projects Impact */}
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
            <p className="text-xl text-slate-300 font-inter max-w-3xl mx-auto">
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

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    <span className="text-cyan-400 font-manrope font-medium">Impact Story</span>
                  </div>
                  <p className="text-white font-inter">{project.impact}</p>
                </div>

                <div className="text-sm text-slate-400 flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Built by: {project.student}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Talent Matching */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-sora">
              Discover Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Purpose</span>
            </h2>
            <p className="text-xl text-slate-300 font-inter">
              Let's match your unique gifts to a mission that matters
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {talents.map((talent, index) => (
              <motion.div
                key={talent.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all text-center"
              >
                <talent.icon className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">{talent.label}</h3>
                <p className="text-sm text-slate-400 mb-3">{talent.description}</p>
                <p className="text-xs text-cyan-400">{talent.count}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.a
              href="#apply-section"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-xl font-manrope font-bold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all inline-block"
            >
              Find Your Track
            </motion.a>
          </div>
        </div>
      </section>

      {/* Mission Tracks */}
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
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Mission Tracks
              </span>
            </h2>
            <p className="text-xl text-slate-300 font-inter">
              Choose your path to defending digital truth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {missionTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all"
              >
                <div className="text-4xl mb-4 text-center">{track.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3 text-center">{track.title}</h3>
                <div className="text-center">
                  <span className="text-cyan-400 font-medium">{track.participants} participants</span>
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
            
            <p className="text-lg text-slate-300 mb-8 font-inter">
              — Dr. Sarah Chen, CEO & Co-Founder
            </p>
            
            <motion.a
              href="#apply-section"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-xl font-manrope font-bold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all inline-block"
            >
              Answer the Call. Join the Mission.
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Countdown + Application */}
      <section id="apply-section" className="py-20 bg-gradient-to-r from-orange-900/20 via-red-900/20 to-pink-900/20">
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
            </div>

            {/* Application Form */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-slate-700/50 text-left max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Join the Fellowship</h3>
              
              {!submitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Future world-changer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">University/School *</label>
                      <input
                        type="text"
                        required
                        value={formData.university}
                        onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Your educational institution"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="your.email@university.edu"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Superpower *</label>
                    <select 
                      required
                      value={formData.superpower}
                      onChange={(e) => setFormData(prev => ({ ...prev, superpower: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select your primary talent</option>
                      <option value="engineering">Engineering & Code</option>
                      <option value="design">Design & UX</option>
                      <option value="research">Research & AI</option>
                      <option value="strategy">Strategy & Policy</option>
                      <option value="storytelling">Storytelling & Content</option>
                      <option value="other">Other (I'll explain)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Why does protecting truth matter to you? *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.motivation}
                      onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Share what drives you to defend digital truth..."
                    />
                  </div>
                  
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                    <h4 className="font-bold text-cyan-300 mb-2">What You'll Get:</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Direct mentorship from ModGuard AI team</li>
                      <li>• Real projects with global impact</li>
                      <li>• Professional LinkedIn certification</li>
                      <li>• Access to exclusive AI research</li>
                      <li>• Career placement opportunities</li>
                    </ul>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                  >
                    Submit & Join the Movement
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Application Submitted!</h3>
                  <p className="text-slate-300 mb-6">
                    Welcome to the ModGuard AI Fellowship. Redirecting to your dashboard...
                  </p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-cyan-400" />
                <span className="text-xl font-bold">ModGuard AI</span>
              </Link>
              <p className="text-slate-400 text-sm">
                Where purpose meets technology. Where your gifts find their calling.
              </p>
            </div>
            
            {/* Platform */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/features" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/solutions" className="text-slate-400 hover:text-white transition-colors">Solutions</Link></li>
                <li><Link to="/demo" className="text-slate-400 hover:text-white transition-colors">Try Live Demo</Link></li>
              </ul>
            </div>
            
            {/* Fellowship */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Fellowship</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/student-portal" className="text-slate-400 hover:text-white transition-colors">Student Portal</Link></li>
                <li><Link to="/fellowship/dashboard" className="text-slate-400 hover:text-white transition-colors">Fellowship Dashboard</Link></li>
                <li><a href="#apply-section" className="text-slate-400 hover:text-white transition-colors">Apply to Join</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Mentorship</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/media" className="text-slate-400 hover:text-white transition-colors">Press & Media</Link></li>
                <li><Link to="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/case-studies" className="text-slate-400 hover:text-white transition-colors">Case Studies</Link></li>
              </ul>
            </div>
            
            {/* Utilities */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Utilities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/api" className="text-slate-400 hover:text-white transition-colors">API Access</Link></li>
                <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#support" className="text-slate-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 ModGuard AI Fellowship. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              <Link to="/api" className="text-slate-400 hover:text-white transition-colors">API</Link>
              <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};