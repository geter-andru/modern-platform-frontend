'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast context
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Toast provider
interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = toastData.duration ?? (toastData.type === 'error' ? 7000 : 4000);
    
    const toast: Toast = {
      id,
      dismissible: true,
      ...toastData,
      duration
    };

    setToasts(prev => {
      const newToasts = [toast, ...prev];
      return newToasts.slice(0, maxToasts);
    });

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearAll } = context;

  const toast = {
    success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      addToast({ message, type: 'success', ...options }),
    
    error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      addToast({ message, type: 'error', ...options }),
    
    warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      addToast({ message, type: 'warning', ...options }),
    
    info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      addToast({ message, type: 'info', ...options }),
    
    custom: (toastData: Omit<Toast, 'id'>) => addToast(toastData),
    
    dismiss: removeToast,
    clear: clearAll
  };

  return toast;
}

// Toast container component
function ToastContainer() {
  const { toasts } = useContext(ToastContext)!;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Individual toast item
interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useContext(ToastContext)!;
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => removeToast(toast.id), 150);
  };

  const getToastStyles = (type: ToastType) => {
    const styles = {
      success: {
        bg: 'bg-emerald-900/90 border-emerald-700/50',
        icon: '✅',
        iconColor: 'text-emerald-400'
      },
      error: {
        bg: 'bg-red-900/90 border-red-700/50',
        icon: '❌',
        iconColor: 'text-red-400'
      },
      warning: {
        bg: 'bg-orange-900/90 border-orange-700/50',
        icon: '⚠️',
        iconColor: 'text-orange-400'
      },
      info: {
        bg: 'bg-blue-900/90 border-blue-700/50',
        icon: 'ℹ️',
        iconColor: 'text-blue-400'
      }
    };
    return styles[type];
  };

  const styles = getToastStyles(toast.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        x: isVisible ? 0 : 300, 
        scale: isVisible ? 1 : 0.5 
      }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      transition={{ duration: 0.2 }}
      className={`
        relative overflow-hidden rounded-lg border backdrop-blur-sm
        ${styles.bg}
        shadow-lg shadow-black/20
      `}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${styles.iconColor}`}>
            <span className="text-lg">{styles.icon}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            {toast.title && (
              <div className="text-white font-medium mb-1">
                {toast.title}
              </div>
            )}
            <div className="text-slate-200 text-sm leading-relaxed">
              {toast.message}
            </div>
            
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className={`
                  mt-2 text-sm font-medium transition-colors
                  ${styles.iconColor} hover:opacity-80
                `}
              >
                {toast.action.label}
              </button>
            )}
          </div>
          
          {toast.dismissible && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Progress bar for duration */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${styles.iconColor.replace('text-', 'bg-')}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

// Pre-built toast components for common use cases
export const ToastComponents = {
  // Loading toast - converted to a hook
  useLoadingToast: (message: string = 'Loading...') => {
    const { addToast, removeToast } = useContext(ToastContext)!;
    const id = addToast({
      message,
      type: 'info',
      duration: 0,
      dismissible: false
    });
    
    return {
      dismiss: () => removeToast(id),
      update: (newMessage: string) => {
        removeToast(id);
        return addToast({
          message: newMessage,
          type: 'info',
          duration: 0,
          dismissible: false
        });
      }
    };
  },
  
  // Promise toast - converted to a hook
  usePromiseToast: <T,>(
    promise: Promise<T>,
    {
      loading: loadingMessage = 'Loading...',
      success: successMessage = 'Success!',
      error: errorMessage = 'Something went wrong'
    }: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: unknown) => string);
    }
  ) => {
    const { addToast, removeToast } = useContext(ToastContext)!;
    
    const loadingId = addToast({
      message: loadingMessage,
      type: 'info',
      duration: 0,
      dismissible: false
    });

    promise
      .then((data) => {
        removeToast(loadingId);
        const message = typeof successMessage === 'function' ? successMessage(data) : successMessage;
        addToast({
          message,
          type: 'success'
        });
      })
      .catch((error) => {
        removeToast(loadingId);
        const message = typeof errorMessage === 'function' ? errorMessage(error) : errorMessage;
        addToast({
          message,
          type: 'error'
        });
      });

    return promise;
  }
};

export default {
  ToastProvider,
  useToast,
  ToastComponents
};