import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Star,
  ExternalLink,
  Plus,
  Filter,
  Search,
  Globe,
  Mic,
  Award,
  Coffee,
  Lightbulb,
  Code,
  Shield
} from 'lucide-react';

const EventCard = ({ title, date, time, location, type, attendees, speaker, description, image, featured }: any) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    className={`bg-white rounded-xl shadow-lg border p-6 ${
      featured ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'
    }`}
  >
    {featured && (
      <div className="flex items-center space-x-2 mb-4">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="text-sm font-medium text-blue-600">Featured Event</span>
      </div>
    )}
    
    <div className="flex items-start space-x-4 mb-4">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
        {image}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            type === 'webinar' ? 'bg-blue-100 text-blue-800' :
            type === 'workshop' ? 'bg-green-100 text-green-800' :
            type === 'conference' ? 'bg-purple-100 text-purple-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {type}
          </span>
          {location === 'Virtual' && <Video className="h-4 w-4 text-gray-400" />}
          {location !== 'Virtual' && <MapPin className="h-4 w-4 text-gray-400" />}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">by {speaker}</p>
      </div>
    </div>
    
    <p className="text-gray-600 mb-4">{description}</p>
    
    <div className="space-y-2 mb-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Calendar className="h-4 w-4" />
        <span>{date}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Clock className="h-4 w-4" />
        <span>{time}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        {location === 'Virtual' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
        <span>{location}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Users className="h-4 w-4" />
        <span>{attendees} registered</span>
      </div>
    </div>
    
    <div className="flex items-center space-x-2">
      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
        Register Now
      </button>
      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
        <ExternalLink className="h-4 w-4" />
      </button>
    </div>
  </motion.div>
);

const SpeakerCard = ({ name, title, company, bio, image, expertise }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center"
  >
    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
      {image}
    </div>
    
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
    <p className="text-sm text-gray-600 mb-2">{title}</p>
    <p className="text-sm text-blue-600 mb-3">{company}</p>
    
    <p className="text-gray-600 text-sm mb-4">{bio}</p>
    
    <div className="flex flex-wrap gap-2 justify-center">
      {expertise.map((skill: string, index: number) => (
        <span
          key={index}
          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
        >
          {skill}
        </span>
      ))}
    </div>
  </motion.div>
);

