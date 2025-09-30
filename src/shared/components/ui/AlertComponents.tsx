'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Alert types
export type AlertType = 'success' | 'error' | 'warning' | 'info';

// Base Alert component
interface AlertProps {
  type?: AlertType;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: 'filled' | 'outlined' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode | boolean;
  className?: string;
}

export function Alert({
  type = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  variant = 'subtle',
  size = 'md',
  icon = true,
  className = ''
}: AlertProps) {
  const getAlertStyles = (type: AlertType, variant: 'filled' | 'outlined' | 'subtle') => {
    const baseStyles = {
      success: {
        filled: 'bg-emerald-600 border-emerald-600 text-white',
        outlined: 'bg-transparent border-emerald-500 text-emerald-400',
        subtle: 'bg-emerald-900/20 border-emerald-700/50 text-emerald-400'
      },
      error: {
        filled: 'bg-red-600 border-red-600 text-white',
        outlined: 'bg-transparent border-red-500 text-red-400',
        subtle: 'bg-red-900/20 border-red-700/50 text-red-400'
      },
      warning: {
        filled: 'bg-orange-600 border-orange-600 text-white',
        outlined: 'bg-transparent border-orange-500 text-orange-400',
        subtle: 'bg-orange-900/20 border-orange-700/50 text-orange-400'
      },
      info: {
        filled: 'bg-blue-600 border-blue-600 text-white',
        outlined: 'bg-transparent border-blue-500 text-blue-400',
        subtle: 'bg-blue-900/20 border-blue-700/50 text-blue-400'
      }
    };
    return baseStyles[type][variant];
  };

  const getIcon = (type: AlertType) => {
    const icons = {
      success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[type];
  };

  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        rounded-lg border backdrop-blur-sm
        ${getAlertStyles(type, variant)}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="flex-shrink-0 mt-0.5">
            {typeof icon === 'boolean' ? (
              <div className={iconSize}>
                {getIcon(type)}
              </div>
            ) : (
              icon
            )}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <div className={`font-semibold mb-1 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'}`}>
              {title}
            </div>
          )}
          <div className={variant === 'filled' ? 'text-white/90' : ''}>
            {children}
          </div>
        </div>
        
        {dismissible && (
          <button
            onClick={onDismiss}
            className={`
              flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors
              ${variant === 'filled' ? 'text-white/70 hover:text-white' : 'opacity-70 hover:opacity-100'}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Success Alert
interface SuccessAlertProps extends Omit<AlertProps, 'type'> {}

export function SuccessAlert(props: SuccessAlertProps) {
  return <Alert {...props} type="success" />;
}

// Error Alert
interface ErrorAlertProps extends Omit<AlertProps, 'type'> {}

export function ErrorAlert(props: ErrorAlertProps) {
  return <Alert {...props} type="error" />;
}

// Warning Alert
interface WarningAlertProps extends Omit<AlertProps, 'type'> {}

export function WarningAlert(props: WarningAlertProps) {
  return <Alert {...props} type="warning" />;
}

// Info Alert
interface InfoAlertProps extends Omit<AlertProps, 'type'> {}

export function InfoAlert(props: InfoAlertProps) {
  return <Alert {...props} type="info" />;
}

// Banner Alert (full width, often used at top of page)
interface BannerAlertProps extends AlertProps {
  sticky?: boolean;
}

export function BannerAlert({ sticky = false, className = '', ...props }: BannerAlertProps) {
  return (
    <div className={`w-full ${sticky ? 'sticky top-0 z-40' : ''}`}>
      <Alert
        {...props}
        className={`rounded-none border-x-0 ${className}`}
        variant="filled"
      />
    </div>
  );
}

// Inline Alert (smaller, for form validation)
interface InlineAlertProps extends Omit<AlertProps, 'size' | 'dismissible'> {
  compact?: boolean;
}

export function InlineAlert({ compact = false, className = '', ...props }: InlineAlertProps) {
  return (
    <Alert
      {...props}
      size="sm"
      variant="subtle"
      className={`${compact ? 'p-2 text-xs' : ''} ${className}`}
      icon={compact ? false : true}
    />
  );
}

// Alert Dialog (modal-like alert)
interface AlertDialogProps extends AlertProps {
  isOpen: boolean;
  onClose?: () => void;
  actions?: ReactNode;
}

export function AlertDialog({
  isOpen,
  onClose,
  actions,
  className = '',
  ...alertProps
}: AlertDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`max-w-md w-full ${className}`}
            >
              <Alert
                {...alertProps}
                variant="filled"
                size="lg"
                dismissible={!!onClose}
                onDismiss={onClose}
              />
              
              {actions && (
                <div className="mt-4 flex justify-end space-x-2">
                  {actions}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Collapsible Alert
interface CollapsibleAlertProps extends AlertProps {
  summary: ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleAlert({
  summary,
  children,
  defaultExpanded = false,
  className = '',
  ...alertProps
}: CollapsibleAlertProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <Alert
      {...alertProps}
      className={className}
    >
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <span>{summary}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-current/20">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Alert>
  );
}

export default {
  Alert,
  SuccessAlert,
  ErrorAlert,
  WarningAlert,
  InfoAlert,
  BannerAlert,
  InlineAlert,
  AlertDialog,
  CollapsibleAlert
};