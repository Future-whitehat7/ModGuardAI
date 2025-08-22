import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Home,
  Award,
  Users,
  Globe,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Building,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  Calendar,
  Heart,
  Target,
  Sparkles,
  Zap,
  Mic
} from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors" />
                <span className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</span>
              </Link>
              <span className="text-gray-400">|</span>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Origin Story & Founder Insights</span>
              </div>
            </div>
            
            <Link
              to="/earlyaccess"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Join Beta Waitlist
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
              Origin Story & Founder Insights
            </h1>
            <p className="text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              The mission-driven journey behind ModGuard AI and the visionary leader 
              protecting digital truth worldwide
            </p>
          </motion.div>
        </div>

        {/* Origin Story */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-200"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-blue-600 mr-4" />
                The Genesis of Digital Defense
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="text-lg text-gray-700 leading-relaxed space-y-6">
                <p>
                  When founder <strong className="text-blue-900">Samuel Fagbamigbe</strong> witnessed creators losing control of their likeness to AI-generated impersonations and scams, he knew trust in media was under siege. ModGuard AI was created not just as a tool, but as a mission: to restore <strong className="text-purple-900">truth, transparency, and fairness</strong> in every piece of content. Starting with Gen Z creators and educators, ModGuard became a movement of ethical digital empowerment.
                </p>
                
                <p>
                  What began as a response to individual creator protection evolved into a comprehensive platform defending digital authenticity for organizations worldwide. The company's mission crystallized around a simple yet powerful vision: ensuring that artificial intelligence serves humanity's highest aspirations while protecting against its potential misuse.
                </p>

                <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-200 my-8">
                  <blockquote className="text-2xl font-bold text-gray-900 italic text-center leading-relaxed">
                    "We're not just building technology—we're architecting trust for the digital age."
                  </blockquote>
                  <footer className="text-center mt-4 text-blue-600 font-semibold">
                    — Samuel Fagbamigbe, CEO & Co-Founder
                  </footer>
                </div>

                <p>
                  This commitment drives every innovation, partnership, and strategic decision at ModGuard AI.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Founder Profile */}
        <section className="mb-20">
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-200">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center flex items-center justify-center">
              <Users className="h-10 w-10 text-blue-600 mr-4" />
              Meet Our Visionary Leader
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Founder Image and Basic Info */}
              <div className="text-center lg:text-left">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto lg:mx-0 mb-8 flex items-center justify-center shadow-2xl">
                  <span className="text-8xl text-white font-bold">SF</span>
                </div>
                
                <h3 className="text-4xl font-bold text-gray-900 mb-4">Samuel Fagbamigbe</h3>
                <h4 className="text-2xl text-blue-600 font-semibold mb-6">CEO & Co-Founder</h4>
                
                <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                  {[
                    "🌍 Clubs Network Global Ambassador",
                    "🤖 Chief AI Officer", 
                    "🎤 International Speaker",
                    "❤️ Tech Philanthropist"
                  ].map((badge, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center space-x-3 justify-center lg:justify-start">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>samuel@modguardai.com</span>
                  </div>
                  <div className="flex items-center space-x-3 justify-center lg:justify-start">
                    <Mic className="h-5 w-5 text-blue-600" />
                    <span>Available for media interviews</span>
                  </div>
                  <div className="flex items-center space-x-3 justify-center lg:justify-start">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Speaking engagements worldwide</span>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-8">
                <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
                  <h4 className="text-2xl font-bold text-blue-900 mb-4">Vision Statement</h4>
                  <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                    "As Clubs Network Global Ambassador and Chief AI Officer, I've witnessed firsthand 
                    how technology can either divide or unite communities. ModGuard AI represents our 
                    commitment to ensuring that artificial intelligence serves humanity's highest 
                    aspirations while protecting against its potential misuse."
                  </blockquote>
                </div>

                <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
                  <h4 className="text-2xl font-bold text-purple-900 mb-6">Global Impact & Recognition</h4>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                      <div className="text-gray-600 font-medium">Countries Served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">127M+</div>
                      <div className="text-gray-600 font-medium">Lives Protected</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-8 border border-green-200">
                  <h4 className="text-2xl font-bold text-green-900 mb-4">Speaking & Philanthropy</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <span>Been recognized globally, with speaking engagements at prestigious conferences like WeMakeFuture, Sigma, Leap Riyadh</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <span>A former board member for the Black Employee Resource Group at TikTok</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <span>Advisory board member, leading AI ethics initiatives</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <span>Advocate for responsible AI development and deployment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Mission & Core Values</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                The principles that guide every decision and innovation at ModGuard AI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-4 text-center">Truth</h3>
                <p className="text-blue-100 text-center">
                  Defending authentic human expression in an age of synthetic media
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-4 text-center">Transparency</h3>
                <p className="text-blue-100 text-center">
                  Open, explainable AI systems that users can understand and trust
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-4 text-center">Fairness</h3>
                <p className="text-blue-100 text-center">
                  Culturally-aware systems that respect diversity and prevent bias
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Timeline */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Company Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From vision to global impact - the ModGuard AI timeline
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                year: '2024',
                title: 'ModGuard AI Founded',
                description: 'Samuel Fagbamigbe establishes ModGuard AI with a mission to protect digital authenticity',
                color: 'blue'
              },
              {
                year: '2024',
                title: 'First Enterprise Clients',
                description: 'Major social platforms and news organizations adopt ModGuard AI technology',
                color: 'purple'
              },
              {
                year: '2025',
                title: 'Global Expansion',
                description: 'Protecting 127M+ users across 50+ countries with 99.2% accuracy',
                color: 'green'
              },
              {
                year: '2025',
                title: 'Series B Funding',
                description: '$50M funding round led by Andreessen Horowitz for global expansion',
                color: 'orange'
              }
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-center space-x-8"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-${milestone.color}-100 border-4 border-${milestone.color}-500`}>
                  <span className={`text-${milestone.color}-600 font-bold text-lg`}>{milestone.year}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 text-lg">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-gray-50 rounded-3xl p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect with Our Leadership</h2>
            <p className="text-gray-600 text-lg">
              Available for media interviews, speaking engagements, and partnership discussions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Media & Press Inquiries</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">press@modguardai.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Available for interviews</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Global speaking availability</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Partnership & Business</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">business@modguardai.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Strategic partnerships</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Global expansion opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <Shield className="h-8 w-8 text-cyan-400" />
                <span className="text-2xl font-bold">ModGuard AI</span>
              </Link>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Defending digital truth with AI-powered content moderation and deepfake detection.
              </p>
            </div>
            
            {/* Platform */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/solutions" className="text-gray-400 hover:text-white transition-colors">Solutions</Link></li>
                <li><Link to="/demo" className="text-gray-400 hover:text-white transition-colors">Live Demo</Link></li>
              </ul>
            </div>
            
            {/* Community */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/student-portal" className="text-gray-400 hover:text-white transition-colors">AI Fellowship</Link></li>
                <li><Link to="/leaderboard" className="text-gray-400 hover:text-white transition-colors">Deepfake Challenge</Link></li>
                <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/media" className="text-gray-400 hover:text-white transition-colors">Press & Media</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            {/* Beta Waitlist */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Join Beta</h3>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-3">Get early access</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-r-lg hover:shadow-lg transition-all font-medium">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 ModGuard AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link to="/earlyaccess" className="text-gray-400 hover:text-white transition-colors">Beta Waitlist</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};