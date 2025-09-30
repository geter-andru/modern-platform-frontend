'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'text-purple-500',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${color} ${className}`}>
      <div className="w-full h-full border-2 border-current border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  rows = 1 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(rows)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};

interface LoadingCardProps {
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ className = '' }) => {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg p-6 animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-700 rounded w-full"></div>
          <div className="h-3 bg-slate-700 rounded w-3/4"></div>
        </div>
        <div className="h-8 bg-slate-700 rounded w-1/3"></div>
      </div>
    </div>
  );
};

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'card' | 'dots';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  message = 'Loading...',
  size = 'md',
  className = ''
}) => {
  const renderLoading = () => {
    switch (type) {
      case 'spinner':
        return <LoadingSpinner size={size} />;
      case 'skeleton':
        return <LoadingSkeleton rows={3} />;
      case 'card':
        return <LoadingCard />;
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        );
      default:
        return <LoadingSpinner size={size} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {renderLoading()}
      {message && (
        <p className="text-slate-400 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

interface FullPageLoadingProps {
  message?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <LoadingState message={message} size="lg" />
    </div>
  );
};

interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  isLoading,
  children,
  className = '',
  disabled = false,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center ${className} ${
        (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {children}
    </button>
  );
};

// Export all components as named exports
export default {
  LoadingSpinner,
  LoadingSkeleton,
  LoadingCard,
  LoadingState,
  FullPageLoading,
  ButtonLoading
};