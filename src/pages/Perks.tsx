import React from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Star,
  Crown,
  Zap,
  Shield,
  Users,
  Award,
  Headphones,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const PerkCard = ({ icon: Icon, title, description, badge, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative overflow-hidden"
  >
    {badge && (
      <div className="absolute top-4 right-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          badge === 'Premium' ? 'bg-purple-100 text-purple-800' :
          badge === 'Enterprise' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {badge}
        </span>
      </div>
    )}
    
    <div className={`inline-flex p-3 rounded-lg mb-4 ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const TierCard = ({ name, price, features, popular, color }: any) => (
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
    
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <div className="flex items-baseline justify-center">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        {price !== 'Free' && <span className="text-gray-500 ml-2">/month</span>}
      </div>
    </div>
    
    <ul className="space-y-3 mb-8">
      {features.map((feature: string, index: number) => (
        <li key={index} className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
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
      Get Started
    </button>
  </motion.div>
);

export const Perks = () => {
  const membershipTiers = [
    {
      name: 'Starter',
      price: 'Free',
      popular: false,
      features: [
        'Basic content analysis',
        '1,000 API calls/month',
        'Community support',
        'Standard response time',
        'Basic dashboard access'
      ]
    },
    {
      name: 'Professional',
      price: '$199',
      popular: true,
      features: [
        'Advanced AI models',
        '100,000 API calls/month',
        'Priority support',
        'Real-time analysis',
        'Custom integrations',
        'Advanced analytics',
        'Webhook notifications'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      popular: false,
      features: [
        'Unlimited API calls',
        'Custom AI training',
        'Dedicated support',
        'SLA guarantees',
        'White-label solutions',
        'Multi-region deployment',
        'Advanced compliance'
      ]
    }
  ];

  const exclusivePerks = [
    {
      icon: Crown,
      title: 'VIP Support Channel',
      description: 'Direct access to our engineering team with 1-hour response time guarantee',
      badge: 'Premium',
      color: 'bg-purple-500'
    },
    {
      icon: Zap,
      title: 'Early Access Features',
      description: 'Be the first to test new AI models and platform features before public release',
      badge: 'Enterprise',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Exclusive Community',
      description: 'Join our private Discord with industry leaders and AI researchers',
      badge: 'Premium',
      color: 'bg-green-500'
    },
    {
      icon: Award,
      title: 'Certification Program',
      description: 'Free access to ModGuard AI certification courses worth $2,000',
      badge: 'Enterprise',
      color: 'bg-orange-500'
    },
    {
      icon: Globe,
      title: 'Global Events Access',
      description: 'Complimentary tickets to AI safety conferences and ModGuard summits',
      badge: 'Premium',
      color: 'bg-indigo-500'
    },
    {
      icon: Sparkles,
      title: 'Custom Model Training',
      description: 'Personalized AI model training sessions with our data science team',
      badge: 'Enterprise',
      color: 'bg-pink-500'
    }
  ];

  const loyaltyRewards = [
    { months: 3, reward: '10% discount on next renewal', icon: Star },
    { months: 6, reward: 'Free API quota upgrade', icon: TrendingUp },
    { months: 12, reward: 'Exclusive ModGuard AI merchandise', icon: Gift },
    { months: 24, reward: 'Lifetime 25% discount', icon: Crown }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Member Perks & Benefits
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock exclusive benefits, priority support, and advanced features designed for our valued community members
          </p>
        </motion.div>
      </div>

      {/* Membership Tiers */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Choose Your Membership Level
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {membershipTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TierCard {...tier} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Exclusive Perks */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Exclusive Member Benefits
          </h2>
          <p className="text-lg text-gray-600">
            Premium perks that go beyond just software access
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exclusivePerks.map((perk, index) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PerkCard {...perk} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Loyalty Rewards */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Loyalty Rewards Program</h2>
            <p className="text-xl text-blue-100">
              The longer you stay, the more you save and earn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loyaltyRewards.map((reward, index) => (
              <motion.div
                key={reward.months}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              >
                <reward.icon className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
                <div className="text-2xl font-bold mb-2">{reward.months} Months</div>
                <p className="text-blue-100 text-sm">{reward.reward}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Special Offers */}
      <div className="mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Limited Time Offer
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Upgrade to Professional plan and get 3 months free, plus exclusive access to our AI research lab
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">3 months free (save $597)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Exclusive AI research lab access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Priority onboarding session</span>
                </li>
              </ul>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2">
                <span>Claim Offer</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                <div>
                  <div className="text-3xl font-bold">50%</div>
                  <div className="text-sm">OFF</div>
                </div>
              </div>
              <p className="text-gray-600">Offer expires in 7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Member Testimonials */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          What Our Members Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-gray-700 mb-4">
              "The VIP support channel has been a game-changer. Getting direct access to the engineering team 
              has helped us implement ModGuard AI 3x faster than expected."
            </blockquote>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">Sarah Chen</div>
              <div className="text-gray-600">CTO, TechCorp</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-gray-700 mb-4">
              "The early access features and certification program have given our team a significant 
              competitive advantage in the content moderation space."
            </blockquote>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">Marcus Rodriguez</div>
              <div className="text-gray-600">Head of Safety, MediaPlatform</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};