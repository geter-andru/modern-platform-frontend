'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * FlexLayout - Enterprise-grade Flexbox layout component system
 * 
 * Features:
 * - Comprehensive flexbox configurations
 * - Responsive flex properties
 * - Direction, wrap, alignment, and distribution control
 * - Gap and spacing management
 * - Flex item grow, shrink, and basis controls
 * - Animation support with staggered children
 * - Accessibility compliance
 * - Performance optimized CSS-in-JS patterns
 */

export type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface FlexLayoutProps {
  children: React.ReactNode;
  direction?: FlexDirection | { [key: string]: FlexDirection };
  wrap?: FlexWrap;
  justify?: FlexJustify;
  align?: FlexAlign;
  alignContent?: FlexAlign;
  gap?: FlexGap | { x?: FlexGap; y?: FlexGap };
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  animate?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
  fullHeight?: boolean;
  fullWidth?: boolean;
  inline?: boolean;
}

const FlexLayout: React.FC<FlexLayoutProps> = ({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'start',
  alignContent = 'start',
  gap = 'none',
  className = '',
  as = 'div',
  animate = false,
  staggerChildren = false,
  staggerDelay = 0.05,
  fullHeight = false,
  fullWidth = false,
  inline = false
}) => {
  // Direction classes
  const directionClasses = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    col: 'flex-col',
    'col-reverse': 'flex-col-reverse'
  };

  // Wrap classes
  const wrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse'
  };

  // Justify content classes
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  // Align items classes
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  // Align content classes
  const alignContentClasses = {
    start: 'content-start',
    center: 'content-center',
    end: 'content-end',
    stretch: 'content-stretch',
    baseline: 'content-baseline'
  };

  // Gap classes
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12'
  };

  const gapXClasses = {
    none: 'gap-x-0',
    xs: 'gap-x-1',
    sm: 'gap-x-2',
    md: 'gap-x-4',
    lg: 'gap-x-6',
    xl: 'gap-x-8',
    '2xl': 'gap-x-12'
  };

  const gapYClasses = {
    none: 'gap-y-0',
    xs: 'gap-y-1',
    sm: 'gap-y-2',
    md: 'gap-y-4',
    lg: 'gap-y-6',
    xl: 'gap-y-8',
    '2xl': 'gap-y-12'
  };

  // Build responsive direction classes
  const getResponsiveDirectionClasses = () => {
    if (typeof direction === 'string') {
      return directionClasses[direction];
    }

    return Object.entries(direction)
      .map(([breakpoint, dir]) => {
        const prefix = breakpoint === 'default' ? '' : `${breakpoint}:`;
        return `${prefix}${directionClasses[dir]}`;
      })
      .join(' ');
  };

  // Build gap classes
  const getGapClasses = () => {
    if (typeof gap === 'string') {
      return gapClasses[gap];
    }

    const xGap = gap.x ? gapXClasses[gap.x] : '';
    const yGap = gap.y ? gapYClasses[gap.y] : '';
    return `${xGap} ${yGap}`.trim();
  };

  // Build flex classes
  const flexClasses = `
    ${inline ? 'inline-flex' : 'flex'}
    ${getResponsiveDirectionClasses()}
    ${wrapClasses[wrap]}
    ${justifyClasses[justify]}
    ${alignClasses[align]}
    ${alignContentClasses[alignContent]}
    ${getGapClasses()}
    ${fullHeight ? 'h-full' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  // Animation variants
  const flexVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ...(staggerChildren && {
          staggerChildren: staggerDelay,
          delayChildren: 0.1
        })
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const Component = animate ? motion[as as keyof typeof motion] || motion.div : as;

  return (
    <Component
      className={flexClasses}
      {...(animate ? {
        variants: flexVariants,
        initial: "initial",
        animate: "animate"
      } : {})}
    >
      {staggerChildren && animate ? (
        React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        children
      )}
    </Component>
  );
};

// Flex Item Component
export interface FlexItemProps {
  children: React.ReactNode;
  grow?: boolean | number;
  shrink?: boolean | number;
  basis?: string | number;
  alignSelf?: FlexAlign;
  order?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const FlexItem: React.FC<FlexItemProps> = ({
  children,
  grow = false,
  shrink = true,
  basis = 'auto',
  alignSelf,
  order,
  className = '',
  as = 'div'
}) => {
  // Grow classes
  const growClasses = {
    false: '',
    true: 'flex-grow',
    0: 'grow-0',
    1: 'flex-grow'
  };

  // Shrink classes
  const shrinkClasses = {
    false: 'flex-shrink-0',
    true: 'flex-shrink',
    0: 'shrink-0',
    1: 'flex-shrink'
  };

  // Basis classes
  const getBasisClass = () => {
    if (typeof basis === 'number') return `flex-basis-${basis}`;
    if (basis === 'auto') return 'basis-auto';
    if (basis === 'full') return 'basis-full';
    return '';
  };

  // Self alignment classes
  const alignSelfClasses = {
    start: 'self-start',
    center: 'self-center',
    end: 'self-end',
    stretch: 'self-stretch',
    baseline: 'self-baseline'
  };

  // Order classes
  const getOrderClass = () => {
    if (order === undefined) return '';
    if (order >= 1 && order <= 12) return `order-${order}`;
    return '';
  };

  // Build flex item classes
  const itemClasses = `
    ${typeof grow === 'boolean' ? growClasses[grow.toString() as 'true' | 'false'] : growClasses[grow as keyof typeof growClasses]}
    ${typeof shrink === 'boolean' ? shrinkClasses[shrink.toString() as 'true' | 'false'] : shrinkClasses[shrink as keyof typeof shrinkClasses]}
    ${getBasisClass()}
    ${alignSelf ? alignSelfClasses[alignSelf] : ''}
    ${getOrderClass()}
    ${className}
  `.trim();

  const Component = as;

  return <Component className={itemClasses}>{children}</Component>;
};

// Stack Component (vertical flex layout)
export interface StackProps extends Omit<FlexLayoutProps, 'direction'> {
  spacing?: FlexGap;
  divider?: React.ReactNode;
}

export const Stack: React.FC<StackProps> = ({
  children,
  spacing = 'md',
  divider,
  ...flexProps
}) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <FlexLayout
      {...flexProps}
      direction="col"
      gap={spacing}
    >
      {divider ? (
        childrenArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < childrenArray.length - 1 && (
              <div className="flex-shrink-0">
                {divider}
              </div>
            )}
          </React.Fragment>
        ))
      ) : (
        children
      )}
    </FlexLayout>
  );
};

// HStack Component (horizontal flex layout)
export interface HStackProps extends Omit<FlexLayoutProps, 'direction'> {
  spacing?: FlexGap;
  divider?: React.ReactNode;
}

export const HStack: React.FC<HStackProps> = ({
  children,
  spacing = 'md',
  divider,
  ...flexProps
}) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <FlexLayout
      {...flexProps}
      direction="row"
      gap={spacing}
    >
      {divider ? (
        childrenArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < childrenArray.length - 1 && (
              <div className="flex-shrink-0">
                {divider}
              </div>
            )}
          </React.Fragment>
        ))
      ) : (
        children
      )}
    </FlexLayout>
  );
};

// Center Component (centered flex layout)
export interface CenterProps extends Omit<FlexLayoutProps, 'justify' | 'align'> {
  axis?: 'both' | 'horizontal' | 'vertical';
}

export const Center: React.FC<CenterProps> = ({
  children,
  axis = 'both',
  ...flexProps
}) => {
  const getAlignment = () => {
    switch (axis) {
      case 'horizontal':
        return { justify: 'center' as FlexJustify, align: 'start' as FlexAlign };
      case 'vertical':
        return { justify: 'start' as FlexJustify, align: 'center' as FlexAlign };
      default:
        return { justify: 'center' as FlexJustify, align: 'center' as FlexAlign };
    }
  };

  const { justify, align } = getAlignment();

  return (
    <FlexLayout
      {...flexProps}
      justify={justify}
      align={align}
    >
      {children}
    </FlexLayout>
  );
};

// Spacer Component (flexible space filler)
export interface SpacerProps {
  className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({ className = '' }) => {
  return <div className={`flex-1 ${className}`} aria-hidden="true" />;
};

// Toolbar Component (horizontal layout with common toolbar patterns)
export interface ToolbarProps extends Omit<FlexLayoutProps, 'direction' | 'align'> {
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  leftContent,
  centerContent,
  rightContent,
  children,
  ...flexProps
}) => {
  if (children) {
    return (
      <FlexLayout
        {...flexProps}
        direction="row"
        align="center"
      >
        {children}
      </FlexLayout>
    );
  }

  return (
    <FlexLayout
      {...flexProps}
      direction="row"
      align="center"
      justify="between"
    >
      <div className="flex items-center">
        {leftContent}
      </div>
      
      {centerContent && (
        <div className="flex items-center">
          {centerContent}
        </div>
      )}
      
      <div className="flex items-center">
        {rightContent}
      </div>
    </FlexLayout>
  );
};

// Split Component (two-panel layout)
export interface SplitProps extends Omit<FlexLayoutProps, 'direction'> {
  left: React.ReactNode;
  right: React.ReactNode;
  splitRatio?: [number, number]; // e.g., [1, 2] for 1:2 ratio
  vertical?: boolean;
  resizable?: boolean;
}

export const Split: React.FC<SplitProps> = ({
  left,
  right,
  splitRatio = [1, 1],
  vertical = false,
  resizable = false,
  ...flexProps
}) => {
  const [leftFlex, rightFlex] = splitRatio;

  return (
    <FlexLayout
      {...flexProps}
      direction={vertical ? 'col' : 'row'}
      fullHeight
    >
      <FlexItem grow={leftFlex} className={resizable ? 'resize-x overflow-auto' : ''}>
        {left}
      </FlexItem>
      <FlexItem grow={rightFlex}>
        {right}
      </FlexItem>
    </FlexLayout>
  );
};

// Hook for responsive flex properties
export const useResponsiveFlex = () => {
  const [flexDirection, setFlexDirection] = React.useState<FlexDirection>('row');

  React.useEffect(() => {
    const updateDirection = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setFlexDirection('col');
      } else {
        setFlexDirection('row');
      }
    };

    updateDirection();
    window.addEventListener('resize', updateDirection);
    return () => window.removeEventListener('resize', updateDirection);
  }, []);

  return { flexDirection };
};

export default FlexLayout;