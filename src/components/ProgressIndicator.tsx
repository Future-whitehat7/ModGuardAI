import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  orientation = 'horizontal',
  showDescriptions = true,
  className = ''
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`space-y-6 ${className}`}>
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4"
          >
            <div className="relative flex-shrink-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  step.completed
                    ? 'bg-green-500 border-green-500'
                    : step.current
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-6 w-6 text-white" />
                ) : step.current ? (
                  <Circle className="h-6 w-6 text-white fill-current" />
                ) : (
                  <span className="text-gray-400 font-medium">{index + 1}</span>
                )}
              </motion.div>
              
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-300" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className={`text-lg font-medium ${
                  step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.title}
              </motion.h3>
              {showDescriptions && step.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="text-gray-600 mt-1"
                >
                  {step.description}
                </motion.p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center space-y-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                step.completed
                  ? 'bg-green-500 border-green-500'
                  : step.current
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-gray-300'
              }`}
            >
              {step.completed ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : step.current ? (
                <Circle className="h-6 w-6 text-white fill-current" />
              ) : (
                <span className="text-gray-400 font-medium">{index + 1}</span>
              )}
            </motion.div>
            
            <div className="text-center">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className={`text-sm font-medium ${
                  step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.title}
              </motion.h3>
              {showDescriptions && step.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="text-xs text-gray-600 mt-1 max-w-24"
                >
                  {step.description}
                </motion.p>
              )}
            </div>
          </motion.div>
          
          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: step.completed ? 1 : 0.3 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
              className="flex-1 mx-4"
            >
              <div className={`h-0.5 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const CircularProgress: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-blue-500"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};