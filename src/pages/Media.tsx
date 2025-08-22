import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Home,
  FileText,
  Calendar,
  Download,
  Share2,
  Mail,
  Phone,
  MessageCircle,
  Users,
  Globe,
  Award,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Newspaper,
  Linkedin,
  Twitter
} from 'lucide-react';

interface PressRelease {
  id: string;
  title: string;
  date: string;
  summary: string;
  downloadUrl: string;
}

export const Media = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
    storyType: 'news'
  });

  const pressReleases: PressRelease[] = [
    {
      id: '1',
      title: 'ModGuard AI Secures $50M Series B Funding',
      date: '2025-01-25',
      summary: 'Investment led by Andreessen Horowitz will accelerate global expansion and AI research initiatives for next-generation deepfake detection.',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Partnership with Global News Network for Election Integrity',
      date: '2025-01-20',
      summary: 'Strategic alliance provides real-time deepfake detection for news verification during election coverage across 23 countries.',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'ModGuard AI Achieves SOC 2 Type II Compliance',
      date: '2025-01-15',
      summary: 'Certification validates enterprise-grade security and privacy controls for government and financial sector clients.',
      downloadUrl: '#'
    },
    {
      id: '4',
      title: 'Global AI Safety Summit: ModGuard Presents Cultural Context Research',
      date: '2025-01-10',
      summary: 'Groundbreaking research on cultural bias in AI detection systems presented at international AI safety conference.',
      downloadUrl: '#'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Story submitted:', formData);
    alert('Thank you for your submission! Our media team will review it within 24 hours and get back to you shortly.');
    setFormData({ name: '', email: '', organization: '', message: '', storyType: 'news' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <span className="text-xl font-bold text-gray-900">ModGuard AI Media Hub</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/blog" className="text-gray-600 hover:text-gray-900 font-medium">
                Blog
              </Link>
              <Link
                to="/demo"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Try Live Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Centered Page Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
              Press & Media Center
            </h1>
            <p className="text-2xl text-gray-600 leading-relaxed mb-8">
              Latest news, press releases, and media resources about ModGuard AI's mission to protect digital truth and safeguard digital authenticity worldwide.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Updated Daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>12,000+ Media Subscribers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Global Coverage</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CEO Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              Leadership & Vision
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto lg:mx-0 mb-8 flex items-center justify-center shadow-2xl">
                  <span className="text-6xl text-white font-bold">SF</span>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Samuel Fagbamigbe</h3>
                <h4 className="text-xl text-blue-600 font-semibold mb-6">CEO & Co-Founder</h4>
                
                <div className="flex flex-wrap gap-3 mb-6 justify-center lg:justify-start">
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
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>samuel@modguardai.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>Available for media interviews</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Speaking engagements worldwide</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Vision Statement</h4>
                  <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                    "As Clubs Network Global Ambassador and Chief AI Officer, I've witnessed firsthand 
                    how technology can either divide or unite communities. ModGuard AI represents our 
                    commitment to ensuring that artificial intelligence serves humanity's highest 
                    aspirations while protecting against its potential misuse. We're not just building 
                    technology—we're architecting trust for the digital age."
                  </blockquote>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Global Impact & Recognition</h4>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                      <div className="text-gray-600">Countries Served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">127M+</div>
                      <div className="text-gray-600">Lives Protected</div>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 text-gray-700">
                    <li>• Keynote speaker at Global AI Safety Summit 2024</li>
                    <li>• Founded Digital Truth Initiative for underserved communities</li>
                    <li>• Advisory board member, Stanford AI Ethics Institute</li>
                    <li>• TED Talk: "Defending Reality in the Age of AI" (2.3M views)</li>
                    <li>• Featured in Forbes 30 Under 30 AI & Data Science</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section id="press-releases" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Newspaper className="h-8 w-8 text-blue-600 mr-3" />
            Latest Press Releases
          </h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{release.title}</h3>
                  <p className="text-gray-600 mb-3">{release.summary}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(release.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-6">
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Press Kit - Expanded and Integrated */}
        <section id="press-kit" className="mb-20">
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              📋 Complete Press Kit & Media Resources
            </h2>
            
            {/* Company Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Company Overview</h3>
                <div className="space-y-4 text-gray-700">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><strong className="text-gray-900">Founded:</strong> 2024</div>
                      <div><strong className="text-gray-900">Headquarters:</strong> San Francisco, CA</div>
                      <div><strong className="text-gray-900">Employees:</strong> 150+ global team</div>
                      <div><strong className="text-gray-900">Funding:</strong> $50M Series B (January 2025)</div>
                      <div><strong className="text-gray-900">Valuation:</strong> $500M (January 2025)</div>
                      <div><strong className="text-gray-900">Coverage:</strong> 50+ countries</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-2">Mission Statement</h4>
                    <p className="text-blue-800">
                      To defend digital truth and protect authentic human expression in an age of synthetic media, 
                      ensuring that technology serves to enhance rather than undermine trust in our interconnected world.
                    </p>
                  </div>
                  <p className="leading-relaxed">
                    ModGuard AI is the leading provider of AI-powered content moderation and deepfake detection technology. 
                    Our platform protects over 127 million users worldwide from synthetic media threats, processing 
                    2.4 million content items daily with 99.2% accuracy.
                  </p>
                  <p className="leading-relaxed">
                    The company was founded with a mission to defend digital truth and ensure authentic human expression 
                    in an age of synthetic media, working with news organizations, social platforms, governments, and 
                    enterprises to maintain trust in digital communications.
                  </p>
                </div>
              </div>

              {/* Key Statistics */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Key Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600">99.2%</div>
                    <div className="text-sm text-gray-600">Detection Accuracy</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                    <div className="text-3xl font-bold text-green-600">127ms</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600">50+</div>
                    <div className="text-sm text-gray-600">Regions Covered</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
                    <div className="text-3xl font-bold text-orange-600">127M+</div>
                    <div className="text-sm text-gray-600">Users Protected</div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <h4 className="font-bold text-gray-900 mb-4">Additional Metrics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 text-sm">Daily Content Processed</span>
                      <span className="font-bold text-gray-900">2.4M items</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 text-sm">Threats Blocked (2024)</span>
                      <span className="font-bold text-gray-900">3.7M threats</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 text-sm">Enterprise Clients</span>
                      <span className="font-bold text-gray-900">500+ organizations</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 text-sm">API Calls Daily</span>
                      <span className="font-bold text-gray-900">127M+ calls</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership Team */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Leadership Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Dr. Sarah Chen', title: 'CEO & Co-Founder', background: 'Former AI Research Lead at DeepMind', avatar: '👩‍💼' },
                  { name: 'Marcus Rodriguez', title: 'CTO & Co-Founder', background: 'Former Principal Engineer at Meta', avatar: '👨‍💻' },
                  { name: 'Prof. Ahmed Hassan', title: 'Chief Ethics Officer', background: 'Stanford AI Ethics Institute', avatar: '👨‍🏫' },
                  { name: 'Lisa Wang', title: 'VP of Product', background: 'Former Product Director at Microsoft', avatar: '👩‍💼' },
                  { name: 'David Kim', title: 'Head of Security', background: 'Former NSA Cybersecurity Specialist', avatar: '👨‍💻' },
                  { name: 'Emma Thompson', title: 'VP of Marketing', background: 'Former CMO at Salesforce', avatar: '👩‍💼' }
                ].map((leader, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-center"
                  >
                    <div className="text-4xl mb-4">{leader.avatar}</div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{leader.name}</h4>
                    <p className="text-blue-600 font-medium mb-3">{leader.title}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{leader.background}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Vision Statement */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl mb-10 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mission Statement</h3>
              <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                "To defend digital truth and protect authentic human expression in an age of synthetic media, 
                ensuring that technology serves to enhance rather than undermine trust in our interconnected world. 
                We believe that by combining advanced AI with human wisdom and cultural understanding, we can 
                create a future where authenticity and innovation coexist harmoniously."
              </blockquote>
              <footer className="mt-4 text-gray-600">
                — Dr. Sarah Chen, CEO & Co-Founder
              </footer>
            </div>

            {/* Product Information */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Product Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Core Technology</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Advanced neural networks for deepfake detection</li>
                    <li>• Cultural context AI for regional sensitivity</li>
                    <li>• Real-time processing infrastructure</li>
                    <li>• Explainable AI decision frameworks</li>
                    <li>• Multi-modal content analysis (video, audio, text, image)</li>
                    <li>• Threat intelligence and predictive analytics</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Target Markets</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Social media platforms and content creators</li>
                    <li>• News organizations and media companies</li>
                    <li>• Government agencies and election commissions</li>
                    <li>• Financial institutions and healthcare providers</li>
                    <li>• Educational institutions and research organizations</li>
                    <li>• Entertainment and media production companies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technology Capabilities */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Technology Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Detection Accuracy', value: '99.2%', icon: '🎯', color: 'bg-blue-50 border-blue-200' },
                  { title: 'Response Time', value: '127ms', icon: '⚡', color: 'bg-green-50 border-green-200' },
                  { title: 'Global Coverage', value: '50+ Regions', icon: '🌍', color: 'bg-purple-50 border-purple-200' },
                  { title: 'Languages', value: '25+', icon: '🗣️', color: 'bg-orange-50 border-orange-200' }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${item.color} border p-6 rounded-xl text-center`}
                  >
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
                    <div className="text-gray-600 text-sm">{item.title}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Primary Use Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Content Verification', description: 'Real-time analysis of user-generated content for authenticity', icon: '🔍' },
                  { title: 'Brand Protection', description: 'Monitoring and prevention of deepfake impersonation attacks', icon: '🛡️' },
                  { title: 'News Verification', description: 'Fact-checking and source verification for journalism', icon: '📰' }
                ].map((usecase, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                    <div className="text-4xl mb-4">{usecase.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-2">{usecase.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{usecase.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Assets */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Media Assets & Downloads</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 mb-4">Brand Assets</h4>
                  <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 mb-4">
                    <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 leading-relaxed">High-resolution logos, brand guidelines, color palettes</p>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium">
                    <Download className="h-4 w-4" />
                    <span>Download Brand Kit</span>
                  </button>
                </div>
                
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 mb-4">Executive Photos</h4>
                  <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 mb-4">
                    <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 leading-relaxed">Professional headshots, team photos, conference images</p>
                  </div>
                  <button className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium">
                    <Download className="h-4 w-4" />
                    <span>Download Photos</span>
                  </button>
                </div>
                
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 mb-4">Product Screenshots</h4>
                  <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 mb-4">
                    <FileText className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 leading-relaxed">Dashboard screenshots, UI mockups, demo videos</p>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 font-medium">
                    <Download className="h-4 w-4" />
                    <span>Download Images</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Awards & Recognition */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Awards & Recognition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { award: 'AI Safety Innovation Award 2024', organization: 'MIT Technology Review' },
                  { award: 'Best Cybersecurity Startup 2024', organization: 'TechCrunch Disrupt' },
                  { award: 'Ethics in AI Excellence Award', organization: 'Stanford AI Institute' },
                  { award: 'Global Impact Recognition', organization: 'World Economic Forum' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Award className="h-6 w-6 text-yellow-600" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{item.award}</div>
                      <div className="text-sm text-gray-600">{item.organization}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Contact */}
            <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white p-10 rounded-2xl">
              <h3 className="text-3xl font-bold mb-8 text-center">Media Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="text-center">
                  <h4 className="font-bold text-white mb-4">Primary Media Contact</h4>
                  <div className="space-y-3">
                    <p className="font-semibold text-cyan-400">Sarah Johnson</p>
                    <p className="text-gray-300">Head of Communications</p>
                    <div className="flex items-center justify-center space-x-6">
                      <a href="mailto:press@modguardai.com" className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                        <Mail className="h-4 w-4" />
                        <span>press@modguardai.com</span>
                      </a>
                      <a href="tel:+1-555-0123" className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                        <Phone className="h-4 w-4" />
                        <span>+1 (555) 012-3456</span>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="font-bold text-white mb-4">Executive Interviews</h4>
                  <div className="space-y-3">
                    <p className="font-semibold text-cyan-400">Dr. Sarah Chen, CEO</p>
                    <p className="text-blue-100">Available for interviews on AI safety, ethics, and the future of content authenticity</p>
                    <a href="mailto:ceo@modguardai.com" className="flex items-center justify-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                      <Mail className="h-4 w-4" />
                      <span>ceo@modguardai.com</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-blue-200 text-sm">
                  <strong>Response Time:</strong> We typically respond to media inquiries within 2 hours during business hours (9 AM - 6 PM PST)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Submission Form */}
        <section id="submit-story" className="mb-20">
          <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              📝 Submit Your Story
            </h2>
            <p className="text-gray-600 mb-10 text-center max-w-3xl mx-auto text-lg leading-relaxed">
              Have a story about AI, deepfakes, digital authenticity, or content verification? 
              We'd love to hear from journalists, researchers, and industry experts.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Organization</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Your news organization or publication"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Story Type</label>
                  <select
                    value={formData.storyType}
                    onChange={(e) => setFormData(prev => ({ ...prev, storyType: e.target.value }))}
                    className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="news">Breaking News Story</option>
                    <option value="feature">Feature Article</option>
                    <option value="case-study">Case Study</option>
                    <option value="research">Research Coverage</option>
                    <option value="interview">Interview Request</option>
                    <option value="opinion">Opinion Piece</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Story Pitch, Interview Request, or Research Topic *</label>
                <textarea
                  required
                  rows={8}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="Tell us about your story idea, research findings, interview request, or how ModGuard AI fits into your coverage area. Include deadlines, angle, and target audience if applicable..."
                />
              </div>
              
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-3">What We're Looking For:</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Stories about AI safety and digital authenticity</li>
                  <li>• Research on deepfake detection and synthetic media</li>
                  <li>• Case studies of content verification success</li>
                  <li>• Analysis of global trends in AI-generated content</li>
                  <li>• Investigations into digital misinformation campaigns</li>
                  <li>• Executive interviews on AI ethics and policy</li>
                </ul>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-16 rounded-2xl hover:shadow-xl transition-all font-bold text-xl"
                >
                  Submit Story Pitch
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  We typically respond to story submissions within 24 hours
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Recent Coverage */}
        <section className="bg-white rounded-3xl shadow-xl p-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Recent Media Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { outlet: 'TechCrunch', headline: 'ModGuard AI Raises $50M to Combat Deepfakes', date: 'Jan 25, 2025' },
              { outlet: 'The Wall Street Journal', headline: 'AI Startup Helps News Organizations Verify Content', date: 'Jan 20, 2025' },
              { outlet: 'MIT Technology Review', headline: 'The Cultural Challenge of Global AI Detection', date: 'Jan 18, 2025' },
              { outlet: 'Forbes', headline: 'How One Startup is Protecting Democracy from Deepfakes', date: 'Jan 15, 2025' },
              { outlet: 'Wired', headline: 'The Future of Content Authenticity is Here', date: 'Jan 12, 2025' },
              { outlet: 'Reuters', headline: 'AI Detection System Prevents Election Misinformation', date: 'Jan 10, 2025' }
            ].map((coverage, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gray-50"
              >
                <div className="font-bold text-blue-600 mb-2">{coverage.outlet}</div>
                <h4 className="font-semibold text-gray-900 mb-3 leading-tight">{coverage.headline}</h4>
                <div className="text-sm text-gray-500">{coverage.date}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-cyan-400" />
                <span className="text-xl font-bold">ModGuard AI</span>
              </Link>
              <p className="text-gray-400 text-sm">
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
                <li><Link to="/demo" className="text-gray-400 hover:text-white transition-colors">Try Live Demo</Link></li>
              </ul>
            </div>
            
            {/* Media & Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Media & Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/media" className="text-gray-400 hover:text-white transition-colors">Press & Media</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors">Case Studies</Link></li>
              </ul>
            </div>
            
            {/* Utilities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Utilities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors">API Access</Link></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compliance</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 ModGuard AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link to="/api" className="text-gray-400 hover:text-white transition-colors">API</Link>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};