'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * ResponsiveContainer - Enterprise-grade responsive container component system
 * 
 * Features:
 * - Multiple container sizes and breakpoints
 * - Responsive padding and spacing
 * - Flex and grid container variants
 * - Aspect ratio containers
 * - Mobile-first responsive design
 * - Custom breakpoint support
 * - Animation support
 * - Accessibility compliance
 * - Performance optimized
 */

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'screen';
export type ContainerPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ContainerVariant = 'default' | 'fluid' | 'constrained' | 'centered' | 'full-bleed';
export type AspectRatio = '1:1' | '4:3' | '16:9' | '21:9' | '3:2' | '2:1' | 'auto';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  variant?: ContainerVariant;
  padding?: ContainerPadding;
  margin?: ContainerPadding;
  aspectRatio?: AspectRatio;
  breakpoint?: 'always' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  animate?: boolean;
  centerContent?: boolean;
  fullHeight?: boolean;
  fullWidth?: boolean;
  maxHeight?: string;
  maxWidth?: string;
  style?: React.CSSProperties;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  size = 'lg',
  variant = 'default',
  padding = 'md',
  margin = 'none',
  aspectRatio = 'auto',
  breakpoint = 'always',
  className = '',
  as = 'div',
  animate = false,
  centerContent = false,
  fullHeight = false,
  fullWidth = false,
  maxHeight,
  maxWidth,
  style
}) => {
  // Container size configurations
  const sizeClasses = {
    xs: 'max-w-xs',     // 20rem / 320px
    sm: 'max-w-sm',     // 24rem / 384px
    md: 'max-w-md',     // 28rem / 448px
    lg: 'max-w-lg',     // 32rem / 512px
    xl: 'max-w-xl',     // 36rem / 576px
    '2xl': 'max-w-2xl', // 42rem / 672px
    '3xl': 'max-w-3xl', // 48rem / 768px
    full: 'max-w-full',
    screen: 'max-w-screen-xl'
  };

  // Padding configurations
  const paddingClasses = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  // Margin configurations
  const marginClasses = {
    none: 'm-0',
    xs: 'm-2',
    sm: 'm-4',
    md: 'm-6',
    lg: 'm-8',
    xl: 'm-12'
  };

  // Variant configurations
  const variantClasses = {
    default: 'mx-auto',
    fluid: 'w-full px-4 sm:px-6 lg:px-8',
    constrained: 'mx-auto px-4 sm:px-6 lg:px-8',
    centered: 'mx-auto flex items-center justify-center',
    'full-bleed': 'w-full'
  };

  // Breakpoint classes
  const breakpointClasses = {
    always: '',
    sm: 'sm:',
    md: 'md:',
    lg: 'lg:',
    xl: 'xl:',
    '2xl': '2xl:'
  };

  // Aspect ratio configurations
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '21:9': 'aspect-[21/9]',
    '3:2': 'aspect-[3/2]',
    '2:1': 'aspect-[2/1]',
    auto: ''
  };

  // Build container classes
  const containerClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${paddingClasses[padding]}
    ${marginClasses[margin]}
    ${aspectRatioClasses[aspectRatio]}
    ${centerContent ? 'flex items-center justify-center' : ''}
    ${fullHeight ? 'h-full' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  // Build inline styles
  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(maxHeight && { maxHeight }),
    ...(maxWidth && { maxWidth })
  };

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const Component = animate ? motion[as as keyof typeof motion] || motion.div : as;

  return (
    <Component
      className={containerClasses}
      style={inlineStyles}
      {...(animate ? {
        variants: containerVariants,
        initial: "initial",
        animate: "animate",
        exit: "exit",
        transition: { duration: 0.3, ease: 'easeOut' }
      } : {})}
    >
      {children}
    </Component>
  );
};

