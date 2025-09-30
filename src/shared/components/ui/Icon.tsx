'use client';

import React, { forwardRef, SVGProps } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { LucideIcon, LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

/**
 * Icon - Enterprise-grade icon component system
 * 
 * Features:
 * - Lucide React icon integration
 * - Dynamic icon loading by name
 * - Custom SVG support
 * - Multiple sizes and variants
 * - Animation support via Framer Motion
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Loading and error states
 * - Icon badges and overlays
 * - Color and styling variants
 * - Responsive sizing
 */

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | number;
export type IconVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'size' | 'color'> {
  name?: keyof typeof LucideIcons;
  icon?: LucideIcon;
  size?: IconSize;
  variant?: IconVariant;
  loading?: boolean;
  error?: boolean;
  badge?: React.ReactNode;
  badgeColor?: string;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  rotate?: number;
  flip?: 'horizontal' | 'vertical' | 'both';
  animate?: boolean;
  spin?: boolean;
  pulse?: boolean;
  bounce?: boolean;
  className?: string;
  children?: React.ReactNode;
  motionProps?: MotionProps;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  title?: string;
}

// Size mapping for consistent sizing
const sizeMap: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 36
};

// Variant color classes
const variantClasses: Record<IconVariant, string> = {
  default: 'text-gray-400',
  primary: 'text-blue-500',
  secondary: 'text-purple-500',
  success: 'text-green-500',
  warning: 'text-orange-500',
  danger: 'text-red-500',
  muted: 'text-gray-600'
};

// Animation variants for Framer Motion
const animationVariants = {
  spin: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: 'linear' }
  },
  pulse: {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
  },
  bounce: {
    animate: { y: [0, -4, 0] },
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
  }
};

