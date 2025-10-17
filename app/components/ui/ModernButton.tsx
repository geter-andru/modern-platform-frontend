'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MICRO_INTERACTIONS } from '../../lib/constants/brand';

/**
 * ModernButton - Professional button component for Next.js App Router
 *
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, link, danger, success, warning)
 * - Multiple sizes (sm, md, lg, xl)
 * - Loading states with spinner
 * - Disabled states
 * - Icon support (left, right, or standalone)
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - TypeScript-first implementation
 * - Dark theme design system integration
 * - Framer Motion animations
 */

interface BaseButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'success' | 'warning';
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  'aria-label'?: string;
  'aria-busy'?: boolean;
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]}`} />
  );
};

const ModernButton: React.FC<BaseButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  loadingText,
  className = '',
  type = 'button',
  size = 'md',
  variant = 'primary',
  icon,
  leftIcon,
  rightIcon,
  iconPosition = 'left',
  fullWidth = false,
  'aria-label': ariaLabel,
  'aria-busy': ariaBusy,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    try {
      if (onClick) {
        onClick(e);
      }
    } catch (error) {
      console.error('ModernButton click error:', error);
    }
  };

  // Size configurations
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  // Variant configurations using dark theme colors
  const variantClasses = {
    primary: `
      bg-purple-600 hover:bg-purple-700 active:bg-purple-800
      text-white border-purple-600
      disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-700
    `,
    secondary: `
      bg-gray-700 hover:bg-gray-600 active:bg-gray-500
      text-white border-gray-700
      disabled:bg-gray-800 disabled:text-gray-600 disabled:border-gray-800
    `,
    outline: `
      bg-transparent hover:bg-purple-600/10 active:bg-purple-600/20
      text-purple-400 border border-purple-600/50
      disabled:bg-transparent disabled:text-gray-600 disabled:border-gray-700
    `,
    ghost: `
      bg-transparent hover:bg-gray-700 active:bg-gray-600
      text-gray-300 border-transparent
      disabled:bg-transparent disabled:text-gray-600 disabled:border-transparent
    `,
    link: `
      bg-transparent hover:bg-transparent active:bg-transparent
      text-purple-400 hover:text-purple-300 underline
      border-transparent disabled:text-gray-600
    `,
    danger: `
      bg-red-600 hover:bg-red-700 active:bg-red-800
      text-white border-red-600
      disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-700
    `,
    success: `
      bg-green-600 hover:bg-green-700 active:bg-green-800
      text-white border-green-600
      disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-700
    `,
    warning: `
      bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800
      text-white border-yellow-600
      disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-700
    `
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    font-medium rounded-lg border
    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
    touch-manipulation select-none
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${!disabled && !loading ? MICRO_INTERACTIONS.hover : ''}
    ${!disabled && !loading ? MICRO_INTERACTIONS.focus : ''}
    ${!disabled && !loading ? MICRO_INTERACTIONS.active : ''}
    ${className}
  `.trim();

  const hasContent = children || leftIcon || rightIcon || icon || loading;

  const content = (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={size === 'sm' ? 'sm' : size === 'lg' || size === 'xl' ? 'lg' : 'md'} />
        </div>
      )}

      {hasContent && (
        <div className={`flex items-center justify-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {!loading && (leftIcon || (icon && iconPosition === 'left')) && (
            <span className="flex-shrink-0">{leftIcon || icon}</span>
          )}

          <span className="flex-1 text-center">
            {loading ? (loadingText || 'Loading...') : children}
          </span>

          {!loading && (rightIcon || (icon && iconPosition === 'right')) && (
            <span className="flex-shrink-0">{rightIcon || icon}</span>
          )}
        </div>
      )}
    </>
  );

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={baseClasses}
      aria-label={ariaLabel}
      aria-busy={ariaBusy || loading}
      aria-disabled={disabled || loading}
      tabIndex={disabled || loading ? -1 : 0}
      whileHover={!disabled && !loading ? { 
        scale: 1.02,
        y: -1,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : {}}
      whileTap={!disabled && !loading ? { 
        scale: 0.98,
        y: 0,
        transition: { duration: 0.1 }
      } : {}}
      {...props}
    >
      {content}
    </motion.button>
  );
};

// Convenience exports for common button types
export const PrimaryButton: React.FC<Omit<BaseButtonProps, 'variant'>> = (props) => (
  <ModernButton {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<BaseButtonProps, 'variant'>> = (props) => (
  <ModernButton {...props} variant="secondary" />
);

export const OutlineButton: React.FC<Omit<BaseButtonProps, 'variant'>> = (props) => (
  <ModernButton {...props} variant="outline" />
);

export const GhostButton: React.FC<Omit<BaseButtonProps, 'variant'>> = (props) => (
  <ModernButton {...props} variant="ghost" />
);

export const LinkButton: React.FC<Omit<BaseButtonProps, 'variant'>> = (props) => (
  <ModernButton {...props} variant="link" />
);

export const DangerButton: React.FC<Omit<BaseButtonProps, 'variant'>> = (props) => (
  <ModernButton {...props} variant="danger" />
);

export const SuccessButton: React.FC<Omit<BaseButtonProps, 'variant'>> = (props) => (
  <ModernButton {...props} variant="success" />
);

export const WarningButton: React.FC<Omit<BaseButtonProps, 'variant'>> = (props) => (
  <ModernButton {...props} variant="warning" />
);

// Icon Button component for standalone icons
interface IconButtonProps extends Omit<BaseButtonProps, 'children' | 'icon' | 'iconPosition'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}) => {
  const iconSizeClasses = {
    sm: 'p-2 min-h-[36px] min-w-[36px]',
    md: 'p-3 min-h-[44px] min-w-[44px]',
    lg: 'p-4 min-h-[48px] min-w-[48px]',
    xl: 'p-5 min-h-[56px] min-w-[56px]'
  };

  return (
    <ModernButton
      {...props}
      size={size}
      variant={variant}
      className={`${iconSizeClasses[size]} ${className}`}
    >
      {icon}
    </ModernButton>
  );
};

export default ModernButton;
export { ModernButton, LoadingSpinner };
