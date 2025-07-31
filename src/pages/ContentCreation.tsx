import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PenTool,
  Image,
  Video,
  Mic,
  FileText,
  Download,
  Share2,
  Eye,
  Sparkles,
  Wand2,
  Palette,
  Type,
  Layout,
  Play,
  Pause,
  RotateCcw,
  Save,
  Upload,
  Settings
} from 'lucide-react';

const CreationTool = ({ icon: Icon, title, description, features, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
  >
    <div className={`inline-flex p-3 rounded-lg mb-4 ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    
    <ul className="space-y-2">
      {features.map((feature: string, index: number) => (
        <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    
    <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
      Launch Tool
    </button>
  </motion.div>
);

const TemplateCard = ({ title, category, preview, downloads }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
  >
    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="text-6xl">{preview}</div>
    </div>
    
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {category}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{downloads} downloads</span>
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-700">
            <Eye className="h-4 w-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export const ContentCreation = () => {
  const [activeTab, setActiveTab] = useState('tools');
  
  const tabs = [
    { id: 'tools', label: 'Creation Tools', icon: PenTool },
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'assets', label: 'Asset Library', icon: Image },
    { id: 'tutorials', label: 'Tutorials', icon: Play }
  ];

  const creationTools = [
    {
      icon: Image,
      title: 'AI Image Generator',
      description: 'Create stunning visuals with AI-powered image generation',
      features: [
        'Text-to-image generation',
        'Style transfer',
        'Background removal',
        'Upscaling & enhancement'
      ],
      color: 'bg-purple-500'
    },
    {
      icon: Video,
      title: 'Video Editor',
      description: 'Professional video editing with AI-assisted features',
      features: [
        'Auto-cut & transitions',
        'Voice synthesis',
        'Subtitle generation',
        'Brand overlay'
      ],
      color: 'bg-blue-500'
    },
    {
      icon: Mic,
      title: 'Audio Studio',
      description: 'Create and edit audio content with advanced AI tools',
      features: [
        'Voice cloning',
        'Noise reduction',
        'Music generation',
        'Podcast editing'
      ],
      color: 'bg-green-500'
    },
    {
      icon: FileText,
      title: 'Content Writer',
      description: 'AI-powered writing assistant for all content types',
      features: [
        'Blog post generation',
        'Social media copy',
        'Email templates',
        'SEO optimization'
      ],
      color: 'bg-orange-500'
    },
    {
      icon: Palette,
      title: 'Brand Designer',
      description: 'Create consistent brand assets and visual identity',
      features: [
        'Logo generation',
        'Color palette creation',
        'Brand guidelines',
        'Asset templates'
      ],
      color: 'bg-pink-500'
    },
    {
      icon: Type,
      title: 'Typography Studio',
      description: 'Advanced text styling and typography tools',
      features: [
        'Custom fonts',
        'Text effects',
        'Layout optimization',
        'Accessibility checks'
      ],
      color: 'bg-indigo-500'
    }
  ];

  const templates = [
    { title: 'Social Media Post', category: 'Social', preview: '📱', downloads: '2.4K' },
    { title: 'Blog Header', category: 'Web', preview: '🌐', downloads: '1.8K' },
    { title: 'Email Newsletter', category: 'Email', preview: '📧', downloads: '3.2K' },
    { title: 'Presentation Slide', category: 'Business', preview: '📊', downloads: '1.5K' },
    { title: 'Video Thumbnail', category: 'Video', preview: '🎬', downloads: '2.9K' },
    { title: 'Infographic', category: 'Design', preview: '📈', downloads: '2.1K' }
  ];

  const assetCategories = [
    { name: 'Stock Photos', count: '10K+', icon: Image },
    { name: 'Video Clips', count: '5K+', icon: Video },
    { name: 'Audio Tracks', count: '3K+', icon: Mic },
    { name: 'Icons & Graphics', count: '15K+', icon: Sparkles },
    { name: 'Fonts', count: '500+', icon: Type },
    { name: 'Templates', count: '1K+', icon: Layout }
  ];

  const tutorials = [
    {
      title: 'Getting Started with AI Image Generation',
      duration: '12 min',
      level: 'Beginner',
      views: '45K'
    },
    {
      title: 'Advanced Video Editing Techniques',
      duration: '28 min',
      level: 'Advanced',
      views: '23K'
    },
    {
      title: 'Creating Consistent Brand Assets',
      duration: '18 min',
      level: 'Intermediate',
      views: '31K'
    },
    {
      title: 'Voice Cloning Best Practices',
      duration: '15 min',
      level: 'Intermediate',
      views: '19K'
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
            Content Creation Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create, edit, and optimize content with AI-powered tools designed for modern creators
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
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
        {activeTab === 'tools' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Creation Tools</h2>
              <p className="text-gray-600">
                Professional-grade tools enhanced with artificial intelligence to streamline your creative workflow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {creationTools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CreationTool {...tool} />
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Quick Start Actions</h3>
                <p className="text-blue-100">Jump right into creating with these popular workflows</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition-colors">
                  <Wand2 className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Generate Social Post</div>
                </button>
                <button className="bg-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition-colors">
                  <Video className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Create Video Ad</div>
                </button>
                <button className="bg-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition-colors">
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Write Blog Post</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Templates</h2>
              <p className="text-gray-600">
                Pre-designed templates to jumpstart your creative projects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TemplateCard {...template} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Asset Library</h2>
              <p className="text-gray-600">
                Curated collection of high-quality assets for your creative projects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assetCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <category.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-gray-600">{category.count} items</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Your Assets</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tutorials' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Tutorials</h2>
              <p className="text-gray-600">
                Learn from experts and master the art of AI-powered content creation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorials.map((tutorial, index) => (
                <motion.div
                  key={tutorial.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Play className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>{tutorial.duration}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tutorial.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          tutorial.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tutorial.level}
                        </span>
                        <span>{tutorial.views} views</span>
                      </div>
                      
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Watch Tutorial →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};