const Icon = forwardRef<SVGSVGElement, IconProps>(({
  name,
  icon,
  size = 'md',
  variant = 'default',
  loading = false,
  error = false,
  badge,
  badgeColor = 'bg-red-500',
  badgePosition = 'top-right',
  rotate = 0,
  flip,
  animate = false,
  spin = false,
  pulse = false,
  bounce = false,
  className = '',
  children,
  motionProps,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  title,
  style,
  ...props
}, ref) => {
  // Determine icon size
  const iconSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.md;

  // Get Lucide icon component
  const LucideComponent = name ? (LucideIcons as any)[name] as LucideIcon : icon;

  // Build transform styles
  const transforms: string[] = [];
  if (rotate) transforms.push(`rotate(${rotate}deg)`);
  if (flip === 'horizontal' || flip === 'both') transforms.push('scaleX(-1)');
  if (flip === 'vertical' || flip === 'both') transforms.push('scaleY(-1)');

  const transformStyle = transforms.length > 0 ? transforms.join(' ') : undefined;

  // Build classes
  const iconClasses = `
    inline-block
    ${variantClasses[variant]}
    ${spin ? 'animate-spin' : ''}
    ${pulse ? 'animate-pulse' : ''}
    ${bounce ? 'animate-bounce' : ''}
    ${loading ? 'opacity-50' : ''}
    ${error ? 'text-red-500' : ''}
    ${className}
  `.trim();

  // Badge position classes
  const badgePositionClasses = {
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2'
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <motion.div
      className="inline-block border-2 border-gray-300 border-t-transparent rounded-full"
      style={{ width: iconSize, height: iconSize }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );

  // Error icon component
  const ErrorIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClasses}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );

  // Custom SVG with children
  if (children && !LucideComponent) {
    const IconWrapper = animate ? motion.svg : 'svg';
    
    return (
      <div className="relative inline-block">
        <IconWrapper
          ref={ref as any}
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClasses}
          style={{ 
            transform: transformStyle, 
            ...style 
          }}
          aria-label={ariaLabel}
          aria-hidden={ariaHidden}
          title={title}
          {...(animate ? {
            ...((spin && animationVariants.spin) ||
               (pulse && animationVariants.pulse) ||
               (bounce && animationVariants.bounce) ||
               {}),
            ...motionProps
          } : {})}
          {...props}
        >
          {children}
        </IconWrapper>

        {badge && (
          <div className={`absolute ${badgePositionClasses[badgePosition]} z-10`}>
            <div className={`${badgeColor} rounded-full min-w-[16px] h-4 flex items-center justify-center text-white text-xs font-medium px-1`}>
              {badge}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="relative inline-block">
        <LoadingSpinner />
        {badge && (
          <div className={`absolute ${badgePositionClasses[badgePosition]} z-10`}>
            <div className={`${badgeColor} rounded-full min-w-[16px] h-4 flex items-center justify-center text-white text-xs font-medium px-1`}>
              {badge}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (error || (!LucideComponent && name)) {
    return (
      <div className="relative inline-block">
        <ErrorIcon />
        {badge && (
          <div className={`absolute ${badgePositionClasses[badgePosition]} z-10`}>
            <div className={`${badgeColor} rounded-full min-w-[16px] h-4 flex items-center justify-center text-white text-xs font-medium px-1`}>
              {badge}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Lucide icon
  if (LucideComponent) {
    const IconComponent = animate ? motion.create(LucideComponent as any) : LucideComponent;
    
    return (
      <div className="relative inline-block">
        <IconComponent
          ref={ref as any}
          size={iconSize}
          className={iconClasses}
          style={{ 
            transform: transformStyle, 
            ...style 
          }}
          aria-label={ariaLabel}
          aria-hidden={ariaHidden}
          title={title}
          {...(animate ? {
            ...((spin && animationVariants.spin) ||
               (pulse && animationVariants.pulse) ||
               (bounce && animationVariants.bounce) ||
               {}),
            ...motionProps
          } : {})}
          {...props}
        />

        {badge && (
          <div className={`absolute ${badgePositionClasses[badgePosition]} z-10`}>
            <div className={`${badgeColor} rounded-full min-w-[16px] h-4 flex items-center justify-center text-white text-xs font-medium px-1`}>
              {badge}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback - render nothing
  return null;
});

Icon.displayName = 'Icon';

// Icon Button Component
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  icon?: LucideIcon;
  name?: keyof typeof LucideIcons;
  size?: IconSize;
  variant?: IconVariant | 'ghost' | 'outline' | 'solid';
  loading?: boolean;
  children?: React.ReactNode;
  badge?: React.ReactNode;
  badgeColor?: string;
  iconProps?: Partial<IconProps>;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  name,
  size = 'md',
  variant = 'ghost',
  loading = false,
  disabled,
  children,
  badge,
  badgeColor,
  iconProps,
  className = '',
  ...props
}, ref) => {
  const iconSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.md;
  const padding = iconSize < 20 ? 'p-1' : iconSize < 24 ? 'p-2' : 'p-3';

  const variantStyles = {
    ghost: 'hover:bg-gray-700 text-gray-400 hover:text-white',
    outline: 'border border-gray-600 hover:border-gray-500 text-gray-400 hover:text-white hover:bg-gray-700',
    solid: 'bg-blue-500 hover:bg-blue-600 text-white',
    default: 'text-gray-400 hover:text-white',
    primary: 'text-blue-500 hover:text-blue-400',
    secondary: 'text-purple-500 hover:text-purple-400',
    success: 'text-green-500 hover:text-green-400',
    warning: 'text-orange-500 hover:text-orange-400',
    danger: 'text-red-500 hover:text-red-400',
    muted: 'text-gray-600 hover:text-gray-500'
  };

  const buttonClasses = `
    relative inline-flex items-center justify-center
    ${padding}
    rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500/30
    ${variantStyles[variant]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {children ? (
        <div className="flex items-center space-x-2">
          <Icon
            icon={icon}
            name={name}
            size={size}
            loading={loading}
            badge={badge}
            badgeColor={badgeColor}
            {...iconProps}
          />
          {children}
        </div>
      ) : (
        <Icon
          icon={icon}
          name={name}
          size={size}
          loading={loading}
          badge={badge}
          badgeColor={badgeColor}
          {...iconProps}
        />
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';

// Icon Group Component for displaying multiple related icons
export interface IconGroupProps {
  icons: Array<{
    name?: keyof typeof LucideIcons;
    icon?: LucideIcon;
    label?: string;
    badge?: React.ReactNode;
    onClick?: () => void;
  }>;
  size?: IconSize;
  variant?: IconVariant;
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
  iconProps?: Partial<IconProps>;
}

export const IconGroup: React.FC<IconGroupProps> = ({
  icons,
  size = 'md',
  variant = 'default',
  spacing = 'normal',
  className = '',
  iconProps
}) => {
  const spacingClasses = {
    tight: 'space-x-1',
    normal: 'space-x-2',
    loose: 'space-x-4'
  };

  return (
    <div className={`flex items-center ${spacingClasses[spacing]} ${className}`}>
      {icons.map((iconItem, index) => (
        <div key={index} className="relative">
          {iconItem.onClick ? (
            <IconButton
              icon={iconItem.icon}
              name={iconItem.name}
              size={size}
              variant="ghost"
              onClick={iconItem.onClick}
              title={iconItem.label}
              badge={iconItem.badge}
              iconProps={{ variant, ...iconProps }}
            />
          ) : (
            <Icon
              icon={iconItem.icon}
              name={iconItem.name}
              size={size}
              variant={variant}
              badge={iconItem.badge}
              title={iconItem.label}
              {...iconProps}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Status Icon Component for displaying status with semantic colors
export interface StatusIconProps extends Omit<IconProps, 'variant'> {
  status: 'success' | 'warning' | 'error' | 'info' | 'loading';
  showText?: boolean;
  text?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  showText = false,
  text,
  size = 'md',
  className = '',
  ...props
}) => {
  const statusConfig = {
    success: { name: 'CheckCircle' as keyof typeof LucideIcons, variant: 'success' as IconVariant, text: 'Success' },
    warning: { name: 'AlertTriangle' as keyof typeof LucideIcons, variant: 'warning' as IconVariant, text: 'Warning' },
    error: { name: 'XCircle' as keyof typeof LucideIcons, variant: 'danger' as IconVariant, text: 'Error' },
    info: { name: 'Info' as keyof typeof LucideIcons, variant: 'primary' as IconVariant, text: 'Info' },
    loading: { name: 'Loader2' as keyof typeof LucideIcons, variant: 'default' as IconVariant, text: 'Loading', spin: true }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Icon
        name={config.name}
        size={size}
        variant={config.variant}
        spin={config.spin}
        {...props}
      />
      {showText && (
        <span className={`text-sm ${variantClasses[config.variant]}`}>
          {text || config.text}
        </span>
      )}
    </div>
  );
};

// Hook for dynamic icon loading
export const useIcon = (name: keyof typeof LucideIcons) => {
  const [icon, setIcon] = React.useState<LucideIcon | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    try {
      const IconComponent = (LucideIcons as any)[name] as LucideIcon;
      if (IconComponent) {
        setIcon(IconComponent);
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [name]);

  return { icon, loading, error };
};

export default Icon;