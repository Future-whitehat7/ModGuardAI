import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = true
}) => {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? undefined : '100%')
  };

  const skeletonElement = (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );

  if (animation) {
    return (
      <motion.div
        animate={{
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {skeletonElement}
      </motion.div>
    );
  }

  return skeletonElement;
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-200">
    <div className="flex items-start space-x-4 mb-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton />
      <Skeleton width="80%" />
      <Skeleton width="90%" />
    </div>
    <div className="mt-4 flex space-x-2">
      <Skeleton variant="rectangular" width={80} height={32} />
      <Skeleton variant="rectangular" width={60} height={32} />
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="mb-8">
      <Skeleton width="300px" height="32px" className="mb-2" />
      <Skeleton width="500px" height="20px" />
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="rectangular" width={60} height={24} />
          </div>
          <Skeleton width="80%" height="24" className="mb-2" />
          <Skeleton width="60%" height="16" />
        </div>
      ))}
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <Skeleton width="200px" height="24" className="mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-2">
                  <Skeleton width="70%" />
                  <Skeleton width="50%" />
                </div>
                <Skeleton variant="rectangular" width={80} height={32} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <Skeleton width="150px" height="24" className="mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton width="100%" />
                <Skeleton width="80%" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);