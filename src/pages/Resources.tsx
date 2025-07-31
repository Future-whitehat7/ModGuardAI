import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Award,
  Lightbulb,
  Code,
  Shield,
  Globe,
  Headphones,
  MessageCircle
} from 'lucide-react';

const ResourceCard = ({ title, description, type, duration, rating, downloads, category, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        {type === 'guide' && <BookOpen className="h-5 w-5 text-white" />}
        {type === 'video' && <Video className="h-5 w-5 text-white" />}
        {type === 'documentation' && <FileText className="h-5 w-5 text-white" />}
        {type === 'course' && <Award className="h-5 w-5 text-white" />}
      </div>
      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
        {category}
      </span>
    </div>
    
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    
    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span>{rating}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Download className="h-4 w-4" />
          <span>{downloads}</span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center space-x-2">
      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
        Access Resource
      </button>
      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
        <ExternalLink className="h-4 w-4" />
      </button>
    </div>
  </motion.div>
);

const CourseCard = ({ title, instructor, lessons, duration, level, enrolled, price, image }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
  >
    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="text-6xl">{image}</div>
    </div>
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          level === 'Beginner' ? 'bg-green-100 text-green-800' :
          level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {level}
        </span>
        <span className="text-lg font-bold text-blue-600">{price}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">by {instructor}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{lessons} lessons</span>
        <span>{duration}</span>
        <span>{enrolled} enrolled</span>
      </div>
      
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
        Enroll Now
      </button>
    </div>
  </motion.div>
);

export const Resources = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const tabs = [
    { id: 'all', label: 'All Resources' },
    { id: 'guides', label: 'Guides' },
    { id: 'courses', label: 'Courses' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'community', label: 'Community' }
  ];

  const resources = [
    {
      title: 'Complete Guide to AI Content Moderation',
      description: 'Comprehensive guide covering all aspects of AI-powered content moderation',
      type: 'guide',
      duration: '45 min read',
      rating: '4.9',
      downloads: '12K',
      category: 'Getting Started',
      color: 'bg-blue-500'
    },
    {
      title: 'Deepfake Detection Best Practices',
      description: 'Learn industry best practices for detecting and preventing deepfake content',
      type: 'video',
      duration: '32 min',
      rating: '4.8',
      downloads: '8.5K',
      category: 'Advanced',
      color: 'bg-purple-500'
    },
    {
      title: 'API Integration Handbook',
      description: 'Step-by-step guide to integrating ModGuard AI into your applications',
      type: 'documentation',
      duration: '25 min read',
      rating: '4.7',
      downloads: '15K',
      category: 'Development',
      color: 'bg-green-500'
    },
    {
      title: 'Cultural Context Filtering',
      description: 'Understanding and implementing cultural sensitivity in content moderation',
      type: 'course',
      duration: '2.5 hours',
      rating: '4.9',
      downloads: '6.2K',
      category: 'Specialized',
      color: 'bg-orange-500'
    },
    {
      title: 'Enterprise Deployment Guide',
      description: 'Best practices for deploying ModGuard AI at enterprise scale',
      type: 'guide',
      duration: '38 min read',
      rating: '4.8',
      downloads: '9.1K',
      category: 'Enterprise',
      color: 'bg-indigo-500'
    },
    {
      title: 'Real-time Analysis Setup',
      description: 'Configure real-time content analysis for your platform',
      type: 'video',
      duration: '28 min',
      rating: '4.6',
      downloads: '7.3K',
      category: 'Technical',
      color: 'bg-pink-500'
    }
  ];

  const courses = [
    {
      title: 'AI Content Moderation Fundamentals',
      instructor: 'Dr. Sarah Chen',
      lessons: 12,
      duration: '4 hours',
      level: 'Beginner',
      enrolled: '2.4K',
      price: 'Free',
      image: '🎓'
    },
    {
      title: 'Advanced Deepfake Detection',
      instructor: 'Marcus Rodriguez',
      lessons: 18,
      duration: '6 hours',
      level: 'Advanced',
      enrolled: '1.8K',
      price: '$199',
      image: '🔍'
    },
    {
      title: 'Enterprise Implementation',
      instructor: 'Lisa Wang',
      lessons: 15,
      duration: '5 hours',
      level: 'Intermediate',
      enrolled: '1.2K',
      price: '$299',
      image: '🏢'
    },
    {
      title: 'Cultural Context & AI Ethics',
      instructor: 'Prof. Ahmed Hassan',
      lessons: 10,
      duration: '3 hours',
      level: 'Intermediate',
      enrolled: '3.1K',
      price: '$149',
      image: '🌍'
    }
  ];

  const communityResources = [
    {
      title: 'Developer Forum',
      description: 'Connect with other developers and get technical support',
      icon: MessageCircle,
      members: '12.5K',
      color: 'bg-blue-500'
    },
    {
      title: 'Expert Office Hours',
      description: 'Weekly sessions with ModGuard AI experts',
      icon: Headphones,
      members: '3.2K',
      color: 'bg-green-500'
    },
    {
      title: 'Best Practices Hub',
      description: 'Community-driven collection of implementation guides',
      icon: Lightbulb,
      members: '8.7K',
      color: 'bg-purple-500'
    },
    {
      title: 'Code Examples Repository',
      description: 'Open-source examples and integrations',
      icon: Code,
      members: '15.3K',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resources & Training
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive learning materials, documentation, and community resources to help you master ModGuard AI
          </p>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5 text-gray-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {(activeTab === 'all' || activeTab === 'guides' || activeTab === 'documentation') && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ResourceCard {...resource} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'courses') && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Training Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'community') && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityResources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${resource.color}`}>
                      <resource.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-gray-600 mb-3">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>{resource.members} members</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Join →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Featured Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Need Personalized Training?</h2>
          <p className="text-xl text-blue-100 mb-6">
            Get custom training sessions tailored to your team's specific needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Schedule Consultation
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              View Enterprise Training
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};