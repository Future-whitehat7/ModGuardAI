import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Home,
  Calendar,
  User,
  Clock,
  TrendingUp,
  Brain,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  Star,
  ArrowRight,
  Search,
  Filter,
  Tag,
  Share2,
  BookOpen,
  Eye
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  trending?: boolean;
  tags: string[];
}

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced blog posts with live AI/deepfake content
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Rise of AI-Generated Content: 2025 Global Report',
      excerpt: 'Comprehensive analysis reveals 847% increase in AI-generated content across platforms, with major implications for digital trust and verification.',
      content: `The digital landscape has undergone a seismic shift in 2024-2025, with AI-generated content proliferating at an unprecedented rate. Our global analysis across 50+ countries reveals that synthetic media creation has increased by 847% year-over-year, fundamentally changing how we consume and trust digital information.

Key findings include:
- Video deepfakes increased 1,200% in political contexts
- Voice cloning attacks targeting financial institutions up 650%
- AI-generated text content now comprises 23% of social media posts
- Cultural variations in deepfake detection accuracy across regions

This report examines the technological, cultural, and societal implications of this transformation, providing insights for policymakers, technologists, and content creators navigating the new digital reality.`,
      author: 'Dr. Sarah Chen',
      date: '2025-01-27',
      category: 'AI Research',
      readTime: '8 min',
      image: '🤖',
      trending: true,
      tags: ['AI', 'Research', 'Global Trends', 'Synthetic Media']
    },
    {
      id: '2',
      title: 'Deepfake Detection: Why Cultural Context Matters',
      excerpt: 'How AI systems trained on Western datasets fail to detect deepfakes in non-Western contexts, and why cultural awareness is crucial for global deployment.',
      content: `Cultural context is the missing piece in most AI detection systems. Our research shows that deepfake detection models trained primarily on Western datasets exhibit significant performance degradation when analyzing content from non-Western cultures.

The challenge stems from:
- Facial recognition biases in training data
- Cultural expressions and gestures misinterpretation
- Language-specific audio processing limitations
- Regional content creation patterns

ModGuard AI addresses these challenges through culturally-aware training datasets and region-specific model adaptations, achieving consistent 96%+ accuracy across all cultural contexts.`,
      author: 'Prof. Ahmed Hassan',
      date: '2025-01-25',
      category: 'Cultural AI',
      readTime: '12 min',
      image: '🌍',
      tags: ['Cultural AI', 'Detection', 'Global', 'Bias']
    },
    {
      id: '3',
      title: 'Voice Cloning Scams: $2.8B in Global Losses',
      excerpt: 'Comprehensive analysis of voice synthesis attacks targeting financial institutions and vulnerable populations worldwide.',
      content: `Voice cloning technology has evolved from a novelty to a sophisticated weapon in the hands of cybercriminals. Our analysis of global financial crime data reveals that voice synthesis attacks have resulted in $2.8 billion in losses across 2024.

Attack patterns show:
- Elder fraud schemes using family member voices
- Corporate executive impersonation for wire transfers
- Banking customer service spoofing
- Insurance claim fraud using synthetic voices

Financial institutions are rapidly adopting voice authentication systems, but the arms race between attackers and defenders continues to escalate.`,
      author: 'Marcus Rodriguez',
      date: '2025-01-23',
      category: 'Security',
      readTime: '6 min',
      image: '🎤',
      trending: true,
      tags: ['Voice Cloning', 'Security', 'Financial Crime', 'Fraud']
    },
    {
      id: '4',
      title: 'Content Creators Fight Back: The Authenticity Revolution',
      excerpt: 'How leading influencers and creators are using AI verification to protect their brands from impersonation and deepfake attacks.',
      content: `The creator economy is fighting back against deepfake impersonation with innovative verification technologies. Leading influencers and content creators are now using AI-powered authenticity certificates to protect their brands and maintain audience trust.

New creator protection strategies include:
- Real-time deepfake monitoring across platforms
- Biometric voice and face verification systems
- Blockchain-based content authentication
- Automated takedown request generation

The result: 89% reduction in unauthorized deepfake content and increased audience engagement through verified authentic content.`,
      author: 'Lisa Wang',
      date: '2025-01-20',
      category: 'Creator Economy',
      readTime: '10 min',
      image: '✨',
      tags: ['Creators', 'Brand Protection', 'Verification', 'Authenticity']
    },
    {
      id: '5',
      title: 'Election Integrity 2024: AI\'s Role in Democracy',
      excerpt: 'Post-election analysis reveals how AI detection systems prevented misinformation campaigns across 23 countries during critical voting periods.',
      content: `The 2024 global election cycle became a proving ground for AI-powered election integrity systems. Across 23 countries, advanced detection systems successfully identified and mitigated 3,247 deepfake videos and 12,000+ synthetic audio clips designed to mislead voters.

Critical interventions included:
- Real-time candidate deepfake detection
- Multi-language disinformation identification
- Cross-platform threat coordination analysis
- Rapid fact-checking verification systems

The success of these systems represents a turning point in protecting democratic processes from synthetic media manipulation.`,
      author: 'David Kim',
      date: '2025-01-18',
      category: 'Politics',
      readTime: '15 min',
      image: '🗳️',
      tags: ['Elections', 'Democracy', 'Politics', 'Integrity']
    },
    {
      id: '6',
      title: 'The Future of Digital Marketing in an AI World',
      excerpt: 'How brands are adapting their marketing strategies to build trust and authenticity in the age of synthetic media.',
      content: `Digital marketing is undergoing a fundamental transformation as brands navigate the challenges and opportunities of AI-generated content. Forward-thinking companies are developing new strategies to maintain authenticity while leveraging AI for creative content production.

Emerging marketing strategies include:
- Authenticated content campaigns with verification badges
- Transparent AI usage disclosure in marketing materials
- Consumer education about synthetic media identification
- Trust-first branding in an age of digital skepticism

Brands that proactively address authenticity concerns are seeing 34% higher consumer trust scores and improved long-term customer relationships.`,
      author: 'Emma Thompson',
      date: '2025-01-15',
      category: 'Digital Marketing',
      readTime: '7 min',
      image: '📊',
      tags: ['Marketing', 'Branding', 'Trust', 'Consumer Behavior']
    },
    {
      id: '7',
      title: 'AI Safety in Healthcare: Protecting Medical Communications',
      excerpt: 'How healthcare organizations are using AI verification to ensure patient safety and prevent medical misinformation.',
      content: `Healthcare communications require the highest levels of trust and accuracy. AI verification systems are now being deployed to protect medical information from synthetic manipulation and ensure patient safety.

Healthcare AI applications include:
- Medical professional verification systems
- Patient communication authentication
- Clinical trial data integrity protection
- Telemedicine security enhancements

These systems have prevented 156 cases of medical misinformation and protected over 2.3 million patient interactions from potential fraud or manipulation.`,
      author: 'Dr. Maria Gonzalez',
      date: '2025-01-12',
      category: 'Healthcare',
      readTime: '9 min',
      image: '🏥',
      tags: ['Healthcare', 'Patient Safety', 'Medical AI', 'Communication']
    },
    {
      id: '8',
      title: 'Global Deepfake Trends: Regional Analysis 2025',
      excerpt: 'Regional breakdown of deepfake creation and detection patterns across continents, revealing cultural and technological variations.',
      content: `Our comprehensive analysis of global deepfake trends reveals significant regional variations in both creation and detection patterns. Understanding these differences is crucial for developing effective global protection strategies.

Regional insights:
- Asia Pacific leads in detection technology adoption (78% of platforms)
- Europe focuses on regulatory compliance and ethical AI frameworks
- North America prioritizes commercial and political deepfake prevention
- Latin America faces unique challenges with resource constraints
- Africa shows rapid growth in mobile-first detection solutions

These regional differences inform our approach to culturally-aware AI systems that respect local contexts while maintaining universal protection standards.`,
      author: 'Dr. James Wu',
      date: '2025-01-10',
      category: 'Global Trends',
      readTime: '11 min',
      image: '🗺️',
      tags: ['Global', 'Regional Analysis', 'Trends', 'Cultural Context']
    }
  ];

  const categories = ['all', 'AI Research', 'Cultural AI', 'Security', 'Creator Economy', 'Politics', 'Digital Marketing', 'Healthcare', 'Global Trends'];

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.trending);
  const regularPosts = filteredPosts.filter(post => !post.trending);

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
              <Link to="/media" className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">ModGuard AI Blog</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/demo"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>Try Live Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Safety & Digital Truth Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Latest insights on AI, deepfakes, digital authenticity, and the future of content verification
            </p>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category === 'all' ? 'All Topics' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <TrendingUp className="h-6 w-6 text-red-500 mr-2" />
              Trending Now
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all p-6 relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      TRENDING
                    </span>
                  </div>
                  
                  <div className="text-4xl mb-4">{post.image}</div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 mt-3 leading-tight">{post.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="text-gray-700">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Read Full Article
                  </button>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Latest Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            Latest Articles
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all p-6"
              >
                <div className="text-3xl mb-4">{post.image}</div>
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-3 mt-3 leading-tight">{post.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="text-gray-700 font-medium">{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Read Full Article
                </button>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Ahead of AI Trends</h2>
          <p className="text-xl text-blue-100 mb-6">
            Get the latest insights on AI safety, deepfake detection, and digital authenticity delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            Join 12,000+ professionals staying informed about AI safety
          </p>
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
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/media" className="text-gray-400 hover:text-white transition-colors">Press & Media</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
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