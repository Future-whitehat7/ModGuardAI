import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Activity,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Globe,
  Users,
  Clock,
  Eye,
  Target,
  TrendingUp,
  TrendingDown,
  Download,
  ExternalLink,
  RefreshCcw,
  Zap
} from 'lucide-react';

interface KPIData {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
}

interface AuditReport {
  id: string;
  title: string;
  date: string;
  score: number;
  status: 'passed' | 'warning' | 'failed';
  summary: string;
}

interface ComplianceStatus {
  regulation: string;
  status: 'compliant' | 'pending' | 'non-compliant';
  lastCheck: string;
  certificate?: string;
}

export const TransparencyDashboard = () => {
  const [activeTab, setActiveTab] = useState('kpis');
  const [isLiveData, setIsLiveData] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock KPI data that updates in real-time
  const [kpiData, setKpiData] = useState<KPIData[]>([
    {
      id: 'accuracy',
      title: 'Detection Accuracy',
      value: '99.2%',
      change: 0.3,
      trend: 'up',
      icon: Target,
      color: 'text-green-400'
    },
    {
      id: 'processing',
      title: 'Processing Speed',
      value: '127ms',
      change: -5.2,
      trend: 'down',
      icon: Zap,
      color: 'text-cyan-400'
    },
    {
      id: 'threats',
      title: 'Threats Detected Today',
      value: '2,847',
      change: 12.8,
      trend: 'up',
      icon: AlertTriangle,
      color: 'text-orange-400'
    },
    {
      id: 'uptime',
      title: 'System Uptime',
      value: '99.97%',
      change: 0.02,
      trend: 'up',
      icon: Activity,
      color: 'text-purple-400'
    },
    {
      id: 'users',
      title: 'Protected Users',
      value: '127M+',
      change: 8.5,
      trend: 'up',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      id: 'coverage',
      title: 'Global Coverage',
      value: '50+ Regions',
      change: 4.2,
      trend: 'up',
      icon: Globe,
      color: 'text-emerald-400'
    }
  ]);

  const ethicsAudits: AuditReport[] = [
    {
      id: 'audit-2025-01',
      title: 'AI Bias Assessment Q1 2025',
      date: '2025-01-15',
      score: 96.8,
      status: 'passed',
      summary: 'Comprehensive bias testing across cultural contexts shows minimal algorithmic bias with 96.8% fairness score.'
    },
    {
      id: 'audit-2024-04',
      title: 'Transparency Framework Review',
      date: '2024-12-20',
      score: 94.5,
      status: 'passed',
      summary: 'Independent review of explainable AI systems confirms high transparency standards in decision-making processes.'
    },
    {
      id: 'audit-2024-03',
      title: 'Data Privacy Compliance',
      date: '2024-11-30',
      score: 89.2,
      status: 'warning',
      summary: 'GDPR compliance maintained with minor recommendations for data retention policy updates.'
    }
  ];

  const complianceStatus: ComplianceStatus[] = [
    {
      regulation: 'GDPR (EU)',
      status: 'compliant',
      lastCheck: '2025-01-20',
      certificate: 'GDPR-2025-001'
    },
    {
      regulation: 'CCPA (California)',
      status: 'compliant',
      lastCheck: '2025-01-18',
      certificate: 'CCPA-2025-001'
    },
    {
      regulation: 'SOC 2 Type II',
      status: 'compliant',
      lastCheck: '2025-01-15',
      certificate: 'SOC2-2025-001'
    },
    {
      regulation: 'ISO 27001',
      status: 'compliant',
      lastCheck: '2025-01-10',
      certificate: 'ISO-2025-001'
    },
    {
      regulation: 'EU AI Act',
      status: 'pending',
      lastCheck: '2025-01-22',
    },
    {
      regulation: 'NIST AI Framework',
      status: 'compliant',
      lastCheck: '2025-01-12',
      certificate: 'NIST-2025-001'
    }
  ];

  // Simulate live data updates
  useEffect(() => {
    if (!isLiveData) return;

    const interval = setInterval(() => {
      setKpiData(prev => prev.map(kpi => ({
        ...kpi,
        value: kpi.id === 'threats' 
          ? `${(parseInt(kpi.value.replace(/,/g, '')) + Math.floor(Math.random() * 10)).toLocaleString()}`
          : kpi.value,
        change: kpi.change + (Math.random() - 0.5) * 0.1
      })));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'compliant':
        return 'text-green-400 bg-green-400/10';
      case 'warning':
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'failed':
      case 'non-compliant':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Transparency
              </span>
              <br />
              <span className="text-white">Dashboard</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Real-time insights into our AI performance, ethics audits, and compliance status
            </p>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Shield className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </a>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setIsLiveData(!isLiveData)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isLiveData 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isLiveData ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></div>
                <span className="text-sm font-medium">{isLiveData ? 'Live' : 'Static'}</span>
              </button>
              
              <div className="text-sm text-slate-400">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors">
                <RefreshCcw className="h-5 w-5 text-slate-300" />
              </button>
              <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors">
                <Download className="h-5 w-5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex space-x-1 bg-slate-800/50 backdrop-blur-md rounded-xl p-1 border border-slate-700/50">
            {[
              { id: 'kpis', label: 'Live KPIs', icon: BarChart3 },
              { id: 'ethics', label: 'Ethics Audits', icon: Shield },
              { id: 'compliance', label: 'Compliance Reports', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <AnimatePresence mode="wait">
            {activeTab === 'kpis' && (
              <motion.div
                key="kpis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kpiData.map((kpi, index) => (
                    <motion.div
                      key={kpi.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
                        <div className="flex items-center space-x-1">
                          {kpi.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                            {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-3xl font-bold text-white mb-2">{kpi.value}</div>
                      <div className="text-slate-400 text-sm">{kpi.title}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Real-time Chart Placeholder */}
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Real-time Activity</h3>
                  <div className="h-64 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                      <p className="text-slate-300">Live monitoring charts would be displayed here</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ethics' && (
              <motion.div
                key="ethics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {ethicsAudits.map((audit, index) => (
                  <motion.div
                    key={audit.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{audit.title}</h3>
                        <p className="text-slate-400">{new Date(audit.date).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400">{audit.score}%</div>
                          <div className="text-sm text-slate-400">Score</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(audit.status)}`}>
                          {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-4">{audit.summary}</p>
                    
                    <button className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                      <span>View Full Report</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'compliance' && (
              <motion.div
                key="compliance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {complianceStatus.map((compliance, index) => (
                  <motion.div
                    key={compliance.regulation}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">{compliance.regulation}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(compliance.status)}`}>
                        {compliance.status.charAt(0).toUpperCase() + compliance.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Check:</span>
                        <span className="text-slate-300">{new Date(compliance.lastCheck).toLocaleDateString()}</span>
                      </div>
                      
                      {compliance.certificate && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Certificate:</span>
                          <span className="text-cyan-400 font-mono">{compliance.certificate}</span>
                        </div>
                      )}
                    </div>
                    
                    {compliance.certificate && (
                      <button className="mt-4 w-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Download Certificate</span>
                      </button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};