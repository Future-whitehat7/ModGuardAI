import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  Phone,
  Video,
  ExternalLink,
  X,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Share2,
  ThumbsUp,
  MessageSquare,
  GitBranch,
  Cpu,
  Database,
  Network,
  Lock,
  Unlock,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Smartphone,
  Monitor,
  Server,
  Cloud,
  Wifi,
  Bluetooth,
  Satellite,
  Radio,
  Signal,
  WifiOff,
  AlertCircle,
  Info,
  HelpCircle,
  Settings,
  User,
  UserCheck,
  UserPlus,
  UserX,
  Users2,
  UserCog,
  UserMinus,
  UserCheck2,
  UserX2,
  UserPlus2,
  UserCog2,
  UserMinus2,
  UserCheck3,
  UserX3,
  UserPlus3,
  UserCog3,
  UserMinus3,
  UserCheck4,
  UserX4,
  UserPlus4,
  UserCog4,
  UserMinus4,
  UserCheck5,
  UserX5,
  UserPlus5,
  UserCog5,
  UserMinus5,
  UserCheck6,
  UserX6,
  UserPlus6,
  UserCog6,
  UserMinus6,
  UserCheck7,
  UserX7,
  UserPlus7,
  UserCog7,
  UserMinus7,
  UserCheck8,
  UserX8,
  UserPlus8,
  UserCog8,
  UserMinus8,
  UserCheck9,
  UserX9,
  UserPlus9,
  UserCog9,
  UserMinus9,
  UserCheck10,
  UserX10,
  UserPlus10,
  UserCog10,
  UserMinus10
} from 'lucide-react';

// Generated images for different sections (replacing video loops)
const animatedAssets = {
  hero: {
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center",
    alt: "AI defenders protecting digital truth"
  },
  caseStudies: {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&crop=center", 
    alt: "Student hackathon projects making real impact"
  },
  talentMatching: {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=center", 
    alt: "Students discovering their purpose in AI defense"
  },
  missionTracks: {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center",
    alt: "Different mission tracks for defending digital truth"
  },
  purposeCallout: {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
    alt: "Inspirational moment of purpose and calling"
  },
  application: {
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop&crop=center",
    alt: "Join the movement and make a difference"
  }
};

// Animated Image Component with hover effects (no video)
const AnimatedImage = ({ asset, className = "", isVisible = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
      }}
    >
      {/* Image */}
      <img
        src={asset.image}
        alt={asset.alt}
        className="w-full h-full object-cover transition-all duration-500"
        style={{ 
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      />
      
      {/* Overlay Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Hover Icon */}
      <motion.div
        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Eye className="h-4 w-4 text-gray-900" />
      </motion.div>
    </motion.div>
  );
};

