import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  Share2,
  Filter,
  Search,
  Lock,
  Eye,
  BarChart3,
  Clock,
  MapPin,
  Zap,
  Users,
  FileText,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Settings,
  Info,
  Calendar,
  Target,
  Activity,
  Radar,
  Crosshair,
  Layers,
  Satellite,
  Map as MapIcon,
  Home,
  X,
  CheckCircle,
  Copy,
  Send
} from 'lucide-react';

interface ThreatData {
  id: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  threatType: 'deepfake' | 'ai-voice' | 'meme-campaign' | 'coordinated-attack';
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  timestamp: string;
  description: string;
  confidence: number;
}

interface RegionData {
  name: string;
  code: string;
  flagCount: number;
  threatMix: {
    deepfake: number;
    aiVoice: number;
    meme: number;
    coordinated: number;
  };
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  countries: string[];
  lastUpdate: string;
}

interface ForecastAlert {
  id: string;
  region: string;
  type: string;
  probability: number;
  timeframe: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const ThreatMapExplorer = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [threatTypeFilter, setThreatTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'global' | 'my-region' | 'top-risk'>('global');
  const [mapStyle, setMapStyle] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite');
  const [showLayers, setShowLayers] = useState({
    threats: true,
    regions: true,
    forecast: true,
    traffic: false
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThreat, setSelectedThreat] = useState<ThreatData | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock threat data
  const [threats] = useState<ThreatData[]>([
    {
      id: '1',
      country: 'Nigeria',
      region: 'Africa',
      lat: 9.0820,
      lng: 8.6753,
      threatType: 'deepfake',
      threatLevel: 'high',
      count: 14,
      timestamp: '2025-01-27T10:30:00Z',
      description: 'Political deepfake videos targeting upcoming elections',
      confidence: 94.2
    },
    {
      id: '2',
      country: 'Brazil',
      region: 'Latin America',
      lat: -14.2350,
      lng: -51.9253,
      threatType: 'ai-voice',
      threatLevel: 'medium',
      count: 8,
      timestamp: '2025-01-27T09:15:00Z',
      description: 'AI-generated voice cloning for financial fraud',
      confidence: 87.6
    },
    {
      id: '3',
      country: 'India',
      region: 'Asia Pacific',
      lat: 20.5937,
      lng: 78.9629,
      threatType: 'meme-campaign',
      threatLevel: 'critical',
      count: 23,
      timestamp: '2025-01-27T11:45:00Z',
      description: 'Coordinated meme disinformation campaign',
      confidence: 96.8
    },
    {
      id: '4',
      country: 'United States',
      region: 'North America',
      lat: 39.8283,
      lng: -98.5795,
      threatType: 'deepfake',
      threatLevel: 'medium',
      count: 6,
      timestamp: '2025-01-27T08:20:00Z',
      description: 'Celebrity deepfake content for misinformation',
      confidence: 91.3
    },
    {
      id: '5',
      country: 'Germany',
      region: 'Europe',
      lat: 51.1657,
      lng: 10.4515,
      threatType: 'coordinated-attack',
      threatLevel: 'high',
      count: 12,
      timestamp: '2025-01-27T12:10:00Z',
      description: 'Multi-platform coordinated disinformation attack',
      confidence: 93.7
    },
    {
      id: '6',
      country: 'South Korea',
      region: 'Asia Pacific',
      lat: 35.9078,
      lng: 127.7669,
      threatType: 'ai-voice',
      threatLevel: 'low',
      count: 3,
      timestamp: '2025-01-27T07:30:00Z',
      description: 'Voice synthesis for social engineering',
      confidence: 82.1
    }
  ]);

  const [regions] = useState<RegionData[]>([
    {
      name: 'Asia Pacific',
      code: 'APAC',
      flagCount: 156,
      threatMix: { deepfake: 45, aiVoice: 25, meme: 20, coordinated: 10 },
      trend: 'up',
      trendPercentage: 23.5,
      riskLevel: 'high',
      countries: ['China', 'India', 'Japan', 'South Korea', 'Australia', 'Indonesia', 'Thailand', 'Vietnam'],
      lastUpdate: '2025-01-27T12:00:00Z'
    },
    {
      name: 'North America',
      code: 'NA',
      flagCount: 89,
      threatMix: { deepfake: 35, aiVoice: 30, meme: 25, coordinated: 10 },
      trend: 'down',
      trendPercentage: -8.2,
      riskLevel: 'medium',
      countries: ['United States', 'Canada', 'Mexico'],
      lastUpdate: '2025-01-27T11:45:00Z'
    },
    {
      name: 'Europe',
      code: 'EU',
      flagCount: 67,
      threatMix: { deepfake: 40, aiVoice: 20, meme: 30, coordinated: 10 },
      trend: 'stable',
      trendPercentage: 2.1,
      riskLevel: 'medium',
      countries: ['Germany', 'France', 'United Kingdom', 'Italy', 'Spain', 'Netherlands', 'Poland', 'Sweden'],
      lastUpdate: '2025-01-27T12:15:00Z'
    },
    {
      name: 'Latin America',
      code: 'LATAM',
      flagCount: 134,
      threatMix: { deepfake: 30, aiVoice: 35, meme: 25, coordinated: 10 },
      trend: 'up',
      trendPercentage: 48.3,
      riskLevel: 'critical',
      countries: ['Brazil', 'Argentina', 'Mexico', 'Colombia', 'Chile', 'Peru', 'Venezuela'],
      lastUpdate: '2025-01-27T11:30:00Z'
    },
    {
      name: 'Africa',
      code: 'AF',
      flagCount: 78,
      threatMix: { deepfake: 50, aiVoice: 15, meme: 25, coordinated: 10 },
      trend: 'up',
      trendPercentage: 31.7,
      riskLevel: 'high',
      countries: ['Nigeria', 'South Africa', 'Kenya', 'Egypt', 'Ghana', 'Morocco', 'Ethiopia'],
      lastUpdate: '2025-01-27T10:45:00Z'
    },
    {
      name: 'Middle East',
      code: 'ME',
      flagCount: 45,
      threatMix: { deepfake: 35, aiVoice: 25, meme: 30, coordinated: 10 },
      trend: 'stable',
      trendPercentage: -1.2,
      riskLevel: 'medium',
      countries: ['Saudi Arabia', 'UAE', 'Israel', 'Turkey', 'Iran', 'Jordan'],
      lastUpdate: '2025-01-27T12:30:00Z'
    }
  ]);

  const [forecastAlerts] = useState<ForecastAlert[]>([
    {
      id: '1',
      region: 'Latin America',
      type: 'Voice-based coordinated attack',
      probability: 72,
      timeframe: '48h',
      description: 'AI models forecast a 72% chance of coordinated voice-based attacks in Southeast Asia in 72 hours.',
      severity: 'high'
    },
    {
      id: '2',
      region: 'Asia Pacific',
      type: 'Deepfake surge',
      probability: 65,
      timeframe: '24h',
      description: 'Predicted surge in political deepfake content ahead of regional elections.',
      severity: 'medium'
    },
    {
      id: '3',
      region: 'Africa',
      type: 'Meme disinformation campaign',
      probability: 58,
      timeframe: '72h',
      description: 'Coordinated meme-based disinformation campaign likely to emerge.',
      severity: 'medium'
    }
  ]);

  // Radar sweep animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setRadarSweepAngle(prev => (prev + 2) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const getThreatColor = (type: string) => {
    switch (type) {
      case 'deepfake': return '#EF4444'; // Red
      case 'ai-voice': return '#F59E0B'; // Yellow
      case 'meme-campaign': return '#8B5CF6'; // Purple
      case 'coordinated-attack': return '#DC2626'; // Dark Red
      default: return '#6B7280'; // Gray
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'deepfake': return '🎭';
      case 'ai-voice': return '🎤';
      case 'meme-campaign': return '🎨';
      case 'coordinated-attack': return '⚡';
      default: return '⚠️';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const filteredThreats = threats.filter(threat => {
    if (threatTypeFilter !== 'all' && threat.threatType !== threatTypeFilter) return false;
    if (searchTerm && !threat.country.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !threat.region.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredRegions = regions.filter(region => {
    if (viewMode === 'top-risk') {
      return ['critical', 'high'].includes(region.riskLevel);
    }
    if (searchTerm && !region.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (viewMode === 'top-risk') {
      const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return riskOrder[b.riskLevel as keyof typeof riskOrder] - riskOrder[a.riskLevel as keyof typeof riskOrder];
    }
    return b.flagCount - a.flagCount;
  });

  const handleExport = (format: string) => {
    // Simulate export functionality
    const data = {
      timestamp: new Date().toISOString(),
      timeRange,
      regions: filteredRegions,
      threats: filteredThreats,
      forecast: forecastAlerts
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-analysis-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleShare = (method: string) => {
    const shareUrl = `${window.location.origin}/threat-map?region=${selectedRegion}&time=${timeRange}`;
    
    if (method === 'copy') {
      navigator.clipboard.writeText(shareUrl);
    } else if (method === 'email') {
      window.open(`mailto:?subject=ModGuard AI Threat Analysis&body=View the latest threat analysis: ${shareUrl}`);
    } else if (method === 'slack') {
      // In a real app, this would integrate with Slack API
      console.log('Share to Slack:', shareUrl);
    }
    
    setShowShareModal(false);
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
                <span className="text-gray-600 hover:text-blue-600 transition-colors">Homepage</span>
              </Link>
              <span className="text-gray-400">|</span>
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 font-sora">Threat Map Explorer</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search regions, countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
              </div>

              {/* Time Range */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              {/* Threat Type Filter */}
              <select
                value={threatTypeFilter}
                onChange={(e) => setThreatTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Threats</option>
                <option value="deepfake">Deepfake Video</option>
                <option value="ai-voice">AI Voice</option>
                <option value="meme-campaign">Meme Campaign</option>
                <option value="coordinated-attack">Coordinated Attack</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { value: 'global', label: 'Global' },
                  { value: 'my-region', label: 'My Region' },
                  { value: 'top-risk', label: 'Top Risk' }
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value as any)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === mode.value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-lg transition-colors ${
                  isPlaying ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Map Area */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Map Header */}
              <div className="bg-gray-900 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold">Global Threat Map</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">SCANNING</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Map Style Selector */}
                    <select
                      value={mapStyle}
                      onChange={(e) => setMapStyle(e.target.value as any)}
                      className="bg-gray-800 border border-gray-700 text-white px-3 py-1 rounded text-sm"
                    >
                      <option value="satellite">Satellite</option>
                      <option value="terrain">Terrain</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    
                    <button className="p-1 text-gray-400 hover:text-white">
                      <Layers className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tactical Map Interface */}
              <div 
                ref={mapRef}
                className="relative h-96 lg:h-[600px] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden"
              >
                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00FFF7" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* World Map Silhouette */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-4xl h-full relative">
                    {/* Simplified world map representation */}
                    <svg viewBox="0 0 800 400" className="w-full h-full opacity-30">
                      <path
                        d="M150,100 L200,80 L280,90 L350,85 L420,95 L480,100 L550,110 L600,120 L650,130 L700,140 L700,200 L650,210 L600,220 L550,230 L480,240 L420,235 L350,225 L280,220 L200,210 L150,200 Z"
                        fill="none"
                        stroke="#00FFF7"
                        strokeWidth="1"
                      />
                      <path
                        d="M100,150 L150,140 L200,145 L250,150 L300,155 L350,160 L400,165 L450,170 L500,175 L550,180 L600,185 L650,190 L700,195 L700,280 L650,285 L600,290 L550,295 L500,300 L450,305 L400,310 L350,315 L300,320 L250,325 L200,330 L150,335 L100,340 Z"
                        fill="none"
                        stroke="#00FFF7"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>

                {/* Radar Sweep */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-96 h-96">
                    <motion.div
                      className="absolute inset-0"
                      style={{ rotate: radarSweepAngle }}
                    >
                      <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent transform -translate-y-1/2 origin-left"></div>
                    </motion.div>
                    
                    {/* Radar Rings */}
                    {[1, 2, 3, 4].map((ring) => (
                      <div
                        key={ring}
                        className="absolute border border-cyan-400/30 rounded-full"
                        style={{
                          width: `${ring * 25}%`,
                          height: `${ring * 25}%`,
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Threat Indicators */}
                {filteredThreats.map((threat, index) => (
                  <motion.div
                    key={threat.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${(threat.lng + 180) * (100 / 360)}%`,
                      top: `${(90 - threat.lat) * (100 / 180)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => setSelectedThreat(threat)}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`w-4 h-4 rounded-full border-2 ${
                        threat.threatLevel === 'critical' ? 'bg-red-500 border-red-300' :
                        threat.threatLevel === 'high' ? 'bg-orange-500 border-orange-300' :
                        threat.threatLevel === 'medium' ? 'bg-yellow-500 border-yellow-300' :
                        'bg-green-500 border-green-300'
                      }`}
                    />
                    
                    {/* Threat Type Icon */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs">
                      {getThreatIcon(threat.threatType)}
                    </div>
                    
                    {/* Pulse Effect */}
                    <motion.div
                      animate={{ 
                        scale: [1, 2, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                      className={`absolute inset-0 rounded-full ${
                        threat.threatLevel === 'critical' ? 'bg-red-500' :
                        threat.threatLevel === 'high' ? 'bg-orange-500' :
                        threat.threatLevel === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                    />
                  </motion.div>
                ))}

                {/* Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Crosshair className="h-8 w-8 text-cyan-400 opacity-50" />
                </div>

                {/* HUD Elements */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="bg-black/80 backdrop-blur-md rounded-lg p-3 text-cyan-400 font-mono text-sm">
                    <div>THREAT LEVEL: {filteredThreats.filter(t => t.threatLevel === 'critical').length > 0 ? 'CRITICAL' : 'ELEVATED'}</div>
                    <div>ACTIVE THREATS: {filteredThreats.length}</div>
                    <div>SCAN STATUS: ACTIVE</div>
                  </div>
                  
                  <div className="bg-black/80 backdrop-blur-md rounded-lg p-3 text-green-400 font-mono text-sm">
                    <div>UPTIME: 99.9%</div>
                    <div>LATENCY: 12ms</div>
                    <div>COVERAGE: GLOBAL</div>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="bg-black/80 backdrop-blur-md rounded-lg p-3 text-cyan-400 font-mono text-sm">
                    <div>COORD: {selectedRegion || 'GLOBAL'}</div>
                    <div>TIME: {new Date().toLocaleTimeString()}</div>
                    <div>MODE: {mapStyle.toUpperCase()}</div>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black/80 backdrop-blur-md rounded-lg p-3">
                    <h4 className="text-cyan-400 font-mono text-sm mb-2">THREAT TYPES</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-white">🎭 Deepfake</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-white">🎤 AI Voice</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-white">🎨 Meme Campaign</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-white">⚡ Coordinated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Threat Type Breakdown */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Threat Distribution</h3>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Last {timeRange}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { type: 'deepfake', label: 'Deepfake Video', percentage: 44, color: 'bg-red-500' },
                    { type: 'ai-voice', label: 'AI Voice Cloning', percentage: 31, color: 'bg-yellow-500' },
                    { type: 'meme-campaign', label: 'Meme Campaigns', percentage: 25, color: 'bg-purple-500' },
                    { type: 'coordinated-attack', label: 'Coordinated Attacks', percentage: 15, color: 'bg-orange-500' }
                  ].map((item) => (
                    <div key={item.type} className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{item.percentage}%</div>
                      <div className="text-sm text-gray-600 mb-2">{item.label}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Regional Analytics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Regional Analytics</h3>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {filteredRegions.map((region, index) => (
                    <motion.div
                      key={region.code}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedRegion === region.code
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRegion(selectedRegion === region.code ? null : region.code)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{region.name}</h4>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(region.trend)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(region.riskLevel)}`}>
                            {region.riskLevel}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex justify-between">
                          <span>Flags: {region.flagCount}</span>
                          <span className={region.trend === 'up' ? 'text-red-600' : region.trend === 'down' ? 'text-green-600' : 'text-gray-600'}>
                            {region.trend === 'up' ? '+' : region.trend === 'down' ? '-' : ''}{Math.abs(region.trendPercentage)}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Threat Mix */}
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 mb-1">Threat Mix:</div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div>Deepfake: {region.threatMix.deepfake}%</div>
                          <div>Voice: {region.threatMix.aiVoice}%</div>
                          <div>Meme: {region.threatMix.meme}%</div>
                          <div>Coord: {region.threatMix.coordinated}%</div>
                        </div>
                      </div>
                      
                      {/* Expandable Countries List */}
                      <AnimatePresence>
                        {selectedRegion === region.code && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-gray-200"
                          >
                            <div className="text-xs text-gray-500 mb-2">Countries:</div>
                            <div className="flex flex-wrap gap-1">
                              {region.countries.map((country) => (
                                <span
                                  key={country}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  {country}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Predictive Risk Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Forecast Alerts</h3>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {forecastAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                      alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                      alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{alert.region}</h4>
                      <span className="text-sm font-medium text-gray-600">{alert.probability}%</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{alert.type}</div>
                    <div className="text-xs text-gray-600 mb-2">{alert.description}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Timeframe: {alert.timeframe}</span>
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Compliance Notice */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Privacy Compliance</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      This dashboard is anonymized and complies with GDPR, CCPA, and SOC2 standards.
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Info className="h-4 w-4" />
                      <span>Threat data shown is model-generated from global content flow trends — no personal data stored.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Detail Modal */}
      <AnimatePresence>
        {selectedThreat && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl w-full max-w-2xl"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Threat Details</h2>
                  <button
                    onClick={() => setSelectedThreat(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="font-semibold text-gray-900">{selectedThreat.country}</div>
                    <div className="text-sm text-gray-600">{selectedThreat.region}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Threat Type</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getThreatIcon(selectedThreat.threatType)}</span>
                      <span className="font-semibold text-gray-900 capitalize">
                        {selectedThreat.threatType.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Threat Level</div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(selectedThreat.threatLevel)}`}>
                      {selectedThreat.threatLevel}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Confidence</div>
                    <div className="font-semibold text-gray-900">{selectedThreat.confidence}%</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">Description</div>
                  <p className="text-gray-700">{selectedThreat.description}</p>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">Detection Count</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedThreat.count}</div>
                  <div className="text-sm text-gray-600">instances detected in last {timeRange}</div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    View Full Analysis
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                    Add to Report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">JSON Report</div>
                    <div className="text-sm text-gray-600">Raw data for analysis</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">PDF Summary</div>
                    <div className="text-sm text-gray-600">Executive briefing</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">CSV Data</div>
                    <div className="text-sm text-gray-600">Spreadsheet format</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Share Analysis</h2>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Copy className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Copy Link</div>
                    <div className="text-sm text-gray-600">Share secure token link</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleShare('email')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Mail className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Email Digest</div>
                    <div className="text-sm text-gray-600">Send to team</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleShare('slack')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Send className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Slack Webhook</div>
                    <div className="text-sm text-gray-600">Post to channel</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};