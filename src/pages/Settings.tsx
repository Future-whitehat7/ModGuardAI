import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Globe,
  Shield,
  Bell,
  Users,
  Key,
  Database,
  Zap,
  Save,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const SettingCard = ({ title, description, icon: Icon, children }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
  >
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

const Toggle = ({ enabled, onChange, label }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export const Settings = () => {
  const [settings, setSettings] = useState({
    // Security Settings
    deepfakeDetection: true,
    culturalFiltering: true,
    realTimeAnalysis: true,
    aiConfidenceThreshold: 85,
    
    // Regional Settings
    regions: {
      northAmerica: true,
      europe: true,
      asiaPacific: true,
      latinAmerica: false,
      middleEastAfrica: false
    },
    
    // Notification Settings
    emailAlerts: true,
    webhookNotifications: true,
    slackIntegration: false,
    smsAlerts: false,
    
    // API Settings
    rateLimiting: true,
    apiVersioning: 'v2',
    responseFormat: 'json',
    
    // Advanced Settings
    dataRetention: 90,
    customModels: false,
    whitelistMode: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedSetting = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      alert('Settings saved successfully!');
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure your content moderation preferences and system behavior
        </p>
      </div>

      <div className="space-y-8">
        {/* Security & Detection */}
        <SettingCard
          title="Security & Detection"
          description="Configure AI models and detection thresholds"
          icon={Shield}
        >
          <div className="space-y-4">
            <Toggle
              enabled={settings.deepfakeDetection}
              onChange={(value: boolean) => updateSetting('deepfakeDetection', value)}
              label="Deepfake Detection"
            />
            <Toggle
              enabled={settings.culturalFiltering}
              onChange={(value: boolean) => updateSetting('culturalFiltering', value)}
              label="Cultural Context Filtering"
            />
            <Toggle
              enabled={settings.realTimeAnalysis}
              onChange={(value: boolean) => updateSetting('realTimeAnalysis', value)}
              label="Real-time Analysis"
            />
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Confidence Threshold: {settings.aiConfidenceThreshold}%
              </label>
              <input
                type="range"
                min="50"
                max="99"
                value={settings.aiConfidenceThreshold}
                onChange={(e) => updateSetting('aiConfidenceThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Less Strict</span>
                <span>More Strict</span>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* Regional Configuration */}
        <SettingCard
          title="Regional Configuration"
          description="Enable or disable content analysis by region"
          icon={Globe}
        >
          <div className="space-y-4">
            <Toggle
              enabled={settings.regions.northAmerica}
              onChange={(value: boolean) => updateNestedSetting('regions', 'northAmerica', value)}
              label="North America"
            />
            <Toggle
              enabled={settings.regions.europe}
              onChange={(value: boolean) => updateNestedSetting('regions', 'europe', value)}
              label="Europe"
            />
            <Toggle
              enabled={settings.regions.asiaPacific}
              onChange={(value: boolean) => updateNestedSetting('regions', 'asiaPacific', value)}
              label="Asia Pacific"
            />
            <Toggle
              enabled={settings.regions.latinAmerica}
              onChange={(value: boolean) => updateNestedSetting('regions', 'latinAmerica', value)}
              label="Latin America"
            />
            <Toggle
              enabled={settings.regions.middleEastAfrica}
              onChange={(value: boolean) => updateNestedSetting('regions', 'middleEastAfrica', value)}
              label="Middle East & Africa"
            />
          </div>
        </SettingCard>

        {/* Notifications */}
        <SettingCard
          title="Notifications"
          description="Configure how you receive alerts and updates"
          icon={Bell}
        >
          <div className="space-y-4">
            <Toggle
              enabled={settings.emailAlerts}
              onChange={(value: boolean) => updateSetting('emailAlerts', value)}
              label="Email Alerts"
            />
            <Toggle
              enabled={settings.webhookNotifications}
              onChange={(value: boolean) => updateSetting('webhookNotifications', value)}
              label="Webhook Notifications"
            />
            <Toggle
              enabled={settings.slackIntegration}
              onChange={(value: boolean) => updateSetting('slackIntegration', value)}
              label="Slack Integration"
            />
            <Toggle
              enabled={settings.smsAlerts}
              onChange={(value: boolean) => updateSetting('smsAlerts', value)}
              label="SMS Alerts"
            />
          </div>
        </SettingCard>

        {/* API Configuration */}
        <SettingCard
          title="API Configuration"
          description="Manage API settings and access controls"
          icon={Key}
        >
          <div className="space-y-4">
            <Toggle
              enabled={settings.rateLimiting}
              onChange={(value: boolean) => updateSetting('rateLimiting', value)}
              label="Rate Limiting"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Version
              </label>
              <select
                value={settings.apiVersioning}
                onChange={(e) => updateSetting('apiVersioning', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="v1">Version 1.0</option>
                <option value="v2">Version 2.0</option>
                <option value="v3">Version 3.0 (Beta)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Format
              </label>
              <select
                value={settings.responseFormat}
                onChange={(e) => updateSetting('responseFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="yaml">YAML</option>
              </select>
            </div>
          </div>
        </SettingCard>

        {/* Advanced Settings */}
        <SettingCard
          title="Advanced Settings"
          description="Configure advanced system behavior and data management"
          icon={Database}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Retention Period: {settings.dataRetention} days
              </label>
              <input
                type="range"
                min="30"
                max="365"
                value={settings.dataRetention}
                onChange={(e) => updateSetting('dataRetention', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>30 days</span>
                <span>365 days</span>
              </div>
            </div>
            
            <Toggle
              enabled={settings.customModels}
              onChange={(value: boolean) => updateSetting('customModels', value)}
              label="Custom AI Models"
            />
            
            <Toggle
              enabled={settings.whitelistMode}
              onChange={(value: boolean) => updateSetting('whitelistMode', value)}
              label="Whitelist Mode"
            />
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Advanced settings may affect system performance
                </span>
              </div>
            </div>
          </div>
        </SettingCard>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={saveSettings}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Settings
        </motion.button>
      </div>
    </div>
  );
};