// Mock case studies data for 2025 hackathon projects
const hackathonCaseStudies = [
  {
    id: 1,
    title: "ElectionGuard 2025",
    subtitle: "Real-time Deepfake Detection for Political Campaigns",
    description: "A team of 5 students from MIT and Stanford built an AI system that detected and prevented 847 deepfake videos during the 2025 election cycle, protecting democratic processes across 12 countries.",
    impact: "Protected 2.3M voters from misinformation",
    technologies: ["Python", "TensorFlow", "Computer Vision", "Real-time API"],
    team: ["Alex Chen (MIT)", "Priya Patel (Stanford)", "David Kim (Harvard)", "Maria Santos (Berkeley)", "Sam Johnson (CMU)"],
    hackathon: "MIT Reality Hack 2025",
    placement: "1st Place",
    prize: "$50,000",
    demo: "https://demo.electionguard2025.com",
    github: "https://github.com/electionguard-ai",
    video: "/videos/electionguard-demo.mp4",
    image: "/images/electionguard-screenshot.png",
    stats: {
      accuracy: "99.7%",
      processingTime: "0.3s",
      languages: "47",
      countries: "12"
    }
  },
  {
    id: 2,
    title: "CulturalContext AI",
    subtitle: "Cross-Cultural Deepfake Detection Engine",
    description: "A revolutionary AI system that understands cultural nuances across 50+ regions to detect contextually inappropriate synthetic content that could spark cultural conflicts.",
    impact: "Prevented 156 potential cultural conflicts",
    technologies: ["NLP", "Cultural Mapping", "Multilingual AI", "Ethnographic Data"],
    team: ["Yuki Tanaka (Tokyo University)", "Ahmed Hassan (Cairo University)", "Sofia Rodriguez (UNAM)", "Li Wei (Tsinghua)", "Fatima Al-Zahra (King's College)"],
    hackathon: "Global AI Ethics Hackathon 2025",
    placement: "2nd Place",
    prize: "$30,000",
    demo: "https://demo.culturalcontext.ai",
    github: "https://github.com/cultural-context-ai",
    video: "/videos/cultural-context-demo.mp4",
    image: "/images/cultural-context-screenshot.png",
    stats: {
      cultures: "50+",
      languages: "127",
      accuracy: "98.9%",
      conflicts: "156 prevented"
    }
  },
  {
    id: 3,
    title: "YouthShield Pro",
    subtitle: "AI-Powered Youth Protection System",
    description: "An advanced detection system specifically designed to protect young users from harmful synthetic content, psychological manipulation, and inappropriate deepfakes.",
    impact: "Safeguarded 2.3M young people worldwide",
    technologies: ["Child Psychology AI", "Age Detection", "Content Filtering", "Parental Controls"],
    team: ["Emma Wilson (Child Psychology, Yale)", "Marcus Johnson (CS, Georgia Tech)", "Aisha Patel (Education, Stanford)", "Carlos Mendez (AI Ethics, MIT)", "Zoe Chen (UX, RISD)"],
    hackathon: "Stanford Social Impact Hackathon 2025",
    placement: "1st Place",
    prize: "$40,000",
    demo: "https://demo.youthshield.pro",
    github: "https://github.com/youth-shield-ai",
    video: "/videos/youthshield-demo.mp4",
    image: "/images/youthshield-screenshot.png",
    stats: {
      users: "2.3M",
      accuracy: "99.1%",
      ageGroups: "13-25",
      countries: "89"
    }
  },
  {
    id: 4,
    title: "CrisisResponse AI",
    subtitle: "Emergency Content Verification Network",
    description: "A real-time system that verifies and authenticates content during natural disasters, humanitarian crises, and emergency situations to ensure accurate information flow.",
    impact: "Ensured accurate info during 23 major crises",
    technologies: ["Real-time Processing", "Satellite Integration", "Emergency APIs", "Multi-source Verification"],
    team: ["Dr. Sarah Chen (Disaster Response, Johns Hopkins)", "Mike Rodriguez (Emergency Management, FEMA)", "Lisa Park (Satellite Tech, NASA)", "Tom Anderson (Network Security, NSA)", "Rachel Green (Humanitarian Aid, UN)"],
    hackathon: "UN Humanitarian Tech Challenge 2025",
    placement: "Grand Prize",
    prize: "$100,000",
    demo: "https://demo.crisisresponse.ai",
    github: "https://github.com/crisis-response-ai",
    video: "/videos/crisis-response-demo.mp4",
    image: "/images/crisis-response-screenshot.png",
    stats: {
      crises: "23",
      responseTime: "2.1s",
      accuracy: "99.8%",
      lives: "847K saved"
    }
  },
  {
    id: 5,
    title: "HealthcareTruth AI",
    subtitle: "Medical Information Verification System",
    description: "An AI system that detects and prevents medical misinformation, fake health claims, and dangerous medical deepfakes that could harm public health.",
    impact: "Protected 5.2M people from medical misinformation",
    technologies: ["Medical NLP", "FDA Database Integration", "Clinical Trial Verification", "Health Literacy AI"],
    team: ["Dr. Emily Watson (Medical AI, Harvard Medical)", "James Liu (Healthcare Tech, UCSF)", "Dr. Maria Garcia (Public Health, Johns Hopkins)", "Alex Thompson (Medical Ethics, Stanford)", "Dr. Raj Patel (Clinical Trials, Mayo Clinic)"],
    hackathon: "Healthcare AI Innovation Challenge 2025",
    placement: "1st Place",
    prize: "$75,000",
    demo: "https://demo.healthcaretruth.ai",
    github: "https://github.com/healthcare-truth-ai",
    video: "/videos/healthcare-truth-demo.mp4",
    image: "/images/healthcare-truth-screenshot.png",
    stats: {
      users: "5.2M",
      accuracy: "99.5%",
      medicalClaims: "12K verified",
      lives: "847K protected"
    }
  },
  {
    id: 6,
    title: "FinancialGuard AI",
    subtitle: "Banking & Finance Deepfake Protection",
    description: "A comprehensive system that protects financial institutions, customers, and transactions from deepfake fraud, voice cloning, and synthetic identity theft.",
    impact: "Prevented $847M in potential fraud",
    technologies: ["Biometric Verification", "Voice Analysis", "Transaction Monitoring", "Fraud Detection"],
    team: ["Jennifer Lee (FinTech, Wharton)", "Marcus Williams (Cybersecurity, Carnegie Mellon)", "Dr. Sarah Johnson (Financial Crime, FBI)", "David Chen (Blockchain, MIT)", "Lisa Rodriguez (Banking Security, JPMorgan)"],
    hackathon: "FinTech Innovation Summit 2025",
    placement: "2nd Place",
    prize: "$60,000",
    demo: "https://demo.financialguard.ai",
    github: "https://github.com/financial-guard-ai",
    video: "/videos/financial-guard-demo.mp4",
    image: "/images/financial-guard-screenshot.png",
    stats: {
      fraud: "$847M prevented",
      accuracy: "99.9%",
      banks: "156 protected",
      transactions: "2.3M secured"
    }
  }
];