export const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  
  const tabs = [
    { id: 'upcoming', label: 'Upcoming Events' },
    { id: 'past', label: 'Past Events' },
    { id: 'speakers', label: 'Speakers' },
    { id: 'calendar', label: 'Event Calendar' }
  ];

  const upcomingEvents = [
    {
      title: 'AI Content Moderation Summit 2025',
      date: 'March 15, 2025',
      time: '9:00 AM - 5:00 PM PST',
      location: 'San Francisco, CA',
      type: 'conference',
      attendees: '1,200',
      speaker: 'Dr. Sarah Chen & Industry Leaders',
      description: 'Join industry leaders for a full-day conference on the future of AI-powered content moderation.',
      image: '🏛️',
      featured: true
    },
    {
      title: 'Deepfake Detection Workshop',
      date: 'February 28, 2025',
      time: '2:00 PM - 4:00 PM EST',
      location: 'Virtual',
      type: 'workshop',
      attendees: '450',
      speaker: 'Marcus Rodriguez',
      description: 'Hands-on workshop covering advanced deepfake detection techniques and implementation strategies.',
      image: '🔍',
      featured: false
    },
    {
      title: 'Enterprise Implementation Webinar',
      date: 'February 20, 2025',
      time: '11:00 AM - 12:00 PM PST',
      location: 'Virtual',
      type: 'webinar',
      attendees: '800',
      speaker: 'Lisa Wang',
      description: 'Learn best practices for implementing ModGuard AI at enterprise scale with real-world case studies.',
      image: '🏢',
      featured: false
    },
    {
      title: 'Cultural Context in AI Moderation',
      date: 'March 5, 2025',
      time: '3:00 PM - 4:30 PM GMT',
      location: 'Virtual',
      type: 'panel',
      attendees: '600',
      speaker: 'Prof. Ahmed Hassan & Panel',
      description: 'Panel discussion on implementing cultural sensitivity in AI-powered content moderation systems.',
      image: '🌍',
      featured: false
    },
    {
      title: 'Developer Office Hours',
      date: 'Every Friday',
      time: '4:00 PM - 5:00 PM PST',
      location: 'Virtual',
      type: 'office hours',
      attendees: '150',
      speaker: 'ModGuard AI Team',
      description: 'Weekly open session for developers to get technical support and ask questions.',
      image: '💻',
      featured: false
    },
    {
      title: 'AI Ethics & Safety Roundtable',
      date: 'March 22, 2025',
      time: '1:00 PM - 3:00 PM EST',
      location: 'New York, NY',
      type: 'roundtable',
      attendees: '80',
      speaker: 'Industry Ethics Board',
      description: 'Intimate roundtable discussion on ethical considerations in AI content moderation.',
      image: '⚖️',
      featured: false
    }
  ];

  const pastEvents = [
    {
      title: 'ModGuard AI Launch Event',
      date: 'January 10, 2025',
      time: '10:00 AM - 12:00 PM PST',
      location: 'Virtual',
      type: 'launch',
      attendees: '2,500',
      speaker: 'ModGuard AI Founders',
      description: 'Official launch event introducing ModGuard AI to the world.',
      image: '🚀',
      featured: true
    },
    {
      title: 'Year-End AI Safety Review',
      date: 'December 15, 2024',
      time: '2:00 PM - 4:00 PM EST',
      location: 'Virtual',
      type: 'review',
      attendees: '1,800',
      speaker: 'Industry Analysts',
      description: 'Comprehensive review of AI safety developments and trends in 2024.',
      image: '📊',
      featured: false
    }
  ];

  const speakers = [
    {
      name: 'Dr. Sarah Chen',
      title: 'Chief AI Officer',
      company: 'ModGuard AI',
      bio: 'Leading AI researcher with 15+ years in machine learning and content safety.',
      image: '👩‍💼',
      expertise: ['AI Research', 'Content Safety', 'Machine Learning']
    },
    {
      name: 'Marcus Rodriguez',
      title: 'VP of Engineering',
      company: 'ModGuard AI',
      bio: 'Former tech lead at major social platforms, expert in large-scale content moderation.',
      image: '👨‍💻',
      expertise: ['Engineering', 'Scalability', 'Platform Safety']
    },
    {
      name: 'Prof. Ahmed Hassan',
      title: 'AI Ethics Researcher',
      company: 'Stanford University',
      bio: 'Renowned expert in AI ethics and cultural considerations in technology.',
      image: '👨‍🏫',
      expertise: ['AI Ethics', 'Cultural Context', 'Research']
    },
    {
      name: 'Lisa Wang',
      title: 'Enterprise Solutions Director',
      company: 'ModGuard AI',
      bio: 'Specialist in enterprise AI implementations and digital transformation.',
      image: '👩‍💼',
      expertise: ['Enterprise', 'Implementation', 'Strategy']
    }
  ];

  const eventTypes = [
    { type: 'webinar', icon: Video, color: 'bg-blue-500' },
    { type: 'workshop', icon: Code, color: 'bg-green-500' },
    { type: 'conference', icon: Mic, color: 'bg-purple-500' },
    { type: 'networking', icon: Coffee, color: 'bg-orange-500' }
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
            Events & Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our community events, workshops, and conferences to learn, network, and stay ahead in AI content moderation
          </p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
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
          
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Host Event</span>
          </button>
        </div>
      </div>

      {/* Event Types */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {eventTypes.map((eventType, index) => (
            <motion.div
              key={eventType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center cursor-pointer"
            >
              <div className={`inline-flex p-3 rounded-lg mb-3 ${eventType.color}`}>
                <eventType.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 capitalize">{eventType.type}s</h3>
            </motion.div>
          ))}
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
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'speakers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {speakers.map((speaker, index) => (
              <motion.div
                key={speaker.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SpeakerCard {...speaker} />
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Interactive Calendar Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                We're building an interactive calendar view to help you plan and track all upcoming events.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Notified
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss an Event</h2>
          <p className="text-xl text-blue-100 mb-6">
            Subscribe to our event newsletter and be the first to know about upcoming workshops, conferences, and community gatherings
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};