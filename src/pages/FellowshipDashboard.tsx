import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Award,
  Users,
  Calendar,
  Target,
  TrendingUp,
  MessageCircle,
  Download,
  Share2,
  Clock,
  CheckCircle,
  Star,
  Zap,
  Globe,
  Heart,
  ArrowRight,
  Plus,
  Filter,
  Search,
  Bell,
  Settings,
  LogOut,
  BookOpen,
  Video,
  Mic,
  Code,
  Lightbulb,
  Brain,
  Palette,
  Edit,
  Save,
  X,
  ExternalLink,
  Copy,
  Upload,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Send,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  track: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  deadline: string;
  status: 'available' | 'in-progress' | 'completed';
  type: 'research' | 'design' | 'code' | 'analysis';
  tasks?: string[];
}

interface Event {
  id: string;
  title: string;
  type: 'webinar' | 'workshop' | 'huddle' | 'mentorship';
  date: string;
  time: string;
  speaker: string;
  attendees: number;
  rsvp: boolean;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  author: string;
  votes: number;
  category: string;
  status: 'suggested' | 'under-review' | 'in-development';
  userVoted: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  university: string;
  bio: string;
  linkedin: string;
  twitter: string;
  github: string;
  instagram: string;
  role: string;
  code: string;
  badge: string;
  level: string;
  points: number;
  hoursContributed: number;
  threatsImproved: number;
  referrals: number;
}

