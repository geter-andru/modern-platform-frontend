'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react';

/**
 * Toast - Advanced toast notification system
 * 
 * Features:
 * - Multiple toast types (success, error, warning, info, loading)
 * - Auto-dismiss with configurable duration
 * - Manual dismiss option
 * - Toast positioning (top-right, top-left, bottom-right, bottom-left)
 * - Progress indicator for auto-dismiss
 * - Action buttons
 * - Rich content support
 * - Persistent toasts option
 * - Maximum toast limit
 * - Context-based toast management
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: ToastAction[];
  onDismiss?: () => void;
  progress?: number;
  createdAt: Date;
}

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  duration?: number;
  persistent?: boolean;
  actions?: ToastAction[];
  onDismiss?: () => void;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, options?: ToastOptions) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  clearAll: () => void;
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  loading: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
  defaultDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
  defaultDuration = 5000
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Generate unique ID
  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add toast
  const addToast = useCallback((message: string, options: ToastOptions = {}): string => {
    const id = generateId();
    const newToast: Toast = {
      id,
      type: options.type || 'info',
      title: options.title,
      message,
      duration: options.duration ?? defaultDuration,
      persistent: options.persistent || false,
      actions: options.actions,
      onDismiss: options.onDismiss,
      createdAt: new Date()
    };

    setToasts(prev => {
      const updated = [newToast, ...prev].slice(0, maxToasts);
      return updated;
    });

    return id;
  }, [defaultDuration, maxToasts]);

  // Remove toast
  const removeToast = useCallback((id: string) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (toast?.onDismiss) {
        toast.onDismiss();
      }
      return prev.filter(t => t.id !== id);
    });
  }, []);

  // Update toast
  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  }, []);

  // Clear all toasts
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}) => 
    addToast(message, { ...options, type: 'success' }), [addToast]);
  
  const error = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}) => 
    addToast(message, { ...options, type: 'error' }), [addToast]);
  
  const warning = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}) => 
    addToast(message, { ...options, type: 'warning' }), [addToast]);
  
  const info = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}) => 
    addToast(message, { ...options, type: 'info' }), [addToast]);
  
  const loading = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}) => 
    addToast(message, { ...options, type: 'loading', persistent: true }), [addToast]);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    updateToast,
    clearAll,
    success,
    error,
    warning,
    info,
    loading
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} position={position} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[];
  position: ToastPosition;
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position,
  onRemove
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed z-50 pointer-events-none ${getPositionClasses()}`}>
      <div className="flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={onRemove}
              position={position}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Individual Toast Component
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
  position: ToastPosition;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove, position }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  // Auto dismiss timer
  useEffect(() => {
    if (toast.persistent || toast.type === 'loading') return;

    const startTime = Date.now();
    const remainingTime = toast.duration || 5000;

    const tick = () => {
      if (isPaused) return;
      
      const elapsed = Date.now() - startTime;
      const newProgress = Math.max(0, ((remainingTime - elapsed) / (toast.duration || 5000)) * 100);
      
      setProgress(newProgress);
      
      if (newProgress <= 0) {
        onRemove(toast.id);
      }
    };

    const interval = setInterval(tick, 16); // ~60fps

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [toast, onRemove, isPaused]);

  // Handle pause/resume on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Get toast styling based on type
  const getToastStyles = () => {
    const baseStyles = 'border-l-4';
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} border-green-500 bg-green-500/10`;
      case 'error':
        return `${baseStyles} border-red-500 bg-red-500/10`;
      case 'warning':
        return `${baseStyles} border-yellow-500 bg-yellow-500/10`;
      case 'loading':
        return `${baseStyles} border-blue-500 bg-blue-500/10`;
      default:
        return `${baseStyles} border-gray-500 bg-gray-500/10`;
    }
  };

  // Get icon based on type
  const getIcon = () => {
    const iconClasses = "w-5 h-5 flex-shrink-0";
    
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-400`} />;
      case 'error':
        return <AlertCircle className={`${iconClasses} text-red-400`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-yellow-400`} />;
      case 'loading':
        return <Loader2 className={`${iconClasses} text-blue-400 animate-spin`} />;
      default:
        return <Info className={`${iconClasses} text-gray-400`} />;
    }
  };

  // Animation variants based on position
  const getAnimationVariants = () => {
    const isLeft = position.includes('left');
    const isRight = position.includes('right');
    const isTop = position.includes('top');
    
    return {
      initial: {
        opacity: 0,
        x: isLeft ? -100 : isRight ? 100 : 0,
        y: isTop ? -20 : 20,
        scale: 0.9
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1
      },
      exit: {
        opacity: 0,
        x: isLeft ? -100 : isRight ? 100 : 0,
        scale: 0.9
      }
    };
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`
        relative pointer-events-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden
        ${getToastStyles()}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Progress Bar */}
      {!toast.persistent && toast.type !== 'loading' && (
        <div className="absolute top-0 left-0 h-1 bg-gray-700 w-full">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {getIcon()}
          
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="font-semibold text-white mb-1">
                {toast.title}
              </p>
            )}
            <p className="text-gray-300 text-sm leading-relaxed">
              {toast.message}
            </p>
            
            {/* Actions */}
            {toast.actions && toast.actions.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                {toast.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.action();
                      onRemove(toast.id);
                    }}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded transition-colors
                      ${action.style === 'primary' 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : action.style === 'danger'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Dismiss Button */}
          <button
            onClick={() => onRemove(toast.id)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ToastItem;