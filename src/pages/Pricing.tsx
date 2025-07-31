import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Zap,
  Shield,
  Users,
  Globe,
  Headphones,
  Star,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

const PricingCard = ({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  popular, 
  cta, 
  color 
}: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`relative bg-white rounded-2xl shadow-xl border-2 p-8 ${
      popular ? 'border-blue-500' : 'border-gray-200'
    }`}
  >
    {popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </span>
      </div>
    )}
    
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-baseline justify-center">
        <span className="text-4xl font-bold text-gray-900">${price}</span>
        <span className="text-gray-500 ml-2">/{period}</span>
      </div>
    </div>
    
    <ul className="space-y-4 mb-8">
      {features.map((feature: string, index: number) => (
        <li key={index} className="flex items-start space-x-3">
          <Check className="h-5 w-5 text-green-500 mt-0.5" />
          <span className="text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
    
    <button
      className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
        popular
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}
    >
      {cta}
    </button>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

export const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  
  const plans = [
    {
      name: 'Starter',
      price: billingPeriod === 'monthly' ? 49 : 490,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      description: 'Perfect for small businesses and startups',
      features: [
        '10,000 API calls/month',
        'Basic content analysis',
        'Deepfake detection',
        'Email support',
        'Standard response time',
        'Web dashboard access'
      ],
      popular: false,
      cta: 'Start Free Trial',
      color: 'gray'
    },
    {
      name: 'Professional',
      price: billingPeriod === 'monthly' ? 199 : 1990,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      description: 'Ideal for growing companies with higher volume',
      features: [
        '100,000 API calls/month',
        'Advanced content analysis',
        'Cultural context filtering',
        'Real-time analysis',
        'Webhook notifications',
        'Priority support',
        'Custom integrations',
        'Analytics dashboard'
      ],
      popular: true,
      cta: 'Start Free Trial',
      color: 'blue'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for large organizations',
      features: [
        'Unlimited API calls',
        'Custom AI models',
        'Dedicated infrastructure',
        'White-label solutions',
        'SLA guarantees',
        '24/7 phone support',
        'Custom training',
        'Multi-region deployment',
        'Advanced reporting'
      ],
      popular: false,
      cta: 'Contact Sales',
      color: 'purple'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Average response time under 200ms with 99.9% uptime guarantee'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with end-to-end encryption and audit logs'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Cultural context awareness across 50+ countries and regions'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Multi-user access with role-based permissions and team management'
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Dedicated support team with average response time under 2 hours'
    },
    {
      icon: Star,
      title: 'Proven Results',
      description: '99.2% accuracy rate trusted by Fortune 500 companies'
    }
  ];

  const usageTiers = [
    { calls: '1-10K', price: '$0.005', description: 'Per API call' },
    { calls: '10K-100K', price: '$0.003', description: 'Per API call' },
    { calls: '100K-1M', price: '$0.002', description: 'Per API call' },
    { calls: '1M+', price: 'Custom', description: 'Volume pricing available' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Choose the perfect plan for your content moderation needs
        </p>
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              billingPeriod === 'annual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>

      {/* Usage-Based Pricing */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pay-As-You-Go Pricing
          </h2>
          <p className="text-gray-600">
            No monthly commitments. Pay only for what you use.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {usageTiers.map((tier, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{tier.calls}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">{tier.price}</p>
                <p className="text-sm text-gray-600">{tier.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Get Started with Pay-As-You-Go
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose ModGuard AI?
          </h2>
          <p className="text-xl text-gray-600">
            Enterprise-grade features designed for scale and reliability
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enterprise Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Need Something Custom?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          We work with enterprises to build tailored content moderation solutions
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Custom Models</h3>
            <p className="text-blue-100">Train AI models specific to your content and use cases</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Dedicated Infrastructure</h3>
            <p className="text-blue-100">Private cloud deployment with guaranteed performance</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">White-Label Solutions</h3>
            <p className="text-blue-100">Fully branded platform under your company name</p>
          </div>
        </div>
        
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Schedule Enterprise Demo
        </button>
      </div>
    </div>
  );
};