'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { X, LucideIcon } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './ButtonComponents';

/**
 * ModalComponents - Professional modal system
 * 
 * Features:
 * - Full-screen and dialog modals
 * - Professional animations and transitions
 * - Keyboard navigation (ESC to close)
 * - Focus trap for accessibility
 * - TypeScript enhanced interfaces
 * - Responsive design
 */

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  motionProps?: MotionProps;
}

export interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  onClose?: () => void;
  className?: string;
  actions?: ReactNode;
}

export interface ModalContentProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export interface AccountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: {
    companyName: string;
    industry: string;
    description: string;
    confidenceScore: number;
    painPoints?: Array<{ description: string; severity: string }>;
    stakeholders?: Array<{ name: string; role: string }>;
  };
  className?: string;
}

// Hook for handling modal keyboard navigation
const useModalKeyboard = (isOpen: boolean, onClose: () => void, closeOnEsc: boolean = true) => {
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEsc]);
};

// Hook for handling focus trap
const useModalFocus = (isOpen: boolean) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    // Focus the modal when it opens
    modal.focus();

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  return modalRef;
};

/**
 * BaseModal - Core modal component with all features
 */
export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  closeOnBackdrop = true,
  closeOnEsc = true,
  size = 'md',
  motionProps
}) => {
  useModalKeyboard(isOpen, onClose, closeOnEsc);
  const modalRef = useModalFocus(isOpen);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'w-full h-full max-w-none'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const defaultMotionProps: MotionProps = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { type: "spring", damping: 25, stiffness: 300 },
    ...motionProps
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className={`min-h-full flex items-center justify-center p-4 ${size === 'full' ? 'p-0' : ''}`}>
          <motion.div
            ref={modalRef}
            {...defaultMotionProps}
            onClick={(e) => e.stopPropagation()}
            className={`
              ${size === 'full' ? 'w-full h-full' : `w-full ${sizeClasses[size]}`}
              bg-gray-950 border border-gray-800 
              ${size === 'full' ? 'rounded-none' : 'rounded-xl'} 
              shadow-2xl focus:outline-none
              ${className}
            `}
            tabIndex={-1}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Modal Header Component
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  onClose,
  className = '',
  actions
}) => {
  return (
    <div className={`bg-gray-900 border-b border-gray-800 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
          
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-gray-800">
                <Icon className="w-5 h-5 text-purple-400" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-400">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Modal Content Component
 */
export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className = '',
  padding = true
}) => {
  return (
    <div className={`overflow-y-auto flex-1 ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Modal Footer Component
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = '',
  align = 'right'
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={`bg-gray-900 border-t border-gray-800 p-4 ${className}`}>
      <div className={`flex items-center ${alignClasses[align]} space-x-3`}>
        {children}
      </div>
    </div>
  );
};

/**
 * Standard Dialog Modal
 */
export const DialogModal: React.FC<BaseModalProps & {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  icon,
  actions,
  size = 'md',
  ...props
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size={size} {...props}>
      <ModalHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        onClose={onClose}
        actions={actions}
      />
      <ModalContent>
        {children}
      </ModalContent>
    </BaseModal>
  );
};

/**
 * Confirmation Modal
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  isLoading = false
}) => {
  const typeConfig = {
    danger: {
      confirmVariant: 'danger' as const,
      icon: '⚠️'
    },
    warning: {
      confirmVariant: 'primary' as const,
      icon: '⚠️'
    },
    info: {
      confirmVariant: 'primary' as const,
      icon: 'ℹ️'
    }
  };

  const config = typeConfig[type];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader title={title} onClose={onClose} />
      <ModalContent>
        <div className="text-center py-4">
          <div className="text-4xl mb-4">{config.icon}</div>
          <p className="text-gray-300 leading-relaxed">{message}</p>
        </div>
      </ModalContent>
      <ModalFooter>
        <SecondaryButton onClick={onClose} disabled={isLoading}>
          {cancelText}
        </SecondaryButton>
        <PrimaryButton 
          variant={config.confirmVariant}
          onClick={onConfirm}
          loading={isLoading}
        >
          {confirmText}
        </PrimaryButton>
      </ModalFooter>
    </BaseModal>
  );
};

/**
 * Full Screen Modal (for detailed views like ICP Analysis)
 */
export const FullScreenModal: React.FC<BaseModalProps & {
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
}> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  headerActions,
  ...props
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="full" {...props}>
      <div className="h-full flex flex-col">
        <ModalHeader
          title={title}
          subtitle={subtitle}
          onClose={onClose}
          actions={headerActions}
        />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </BaseModal>
  );
};

/**
 * Account Detail Modal - Specialized for WeeklyTargetAccounts
 */
export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  isOpen,
  onClose,
  account,
  className = ''
}) => {
  return (
    <DialogModal
      isOpen={isOpen}
      onClose={onClose}
      title={account.companyName}
      subtitle={account.industry}
      size="lg"
      className={className}
    >
      <div className="space-y-6">
        {/* Company Overview */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Company Overview</h3>
          <p className="text-gray-300">{account.description}</p>
          <div className="mt-3 flex items-center">
            <span className="text-sm text-gray-400 mr-2">ICP Match:</span>
            <div className="px-2 py-1 bg-blue-600 text-white text-sm rounded">
              {account.confidenceScore}%
            </div>
          </div>
        </div>

        {/* Pain Points */}
        {account.painPoints && account.painPoints.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Pain Points</h3>
            <div className="space-y-2">
              {account.painPoints.map((pain, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    pain.severity === 'high' ? 'bg-red-400' :
                    pain.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <p className="text-gray-300 flex-1">{pain.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Stakeholders */}
        {account.stakeholders && account.stakeholders.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Key Stakeholders</h3>
            <div className="space-y-2">
              {account.stakeholders.map((stakeholder, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{stakeholder.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{stakeholder.name}</p>
                    <p className="text-sm text-gray-400">{stakeholder.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ModalFooter>
        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
        <PrimaryButton onClick={() => console.log('Add to pipeline')}>
          Add to Pipeline
        </PrimaryButton>
      </ModalFooter>
    </DialogModal>
  );
};

// Export all components
export default BaseModal;