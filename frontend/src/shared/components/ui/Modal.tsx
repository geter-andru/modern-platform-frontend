'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';

/**
 * Modal - Flexible modal dialog system
 * 
 * Features:
 * - Multiple modal sizes and variants
 * - Animated entrance/exit transitions
 * - Backdrop blur and click-outside-to-close
 * - Keyboard navigation (ESC to close)
 * - Full-screen mode support
 * - Custom header and footer sections
 * - Scroll handling for large content
 * - Focus management and accessibility
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type ModalVariant = 'default' | 'centered' | 'drawer' | 'fullscreen';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showFullscreenToggle?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  backdropClassName?: string;
  contentClassName?: string;
  preventScroll?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showFullscreenToggle = false,
  header,
  footer,
  className = '',
  backdropClassName = '',
  contentClassName = '',
  preventScroll = true
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Size configurations
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  // Variant-specific animations
  const getVariantAnimation = () => {
    switch (variant) {
      case 'drawer':
        return {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '100%', opacity: 0 }
        };
      case 'fullscreen':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 }
        };
      default:
        return {
          initial: { scale: 0.9, opacity: 0, y: 20 },
          animate: { scale: 1, opacity: 1, y: 0 },
          exit: { scale: 0.9, opacity: 0, y: 20 }
        };
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }

      // Trap focus within modal
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    if (isOpen) {
      // Store currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevent body scroll
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }

      // Focus first focusable element in modal
      setTimeout(() => {
        const focusableElement = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (focusableElement) {
          focusableElement.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (preventScroll) {
        document.body.style.overflow = 'unset';
      }
      
      // Restore focus to previously focused element
      if (previousActiveElement.current && !isOpen) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, closeOnEscape, onClose, preventScroll]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const animation = getVariantAnimation();
  const modalSizeClass = isFullscreen ? 'max-w-[95vw] max-h-[95vh]' : sizeClasses[size];

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
            className={`
              fixed inset-0 bg-black/50 backdrop-blur-sm z-50
              ${variant === 'drawer' ? '' : 'flex items-center justify-center p-4'}
              ${backdropClassName}
            `}
            onClick={handleBackdropClick}
          >
            {/* Modal Container */}
            <motion.div
              ref={modalRef}
              initial={animation.initial}
              animate={animation.animate}
              exit={animation.exit}
              transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.3 }}
              className={`
                relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl
                ${variant === 'drawer' ? 'ml-auto h-full max-h-full w-full max-w-md rounded-l-xl rounded-r-none' : ''}
                ${variant === 'fullscreen' || isFullscreen ? 'w-full h-full rounded-none' : modalSizeClass}
                ${variant === 'centered' ? 'm-auto' : ''}
                ${className}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || header || showCloseButton || showFullscreenToggle) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {title && (
                      <h2 className="text-xl font-semibold text-white truncate">
                        {title}
                      </h2>
                    )}
                    {header}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {showFullscreenToggle && (
                      <button
                        onClick={toggleFullscreen}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Close modal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className={`
                ${variant === 'drawer' || isFullscreen ? 'flex-1 overflow-auto' : 'max-h-[80vh] overflow-auto'}
                ${title || header ? 'p-6' : 'p-6'}
                ${contentClassName}
              `}>
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
                  {footer}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Confirmation Modal Component
export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-blue-500 hover:bg-blue-600'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50
              ${variantStyles[variant]}
            `}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <p className="text-gray-300">{message}</p>
    </Modal>
  );
};

// Alert Modal Component
export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info'
}) => {
  const variantStyles = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          OK
        </button>
      }
    >
      <p className={`${variantStyles[variant]}`}>{message}</p>
    </Modal>
  );
};

export default Modal;