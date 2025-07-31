import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ThumbsUp, Star, Bookmark, Bell, Check, X, Loader } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  loading = false,
  success = false,
  error = false,
  icon,
  variant = 'primary',
  size = 'md'
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
      case 'outline':
        return 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-3 py-1.5 text-sm';
      case 'md': return 'px-4 py-2';
      case 'lg': return 'px-6 py-3 text-lg';
      default: return 'px-4 py-2';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            <Loader className="h-4 w-4 animate-spin mr-2" />
            <span>Loading...</span>
          </motion.div>
        ) : showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center"
          >
            <Check className="h-4 w-4 mr-2" />
            <span>Success!</span>
          </motion.div>
        ) : showError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center"
          >
            <X className="h-4 w-4 mr-2" />
            <span>Error</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

interface ToggleProps {
  isActive: boolean;
  onChange: (isActive: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  label?: string;
  labelPosition?: 'left' | 'right';
}

export const AnimatedToggle: React.FC<ToggleProps> = ({
  isActive,
  onChange,
  activeColor = 'bg-blue-600',
  inactiveColor = 'bg-gray-300',
  size = 'md',
  disabled = false,
  className = '',
  label,
  labelPosition = 'right'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' };
      case 'md': return { track: 'w-12 h-6', thumb: 'w-5 h-5', translate: 'translate-x-6' };
      case 'lg': return { track: 'w-16 h-8', thumb: 'w-7 h-7', translate: 'translate-x-8' };
      default: return { track: 'w-12 h-6', thumb: 'w-5 h-5', translate: 'translate-x-6' };
    }
  };

  const { track, thumb, translate } = getSizeClasses();

  const renderToggle = () => (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isActive}
      onClick={() => !disabled && onChange(!isActive)}
      className={`relative inline-flex flex-shrink-0 ${track} rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isActive ? activeColor : inactiveColor
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <span className="sr-only">{label || (isActive ? 'Enabled' : 'Disabled')}</span>
      <motion.span
        className={`${thumb} rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        animate={{
          x: isActive ? parseInt(translate.split('-x-')[1]) : 0
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

  if (label) {
    return (
      <div className="flex items-center space-x-2">
        {labelPosition === 'left' && <span className="text-sm text-gray-700">{label}</span>}
        {renderToggle()}
        {labelPosition === 'right' && <span className="text-sm text-gray-700">{label}</span>}
      </div>
    );
  }

  return renderToggle();
};

interface LikeButtonProps {
  initialLiked?: boolean;
  initialCount?: number;
  onChange?: (isLiked: boolean, count: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  initialLiked = false,
  initialCount = 0,
  onChange,
  className = '',
  size = 'md'
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    const newLikedState = !isLiked;
    const newCount = newLikedState ? count + 1 : count - 1;
    
    setIsLiked(newLikedState);
    setCount(newCount);
    
    onChange?.(newLikedState, newCount);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return { icon: 'h-4 w-4', text: 'text-xs' };
      case 'md': return { icon: 'h-5 w-5', text: 'text-sm' };
      case 'lg': return { icon: 'h-6 w-6', text: 'text-base' };
      default: return { icon: 'h-5 w-5', text: 'text-sm' };
    }
  };

  const { icon, text } = getSizeClasses();

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-1 focus:outline-none ${className}`}
    >
      <ThumbsUp
        className={`${icon} ${isLiked ? 'text-blue-600 fill-current' : 'text-gray-500'} transition-colors duration-200`}
      />
      <span className={`${text} ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}>
        {count > 0 ? count : ''}
      </span>
    </button>
  );
};

interface FavoriteButtonProps {
  initialFavorited?: boolean;
  onChange?: (isFavorited: boolean) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'heart' | 'star' | 'bookmark';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  initialFavorited = false,
  onChange,
  className = '',
  size = 'md',
  type = 'heart'
}) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    const newState = !isFavorited;
    setIsFavorited(newState);
    setIsAnimating(true);
    
    onChange?.(newState);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-5 w-5';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };

  const iconSize = getSizeClasses();
  
  const getIcon = () => {
    switch (type) {
      case 'heart': return <Heart className={`${iconSize} ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-500'}`} />;
      case 'star': return <Star className={`${iconSize} ${isFavorited ? 'text-yellow-500 fill-current' : 'text-gray-500'}`} />;
      case 'bookmark': return <Bookmark className={`${iconSize} ${isFavorited ? 'text-blue-500 fill-current' : 'text-gray-500'}`} />;
      default: return <Heart className={`${iconSize} ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-500'}`} />;
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isAnimating ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}
      transition={{ duration: 0.5 }}
      className={`focus:outline-none ${className}`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {getIcon()}
    </motion.button>
  );
};

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  onClick,
  className = '',
  children
}) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
      
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            style={{
              minWidth: count > 9 ? '1.5rem' : '1.25rem',
              height: count > 9 ? '1.5rem' : '1.25rem',
              padding: count > 9 ? '0 0.25rem' : '0'
            }}
          >
            {displayCount}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};