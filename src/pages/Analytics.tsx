import React from 'react';
import { motion } from 'framer-motion';
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
  Activity
} from 'lucide-react';

const MetricCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <div className="flex items-center mt-2">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const RegionCard = ({ region, processed, violations, rate }: any) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div>
      <p className="font-medium text-gray-900">{region}</p>
      <p className="text-sm text-gray-600">{processed} processed</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium text-gray-900">{violations} violations</p>
      <p className="text-sm text-red-600">{rate}% rate</p>
    </div>
  </div>
);

export const Analytics = () => {
  const metrics = [
    {
      title: 'Total Content Processed',
      value: '12.4M',
      change: 18.2,
      trend: 'up',
      icon: Activity,
      color: 'bg-blue-500'
    },
    {
      title: 'Violations Detected',
      value: '342K',
      change: -12.5,
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      title: 'Clean Content Rate',
      value: '97.2%',
      change: 2.8,
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Active Users',
      value: '45.6K',
      change: 8.7,
      trend: 'up',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  const regions = [
    { region: 'North America', processed: '4.2M', violations: '89K', rate: '2.1' },
    { region: 'Europe', processed: '3.8M', violations: '76K', rate: '2.0' },
    { region: 'Asia Pacific', processed: '2.9M', violations: '95K', rate: '3.3' },
    { region: 'Latin America', processed: '1.1M', violations: '34K', rate: '3.1' },
    { region: 'Middle East & Africa', processed: '410K', violations: '48K', rate: '11.7' }
  ];

  const threatTypes = [
    { type: 'Deepfake Content', count: '142K', percentage: 41.5, color: 'bg-red-500' },
    { type: 'Inappropriate Content', count: '89K', percentage: 26.0, color: 'bg-orange-500' },
    { type: 'Hate Speech', count: '67K', percentage: 19.6, color: 'bg-yellow-500' },
    { type: 'Spam Content', count: '44K', percentage: 12.9, color: 'bg-blue-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Comprehensive insights into your content moderation performance
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Threat Distribution */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Threat Distribution</h2>
                <PieChart className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {threatTypes.map((threat, index) => (
                  <motion.div
                    key={threat.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${threat.color}`}></div>
                      <span className="text-sm font-medium text-gray-900">{threat.type}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{threat.count}</span>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {threat.percentage}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Processing Speed */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Processing Speed</h2>
              <Clock className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">127ms</div>
              <p className="text-sm text-gray-600">Average response time</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Image Analysis</span>
                <span className="text-sm font-medium">89ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Video Analysis</span>
                <span className="text-sm font-medium">245ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Deepfake Detection</span>
                <span className="text-sm font-medium">312ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cultural Context</span>
                <span className="text-sm font-medium">156ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Analysis */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Regional Analysis</h2>
            <Globe className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((region, index) => (
              <motion.div
                key={region.region}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RegionCard {...region} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};