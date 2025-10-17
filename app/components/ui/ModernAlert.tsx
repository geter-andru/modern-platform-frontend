'use client';

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X, ChevronDown } from 'lucide-react';

/**
 * ModernAlert - Comprehensive alert component system for Next.js App Router
 *
 * Features:
 * - 4 semantic variants (success, error, warning, info)
 * - Optional title with description
 * - Optional icon (auto or custom)
 * - Dismissible with close button
 * - Action buttons (1-2 buttons)
 * - Collapsible content section
 * - Auto-dismiss timer (optional)
 * - Entry/exit animations
 * - Banner alert (full width, sticky)
 * - Inline alert (form validation)
 * - Alert dialog (modal-like)
 * - Dark theme design system
 * - Framer Motion animations
 * - TypeScript strict mode
 * - Full accessibility
 */

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';
export type AlertSize = 'sm' | 'md' | 'lg';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  children?: ReactNode;
  icon?: ReactNode | boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: ReactNode;
  size?: AlertSize;
  autoDismiss?: number; // milliseconds
  className?: string;
}

const ModernAlert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  description,
  children,
  icon = true,
  dismissible = false,
  onDismiss,
  actions,
  size = 'md',
  autoDismiss,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Auto-dismiss functionality
  useEffect(() => {
    if (autoDismiss && autoDismiss > 0) {
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, autoDismiss);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 200); // Wait for exit animation
  };

  // Variant configurations with dark theme colors
  const variantConfig = {
    success: {
      bg: 'bg-green-500/10 border-green-500/30',
      text: 'text-green-400',
      icon: <CheckCircle className="w-5 h-5" />
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/30',
      text: 'text-red-400',
      icon: <XCircle className="w-5 h-5" />
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      text: 'text-yellow-400',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      text: 'text-blue-400',
      icon: <Info className="w-5 h-5" />
    }
  };

  const config = variantConfig[variant];

  // Size configurations
  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        rounded-lg border backdrop-blur-sm
        ${config.bg}
        ${sizeClasses[size]}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {icon && (
          <div className={`flex-shrink-0 mt-0.5 ${config.text}`}>
            {typeof icon === 'boolean' ? config.icon : icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {title && (
            <div className={`font-semibold mb-1 text-white ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'}`}>
              {title}
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="text-gray-300 mb-2">
              {description}
            </div>
          )}

          {/* Children */}
          {children && (
            <div className="text-gray-300">
              {children}
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="mt-3 flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/20 transition-colors text-gray-400 hover:text-white"
            aria-label="Dismiss alert"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Success Alert (convenience wrapper)
export interface SuccessAlertProps extends Omit<AlertProps, 'variant'> {}

export const SuccessAlert: React.FC<SuccessAlertProps> = (props) => {
  return <ModernAlert {...props} variant="success" />;
};

// Error Alert (convenience wrapper)
export interface ErrorAlertProps extends Omit<AlertProps, 'variant'> {}

export const ErrorAlert: React.FC<ErrorAlertProps> = (props) => {
  return <ModernAlert {...props} variant="error" />;
};

// Warning Alert (convenience wrapper)
export interface WarningAlertProps extends Omit<AlertProps, 'variant'> {}

export const WarningAlert: React.FC<WarningAlertProps> = (props) => {
  return <ModernAlert {...props} variant="warning" />;
};

// Info Alert (convenience wrapper)
export interface InfoAlertProps extends Omit<AlertProps, 'variant'> {}

export const InfoAlert: React.FC<InfoAlertProps> = (props) => {
  return <ModernAlert {...props} variant="info" />;
};

// Banner Alert (full width, often at top of page)
export interface BannerAlertProps extends AlertProps {
  sticky?: boolean;
}

export const BannerAlert: React.FC<BannerAlertProps> = ({
  sticky = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${sticky ? 'sticky top-0 z-40' : ''}`}>
      <ModernAlert
        {...props}
        className={`rounded-none border-x-0 ${className}`}
      />
    </div>
  );
};

// Inline Alert (smaller, for form validation)
export interface InlineAlertProps extends Omit<AlertProps, 'size' | 'dismissible'> {
  compact?: boolean;
}

export const InlineAlert: React.FC<InlineAlertProps> = ({
  compact = false,
  className = '',
  icon = !compact,
  ...props
}) => {
  return (
    <ModernAlert
      {...props}
      size="sm"
      icon={icon}
      className={`${compact ? 'p-2 text-xs' : ''} ${className}`}
    />
  );
};

// Alert Dialog (modal-like alert with backdrop)
export interface AlertDialogProps extends AlertProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  actions,
  className = '',
  ...alertProps
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`max-w-md w-full pointer-events-auto ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              <ModernAlert
                {...alertProps}
                size="lg"
                dismissible={!!onClose}
                onDismiss={onClose}
                actions={actions}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Collapsible Alert (expandable content)
export interface CollapsibleAlertProps extends AlertProps {
  summary: ReactNode;
  defaultExpanded?: boolean;
}

export const CollapsibleAlert: React.FC<CollapsibleAlertProps> = ({
  summary,
  children,
  defaultExpanded = false,
  className = '',
  ...alertProps
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <ModernAlert {...alertProps} className={className}>
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left group"
          type="button"
        >
          <span className="font-medium text-white">{summary}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-current/20">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModernAlert>
  );
};

ModernAlert.displayName = 'ModernAlert';

export default ModernAlert;
