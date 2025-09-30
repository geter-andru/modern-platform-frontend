'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Divider - Enterprise-grade divider/separator component system
 * 
 * Features:
 * - Horizontal and vertical orientations
 * - Multiple variants and styles
 * - Text labels and icons
 * - Gradient and solid styles
 * - Customizable thickness and spacing
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Animation support
 * - Responsive design
 * - Theme integration
 */

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted' | 'gradient' | 'double';
export type DividerSize = 'thin' | 'medium' | 'thick';
export type DividerColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted';

export interface DividerProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  size?: DividerSize;
  color?: DividerColor;
  className?: string;
  children?: React.ReactNode;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  flexItem?: boolean;
  'aria-label'?: string;
  'data-testid'?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  size = 'thin',
  color = 'default',
  className = '',
  children,
  label,
  icon,
  spacing = 'md',
  animate = false,
  flexItem = false,
  'aria-label': ariaLabel,
  'data-testid': testId
}) => {
  // Size configurations
  const sizeClasses = {
    horizontal: {
      thin: 'border-t',
      medium: 'border-t-2',
      thick: 'border-t-4'
    },
    vertical: {
      thin: 'border-l',
      medium: 'border-l-2', 
      thick: 'border-l-4'
    }
  };

  // Color configurations
  const colorClasses = {
    default: 'border-gray-700',
    primary: 'border-blue-500',
    secondary: 'border-purple-500',
    success: 'border-green-500',
    warning: 'border-orange-500',
    danger: 'border-red-500',
    muted: 'border-gray-800'
  };

  // Variant configurations
  const variantClasses = {
    solid: '',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    gradient: '',
    double: 'border-double'
  };

  // Spacing configurations
  const spacingClasses = {
    horizontal: {
      none: 'my-0',
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-6',
      xl: 'my-8'
    },
    vertical: {
      none: 'mx-0',
      sm: 'mx-2',
      md: 'mx-4',
      lg: 'mx-6',
      xl: 'mx-8'
    }
  };

  // Build divider classes
  const getDividerClasses = () => {
    const classes = [
      sizeClasses[orientation][size],
      variant === 'gradient' ? '' : colorClasses[color],
      variantClasses[variant],
      spacingClasses[orientation][spacing]
    ];

    if (orientation === 'vertical') {
      classes.push('h-full', 'inline-block');
      if (flexItem) classes.push('self-stretch');
    } else {
      classes.push('w-full');
    }

    return classes.filter(Boolean).join(' ');
  };

  // Gradient styles for gradient variant
  const getGradientStyle = () => {
    if (variant !== 'gradient') return {};

    const gradientColors = {
      default: 'linear-gradient(90deg, transparent, rgb(55, 65, 81), transparent)',
      primary: 'linear-gradient(90deg, transparent, rgb(59, 130, 246), transparent)',
      secondary: 'linear-gradient(90deg, transparent, rgb(147, 51, 234), transparent)',
      success: 'linear-gradient(90deg, transparent, rgb(34, 197, 94), transparent)',
      warning: 'linear-gradient(90deg, transparent, rgb(251, 146, 60), transparent)',
      danger: 'linear-gradient(90deg, transparent, rgb(239, 68, 68), transparent)',
      muted: 'linear-gradient(90deg, transparent, rgb(31, 41, 55), transparent)'
    };

    if (orientation === 'horizontal') {
      return {
        background: gradientColors[color],
        height: size === 'thin' ? '1px' : size === 'medium' ? '2px' : '4px',
        border: 'none'
      };
    } else {
      return {
        background: `linear-gradient(180deg, transparent, ${gradientColors[color].match(/rgb\([^)]+\)/)?.[0] || 'rgb(55, 65, 81)'}, transparent)`,
        width: size === 'thin' ? '1px' : size === 'medium' ? '2px' : '4px',
        border: 'none'
      };
    }
  };

  // Animation variants
  const animationVariants = {
    horizontal: {
      initial: { scaleX: 0, opacity: 0 },
      animate: { scaleX: 1, opacity: 1 },
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    vertical: {
      initial: { scaleY: 0, opacity: 0 },
      animate: { scaleY: 1, opacity: 1 },
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  // Label/content divider
  if (children || label || icon) {
    return (
      <div 
        className={`flex items-center ${orientation === 'vertical' ? 'flex-col h-full' : 'w-full'} ${spacingClasses[orientation][spacing]} ${className}`}
        role="separator"
        aria-label={ariaLabel}
        data-testid={testId}
      >
        {/* First divider segment */}
        {animate ? (
          <motion.div
            className={`flex-1 ${getDividerClasses()}`}
            style={getGradientStyle()}
            variants={animationVariants[orientation]}
            initial="initial"
            animate="animate"
          />
        ) : (
          <div
            className={`flex-1 ${getDividerClasses()}`}
            style={getGradientStyle()}
          />
        )}

        {/* Content */}
        {(children || label || icon) && (
          <div className={`flex items-center ${orientation === 'vertical' ? 'py-2' : 'px-4'} text-gray-400 text-sm font-medium`}>
            {icon && (
              <span className={`${(children || label) ? (orientation === 'vertical' ? 'mb-1' : 'mr-2') : ''}`}>
                {icon}
              </span>
            )}
            {children || label}
          </div>
        )}

        {/* Second divider segment */}
        {animate ? (
          <motion.div
            className={`flex-1 ${getDividerClasses()}`}
            style={getGradientStyle()}
            variants={animationVariants[orientation]}
            initial="initial"
            animate="animate"
          />
        ) : (
          <div
            className={`flex-1 ${getDividerClasses()}`}
            style={getGradientStyle()}
          />
        )}
      </div>
    );
  }

  // Simple divider
  const DividerElement = animate ? motion.div : 'div';

  return (
    <DividerElement
      className={`${getDividerClasses()} ${className}`}
      style={getGradientStyle()}
      role="separator"
      aria-label={ariaLabel}
      data-testid={testId}
      {...(animate ? {
        variants: animationVariants[orientation],
        initial: "initial",
        animate: "animate"
      } : {})}
    />
  );
};

// Section Divider Component - with more prominent styling
export interface SectionDividerProps extends Omit<DividerProps, 'size' | 'variant'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  prominent?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  title,
  subtitle,
  actions,
  prominent = false,
  color = 'default',
  spacing = 'xl',
  animate = true,
  className = '',
  ...props
}) => {
  return (
    <div className={`${spacingClasses.horizontal[spacing]} ${className}`}>
      <div className={`flex items-center justify-between ${prominent ? 'pb-4' : 'pb-2'}`}>
        <div>
          {title && (
            <h3 className={`font-semibold text-gray-200 ${prominent ? 'text-lg' : 'text-base'}`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      
      <Divider
        variant={prominent ? 'gradient' : 'solid'}
        size={prominent ? 'medium' : 'thin'}
        color={color}
        spacing="none"
        animate={animate}
        {...props}
      />
    </div>
  );
};

// Text Divider Component - specifically for text content separation
export interface TextDividerProps extends Pick<DividerProps, 'color' | 'variant' | 'animate' | 'className'> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const TextDivider: React.FC<TextDividerProps> = ({
  children,
  size = 'md',
  color = 'muted',
  variant = 'solid',
  animate = false,
  className = ''
}) => {
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base'
  };

  return (
    <div className={`relative flex items-center justify-center my-6 ${className}`}>
      <Divider
        variant={variant}
        color={color}
        spacing="none"
        animate={animate}
        className="absolute inset-0"
      />
      <div className={`relative bg-gray-900 px-4 ${textSizeClasses[size]} font-medium text-gray-400`}>
        {children}
      </div>
    </div>
  );
};

// Breadcrumb Divider Component
export interface BreadcrumbDividerProps {
  icon?: React.ReactNode;
  className?: string;
}

export const BreadcrumbDivider: React.FC<BreadcrumbDividerProps> = ({
  icon,
  className = ''
}) => {
  const DefaultIcon = () => (
    <svg
      className="w-4 h-4 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className={`flex items-center justify-center px-2 ${className}`}>
      {icon || <DefaultIcon />}
    </div>
  );
};

// List Divider Component - for separating list items
export interface ListDividerProps extends Pick<DividerProps, 'color' | 'variant' | 'className'> {
  inset?: boolean;
  fullWidth?: boolean;
}

export const ListDivider: React.FC<ListDividerProps> = ({
  color = 'muted',
  variant = 'solid',
  inset = false,
  fullWidth = true,
  className = ''
}) => {
  return (
    <Divider
      variant={variant}
      color={color}
      spacing="none"
      className={`
        ${inset ? 'ml-12' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    />
  );
};

// Card Divider Component - for separating card sections
export const CardDivider: React.FC<Pick<DividerProps, 'className'>> = ({ className = '' }) => {
  return (
    <Divider
      color="muted"
      spacing="none"
      className={`my-4 ${className}`}
    />
  );
};

// Toolbar Divider Component - vertical divider for toolbars
export const ToolbarDivider: React.FC<Pick<DividerProps, 'className'>> = ({ className = '' }) => {
  return (
    <Divider
      orientation="vertical"
      color="muted"
      spacing="sm"
      className={`h-6 ${className}`}
    />
  );
};

// Hook for divider animations
export const useDividerAnimation = (trigger: boolean = true) => {
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  React.useEffect(() => {
    if (trigger) {
      setShouldAnimate(true);
    }
  }, [trigger]);

  const reset = React.useCallback(() => {
    setShouldAnimate(false);
  }, []);

  return { shouldAnimate, reset };
};

// Spacer utility component (invisible divider for spacing)
export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  orientation?: DividerOrientation;
  className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  orientation = 'horizontal',
  className = ''
}) => {
  const spacerClasses = {
    horizontal: {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-4',
      lg: 'h-6',
      xl: 'h-8',
      '2xl': 'h-12',
      '3xl': 'h-16'
    },
    vertical: {
      xs: 'w-1',
      sm: 'w-2',
      md: 'w-4',
      lg: 'w-6',
      xl: 'w-8',
      '2xl': 'w-12',
      '3xl': 'w-16'
    }
  };

  return (
    <div 
      className={`${spacerClasses[orientation][size]} ${className}`}
      aria-hidden="true"
    />
  );
};

export default Divider;