import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Users,
  Activity,
  Clock,
  Eye,
  Settings,
  Upload,
  Download,
  Filter,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  Globe,
  FileText,
  Sliders,
  RefreshCw,
  Calendar,
  MessageCircle,
  HelpCircle,
  LogOut,
  User,
  Home,
  TrendingUp
} from 'lucide-react';

import { SearchAutocomplete } from '../components/SearchAutocomplete';
import { InteractiveChart } from '../components/InteractiveDataViz';
import { SkeletonLoader, CardSkeleton, DashboardSkeleton } from '../components/SkeletonLoader';
import { InfiniteScroll } from '../components/InfiniteScroll';
import { InteractiveTabs } from '../components/InteractiveTabs';
import { DragDropUpload } from '../components/DragDropUpload';
import { useToast } from '../context/ToastContext';
import { AnimatedButton, AnimatedToggle, NotificationBadge } from '../components/MicroInteractions';

interface ThreatItem {
  id: string;
  title: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  region: string;
  status: 'new' | 'reviewing' | 'resolved';
  confidence: number;
}

export const EnterpriseDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [threatItems, setThreatItems] = useState<ThreatItem[]>([]);
  const [hasMoreThreats, setHasMoreThreats] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const { addToast } = useToast();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      addToast('success', 'Dashboard Loaded', 'Welcome to your ModGuard AI dashboard');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Initial threat data
  useEffect(() => {
    if (!isLoading) {
      fetchThreats();
    }
  }, [isLoading]);

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates || isLoading) return;
    
    const interval = setInterval(() => {
      // Add a new threat item occasionally
      if (Math.random() > 0.7) {
        const newThreat = generateMockThreat();
        setThreatItems(prev => [newThreat, ...prev]);
        
        // Show notification for high severity threats
        if (['high', 'critical'].includes(newThreat.severity)) {
          addToast('warning', 'New Threat Detected', `${newThreat.title} in ${newThreat.region}`);
          setNotificationCount(prev => prev + 1);
        }
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [realTimeUpdates, isLoading]);

  const generateMockThreat = (): ThreatItem => {
    const types = ['Deepfake', 'Voice Clone', 'Text Generation', 'Coordinated Attack'];
    const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa'];
    const severities: Array<ThreatItem['severity']> = ['low', 'medium', 'high', 'critical'];
    const statuses: Array<ThreatItem['status']> = ['new', 'reviewing', 'resolved'];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: `${types[Math.floor(Math.random() * types.length)]} Content Detected`,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date().toISOString(),
      region: regions[Math.floor(Math.random() * regions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      confidence: 70 + Math.random() * 30
    };
  };

  const fetchThreats = async () => {
    setIsLoadingMore(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newThreats = Array(10).fill(null).map(generateMockThreat);
    setThreatItems(prev => [...prev, ...newThreats]);
    
    // Simulate end of data after a certain number of items
    if (threatItems.length > 30) {
      setHasMoreThreats(false);
    }
    
    setIsLoadingMore(false);
  };

  const handleFileUpload = (files: File[]) => {
    addToast('info', 'Files Received', `Processing ${files.length} files for analysis`);
    
    // Simulate processing
    setTimeout(() => {
      addToast('success', 'Analysis Complete', 'All files have been processed successfully');
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart data
  const threatTypeData = [
    { id: '1', label: 'Deepfakes', value: 45, color: '#EF4444', trend: 12, category: 'Visual' },
    { id: '2', label: 'Voice Cloning', value: 28, color: '#F59E0B', trend: -5, category: 'Audio' },
    { id: '3', label: 'Text Generation', value: 35, color: '#8B5CF6', trend: 8, category: 'Text' },
    { id: '4', label: 'Coordinated', value: 22, color: '#DC2626', trend: 15, category: 'Network' }
  ];

  const regionData = [
    { id: '1', label: 'North America', value: 127, color: '#3B82F6', trend: -8, category: 'Region' },
    { id: '2', label: 'Europe', value: 98, color: '#10B981', trend: 5, category: 'Region' },
    { id: '3', label: 'Asia Pacific', value: 156, color: '#F59E0B', trend: 23, category: 'Region' },
    { id: '4', label: 'Latin America', value: 64, color: '#8B5CF6', trend: 12, category: 'Region' },
    { id: '5', label: 'Africa', value: 42, color: '#EC4899', trend: 18, category: 'Region' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">ModGuard AI</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <SearchAutocomplete
                onSelect={(result) => {
                  addToast('info', 'Navigation', `Navigating to ${result.title}`);
                }}
                placeholder="Search threats, features, help..."
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationBadge count={notificationCount} onClick={() => setNotificationCount(0)}>
                <Bell className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </NotificationBadge>
              
              <div className="hidden md:flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">System Operational</span>
              </div>
              
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: isSidebarOpen ? 0 : -280 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl lg:relative lg:translate-x-0 lg:shadow-none"
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ModGuard AI</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Sarah Chen</div>
                <div className="text-sm text-gray-500">Enterprise Admin</div>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-6">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Dashboard
              </div>
              <ul className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'threats', label: 'Threat Analysis', icon: AlertTriangle },
                  { id: 'upload', label: 'Content Upload', icon: Upload },
                  { id: 'analytics', label: 'Analytics', icon: Activity }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Settings
              </div>
              <ul className="space-y-1">
                {[
                  { id: 'settings', label: 'General Settings', icon: Settings },
                  { id: 'api', label: 'API & Integrations', icon: Sliders },
                  { id: 'team', label: 'Team Management', icon: Users },
                  { id: 'help', label: 'Help & Support', icon: HelpCircle }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        addToast('info', 'Navigation', `Navigating to ${item.label}`);
                      }}
                      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900">
                <Home className="h-5 w-5 mr-3" />
                Back to Home
              </Link>
              <button className="flex items-center w-full px-3 py-2 mt-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </button>
            </div>
          </nav>
        </motion.div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Real-time insights and threat monitoring
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Link
                      to="/demo"
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Try Live Demo</span>
                    </Link>
                    
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="24h">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                    </select>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Real-time Updates</span>
                      <AnimatedToggle
                        isActive={realTimeUpdates}
                        onChange={setRealTimeUpdates}
                        size="sm"
                      />
                    </div>
                    
                    <AnimatedButton
                      icon={<RefreshCw className="h-4 w-4" />}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToast('info', 'Refreshing Data', 'Fetching the latest information');
                        setTimeout(() => {
                          addToast('success', 'Data Refreshed', 'Dashboard updated with latest data');
                        }, 1000);
                      }}
                    >
                      Refresh
                    </AnimatedButton>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Content Analyzed', value: '127,543', change: 12.3, icon: Activity, color: 'bg-blue-500' },
                    { title: 'Threats Detected', value: '2,847', change: -8.2, icon: AlertTriangle, color: 'bg-red-500' },
                    { title: 'Clean Content', value: '97.8%', change: 2.1, icon: CheckCircle, color: 'bg-green-500' },
                    { title: 'Active Regions', value: '34', change: 5.7, icon: Globe, color: 'bg-purple-500' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                          <div className="flex items-center mt-2">
                            {stat.change > 0 ? (
                              <motion.div
                                animate={{ y: [0, -2, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                              </motion.div>
                            ) : (
                              <motion.div
                                animate={{ y: [0, 2, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
                              </motion.div>
                            )}
                            <span className={`text-sm ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Math.abs(stat.change)}%
                            </span>
                            <span className="text-sm text-gray-500 ml-1">vs last period</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-full ${stat.color}`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InteractiveChart
                    data={threatTypeData}
                    type="bar"
                    title="Threat Type Distribution"
                    height={300}
                    animated={true}
                    interactive={true}
                    showLegend={true}
                    onDataPointClick={(point) => {
                      addToast('info', 'Threat Analysis', `Analyzing ${point.label} threats in detail`);
                    }}
                  />
                  
                  <InteractiveChart
                    data={regionData}
                    type="pie"
                    title="Regional Distribution"
                    height={300}
                    animated={true}
                    interactive={true}
                    showLegend={true}
                    onDataPointClick={(point) => {
                      addToast('info', 'Region Analysis', `Viewing details for ${point.label}`);
                    }}
                  />
                </div>

                {/* Recent Threats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Recent Threats</h2>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Last {timeRange}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-hidden">
                    <InfiniteScroll
                      items={threatItems}
                      renderItem={(item, index) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${
                                item.type.includes('Deepfake') ? 'bg-red-100' :
                                item.type.includes('Voice') ? 'bg-yellow-100' :
                                item.type.includes('Text') ? 'bg-purple-100' :
                                'bg-blue-100'
                              }`}>
                                <AlertTriangle className={`h-5 w-5 ${
                                  item.type.includes('Deepfake') ? 'text-red-600' :
                                  item.type.includes('Voice') ? 'text-yellow-600' :
                                  item.type.includes('Text') ? 'text-purple-600' :
                                  'text-blue-600'
                                }`} />
                              </div>
                              
                              <div>
                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(item.severity)}`}>
                                    {item.severity}
                                  </span>
                                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                                    {item.status}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(item.timestamp).toLocaleString()}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {item.region}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-medium text-gray-900">
                                {item.confidence.toFixed(1)}%
                              </div>
                              <button
                                onClick={() => {
                                  addToast('info', 'Threat Details', `Viewing details for ${item.title}`);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      loadMore={fetchThreats}
                      hasMore={hasMoreThreats}
                      loading={isLoadingMore}
                      className="max-h-96 overflow-y-auto"
                      loadingComponent={
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-gray-600">Loading more threats...</span>
                        </div>
                      }
                      emptyComponent={
                        <div className="p-8 text-center">
                          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No threats detected</h3>
                          <p className="text-gray-600">Your content is currently clean and safe.</p>
                        </div>
                      }
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Content Upload</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload content for AI-powered analysis and moderation
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload Files</h2>
                  
                  <DragDropUpload
                    onFilesUploaded={handleFileUpload}
                    acceptedTypes={['image/*', 'video/*', 'audio/*', 'application/pdf']}
                    maxFileSize={50}
                    maxFiles={10}
                    multiple={true}
                    showPreviews={true}
                  />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Analysis Options</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Deepfake Detection</h3>
                        <p className="text-sm text-gray-500">Identify AI-generated synthetic media</p>
                      </div>
                      <AnimatedToggle
                        isActive={true}
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Cultural Context Filter</h3>
                        <p className="text-sm text-gray-500">Apply regional content standards</p>
                      </div>
                      <AnimatedToggle
                        isActive={true}
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Explainable AI</h3>
                        <p className="text-sm text-gray-500">Generate detailed analysis reports</p>
                      </div>
                      <AnimatedToggle
                        isActive={true}
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Real-time Processing</h3>
                        <p className="text-sm text-gray-500">Immediate analysis and feedback</p>
                      </div>
                      <AnimatedToggle
                        isActive={false}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Comprehensive insights into your content moderation performance
                  </p>
                </div>

                <InteractiveTabs
                  tabs={[
                    {
                      id: 'overview',
                      label: 'Overview',
                      content: (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <InteractiveChart
                              data={threatTypeData}
                              type="bar"
                              title="Threat Type Distribution"
                              height={300}
                              animated={true}
                              interactive={true}
                              showLegend={true}
                            />
                            
                            <InteractiveChart
                              data={regionData}
                              type="pie"
                              title="Regional Distribution"
                              height={300}
                              animated={true}
                              interactive={true}
                              showLegend={true}
                            />
                          </div>
                        </div>
                      )
                    },
                    {
                      id: 'threats',
                      label: 'Threat Analysis',
                      content: (
                        <div className="space-y-6">
                          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Threat Severity Distribution</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                { label: 'Critical', value: '23', color: 'bg-red-100 text-red-800' },
                                { label: 'High', value: '156', color: 'bg-orange-100 text-orange-800' },
                                { label: 'Medium', value: '342', color: 'bg-yellow-100 text-yellow-800' },
                                { label: 'Low', value: '578', color: 'bg-green-100 text-green-800' }
                              ].map((item, index) => (
                                <motion.div
                                  key={item.label}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-white rounded-lg border border-gray-200 p-4 text-center"
                                >
                                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${item.color} mb-2`}>
                                    {item.label}
                                  </div>
                                  <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    },
                    {
                      id: 'performance',
                      label: 'System Performance',
                      content: (
                        <div className="space-y-6">
                          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[
                                { label: 'Average Response Time', value: '127ms', icon: Clock, color: 'bg-blue-100 text-blue-600' },
                                { label: 'Uptime', value: '99.9%', icon: Activity, color: 'bg-green-100 text-green-600' },
                                { label: 'API Calls', value: '1.2M', icon: Zap, color: 'bg-purple-100 text-purple-600' }
                              ].map((item, index) => (
                                <motion.div
                                  key={item.label}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-white rounded-lg border border-gray-200 p-4"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${item.color}`}>
                                      <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">{item.label}</div>
                                      <div className="text-xl font-bold text-gray-900">{item.value}</div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    }
                  ]}
                  defaultTabId="overview"
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure your ModGuard AI platform settings
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Real-time Updates</h3>
                        <p className="text-sm text-gray-500">Receive live threat notifications</p>
                      </div>
                      <AnimatedToggle
                        isActive={realTimeUpdates}
                        onChange={(value) => {
                          setRealTimeUpdates(value);
                          addToast(
                            value ? 'success' : 'info',
                            value ? 'Real-time Updates Enabled' : 'Real-time Updates Disabled',
                            value ? 'You will now receive live threat notifications' : 'You will no longer receive live updates'
                          );
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive alerts via email</p>
                      </div>
                      <AnimatedToggle
                        isActive={true}
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Slack Integration</h3>
                        <p className="text-sm text-gray-500">Send alerts to Slack channels</p>
                      </div>
                      <AnimatedToggle
                        isActive={false}
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Data Retention</h3>
                        <p className="text-sm text-gray-500">Store threat data for 90 days</p>
                      </div>
                      <AnimatedToggle
                        isActive={true}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">API Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="flex">
                        <input
                          type="password"
                          value="••••••••••••••••••••••••••••••"
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-500"
                        />
                        <button
                          onClick={() => {
                            addToast('success', 'API Key Copied', 'API key has been copied to clipboard');
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://your-domain.com/webhook"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <AnimatedButton
                        onClick={() => {
                          addToast('success', 'Settings Saved', 'Your API settings have been updated');
                        }}
                      >
                        Save API Settings
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-4 h-16">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'threats', label: 'Threats', icon: AlertTriangle },
            { id: 'upload', label: 'Upload', icon: Upload },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center"
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-xs mt-1 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Help Button */}
      <div className="fixed right-6 bottom-6 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            addToast('info', 'Help & Support', 'Opening live chat with our support team');
          }}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      </div>
    </div>
  );
};