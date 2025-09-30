import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  color?: 'primary' | 'white' | 'muted';
  variant?: 'spinner' | 'dots' | 'pulse';
  'aria-label'?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  text,
  color = 'primary',
  variant = 'spinner',
  'aria-label': ariaLabel
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-blue-500',
    white: 'border-white',
    muted: 'border-gray-400'
  };

  const bgColorClasses = {
    primary: 'bg-blue-500',
    white: 'bg-white',
    muted: 'bg-gray-400'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const renderSpinner = () => {
    const defaultAriaLabel = ariaLabel || 'Loading...';
    
    switch (variant) {
      case 'dots':
        return (
          <div 
            className="flex space-x-1"
            role="status"
            aria-label={defaultAriaLabel}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${bgColorClasses[color]} animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`${sizeClasses[size]} rounded-full ${bgColorClasses[color]} animate-pulse`}
            role="status"
            aria-label={defaultAriaLabel}
          />
        );

      default: // spinner
        return (
          <div
            className={`${sizeClasses[size]} border-2 border-gray-200 ${colorClasses[color]} ${colorClasses[color].replace('border-', 'border-t-')} rounded-full animate-spin`}
            role="status"
            aria-label={defaultAriaLabel}
          />
        );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`opacity-100 transition-opacity duration-300 flex items-center justify-center ${className}`}>
        {renderSpinner()}
      </div>
      {text && text.trim() && (
        <span className={`ml-2 ${textSizeClasses[size]} text-gray-500`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;