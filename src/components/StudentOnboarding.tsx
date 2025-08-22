import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Upload,
  Brain,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Lightbulb,
  Globe,
  Code,
  Palette,
  Users,
  Award,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';
import { FellowshipOnboarding } from './FellowshipOnboarding';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentOnboarding: React.FC<OnboardingProps> = ({ isOpen, onClose }) => {
  const [isFellowshipOnboardingOpen, setIsFellowshipOnboardingOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartOnboarding = () => {
    setIsFellowshipOnboardingOpen(true);
  };

  const handleOnboardingComplete = (data: any) => {
    console.log('Onboarding completed with data:', data);
    // Here you would typically save the data to your backend
    // For now, we'll just navigate to the fellowship dashboard
    navigate('/fellowship/dashboard');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-8 flex items-center justify-center">
              <Shield className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6 font-sora">
              Join the ModGuard AI Fellowship
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-inter max-w-2xl mx-auto">
              A mission-driven community where your unique talents help protect truth at global scale
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <Brain className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
                <p className="text-gray-600 text-sm">We'll analyze your skills and match you to impactful projects</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Global Community</h3>
                <p className="text-gray-600 text-sm">Connect with like-minded individuals defending digital truth</p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Real Impact</h3>
                <p className="text-gray-600 text-sm">Your work directly protects millions from misinformation</p>
              </div>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartOnboarding}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
              >
                Start Fellowship Onboarding
              </motion.button>
              
              <button
                onClick={onClose}
                className="w-full text-gray-600 hover:text-gray-800 transition-colors"
              >
                Maybe later
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Join 2,847+ students already making a difference
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fellowship Onboarding Modal */}
      <FellowshipOnboarding
        isOpen={isFellowshipOnboardingOpen}
        onClose={() => setIsFellowshipOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />
    </>
  );
};