export const FellowshipDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDescription, setNewIdeaDescription] = useState('');
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [copiedReferralLink, setCopiedReferralLink] = useState(false);

  // Mock user data with editable profile
  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    university: 'Stanford University',
    bio: 'Passionate about AI ethics and cultural understanding. Building bridges between technology and humanity.',
    linkedin: 'https://linkedin.com/in/alexchen',
    twitter: '@alexchen_ai',
    github: 'alexchen-dev',
    instagram: '@alex.creates',
    role: 'Cultural Signal Mapper',
    code: 'CSM-2025-A7X9K2',
    badge: '🌍',
    level: 'Rising Defender',
    points: 2847,
    hoursContributed: 127,
    threatsImproved: 23,
    referrals: 5
  });

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Analyze Cultural Context in Viral Memes',
      description: 'Research how memes spread across different cultural contexts and identify potential misinterpretation risks',
      track: 'cultural-insight',
      difficulty: 'intermediate',
      points: 150,
      deadline: '2025-02-15',
      status: 'available',
      type: 'research',
      tasks: [
        'Collect 50 viral memes from different regions',
        'Analyze cultural interpretation differences',
        'Document potential misunderstanding risks',
        'Create recommendation framework'
      ]
    },
    {
      id: '2',
      title: 'Design Trust Indicator UI Component',
      description: 'Create a user interface component that clearly communicates content authenticity to users',
      track: 'ux-design',
      difficulty: 'beginner',
      points: 100,
      deadline: '2025-02-10',
      status: 'in-progress',
      type: 'design',
      tasks: [
        'Research existing trust indicators',
        'Design wireframes and mockups',
        'Create interactive prototype',
        'Conduct user testing'
      ]
    },
    {
      id: '3',
      title: 'Build Deepfake Detection API Wrapper',
      description: 'Develop a Python wrapper for our deepfake detection API with comprehensive documentation',
      track: 'engineering',
      difficulty: 'advanced',
      points: 250,
      deadline: '2025-02-20',
      status: 'available',
      type: 'code',
      tasks: [
        'Set up development environment',
        'Implement API wrapper functions',
        'Write comprehensive documentation',
        'Create example usage scripts',
        'Add error handling and tests'
      ]
    },
    {
      id: '4',
      title: 'Ethical AI Decision Framework',
      description: 'Research and propose a framework for making ethical decisions in AI content moderation',
      track: 'ai-ethics',
      difficulty: 'advanced',
      points: 200,
      deadline: '2025-02-25',
      status: 'completed',
      type: 'analysis',
      tasks: [
        'Literature review on AI ethics',
        'Interview stakeholders',
        'Draft framework document',
        'Present to ethics committee'
      ]
    }
  ]);

  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'AI Ethics in Practice',
      type: 'webinar',
      date: '2025-02-08',
      time: '2:00 PM PST',
      speaker: 'Dr. Sarah Chen',
      attendees: 234,
      rsvp: true
    },
    {
      id: '2',
      title: 'Deepfake Detection Workshop',
      type: 'workshop',
      date: '2025-02-12',
      time: '10:00 AM PST',
      speaker: 'Marcus Rodriguez',
      attendees: 89,
      rsvp: false
    },
    {
      id: '3',
      title: 'Fellowship Community Huddle',
      type: 'huddle',
      date: '2025-02-15',
      time: '4:00 PM PST',
      speaker: 'Fellowship Team',
      attendees: 156,
      rsvp: true
    }
  ];

  const [communityIdeas, setCommunityIdeas] = useState<Idea[]>([
    {
      id: '1',
      title: 'Real-time Collaboration Detection',
      description: 'AI system that detects when multiple accounts are coordinating to spread misinformation',
      author: 'Jamie Liu',
      votes: 47,
      category: 'AI/ML',
      status: 'under-review',
      userVoted: true
    },
    {
      id: '2',
      title: 'Cultural Context Learning Game',
      description: 'Interactive game that teaches users about cultural nuances in content interpretation',
      author: 'Priya Patel',
      votes: 32,
      category: 'Education',
      status: 'suggested',
      userVoted: false
    },
    {
      id: '3',
      title: 'Voice Authenticity Blockchain',
      description: 'Blockchain-based system for verifying the authenticity of voice recordings',
      author: 'David Kim',
      votes: 28,
      category: 'Blockchain',
      status: 'in-development',
      userVoted: false
    }
  ]);

  const trackOptions = [
    { value: 'all', label: 'All Tracks' },
    { value: 'ai-ethics', label: 'AI Ethics & Alignment' },
    { value: 'ux-design', label: 'UX Design' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'cultural-insight', label: 'Cultural Insight' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'data-science', label: 'Data Science' }
  ];

  const filteredMissions = selectedTrack === 'all' 
    ? missions 
    : missions.filter(mission => mission.track === selectedTrack);

  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'research': return BookOpen;
      case 'design': return Palette;
      case 'code': return Code;
      case 'analysis': return Brain;
      default: return Target;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStartMission = (mission: Mission) => {
    setActiveMission(mission);
    setMissions(prev => prev.map(m => 
      m.id === mission.id ? { ...m, status: 'in-progress' } : m
    ));
  };

  const handleCompleteMission = (missionId: string) => {
    setMissions(prev => prev.map(m => 
      m.id === missionId ? { ...m, status: 'completed' } : m
    ));
    setActiveMission(null);
    // Add points to user
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      setUser(prev => ({ ...prev, points: prev.points + mission.points }));
    }
  };

  const handleVoteIdea = (ideaId: string) => {
    setCommunityIdeas(prev => prev.map(idea => 
      idea.id === ideaId 
        ? { 
            ...idea, 
            votes: idea.userVoted ? idea.votes - 1 : idea.votes + 1,
            userVoted: !idea.userVoted 
          }
        : idea
    ));
  };

  const handleSubmitIdea = () => {
    if (newIdeaTitle && newIdeaDescription) {
      const newIdea: Idea = {
        id: Date.now().toString(),
        title: newIdeaTitle,
        description: newIdeaDescription,
        author: user.name,
        votes: 1,
        category: 'Community',
        status: 'suggested',
        userVoted: true
      };
      setCommunityIdeas(prev => [newIdea, ...prev]);
      setNewIdeaTitle('');
      setNewIdeaDescription('');
      setShowNewIdeaForm(false);
    }
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    // Here you would typically save to backend
  };

  const copyReferralLink = () => {
    const referralLink = `https://modguard.ai/fellowship?ref=${user.code}`;
    navigator.clipboard.writeText(referralLink);
    setCopiedReferralLink(true);
    setTimeout(() => setCopiedReferralLink(false), 2000);
  };

  const openCalendarBooking = () => {
    // In a real app, this would open a calendar booking widget
    setShowCalendarModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <span className="text-lg sm:text-xl font-bold text-gray-900 font-sora">ModGuard AI</span>
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="hidden sm:inline text-gray-600 font-medium">Fellowship Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">{user.badge}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-3xl font-bold font-sora mb-2">
                Welcome back, {user.name}! {user.badge}
              </h1>
              <p className="text-blue-100 text-sm sm:text-lg font-inter">
                Mission Code: <span className="font-mono">{user.code}</span>
              </p>
              <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
                You're making a real impact in defending digital truth
              </p>
            </div>
            
            <div className="text-left sm:text-right">
              <div className="text-xl sm:text-2xl font-bold mb-1">{user.level}</div>
              <div className="text-blue-200 text-sm">Current Level</div>
              <button 
                onClick={openCalendarBooking}
                className="mt-2 sm:mt-4 bg-white/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm sm:text-base"
              >
                Book Onboarding Session
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 bg-blue-100 rounded-lg">
                <Star className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{user.points.toLocaleString()}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Impact Points</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 bg-green-100 rounded-lg">
                <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{user.hoursContributed}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Hours Contributed</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 bg-purple-100 rounded-lg">
                <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{user.threatsImproved}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Threats Improved</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 bg-orange-100 rounded-lg">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{user.referrals}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Referrals</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Missions */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Live Missions Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Live Missions Feed</h2>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedTrack}
                      onChange={(e) => setSelectedTrack(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                    >
                      {trackOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4">
                {filteredMissions.map((mission, index) => {
                  const MissionIcon = getMissionIcon(mission.type);
                  return (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                            <MissionIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1">{mission.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{mission.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
                                {mission.difficulty}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                                {mission.status.replace('-', ' ')}
                              </span>
                              <span className="text-gray-500 flex items-center">
                                <Star className="h-4 w-4 inline mr-1" />
                                {mission.points} points
                              </span>
                              <span className="text-gray-500 text-xs">
                                Due: {new Date(mission.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleStartMission(mission)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex-shrink-0 w-full sm:w-auto"
                        >
                          {mission.status === 'available' ? 'Start Mission' : 
                           mission.status === 'in-progress' ? 'Continue' : 'View Results'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Co-Creation Wall */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Co-Creation Wall</h2>
                  <button 
                    onClick={() => setShowNewIdeaForm(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Suggest Feature</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4">
                {/* New Idea Form */}
                <AnimatePresence>
                  {showNewIdeaForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border border-blue-200 rounded-lg p-4 bg-blue-50"
                    >
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Feature title..."
                          value={newIdeaTitle}
                          onChange={(e) => setNewIdeaTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          placeholder="Describe your feature idea..."
                          value={newIdeaDescription}
                          onChange={(e) => setNewIdeaDescription(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSubmitIdea}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Submit Idea
                          </button>
                          <button
                            onClick={() => setShowNewIdeaForm(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {communityIdeas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                          {idea.status === 'in-development' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              ModGuard May Build This
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{idea.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span>by {idea.author}</span>
                          <span>{idea.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleVoteIdea(idea.id)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                            idea.userVoted 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <TrendingUp className="h-4 w-4" />
                          <span>{idea.votes}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Events & Impact */}
          <div className="space-y-6 lg:space-y-8">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Upcoming Events</h2>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{event.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2 ${
                        event.type === 'webinar' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'workshop' ? 'bg-green-100 text-green-800' :
                        event.type === 'huddle' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    
                    <button
                      className={`mt-3 w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        event.rsvp
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {event.rsvp ? 'RSVP\'d' : 'RSVP'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Social Good Impact Meter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Impact Meter</h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="text-center mb-6">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">Level 7</div>
                  <div className="text-gray-600">Digital Defender</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">73% to next level</div>
                </div>
                
                <div className="space-y-4">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Download Proof of Impact
                  </button>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Refer & Earn</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">
                        Your special referral link:
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={`https://modguard.ai/fellowship?ref=${user.code}&name=${encodeURIComponent(user.name)}`}
                          readOnly
                          className="flex-1 text-xs bg-white border border-gray-300 rounded px-2 py-1"
                        />
                        <button 
                          onClick={copyReferralLink}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          {copiedReferralLink ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {user.referrals}/3 referrals for Digital Defender badge
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        Earn: Professional LinkedIn badge, ModGuard swag, priority mentorship
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                  <input
                    type="text"
                    value={user.university}
                    onChange={(e) => setUser(prev => ({ ...prev, university: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={user.bio}
                    onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Linkedin className="h-4 w-4 inline mr-1" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={user.linkedin}
                        onChange={(e) => setUser(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Twitter className="h-4 w-4 inline mr-1" />
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={user.twitter}
                        onChange={(e) => setUser(prev => ({ ...prev, twitter: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="@username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Github className="h-4 w-4 inline mr-1" />
                        GitHub
                      </label>
                      <input
                        type="text"
                        value={user.github}
                        onChange={(e) => setUser(prev => ({ ...prev, github: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Instagram className="h-4 w-4 inline mr-1" />
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={user.instagram}
                        onChange={(e) => setUser(prev => ({ ...prev, instagram: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mission Detail Modal */}
      <AnimatePresence>
        {activeMission && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{activeMission.title}</h2>
                  <button
                    onClick={() => setActiveMission(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6">{activeMission.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mission Tasks</h3>
                  <div className="space-y-3">
                    {activeMission.tasks?.map((task, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleCompleteMission(activeMission.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Complete Mission (+{activeMission.points} points)
                  </button>
                  <button
                    onClick={() => setActiveMission(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Save Progress
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Calendar Booking Modal */}
      <AnimatePresence>
        {showCalendarModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl w-full max-w-2xl"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Book Onboarding Session</h2>
                  <button
                    onClick={() => setShowCalendarModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center">
                  <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Schedule Your Mentorship Session
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Connect with a ModGuard AI mentor to discuss your fellowship journey and get personalized guidance.
                  </p>
                  
                  <div className="space-y-4">
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <ExternalLink className="h-5 w-5" />
                      <span>Open Calendly Booking</span>
                    </button>
                    
                    <div className="text-sm text-gray-500">
                      Available times: Monday-Friday, 9 AM - 5 PM PST
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Mobile Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-30">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1 text-blue-600">
            <Target className="h-5 w-5" />
            <span className="text-xs">Missions</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <Award className="h-5 w-5" />
            <span className="text-xs">Impact</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <Users className="h-5 w-5" />
            <span className="text-xs">Community</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <Settings className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};