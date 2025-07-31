import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, X, Info, AlertCircle } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-800',
      description: 'text-green-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      description: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-800',
      description: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      description: 'text-blue-700'
    }
  };

  const Icon = icons[type];
  const style = styles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className={`${style.bg} ${style.border} border rounded-lg p-4 shadow-lg max-w-sm w-full relative overflow-hidden`}
    >
      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-current to-transparent opacity-30"
        />
      )}

      <div className="flex items-start space-x-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        >
          <Icon className={`h-5 w-5 ${style.icon} flex-shrink-0 mt-0.5`} />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <motion.h4
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className={`text-sm font-medium ${style.title}`}
          >
            {title}
          </motion.h4>
          {description && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-sm ${style.description} mt-1`}
            >
              {description}
            </motion.p>
          )}
        </div>
        
        <button
          onClick={() => onClose(id)}
          className={`${style.icon} hover:bg-white/50 rounded-md p-1 transition-colors flex-shrink-0`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[]; onClose: (id: string) => void }> = ({
  toasts,
  onClose
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};