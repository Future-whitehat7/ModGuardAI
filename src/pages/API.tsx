import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Copy,
  Key,
  Zap,
  BarChart3,
  Globe,
  Shield,
  PlayCircle,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const CodeBlock = ({ language, code, title }: any) => (
  <div className="bg-gray-900 rounded-lg overflow-hidden">
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center space-x-2">
        <Code className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">{title}</span>
      </div>
      <button className="p-1 text-gray-400 hover:text-white transition-colors">
        <Copy className="h-4 w-4" />
      </button>
    </div>
    <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  </div>
);

const EndpointCard = ({ method, endpoint, description, status }: any) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          method === 'GET' ? 'bg-blue-100 text-blue-800' :
          method === 'POST' ? 'bg-green-100 text-green-800' :
          method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {method}
        </span>
        <code className="text-sm font-mono text-gray-700">{endpoint}</code>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`h-2 w-2 rounded-full ${
          status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
        }`}></div>
        <span className="text-xs text-gray-500">{status}</span>
      </div>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export const API = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'endpoints', label: 'Endpoints', icon: Globe },
    { id: 'authentication', label: 'Authentication', icon: Key },
    { id: 'examples', label: 'Examples', icon: Code },
    { id: 'testing', label: 'Testing', icon: PlayCircle }
  ];

  const endpoints = [
    {
      method: 'POST',
      endpoint: '/api/v2/analyze',
      description: 'Analyze content for violations and deepfakes',
      status: 'active'
    },
    {
      method: 'GET',
      endpoint: '/api/v2/results/{id}',
      description: 'Retrieve analysis results by ID',
      status: 'active'
    },
    {
      method: 'POST',
      endpoint: '/api/v2/batch',
      description: 'Submit multiple files for batch processing',
      status: 'active'
    },
    {
      method: 'GET',
      endpoint: '/api/v2/status',
      description: 'Check system status and health',
      status: 'active'
    },
    {
      method: 'POST',
      endpoint: '/api/v2/webhook',
      description: 'Configure webhook notifications',
      status: 'active'
    },
    {
      method: 'GET',
      endpoint: '/api/v2/usage',
      description: 'Get API usage statistics',
      status: 'active'
    }
  ];

  const curlExample = `curl -X POST https://api.modguard.ai/v2/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@/path/to/your/file.jpg" \\
  -F "options={\\"deepfake_detection\\": true, \\"cultural_filtering\\": true}"`;

  const jsExample = `const ModGuardAI = require('@modguard/api');

const client = new ModGuardAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.modguard.ai/v2'
});

async function analyzeContent(filePath) {
  try {
    const result = await client.analyze({
      file: filePath,
      options: {
        deepfakeDetection: true,
        culturalFiltering: true,
        realTimeAnalysis: true
      }
    });
    
    console.log('Analysis complete:', result);
    return result;
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}`;

  const pythonExample = `import modguard_ai

client = modguard_ai.Client(api_key="YOUR_API_KEY")

def analyze_content(file_path):
    try:
        result = client.analyze(
            file=file_path,
            options={
                "deepfake_detection": True,
                "cultural_filtering": True,
                "real_time_analysis": True
            }
        )
        
        print("Analysis complete:", result)
        return result
    except Exception as error:
        print("Analysis failed:", error)`;

  const responseExample = `{
  "id": "analysis_123456789",
  "status": "completed",
  "timestamp": "2025-01-27T10:30:00Z",
  "results": {
    "deepfake_score": 12.5,
    "content_score": 98.7,
    "cultural_flags": [],
    "violations": [],
    "confidence": 96.2,
    "processing_time": 127
  },
  "metadata": {
    "file_size": 2048576,
    "file_type": "image/jpeg",
    "dimensions": "1920x1080"
  }
}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
        <p className="mt-2 text-gray-600">
          Integrate ModGuard AI into your applications with our powerful REST API
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">API Calls Today</p>
                    <p className="text-2xl font-bold text-gray-900">127K</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">99.9%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response</p>
                    <p className="text-2xl font-bold text-gray-900">127ms</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 mb-4">
                  The ModGuard AI API provides powerful content moderation capabilities through simple REST endpoints. 
                  Get started in minutes with our comprehensive documentation and code examples.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">1. Get Your API Key</h3>
                    <p className="text-blue-700 text-sm">
                      Sign up for an account and generate your API key from the dashboard.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">2. Make Your First Call</h3>
                    <p className="text-green-700 text-sm">
                      Upload content and receive instant analysis results with confidence scores.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">3. Configure Webhooks</h3>
                    <p className="text-purple-700 text-sm">
                      Set up real-time notifications for automated content processing.
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">4. Scale Your Solution</h3>
                    <p className="text-orange-700 text-sm">
                      Use batch processing and custom models for enterprise-scale deployments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'endpoints' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Endpoints</h2>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <EndpointCard key={index} {...endpoint} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'authentication' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">API Authentication</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 mb-6">
                  ModGuard AI uses API keys for authentication. Include your API key in the Authorization header 
                  of every request.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Keep your API key secure</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Never expose your API key in client-side code or public repositories.
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Header Format</h3>
                <CodeBlock
                  language="http"
                  title="Authorization Header"
                  code="Authorization: Bearer YOUR_API_KEY"
                />
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Rate Limits</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Starter Plan:</strong> 1,000 requests per hour</li>
                    <li>• <strong>Professional Plan:</strong> 10,000 requests per hour</li>
                    <li>• <strong>Enterprise Plan:</strong> Custom limits available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Code Examples</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">cURL</h3>
                  <CodeBlock
                    language="bash"
                    title="Basic Content Analysis"
                    code={curlExample}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">JavaScript</h3>
                  <CodeBlock
                    language="javascript"
                    title="Node.js Example"
                    code={jsExample}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Python</h3>
                  <CodeBlock
                    language="python"
                    title="Python Example"
                    code={pythonExample}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Format</h3>
                  <CodeBlock
                    language="json"
                    title="Analysis Response"
                    code={responseExample}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">API Testing</h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Interactive API Explorer</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Test API endpoints directly from your browser with our interactive explorer.
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open API Explorer
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Test Endpoints</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Content Analysis</li>
                    <li>• Batch Processing</li>
                    <li>• Webhook Configuration</li>
                    <li>• Status Monitoring</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Testing Tools</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Postman Collection</li>
                    <li>• Insomnia Workspace</li>
                    <li>• OpenAPI Specification</li>
                    <li>• SDK Downloads</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};