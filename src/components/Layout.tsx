import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Upload,
  BarChart3,
  Settings,
  Code,
  CreditCard,
  Menu,
  X,
  Eye,
  AlertTriangle,
  CheckCircle,
  Users,
  Home,
  Gift,
  PenTool,
  BookOpen,
  Calendar
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/enterprise-dashboard', icon: BarChart3 },
    { name: 'Upload Content', href: '/upload', icon: Upload },
    { name: 'Analytics', href: '/analytics', icon: Eye },
    { name: 'API', href: '/api', icon: Code },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const resourceSections = [
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
    { name: 'Perks & Benefits', href: '/perks', icon: Gift },
    { name: 'Content Creation', href: '/content-creation', icon: PenTool },
    { name: 'Resources & Training', href: '/resources', icon: BookOpen },
    { name: 'Events', href: '/events', icon: Calendar },
  ];

  const stats = [
    { name: 'Content Analyzed', value: '2.4M', icon: Eye, color: 'text-blue-600' },
    { name: 'Threats Detected', value: '143K', icon: AlertTriangle, color: 'text-red-600' },
    { name: 'Clean Content', value: '98.7%', icon: CheckCircle, color: 'text-green-600' },
    { name: 'Active Users', value: '12.3K', icon: Users, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Header Bar - Moved to very top */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Content Moderation Suite
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">System Operational</span>
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ModGuard AI
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Back to Landing Page */}
        <div className="px-4 py-2 border-b border-gray-200">
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Home className="mr-3 h-4 w-4" />
            Back to Homepage
          </Link>
        </div>

        <nav className="mt-4 px-4 flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Platform
            </h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === item.href
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              {resourceSections.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === item.href
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <stat.icon className={`h-4 w-4 mr-2 ${stat.color}`} />
                    <span className="text-sm text-gray-600">{stat.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Page content - Centered and properly aligned */}
        <main className="flex-1 flex justify-center py-8">
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};