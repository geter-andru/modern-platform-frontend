'use client';

/**
 * ButtonComponents Library
 * 
 * Standardized button components with proper error handling,
 * loading states, and accessibility features.
 */

import React, { ReactNode, ButtonHTMLAttributes } from 'react';

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  );
};

// Primary Action Button
interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  className = "",
  type = "button",
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
      console.error('Button click error:', error);
      // Could show a user-friendly error message here
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed
        text-white font-semibold rounded-lg transition-colors duration-200
        min-h-[44px] min-w-[44px] touch-manipulation
        flex items-center justify-center
        ${className}
      `}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

// Secondary Action Button
interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  className = "", 
  type = "button",
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
      console.error('Button click error:', error);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed
        text-gray-300 font-medium rounded-lg transition-colors duration-200
        min-h-[44px] min-w-[44px] touch-manipulation
        flex items-center justify-center
        ${className}
      `}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

// Icon Button
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  disabled = false,
  className = "",
  ariaLabel,
  size = "md",
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    try {
      if (onClick) {
        onClick(e);
      }
    } catch (error) {
      console.error('Icon button click error:', error);
    }
  };

  const sizeClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4"
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed
        text-gray-300 rounded-lg transition-colors duration-200
        min-h-[44px] min-w-[44px] touch-manipulation
        flex items-center justify-center
        ${className}
      `}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </button>
  );
};

// Link Button (looks like a link but is a button)
interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    try {
      if (onClick) {
        onClick(e);
      }
    } catch (error) {
      console.error('Link button click error:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed
        underline transition-colors duration-200
        min-h-[44px] touch-manipulation
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Export all components
const ButtonComponents = {
  PrimaryButton,
  SecondaryButton,
  IconButton,
  LinkButton,
  LoadingSpinner
};

export default ButtonComponents;
export { LoadingSpinner };