export const StudentPortal = () => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Enhanced scroll tracking for animations
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0]);

  // Track scroll position for section animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown timer to December 31st, 2025
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('December 31, 2025 23:59:59').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

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

  const openCaseStudy = (caseStudy) => {
    setSelectedCaseStudy(caseStudy);
  };

  const closeCaseStudy = () => {
    setSelectedCaseStudy(null);
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % 3);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + 3) % 3);
  };

  const fellowshipStories = [
    {
      title: "The Journey Begins",
      description: "Follow Alex, a computer science student from MIT, as they discover their passion for protecting digital truth and join the ModGuard AI Fellowship.",
      video: "/videos/fellowship-story-1.mp4",
      thumbnail: "/images/fellowship-story-1.jpg"
    },
    {
      title: "Building Real Solutions",
      description: "Watch Priya, a Stanford AI researcher, develop a cross-cultural deepfake detection system that prevents cultural conflicts worldwide.",
      video: "/videos/fellowship-story-2.mp4",
      thumbnail: "/images/fellowship-story-2.jpg"
    },
    {
      title: "Global Impact",
      description: "See how David, a Harvard student, deployed his election protection system across 12 countries, safeguarding democratic processes.",
      video: "/videos/fellowship-story-3.mp4",
      thumbnail: "/images/fellowship-story-3.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear",
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-40 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            rotate: -360,
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear",
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 7, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header - Exact match to home page */}
      <motion.header 
        className="fixed top-0 w-full z-50 py-5"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <nav className="container max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center">
            {/* Logo - Exact match to home page */}
            <motion.div 
              className="flex items-center flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/" 
                className="logo"
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#1a1a2e',
                  textDecoration: 'none',
                  letterSpacing: '-0.5px'
                }}
              >
                ModGuardAI
              </Link>
            </motion.div>

            {/* Navigation Links - Exact match to home page */}
            <ul className="hidden lg:flex items-center" style={{ gap: '40px' }}>
              <li>
                <Link
                  to="/features"
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#16d9e3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1a1a2e';
                  }}
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions"
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#16d9e3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1a1a2e';
                  }}
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/student-portal"
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#16d9e3',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#16d9e3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1a1a2e';
                  }}
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#16d9e3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1a1a2e';
                  }}
                >
                  Developers
                </Link>
              </li>
            </ul>

            {/* CTA Button - Exact match to home page */}
            <div className="hidden lg:flex items-center">
              <motion.button
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  boxShadow: "0 12px 35px rgba(22, 217, 227, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const email = prompt('Enter email:');
                  const password = prompt('Enter password:');
                  
                  if (email && password) {
                    alert('Login successful! Redirecting to dashboard...');
                    window.location.href = '/dashboard';
                  } else {
                    alert('Please enter both email and password');
                  }
                }}
                className="cta-button"
                style={{
                  background: 'linear-gradient(135deg, #16d9e3, #1a1a2e)',
                  color: 'white',
                  padding: '14px 28px',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Login/Dashboard
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      <div className="flex-1 flex flex-col" style={{ marginTop: '100px' }}>
        {/* Hero Section - Enhanced with animated image */}
        <section 
          className="bg-white relative"
          style={{ padding: '120px 0 200px 0', textAlign: 'center', position: 'relative' }}
        >
          <motion.div
            className="relative z-10 max-w-7xl mx-auto px-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-8"
            >
              🚀 Join the Next Generation of AI Defenders
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-900"
              style={{
                fontSize: 'clamp(60px, 10vw, 120px)',
                fontWeight: 900,
                lineHeight: 0.9,
                marginBottom: '40px',
                letterSpacing: '-3px'
              }}
            >
              <span className="block">USE YOUR</span>
              <span className="block">TALENT TO</span>
              <span className="block">PROTECT</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-900"
              style={{
                fontSize: '32px',
                fontWeight: 700,
                marginBottom: '30px',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              A Billion Lives Through AI-Powered Truth Defense
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-gray-600"
              style={{
                fontSize: '20px',
                marginBottom: '60px',
                maxWidth: '700px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: 1.7
              }}
            >
              You were given your creativity for a reason. Join us in building a global trust system for the digital age.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <motion.a
                href="#apply-section"
                whileHover={{ 
                  scale: 1.02, 
                  y: -4,
                  boxShadow: "0 15px 40px rgba(22, 217, 227, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-xl transition-all"
              >
                Answer the Call
              </motion.a>
              
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  y: -4,
                  backgroundColor: '#16d9e3'
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsVideoPlaying(true)}
                className="border-2 border-gray-900 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-cyan-400 hover:text-white hover:border-cyan-400 transition-all"
              >
                <Video className="inline-block mr-2 h-6 w-6" />
                Watch Fellowship Stories
              </motion.button>
            </motion.div>

            {/* Hero Animated Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="relative max-w-4xl mx-auto mb-16"
            >
              <AnimatedImage 
                asset={animatedAssets.hero}
                className="h-64 md:h-80 lg:h-96"
                isVisible={true}
              />
            </motion.div>

            {/* Global Impact Stats - Enhanced with animations */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" style={{ fontWeight: 900 }}>
                  Current Fellowship Impact
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { value: "2,847", label: "Active Fellows", color: "text-cyan-500" },
                    { value: "47", label: "Universities", color: "text-blue-600" },
                    { value: "127M", label: "Lives Protected", color: "text-purple-600" },
                    { value: "23", label: "Countries", color: "text-orange-600" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <motion.div 
                        className={`text-3xl font-bold mb-2 ${stat.color}`}
                        style={{ fontWeight: 900 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          delay: 1.6 + index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        {stat.value}
                      </motion.div>
                      <p className="text-gray-600 font-medium">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Real Projects. Real Impact. Section - Enhanced with animated image */}
        <section className="py-20 bg-gray-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontWeight: 900 }}>
                Real Projects. <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Real Impact.</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                See how student contributions from 2025 hackathons are already changing the world
              </p>
            </motion.div>

            {/* Section Animated Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16"
            >
              <AnimatedImage 
                asset={animatedAssets.caseStudies}
                className="h-64 md:h-80 max-w-4xl mx-auto"
                isVisible={true}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hackathonCaseStudies.map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -10,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
                  }}
                  onClick={() => openCaseStudy(caseStudy)}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 cursor-pointer transition-all hover:shadow-xl group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {caseStudy.placement}
                    </div>
                    <div className="text-green-600 font-bold text-lg">
                      {caseStudy.prize}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontWeight: 900 }}>
                    {caseStudy.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {caseStudy.subtitle}
                  </p>

                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-5 w-5 text-cyan-500" />
                      <span className="text-cyan-500 font-semibold">Impact</span>
                    </div>
                    <p className="text-gray-800 font-medium">{caseStudy.impact}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseStudy.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span key={techIndex} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                    {caseStudy.technologies.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        +{caseStudy.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 flex items-center space-x-2 mb-4">
                    <GraduationCap className="h-4 w-4" />
                    <span>{caseStudy.hackathon}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {caseStudy.team.length} students
                    </div>
                    <div className="flex items-center text-cyan-500 font-semibold group-hover:text-cyan-600 transition-colors">
                      <span>View Details</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fellowship Stories Video Modal */}
        <AnimatePresence>
          {isVideoPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
              onClick={() => setIsVideoPlaying(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    onClick={() => setIsVideoPlaying(false)}
                    className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  
                  <div className="relative h-96 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2" style={{ fontWeight: 900 }}>
                        {fellowshipStories[currentVideoIndex].title}
                      </h3>
                      <p className="text-lg opacity-90 max-w-md mx-auto">
                        {fellowshipStories[currentVideoIndex].description}
                      </p>
                    </div>
                    
                    <button
                      onClick={prevVideo}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-all"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    
                    <button
                      onClick={nextVideo}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-all"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-center space-x-2 mb-4">
                      {fellowshipStories.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentVideoIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentVideoIndex ? 'bg-cyan-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Watch how students are using ModGuard AI to solve real-world problems
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
                        style={{ fontWeight: 700 }}
                      >
                        Watch Full Story
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Case Study Modal */}
        <AnimatePresence>
          {selectedCaseStudy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
              onClick={closeCaseStudy}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                          {selectedCaseStudy.placement}
                        </div>
                        <div className="text-green-600 font-bold text-lg">
                          {selectedCaseStudy.prize}
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontWeight: 900 }}>
                        {selectedCaseStudy.title}
                      </h2>
                      <p className="text-xl text-gray-600 mb-4">
                        {selectedCaseStudy.subtitle}
                      </p>
                    </div>
                    <button
                      onClick={closeCaseStudy}
                      className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-all"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontWeight: 900 }}>
                        Project Overview
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {selectedCaseStudy.description}
                      </p>
                      
                      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Sparkles className="h-5 w-5 text-cyan-500" />
                          <span className="text-cyan-500 font-semibold">Impact</span>
                        </div>
                        <p className="text-gray-800 font-medium">{selectedCaseStudy.impact}</p>
                      </div>

                      <h4 className="text-lg font-bold text-gray-900 mb-3" style={{ fontWeight: 900 }}>
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedCaseStudy.technologies.map((tech, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontWeight: 900 }}>
                        Team Members
                      </h3>
                      <div className="space-y-2 mb-6">
                        {selectedCaseStudy.team.map((member, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {member.split(' ')[0][0]}
                            </div>
                            <span className="text-gray-800 font-medium">{member}</span>
                          </div>
                        ))}
                      </div>

                      <h4 className="text-lg font-bold text-gray-900 mb-3" style={{ fontWeight: 900 }}>
                        Key Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedCaseStudy.stats).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-cyan-500 mb-1" style={{ fontWeight: 900 }}>
                              {value}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={selectedCaseStudy.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold text-center hover:shadow-xl transition-all"
                      style={{ fontWeight: 700 }}
                    >
                      <ExternalLink className="inline-block mr-2 h-5 w-5" />
                      View Live Demo
                    </a>
                    <a
                      href={selectedCaseStudy.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold text-center hover:border-gray-400 transition-all"
                      style={{ fontWeight: 700 }}
                    >
                      <GitBranch className="inline-block mr-2 h-5 w-5" />
                      View Code
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Talent Matching - Enhanced with animated image */}
        <section className="py-20 bg-white relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontWeight: 900 }}>
                Discover Your <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Purpose</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Let's match your unique gifts to a mission that matters
              </p>
            </motion.div>

            {/* Section Animated Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16"
            >
              <AnimatedImage 
                asset={animatedAssets.talentMatching}
                className="h-64 md:h-80 max-w-4xl mx-auto"
                isVisible={true}
              />
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { icon: Code, label: 'Engineer', description: 'Build the algorithms that protect truth', count: '847 students' },
                { icon: Palette, label: 'Designer', description: 'Create interfaces that make safety intuitive', count: '423 students' },
                { icon: Brain, label: 'Researcher', description: 'Discover new ways to detect deception', count: '612 students' },
                { icon: Target, label: 'Strategist', description: 'Shape how we deploy protection globally', count: '289 students' }
              ].map((talent, index) => (
                <motion.div
                  key={talent.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all text-center group"
                >
                  <talent.icon className="h-8 w-8 text-cyan-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ fontWeight: 700 }}>{talent.label}</h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{talent.description}</p>
                  <p className="text-xs text-cyan-500 font-semibold">{talent.count}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <motion.a
                href="#apply-section"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all inline-block"
                style={{ fontWeight: 700 }}
              >
                Find Your Track
              </motion.a>
            </div>
          </div>
        </section>

        {/* Mission Tracks - Enhanced with animated image */}
        <section className="py-20 bg-gray-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontWeight: 900 }}>
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Mission Tracks
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Choose your path to defending digital truth
              </p>
            </motion.div>

            {/* Section Animated Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16"
            >
              <AnimatedImage 
                asset={animatedAssets.missionTracks}
                className="h-64 md:h-80 max-w-4xl mx-auto"
                isVisible={true}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 'ai-ethics', title: 'AI Ethics & Alignment', icon: '⚖️', participants: 234 },
                { id: 'cultural-insight', title: 'Cultural Signal Mapping', icon: '🌍', participants: 189 },
                { id: 'ux-design', title: 'Trust UX Design', icon: '🎨', participants: 156 },
                { id: 'cybersecurity', title: 'Threat Intelligence', icon: '🛡️', participants: 203 },
                { id: 'storytelling', title: 'Narrative Defense', icon: '📖', participants: 145 },
                { id: 'engineering', title: 'Systems Engineering', icon: '⚙️', participants: 278 }
              ].map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform">{track.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 text-center" style={{ fontWeight: 900 }}>{track.title}</h3>
                  <div className="text-center">
                    <span className="text-cyan-500 font-semibold">{track.participants} participants</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Purpose Callout - Enhanced with animated image */}
        <section className="py-20 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-3xl p-12"
            >
              {/* Section Animated Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="mb-8"
              >
                <AnimatedImage 
                  asset={animatedAssets.purposeCallout}
                  className="h-48 md:h-64 max-w-2xl mx-auto"
                  isVisible={true}
                />
              </motion.div>

              <blockquote className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 leading-tight" style={{ fontWeight: 900 }}>
                <span className="text-gray-900">"We believe your gifts are not an accident.</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  You were born into a generation that must protect the truth.
                </span>
                <br />
                <span className="text-gray-900">ModGuard is where that purpose becomes action."</span>
              </blockquote>
              
              <p className="text-lg text-gray-600 mb-8 font-medium">
                — Dr. Sarah Chen, CEO & Co-Founder
              </p>
              
              <motion.a
                href="#apply-section"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all inline-block"
                style={{ fontWeight: 700 }}
              >
                Answer the Call. Join the Mission.
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Countdown + Application - Enhanced with animated image */}
        <section id="apply-section" className="py-20 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontWeight: 900 }}>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Next Gen Builders Cohort
                </span>
              </h2>
              
              <p className="text-2xl text-gray-700 font-medium mb-8 leading-relaxed">
                This is your moment. Ready to leave your fingerprint on something that will outlive you?
              </p>

              {/* Section Animated Image */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="mb-8"
              >
                <AnimatedImage 
                  asset={animatedAssets.application}
                  className="h-48 md:h-64 max-w-2xl mx-auto"
                  isVisible={true}
                />
              </motion.div>
              
              <div className="bg-white rounded-2xl p-8 border border-orange-200 mb-8 shadow-lg">
                <p className="text-orange-600 font-medium text-lg mb-6" style={{ fontWeight: 700 }}>
                  Cohort opens in:
                </p>
                
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[
                    { value: countdown.days, label: "Days" },
                    { value: countdown.hours, label: "Hours" },
                    { value: countdown.minutes, label: "Minutes" },
                    { value: countdown.seconds, label: "Seconds" }
                  ].map((time, index) => (
                    <motion.div
                      key={time.label}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <motion.div 
                        className="text-4xl font-bold text-orange-600"
                        style={{ fontWeight: 900 }}
                        key={time.value}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                      >
                        {time.value}
                      </motion.div>
                      <div className="text-gray-600 font-medium">{time.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Application Form - Enhanced with animations */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-xl p-8 border border-gray-200 text-left max-w-2xl mx-auto shadow-lg"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center" style={{ fontWeight: 900 }}>
                  Join the Fellowship
                </h3>
                
                {!submitted ? (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                      >
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                          placeholder="Your full name"
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        <input
                          type="text"
                          required
                          value={formData.university}
                          onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                          placeholder="Your university"
                        />
                      </motion.div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                        placeholder="your.email@university.edu"
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <select 
                        required
                        value={formData.superpower}
                        onChange={(e) => setFormData(prev => ({ ...prev, superpower: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                      >
                        <option value="">Select your primary talent</option>
                        <option value="engineering">Engineering & Code</option>
                        <option value="design">Design & UX</option>
                        <option value="research">Research & AI</option>
                        <option value="strategy">Strategy & Policy</option>
                        <option value="storytelling">Storytelling & Content</option>
                        <option value="other">Other (I'll explain)</option>
                      </select>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <textarea
                        required
                        rows={4}
                        value={formData.motivation}
                        onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                        placeholder="Why does protecting truth matter to you?"
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      viewport={{ once: true }}
                      className="bg-cyan-50 border border-cyan-200 rounded-lg p-4"
                    >
                      <h4 className="font-bold text-cyan-800 mb-2" style={{ fontWeight: 700 }}>What You'll Get:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Direct mentorship from ModGuard AI team</li>
                        <li>• Real projects with global impact</li>
                        <li>• Professional LinkedIn certification</li>
                        <li>• Access to exclusive AI research</li>
                        <li>• Career placement opportunities</li>
                      </ul>
                    </motion.div>
                    
                    <motion.button 
                      type="submit"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                      style={{ fontWeight: 700 }}
                    >
                      Submit & Join the Movement
                    </motion.button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontWeight: 900 }}>
                      Application Submitted!
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Welcome to the ModGuard AI Fellowship. Redirecting to your dashboard...
                    </p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer - Exact match to home page */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
              {/* Company Info */}
              <div>
                <Link to="/" className="flex items-center space-x-2 mb-6">
                  <div className="text-2xl font-bold" style={{ fontWeight: 900, color: '#16d9e3' }}>
                    ModGuardAI
                  </div>
                </Link>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Where purpose meets technology. Where your gifts find their calling.
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
              
              {/* Fellowship */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Fellowship</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/student-portal" className="text-gray-400 hover:text-white transition-colors">Student Portal</Link></li>
                  <li><Link to="/fellowship/dashboard" className="text-gray-400 hover:text-white transition-colors">Fellowship Dashboard</Link></li>
                  <li><a href="#apply-section" className="text-gray-400 hover:text-white transition-colors">Apply to Join</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mentorship</a></li>
                </ul>
              </div>
              
              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
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
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 ModGuardAI Fellowship. All rights reserved.
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
    </div>
  );
};