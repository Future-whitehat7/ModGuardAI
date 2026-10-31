import React, { useEffect } from 'react';
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
    <div className={`toast-in ${style.bg} ${style.border} border rounded-lg p-4 shadow-lg max-w-sm w-full relative overflow-hidden`}>
      {duration > 0 && (
        <div
          className="toast-bar absolute bottom-0 left-0 h-1 bg-current opacity-30"
          style={{ animationDuration: `${duration}ms` }}
        />
      )}

      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${style.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${style.title}`}>{title}</h4>
          {description && (
            <p className={`text-sm ${style.description} mt-1`}>{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onClose(id)}
          className={`${style.icon} hover:bg-white/50 rounded-md p-1 transition-colors flex-shrink-0 min-h-12 min-w-12`}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[]; onClose: (id: string) => void }> = ({
  toasts,
  onClose
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};
