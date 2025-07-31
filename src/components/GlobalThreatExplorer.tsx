import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  AlertTriangle,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter,
  Calendar,
  Zap,
  ArrowRight,
  CheckCircle,
  Brain,
  MapPin,
  Activity,
  Target,
  Crosshair,
  Radar
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

export const GlobalThreatExplorer = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [threatTypeFilter, setThreatTypeFilter] = useState('all');
  const [selectedThreat, setSelectedThreat] = useState<ThreatData | null>(null);
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

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
      countries: ['China', 'India', 'Japan', 'South Korea', 'Australia'],
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
      countries: ['Germany', 'France', 'United Kingdom', 'Italy'],
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
      countries: ['Brazil', 'Argentina', 'Mexico', 'Colombia'],
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
      countries: ['Nigeria', 'South Africa', 'Kenya', 'Egypt'],
      lastUpdate: '2025-01-27T10:45:00Z'
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
      case 'deepfake': return '#EF4444';
      case 'ai-voice': return '#F59E0B';
      case 'meme-campaign': return '#8B5CF6';
      case 'coordinated-attack': return '#DC2626';
      default: return '#6B7280';
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
    return true;
  });

  return (
    <section className="relative py-20 bg-[#1A1F36] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4 font-sora">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Global Threat Explorer
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-inter">
            Real-time visualization of synthetic media threats detected worldwide
          </p>
        </motion.div>
      </div>
      
      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Interactive Map Visualization */}
          <div className="lg:col-span-3 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden h-[500px] relative"
            >
              {/* Controls Overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-col space-y-4">
                <div className="bg-slate-800/70 backdrop-blur-md rounded-lg p-2 flex">
                  {['24H', '7D', '30D'].map((range) => (
                    <button
                      key={range}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        timeRange === range
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/70'
                      }`}
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                
                <div className="bg-slate-800/70 backdrop-blur-md rounded-lg p-2">
                  <select
                    value={threatTypeFilter}
                    onChange={(e) => setThreatTypeFilter(e.target.value)}
                    className="bg-transparent text-white text-sm focus:outline-none"
                  >
                    <option value="all">All Threats</option>
                    <option value="deepfake">Deepfakes</option>
                    <option value="ai-voice">AI Voice</option>
                    <option value="meme-campaign">Meme Campaigns</option>
                    <option value="coordinated-attack">Coordinated Attacks</option>
                  </select>
                </div>
              </div>
              
              {/* Live indicator */}
              <div className="absolute top-4 right-4 z-20 bg-slate-800/70 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-cyan-400 text-sm font-medium">LIVE</span>
              </div>

              {/* Interactive World Map */}
              <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
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

                {/* Simplified World Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 800 400" className="w-full h-full opacity-30">
                    {/* Continents as simplified shapes */}
                    <g stroke="#00FFF7" strokeWidth="1" fill="none">
                      {/* North America */}
                      <path d="M100,80 L200,60 L280,70 L300,120 L250,180 L150,200 L80,150 Z" />
                      {/* South America */}
                      <path d="M200,200 L280,190 L300,250 L280,320 L220,340 L180,300 L170,240 Z" />
                      {/* Europe */}
                      <path d="M350,60 L420,50 L450,80 L440,120 L380,130 L340,100 Z" />
                      {/* Africa */}
                      <path d="M380,130 L450,120 L480,200 L460,280 L420,300 L380,280 L360,200 Z" />
                      {/* Asia */}
                      <path d="M450,50 L600,40 L650,80 L680,120 L650,180 L580,200 L500,180 L450,120 Z" />
                      {/* Australia */}
                      <path d="M580,280 L650,270 L680,300 L650,320 L580,310 Z" />
                    </g>
                  </svg>
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
                <div className="absolute inset-0">
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
                </div>

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
                </div>

                <div className="absolute top-4 right-4">
                  <div className="bg-black/80 backdrop-blur-md rounded-lg p-3 text-cyan-400 font-mono text-sm">
                    <div>TIME: {new Date().toLocaleTimeString()}</div>
                    <div>MODE: GLOBAL</div>
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
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/90 to-transparent">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Threat Distribution</h3>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-400">Last {timeRange}</span>
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
                      <div className="text-2xl font-bold text-white mb-1">{item.percentage}%</div>
                      <div className="text-sm text-gray-300 mb-2">{item.label}</div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Regional Analytics */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-700/50"
            >
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white">Regional Analytics</h3>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {regions.map((region, index) => (
                    <motion.div
                      key={region.code}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedRegion === region.code
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700/50 hover:border-slate-600/50 bg-slate-800/30'
                      }`}
                      onClick={() => setSelectedRegion(selectedRegion === region.code ? null : region.code)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{region.name}</h4>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(region.trend)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(region.riskLevel)}`}>
                            {region.riskLevel}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-300 mb-3">
                        <div className="flex justify-between">
                          <span>Flags: {region.flagCount}</span>
                          <span className={region.trend === 'up' ? 'text-red-400' : region.trend === 'down' ? 'text-green-400' : 'text-slate-400'}>
                            {region.trend === 'up' ? '+' : region.trend === 'down' ? '-' : ''}{Math.abs(region.trendPercentage)}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Threat Mix */}
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400 mb-1">Threat Mix:</div>
                        <div className="grid grid-cols-2 gap-1 text-xs text-slate-300">
                          <div>Deepfake: {region.threatMix.deepfake}%</div>
                          <div>Voice: {region.threatMix.aiVoice}%</div>
                          <div>Meme: {region.threatMix.meme}%</div>
                          <div>Coord: {region.threatMix.coordinated}%</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-700/50"
            >
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">System Status</h3>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Detection Rate</span>
                    <span className="text-green-400 font-bold">99.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Response Time</span>
                    <span className="text-cyan-400 font-bold">127ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Uptime</span>
                    <span className="text-green-400 font-bold">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Active Regions</span>
                    <span className="text-white font-bold">50+</span>
                  </div>
                </div>
                
                <div className="mt-6 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400 mr-2" />
                    <span className="text-sm font-medium text-white">All Systems Operational</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    ModGuard AI is actively monitoring and protecting against threats globally.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/70 to-purple-900/70 backdrop-blur-md rounded-xl border border-blue-500/30 p-5"
            >
              <h3 className="text-lg font-semibold text-white font-sora mb-3">
                Protect Your Organization
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Deploy enterprise-grade threat detection and content verification across your digital ecosystem.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 font-medium"
              >
                <Shield className="h-4 w-4" />
                <span>Request Enterprise Demo</span>
              </motion.button>
            </motion.div>
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
              className="bg-slate-800 rounded-xl w-full max-w-2xl border border-slate-700"
            >
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Threat Details</h2>
                  <button
                    onClick={() => setSelectedThreat(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Location</div>
                    <div className="font-semibold text-white">{selectedThreat.country}</div>
                    <div className="text-sm text-slate-300">{selectedThreat.region}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Threat Type</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getThreatIcon(selectedThreat.threatType)}</span>
                      <span className="font-semibold text-white capitalize">
                        {selectedThreat.threatType.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Threat Level</div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(selectedThreat.threatLevel)}`}>
                      {selectedThreat.threatLevel}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Confidence</div>
                    <div className="font-semibold text-white">{selectedThreat.confidence}%</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-slate-400 mb-2">Description</div>
                  <p className="text-slate-200">{selectedThreat.description}</p>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    View Full Analysis
                  </button>
                  <button className="flex-1 border border-slate-600 text-slate-300 py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">
                    Add to Report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};