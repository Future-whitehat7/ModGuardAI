import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Medal,
  TrendingUp,
  Eye,
  Target,
  Clock,
  Award,
  Crown,
  Zap,
  Shield,
  Brain,
  Users,
  Calendar,
  Filter
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  university: string;
  score: number;
  accuracy: number;
  timeSpent: string;
  correctDetections: number;
  badge: string;
  level: string;
  country: string;
  streak: number;
  totalChallenges: number;
}

export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('overall');
  const [timeFilter, setTimeFilter] = useState('all-time');

  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Alex Chen',
      university: 'Stanford University',
      score: 9847,
      accuracy: 97.8,
      timeSpent: '2h 34m',
      correctDetections: 89,
      badge: '🏆',
      level: 'Deepfake Detective',
      country: 'USA',
      streak: 15,
      totalChallenges: 91
    },
    {
      rank: 2,
      name: 'Priya Patel',
      university: 'MIT',
      score: 9234,
      accuracy: 96.4,
      timeSpent: '3h 12m',
      correctDetections: 82,
      badge: '🥈',
      level: 'Truth Guardian',
      country: 'USA',
      streak: 12,
      totalChallenges: 85
    },
    {
      rank: 3,
      name: 'Marcus Rodriguez',
      university: 'UC Berkeley',
      score: 8976,
      accuracy: 95.9,
      timeSpent: '2h 56m',
      correctDetections: 79,
      badge: '🥉',
      level: 'Authenticity Expert',
      country: 'USA',
      streak: 8,
      totalChallenges: 82
    },
    {
      rank: 4,
      name: 'Elena Kowalski',
      university: 'Technical University of Munich',
      score: 8654,
      accuracy: 94.7,
      timeSpent: '4h 21m',
      correctDetections: 74,
      badge: '⭐',
      level: 'Synthesis Sleuth',
      country: 'Germany',
      streak: 6,
      totalChallenges: 78
    },
    {
      rank: 5,
      name: 'Yuki Tanaka',
      university: 'University of Tokyo',
      score: 8432,
      accuracy: 93.8,
      timeSpent: '3h 45m',
      correctDetections: 71,
      badge: '🌟',
      level: 'Digital Detective',
      country: 'Japan',
      streak: 9,
      totalChallenges: 76
    },
    {
      rank: 6,
      name: 'Sarah Kim',
      university: 'Seoul National University',
      score: 8198,
      accuracy: 92.3,
      timeSpent: '2h 18m',
      correctDetections: 68,
      badge: '💎',
      level: 'Reality Ranger',
      country: 'South Korea',
      streak: 4,
      totalChallenges: 74
    },
    {
      rank: 7,
      name: 'Ahmed Hassan',
      university: 'Cairo University',
      score: 7923,
      accuracy: 91.6,
      timeSpent: '5h 07m',
      correctDetections: 65,
      badge: '🎯',
      level: 'Truth Seeker',
      country: 'Egypt',
      streak: 7,
      totalChallenges: 71
    },
    {
      rank: 8,
      name: 'Isabella Santos',
      university: 'University of São Paulo',
      score: 7654,
      accuracy: 90.4,
      timeSpent: '3h 29m',
      correctDetections: 62,
      badge: '🔍',
      level: 'Fraud Fighter',
      country: 'Brazil',
      streak: 5,
      totalChallenges: 69
    }
  ];

  const tabs = [
    { id: 'overall', label: 'Overall Rankings', icon: Trophy },
    { id: 'accuracy', label: 'Accuracy Leaders', icon: Target },
    { id: 'speed', label: 'Speed Champions', icon: Zap },
    { id: 'streak', label: 'Win Streaks', icon: TrendingUp }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRowBackground = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200';
      case 2: return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
      case 3: return 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const sortedData = [...leaderboardData].sort((a, b) => {
    switch (activeTab) {
      case 'accuracy': return b.accuracy - a.accuracy;
      case 'speed': return a.timeSpent.localeCompare(b.timeSpent);
      case 'streak': return b.streak - a.streak;
      default: return a.rank - b.rank;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-8">
          <a 
            href="/" 
            className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Shield className="h-5 w-5" />
            <span className="font-medium">← Back to Home</span>
          </a>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deepfake Challenge Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Top performers in the global fight against synthetic media deception
          </p>
        </motion.div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Users, label: 'Total Participants', value: '12,847', color: 'bg-blue-100 text-blue-600' },
          { icon: Eye, label: 'Deepfakes Detected', value: '2.4M+', color: 'bg-red-100 text-red-600' },
          { icon: Globe, label: 'Countries Participating', value: '67', color: 'bg-green-100 text-green-600' },
          { icon: Brain, label: 'Average Accuracy', value: '78.4%', color: 'bg-purple-100 text-purple-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center"
          >
            <div className={`inline-flex p-3 rounded-lg mb-4 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all-time">All Time</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="today">Today</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Rankings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Streak
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.map((entry, index) => (
                <motion.tr
                  key={entry.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 transition-colors ${getRowBackground(entry.rank)}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{entry.badge}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {entry.country}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">{entry.university}</div>
                        <div className="text-xs text-purple-600 font-medium">{entry.level}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">{entry.score.toLocaleString()}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900">{entry.accuracy}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${entry.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{entry.correctDetections}/{entry.totalChallenges}</div>
                      <div className="text-xs text-gray-500">{entry.timeSpent}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-900">{entry.streak}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Challenge CTA */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Think You Can Make the Leaderboard?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Test your deepfake detection skills and compete with the best
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Take the Challenge
          </button>
          <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
            View Challenge Rules
          </button>
        </div>
      </div>
    </div>
  );
};