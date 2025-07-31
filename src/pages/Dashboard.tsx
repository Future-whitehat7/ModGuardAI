import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Activity,
  Shield,
  Zap,
  Upload,
  Settings,
  Eye,
  Database
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.6, 
      delay: index * 0.1,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{ 
      scale: 1.05, 
      y: -10,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.95 }}
    className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 w-full cursor-pointer"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="text-xs sm:text-sm font-medium text-gray-600 truncate"
        >
          {title}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
          className="text-lg sm:text-2xl font-bold text-gray-900 mt-1"
        >
          {value}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          className={`text-xs sm:text-sm mt-1 flex items-center ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          <motion.div
            animate={{ 
              rotate: change > 0 ? [0, 10, 0] : [0, -10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {change > 0 ? (
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            )}
          </motion.div>
          <span className="hidden sm:inline">{change > 0 ? '+' : ''}{change}% from last week</span>
          <span className="sm:hidden">{change > 0 ? '+' : ''}{change}%</span>
        </motion.p>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: index * 0.1 + 0.6,
          type: "spring",
          stiffness: 200
        }}
        whileHover={{ 
          rotate: 360,
          transition: { duration: 0.5 }
        }}
        className={`p-2 sm:p-3 rounded-full ${color} ml-2 sm:ml-4 flex-shrink-0`}
      >
        <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

const ThreatCard = ({ threat, severity, region, time, index }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -50, rotateY: -90 }}
    animate={{ opacity: 1, x: 0, rotateY: 0 }}
    transition={{ 
      duration: 0.6, 
      delay: index * 0.1,
      type: "spring"
    }}
    whileHover={{ 
      scale: 1.02,
      x: 10,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }}
    className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
          whileHover={{ 
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5 }
          }}
          className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
            severity === 'High' ? 'bg-red-100' : 
            severity === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
          }`}
        >
          <AlertTriangle className={`h-3 w-3 sm:h-4 sm:w-4 ${
            severity === 'High' ? 'text-red-600' : 
            severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'
          }`} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="text-sm sm:text-base font-medium text-gray-900 truncate"
          >
            {threat}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="text-xs sm:text-sm text-gray-600 truncate"
          >
            {region}
          </motion.p>
        </div>
      </div>
      <div className="text-right ml-2 sm:ml-4 flex-shrink-0">
        <motion.span 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.6, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
            severity === 'High' ? 'bg-red-100 text-red-800' : 
            severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
          }`}
        >
          {severity}
        </motion.span>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.7 }}
          className="text-xs text-gray-500 mt-1"
        >
          {time}
        </motion.p>
      </div>
    </div>
  </motion.div>
);

export const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const stats = [
    {
      title: 'Content Analyzed Today',
      value: '127,543',
      change: 12.3,
      icon: Activity,
      color: 'bg-blue-500'
    },
    {
      title: 'Threats Detected',
      value: '2,847',
      change: -8.2,
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      title: 'Clean Content',
      value: '97.8%',
      change: 2.1,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Active Regions',
      value: '34',
      change: 5.7,
      icon: Globe,
      color: 'bg-purple-500'
    }
  ];

  const recentThreats = [
    {
      threat: 'Deepfake Detection - Political Figure',
      severity: 'High',
      region: 'North America',
      time: '2 min ago'
    },
    {
      threat: 'Inappropriate Content - Social Media',
      severity: 'Medium',
      region: 'Europe',
      time: '5 min ago'
    },
    {
      threat: 'Hate Speech Detection',
      severity: 'High',
      region: 'Asia Pacific',
      time: '8 min ago'
    },
    {
      threat: 'Spam Content Filter',
      severity: 'Low',
      region: 'Global',
      time: '12 min ago'
    }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'threats', label: 'Threat Analysis', icon: Shield },
    { id: 'upload', label: 'Content Upload', icon: Upload },
    { id: 'analytics', label: 'Analytics', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6 sm:space-y-8 w-full">
            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <StatCard key={stat.title} {...stat} index={index} />
              ))}
            </div>

            {/* Main Content Grid - Responsive */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
              {/* Real-time Activity - Full width on mobile */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900">Real-time Activity</h2>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs sm:text-sm text-gray-600">Live</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {recentThreats.map((threat, index) => (
                        <ThreatCard key={index} {...threat} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status Sidebar - Stack on mobile */}
              <div className="space-y-4 sm:space-y-6">
                {/* AI Models Status */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">AI Models Status</h2>
                  </div>
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    {[
                      { icon: Shield, label: 'Deepfake Detection', color: 'text-blue-600' },
                      { icon: Activity, label: 'Content Analysis', color: 'text-purple-600' },
                      { icon: Globe, label: 'Cultural Context', color: 'text-orange-600' }
                    ].map((item, index) => (
                      <motion.div 
                        key={item.label}
                        whileHover={{ x: 2 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
                          <span className="text-xs sm:text-sm font-medium truncate">{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs sm:text-sm text-green-600">Active</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg text-white p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold">Performance</h3>
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { label: 'Avg Response Time', value: '127ms' },
                      { label: 'Accuracy Rate', value: '99.2%' },
                      { label: 'Uptime', value: '99.9%' }
                    ].map((metric, index) => (
                      <motion.div 
                        key={metric.label}
                        whileHover={{ x: 2 }}
                        className="flex justify-between items-center"
                      >
                        <span className="text-blue-100 text-xs sm:text-sm truncate">{metric.label}</span>
                        <span className="font-semibold text-sm sm:text-base">
                          {metric.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* API Usage */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">API Usage</h2>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-xs sm:text-sm text-gray-600">This Month</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">2.4M / 5M calls</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: '48%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-blue-600 h-2 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      48% of monthly quota used
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'threats':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6 w-full"
          >
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6"
            >
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6"
              >
                Threat Analysis Dashboard
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {[
                  { title: 'High Priority Threats', value: '23', color: 'red', desc: 'Requires immediate attention' },
                  { title: 'Medium Priority', value: '156', color: 'yellow', desc: 'Under review' },
                  { title: 'Resolved Today', value: '342', color: 'green', desc: 'Successfully mitigated' }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 50, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                    }}
                    className={`bg-${item.color}-50 rounded-lg p-3 sm:p-4 cursor-pointer`}
                  >
                    <h3 className={`text-sm sm:text-lg font-semibold text-${item.color}-800 mb-1 sm:mb-2 truncate`}>{item.title}</h3>
                    <motion.p 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                      className={`text-2xl sm:text-3xl font-bold text-${item.color}-600`}
                    >
                      {item.value}
                    </motion.p>
                    <p className={`text-xs sm:text-sm text-${item.color}-600`}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentThreats.map((threat, index) => (
                  <ThreatCard key={index} {...threat} index={index} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        );

      case 'upload':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6 w-full"
          >
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-8"
            >
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6"
              >
                Content Upload & Analysis
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: "rgb(59, 130, 246)",
                  backgroundColor: "rgb(239, 246, 255)"
                }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center transition-all duration-300"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-base sm:text-lg font-semibold text-gray-900 mb-2"
                >
                  Upload Content for Analysis
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4"
                >
                  Drag and drop files here, or click to select
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Select Files
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        );

      case 'analytics':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6 w-full"
          >
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6"
            >
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6"
              >
                Analytics Dashboard
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                  <StatCard key={stat.title} {...stat} index={index} />
                ))}
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.01 }}
                className="mt-6 sm:mt-8 bg-gray-50 rounded-lg p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Content Analysis Trends</h3>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="h-48 sm:h-64 flex items-center justify-center text-gray-500"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <BarChart3 className="h-12 w-12 sm:h-16 sm:w-16 mr-4" />
                  </motion.div>
                  <span className="text-sm sm:text-base">Analytics charts would be displayed here</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6 w-full"
          >
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6"
            >
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6"
              >
                System Settings
              </motion.h2>
              <div className="space-y-4 sm:space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="border-b border-gray-200 pb-4 sm:pb-6"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Detection Settings</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { label: 'Deepfake Detection', enabled: true },
                      { label: 'Cultural Context Filtering', enabled: true },
                      { label: 'Real-time Analysis', enabled: false }
                    ].map((setting, index) => (
                      <motion.div 
                        key={setting.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm sm:text-base text-gray-700 truncate">{setting.label}</span>
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full relative cursor-pointer transition-colors ${
                            setting.enabled ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div 
                            animate={{ 
                              x: setting.enabled ? (window.innerWidth < 640 ? 20 : 24) : 2 
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full absolute top-0.5"
                          />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Notification Settings</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { label: 'Email Alerts', enabled: true },
                      { label: 'Slack Integration', enabled: false }
                    ].map((setting, index) => (
                      <motion.div 
                        key={setting.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm sm:text-base text-gray-700 truncate">{setting.label}</span>
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full relative cursor-pointer transition-colors ${
                            setting.enabled ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div 
                            animate={{ 
                              x: setting.enabled ? (window.innerWidth < 640 ? 20 : 24) : 2 
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full absolute top-0.5"
                          />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Responsive */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-48 sm:w-64 bg-white shadow-lg border-r border-gray-200 flex-shrink-0"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-3 sm:p-6 border-b border-gray-200"
        >
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">Content Moderation Suite</p>
        </motion.div>
        
        <nav className="mt-4 sm:mt-6 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ 
                x: 10,
                backgroundColor: "rgb(249, 250, 251)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center px-3 sm:px-6 py-2 sm:py-3 text-left transition-all ${
                activeSection === item.id 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
              </motion.div>
              <span className="text-xs sm:text-sm truncate">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Main Content - Force Centered with Responsive Design */}
      <div className="flex-1 overflow-auto">
        <main className="min-h-full w-full flex justify-center">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100
                }}
                className="w-full flex justify-center"
              >
                <div className="w-full max-w-7xl">
                  {renderContent()}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};