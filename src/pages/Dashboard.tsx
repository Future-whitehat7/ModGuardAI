import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Database,
  Download,
  ExternalLink,
  RefreshCcw,
  Target,
  Home,
  FileText,
  Award,
  Lock,
  Play,
  Pause,
  Filter,
  Search,
  X,
  Bell,
  Menu,
  User,
  MessageCircle,
  Info
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <div className="flex items-center mt-2">
          {change > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last week</span>
        </div>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const ThreatCard = ({ threat, severity, region, time, index }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3 flex-1">
        <div className={`p-2 rounded-full ${
          severity === 'High' ? 'bg-red-100' : 
          severity === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
        }`}>
          <AlertTriangle className={`h-4 w-4 ${
            severity === 'High' ? 'text-red-600' : 
            severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'
          }`} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{threat}</p>
          <p className="text-sm text-gray-600">{region}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          severity === 'High' ? 'bg-red-100 text-red-800' : 
          severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {severity}
        </span>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  </motion.div>
);

export const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [isLiveData, setIsLiveData] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const stats = [
    { title: 'Content Analyzed Today', value: '127,543', change: 12.3, icon: Activity, color: 'bg-blue-500' },
    { title: 'Threats Detected', value: '2,847', change: -8.2, icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Clean Content Rate', value: '97.8%', change: 2.1, icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Active Regions', value: '50+', change: 5.7, icon: Globe, color: 'bg-purple-500' }
  ];

  const recentThreats = [
    { threat: 'Deepfake Detection - Political Figure', severity: 'High', region: 'North America', time: '2 min ago' },
    { threat: 'Voice Cloning - Financial Fraud', severity: 'Critical', region: 'Europe', time: '5 min ago' },
    { threat: 'Synthetic Text - News Article', severity: 'Medium', region: 'Asia Pacific', time: '8 min ago' },
    { threat: 'Coordinated Attack - Social Media', severity: 'High', region: 'Latin America', time: '12 min ago' }
  ];

  const ethicsAudits = [
    {
      title: 'AI Bias Assessment Q1 2025',
      date: '2025-01-15',
      score: 96.8,
      status: 'passed',
      summary: 'Comprehensive bias testing across cultural contexts shows minimal algorithmic bias with 96.8% fairness score.'
    },
    {
      title: 'Transparency Framework Review',
      date: '2024-12-20',
      score: 94.5,
      status: 'passed',
      summary: 'Independent review of explainable AI systems confirms high transparency standards in decision-making processes.'
    },
    {
      title: 'Data Privacy Compliance Audit',
      date: '2024-11-30',
      score: 89.2,
      status: 'warning',
      summary: 'GDPR compliance maintained with minor recommendations for data retention policy updates.'
    }
  ];

  const complianceStatus = [
    { regulation: 'GDPR (EU)', status: 'compliant', lastCheck: '2025-01-20', certificate: 'GDPR-2025-001' },
    { regulation: 'CCPA (California)', status: 'compliant', lastCheck: '2025-01-18', certificate: 'CCPA-2025-001' },
    { regulation: 'SOC 2 Type II', status: 'compliant', lastCheck: '2025-01-15', certificate: 'SOC2-2025-001' },
    { regulation: 'ISO 27001', status: 'compliant', lastCheck: '2025-01-10', certificate: 'ISO-2025-001' },
    { regulation: 'EU AI Act', status: 'pending', lastCheck: '2025-01-22' },
    { regulation: 'NIST AI Framework', status: 'compliant', lastCheck: '2025-01-12', certificate: 'NIST-2025-001' }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'live-kpis', label: 'Live KPIs', icon: Activity },
    { id: 'content-moderation', label: 'Content Moderation Suite', icon: Eye },
    { id: 'threat-analysis', label: 'Threat Analysis', icon: AlertTriangle },
    { id: 'ethics-audit', label: 'Ethics Audit', icon: Shield },
    { id: 'compliance', label: 'Compliance Reports', icon: FileText },
    { id: 'settings', label: 'Settings & Configuration', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Header with prominent CTA */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="mt-2 text-gray-600">Real-time insights and comprehensive threat monitoring</p>
              </div>
              
              <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
                {/* Upload Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload & Analyze Content</h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                    <Upload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Content for Analysis</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Drag and drop images, videos, or audio files here, or click to select files from your computer
                    </p>
                    <Link
                      to="/demo"
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 font-medium"
                    >
                      <Upload className="h-5 w-5" />
                      <span>Start Analysis</span>
                    </Link>
                    <p className="text-sm text-gray-500 mt-4">
                      Supports images, videos, and audio files (max 100MB)
                    </p>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      icon: Shield,
                      title: 'Deepfake Detection',
                      description: 'Advanced AI models detect synthetic media with 99.2% accuracy across all formats',
                      action: 'Try Detection'
                    },
                    {
                      icon: Globe,
                      title: 'Cultural Context Analysis',
                      description: 'AI that understands cultural nuances and regional sensitivities across 50+ markets',
                      action: 'Explore Cultural AI'
                    },
                    {
                      icon: Zap,
                      title: 'Real-time Processing',
                      description: 'Lightning-fast analysis with 127ms average response time for instant results',
                      action: 'See Live Processing'
                    },
                    {
                      icon: Eye,
                      title: 'Content Verification',
                      description: 'Comprehensive authenticity verification with detailed confidence scoring',
                      action: 'Verify Content'
                    },
                    {
                      icon: BarChart3,
                      title: 'Analytics & Reporting',
                      description: 'Detailed insights and comprehensive reporting on all content analysis',
                      action: 'View Analytics'
                    },
                    {
                      icon: Settings,
                      title: 'Custom Configuration',
                      description: 'Tailored moderation settings and rules for your specific requirements',
                      action: 'Configure Now'
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <feature.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-6">{feature.description}</p>
                      <Link
                        to="/demo"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium group"
                      >
                        <span>{feature.action}</span>
                        <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <Link
                  to="/demo"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all inline-flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Try Live Demo</span>
                </Link>
                
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={stat.title} {...stat} index={index} />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Real-time Activity */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Real-time Threat Activity</h2>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-gray-600">Live Monitoring</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentThreats.map((threat, index) => (
                        <ThreatCard key={index} {...threat} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { label: 'Deepfake Detection', status: 'Active', icon: Shield, color: 'text-blue-600' },
                      { label: 'Content Analysis', status: 'Active', icon: Activity, color: 'text-purple-600' },
                      { label: 'Cultural Context', status: 'Active', icon: Globe, color: 'text-green-600' },
                      { label: 'Real-time Processing', status: 'Active', icon: Zap, color: 'text-orange-600' }
                    ].map((item, index) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                          <span className="text-sm font-medium text-gray-900">{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-green-600">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Performance Metrics</h3>
                    <Target className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-100">Detection Accuracy</span>
                      <span className="font-bold">99.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-100">Response Time</span>
                      <span className="font-bold">127ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-100">System Uptime</span>
                      <span className="font-bold">99.97%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'content-moderation':
        return (
          <div className="space-y-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Content Upload & Analysis</h1>
                <p className="mt-2 text-gray-600">Advanced AI-powered content analysis and moderation tools</p>
              </div>
              
              <Link
                to="/demo"
                className="mt-6 lg:mt-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all inline-flex items-center space-x-2"
              >
                <Upload className="h-5 w-5" />
                <span>Try Live Analysis</span>
              </Link>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload & Analyze Content</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Content for Analysis</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Drag and drop images, videos, or audio files here, or click to select files from your computer
                </p>
                <Link
                  to="/demo"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all inline-flex items-center space-x-2 font-medium"
                >
                  <Upload className="h-5 w-5" />
                  <span>Start Analysis</span>
                </Link>
                <p className="text-sm text-gray-500 mt-4">
                  Supports images, videos, and audio files (max 100MB)
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Deepfake Detection',
                  description: 'Advanced AI models detect synthetic media with 99.2% accuracy across all formats',
                  action: 'Try Detection'
                },
                {
                  icon: Globe,
                  title: 'Cultural Context Analysis',
                  description: 'AI that understands cultural nuances and regional sensitivities across 50+ markets',
                  action: 'Explore Cultural AI'
                },
                {
                  icon: Zap,
                  title: 'Real-time Processing',
                  description: 'Lightning-fast analysis with 127ms average response time for instant results',
                  action: 'See Live Processing'
                },
                {
                  icon: Eye,
                  title: 'Content Verification',
                  description: 'Comprehensive authenticity verification with detailed confidence scoring',
                  action: 'Verify Content'
                },
                {
                  icon: BarChart3,
                  title: 'Analytics & Reporting',
                  description: 'Detailed insights and comprehensive reporting on all content analysis',
                  action: 'View Analytics'
                },
                {
                  icon: Settings,
                  title: 'Custom Configuration',
                  description: 'Tailored moderation settings and rules for your specific requirements',
                  action: 'Configure Now'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Link
                    to="/demo"
                    className="inline-flex items-center space-x-2 text-cyan-600 hover:text-blue-600 font-medium group"
                  >
                    <span>{feature.action}</span>
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
            </div>
          </div>
        );

      case 'live-kpis':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Live KPIs & Performance</h1>
                <p className="mt-2 text-gray-600">Real-time performance indicators and system metrics</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isLiveData ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-medium text-gray-700">{isLiveData ? 'Live Data' : 'Static Mode'}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </div>
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <RefreshCcw className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Enhanced KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Detection Accuracy', value: '99.2%', change: 0.3, icon: Target, color: 'bg-green-500' },
                { title: 'Processing Speed', value: '127ms', change: -5.2, icon: Zap, color: 'bg-cyan-500' },
                { title: 'Threats Detected Today', value: '2,847', change: 12.8, icon: AlertTriangle, color: 'bg-orange-500' },
                { title: 'System Uptime', value: '99.97%', change: 0.02, icon: Activity, color: 'bg-purple-500' },
                { title: 'Protected Users', value: '127M+', change: 8.5, icon: Users, color: 'bg-blue-500' },
                { title: 'Global Coverage', value: '50+ Regions', change: 4.2, icon: Globe, color: 'bg-emerald-500' }
              ].map((kpi, index) => (
                <motion.div
                  key={kpi.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <kpi.icon className={`h-8 w-8 text-white p-2 rounded-lg ${kpi.color}`} />
                    <div className="flex items-center space-x-1">
                      {kpi.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${kpi.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</div>
                  <div className="text-gray-600">{kpi.title}</div>
                </motion.div>
              ))}
            </div>

            {/* Real-time Chart Placeholder */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Real-time Performance Analytics</h3>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Live performance charts and analytics</p>
                  <p className="text-sm text-gray-500 mt-2">Real-time data visualization would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ethics-audit':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ethics Audit & Transparency</h1>
              <p className="mt-2 text-gray-600">AI ethics assessments and transparency reports</p>
            </div>

            <div className="space-y-6">
              {ethicsAudits.map((audit, index) => (
                <motion.div
                  key={audit.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{audit.title}</h3>
                      <p className="text-gray-600">{new Date(audit.date).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{audit.score}%</div>
                        <div className="text-sm text-gray-500">Ethics Score</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compliance Reports</h1>
              <p className="mt-2 text-gray-600">Regulatory compliance status and certifications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceStatus.map((compliance, index) => (
                <motion.div
                  key={compliance.regulation}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{compliance.regulation}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(compliance.status)}`}>
                      {compliance.status.charAt(0).toUpperCase() + compliance.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Check:</span>
                      <span className="text-gray-900 font-medium">{new Date(compliance.lastCheck).toLocaleDateString()}</span>
                    </div>
                    
                    {compliance.certificate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certificate ID:</span>
                        <span className="text-blue-600 font-mono text-xs">{compliance.certificate}</span>
                      </div>
                    )}
                  </div>
                  
                  {compliance.certificate && (
                    <button className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download Certificate</span>
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'threat-analysis':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Advanced Threat Analysis</h1>
                <p className="mt-2 text-gray-600">Comprehensive threat detection and analysis dashboard</p>
              </div>
              <Link
                to="/demo"
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all inline-flex items-center space-x-2"
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Try Threat Detection</span>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Threat Distribution Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { title: 'Critical Threats', value: '23', color: 'red', desc: 'Immediate action required' },
                  { title: 'High Priority', value: '156', color: 'orange', desc: 'Under active investigation' },
                  { title: 'Resolved Today', value: '342', color: 'green', desc: 'Successfully mitigated' }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-6 text-center`}
                  >
                    <h3 className={`text-lg font-semibold text-${item.color}-800 mb-2`}>{item.title}</h3>
                    <p className={`text-3xl font-bold text-${item.color}-600 mb-2`}>{item.value}</p>
                    <p className={`text-sm text-${item.color}-600`}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Threat Activity</h3>
                {recentThreats.map((threat, index) => (
                  <ThreatCard key={index} {...threat} index={index} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings & Configuration</h1>
              <p className="mt-2 text-gray-600">Configure your ModGuard AI platform settings and preferences</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detection Settings</h2>
              <div className="space-y-6">
                {[
                  { label: 'Deepfake Detection', description: 'Enable advanced synthetic media detection', enabled: true },
                  { label: 'Cultural Context Filtering', description: 'Apply regional content standards', enabled: true },
                  { label: 'Real-time Analysis', description: 'Process content in real-time', enabled: false },
                  { label: 'Explainable AI Reports', description: 'Generate detailed analysis explanations', enabled: true }
                ].map((setting, index) => (
                  <div key={setting.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{setting.label}</h3>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                      setting.enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white shadow-lg border-r border-gray-200 min-h-screen sticky top-0">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Unified Control Center</p>
          </div>
          
          <nav className="mt-6">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-all ${
                  activeSection === item.id 
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};