// Grid Container Component
export interface GridContainerProps extends Omit<ResponsiveContainerProps, 'variant'> {
  cols?: number | { [key: string]: number };
  rows?: number | { [key: string]: number };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  autoFit?: boolean;
  minItemWidth?: string;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  cols = 1,
  rows,
  gap = 'md',
  autoFit = false,
  minItemWidth = '250px',
  className = '',
  children,
  ...containerProps
}) => {
  // Gap configurations
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  // Build grid classes
  const getGridClasses = () => {
    if (autoFit) {
      return `grid gap-${gap} grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]`;
    }

    if (typeof cols === 'number') {
      const colsClass = `grid-cols-${cols}`;
      const rowsClass = rows ? `grid-rows-${rows}` : '';
      return `grid ${colsClass} ${rowsClass} ${gapClasses[gap]}`;
    }

    // Responsive columns
    const responsiveCols = Object.entries(cols)
      .map(([breakpoint, colCount]) => {
        const prefix = breakpoint === 'default' ? '' : `${breakpoint}:`;
        return `${prefix}grid-cols-${colCount}`;
      })
      .join(' ');

    return `grid ${responsiveCols} ${gapClasses[gap]}`;
  };

  return (
    <ResponsiveContainer
      {...containerProps}
      className={`${getGridClasses()} ${className}`}
    >
      {children}
    </ResponsiveContainer>
  );
};

// Flex Container Component
export interface FlexContainerProps extends Omit<ResponsiveContainerProps, 'variant'> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const FlexContainer: React.FC<FlexContainerProps> = ({
  direction = 'row',
  wrap = false,
  justify = 'start',
  align = 'start',
  gap = 'md',
  className = '',
  children,
  ...containerProps
}) => {
  // Direction classes
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };

  // Justify classes
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  // Align classes
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  // Gap classes
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const flexClasses = `
    flex
    ${directionClasses[direction]}
    ${wrap ? 'flex-wrap' : 'flex-nowrap'}
    ${justifyClasses[justify]}
    ${alignClasses[align]}
    ${gapClasses[gap]}
    ${className}
  `.trim();

  return (
    <ResponsiveContainer {...containerProps} className={flexClasses}>
      {children}
    </ResponsiveContainer>
  );
};

// Aspect Ratio Container Component
export interface AspectRatioContainerProps extends Omit<ResponsiveContainerProps, 'aspectRatio'> {
  ratio: number; // width / height (e.g., 16/9 = 1.77)
  cover?: boolean;
}

export const AspectRatioContainer: React.FC<AspectRatioContainerProps> = ({
  ratio,
  cover = false,
  className = '',
  children,
  ...containerProps
}) => {
  const aspectRatioStyle = {
    aspectRatio: ratio.toString()
  };

  return (
    <ResponsiveContainer
      {...containerProps}
      className={`relative ${className}`}
      style={aspectRatioStyle}
    >
      <div className={`${cover ? 'absolute inset-0 w-full h-full object-cover' : ''}`}>
        {children}
      </div>
    </ResponsiveContainer>
  );
};

// Masonry Container Component (CSS Grid based)
export interface MasonryContainerProps extends Omit<ResponsiveContainerProps, 'variant'> {
  columns?: number;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const MasonryContainer: React.FC<MasonryContainerProps> = ({
  columns = 3,
  gap = 'md',
  className = '',
  children,
  ...containerProps
}) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const masonryClasses = `
    grid
    grid-cols-${columns}
    ${gapClasses[gap]}
    items-start
    ${className}
  `.trim();

  return (
    <ResponsiveContainer {...containerProps} className={masonryClasses}>
      {children}
    </ResponsiveContainer>
  );
};

// Sticky Container Component
export interface StickyContainerProps extends ResponsiveContainerProps {
  top?: string | number;
  bottom?: string | number;
  zIndex?: number;
}

export const StickyContainer: React.FC<StickyContainerProps> = ({
  top = 0,
  bottom,
  zIndex = 10,
  className = '',
  children,
  ...containerProps
}) => {
  const stickyStyle = {
    position: 'sticky' as const,
    top: typeof top === 'number' ? `${top}px` : top,
    ...(bottom && { bottom: typeof bottom === 'number' ? `${bottom}px` : bottom }),
    zIndex
  };

  return (
    <ResponsiveContainer
      {...containerProps}
      className={className}
      style={stickyStyle}
    >
      {children}
    </ResponsiveContainer>
  );
};

// Hook for responsive breakpoint detection
export const useResponsiveBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState<string>('mobile');

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else if (width >= 640) setBreakpoint('sm');
      else setBreakpoint('mobile');
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'sm' || breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    isLarge: breakpoint === 'xl' || breakpoint === '2xl'
  };
};

export default ResponsiveContainer;