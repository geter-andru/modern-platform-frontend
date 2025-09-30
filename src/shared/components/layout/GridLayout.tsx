'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * GridLayout - Enterprise-grade CSS Grid layout component system
 * 
 * Features:
 * - Responsive grid configurations
 * - Auto-fit and auto-fill grid layouts
 * - Custom grid templates and areas
 * - Gap and spacing configurations
 * - Grid item positioning and spanning
 * - Masonry-style layouts
 * - Animation support with staggered children
 * - Accessibility compliance
 * - Performance optimized with CSS Grid
 */

export type GridColumns = number | 'auto-fit' | 'auto-fill' | string;
export type GridRows = number | 'auto' | string;
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';
export type GridJustify = 'start' | 'center' | 'end' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';

export interface GridLayoutProps {
  children: React.ReactNode;
  columns?: GridColumns | { [key: string]: GridColumns };
  rows?: GridRows | { [key: string]: GridRows };
  gap?: GridGap | { column?: GridGap; row?: GridGap };
  minItemWidth?: string;
  maxItemWidth?: string;
  minItemHeight?: string;
  maxItemHeight?: string;
  alignItems?: GridAlign;
  justifyItems?: GridAlign;
  alignContent?: GridAlign;
  justifyContent?: GridJustify;
  templateAreas?: string[];
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  animate?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  columns = 1,
  rows = 'auto',
  gap = 'md',
  minItemWidth = '200px',
  maxItemWidth = '1fr',
  minItemHeight,
  maxItemHeight,
  alignItems = 'stretch',
  justifyItems = 'stretch',
  alignContent = 'start',
  justifyContent = 'stretch',
  templateAreas,
  autoFlow = 'row',
  className = '',
  as = 'div',
  animate = false,
  staggerChildren = false,
  staggerDelay = 0.05
}) => {
  // Gap configurations
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12'
  };

  const gapValues = {
    none: '0',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  };

  // Alignment classes
  const alignItemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyItemsClasses = {
    start: 'justify-items-start',
    center: 'justify-items-center',
    end: 'justify-items-end',
    stretch: 'justify-items-stretch'
  };

  const alignContentClasses = {
    start: 'content-start',
    center: 'content-center',
    end: 'content-end',
    stretch: 'content-stretch'
  };

  const justifyContentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    stretch: 'justify-stretch',
    'space-around': 'justify-around',
    'space-between': 'justify-between',
    'space-evenly': 'justify-evenly'
  };

  // Auto flow classes
  const autoFlowClasses = {
    row: 'grid-flow-row',
    column: 'grid-flow-col',
    'row dense': 'grid-flow-row-dense',
    'column dense': 'grid-flow-col-dense'
  };

  // Build grid template columns
  const getGridTemplateColumns = () => {
    if (typeof columns === 'string') {
      if (columns === 'auto-fit') {
        return `repeat(auto-fit, minmax(${minItemWidth}, ${maxItemWidth}))`;
      }
      if (columns === 'auto-fill') {
        return `repeat(auto-fill, minmax(${minItemWidth}, ${maxItemWidth}))`;
      }
      return columns;
    }

    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }

    // Responsive columns
    return undefined; // Will be handled by responsive classes
  };

  // Build grid template rows
  const getGridTemplateRows = () => {
    if (typeof rows === 'string') {
      if (rows === 'auto') return 'auto';
      return rows;
    }

    if (typeof rows === 'number') {
      const rowHeight = minItemHeight || '1fr';
      return `repeat(${rows}, ${rowHeight})`;
    }

    return undefined;
  };

  // Build gap values
  const getGapValue = () => {
    if (typeof gap === 'object') {
      const columnGap = gap.column ? gapValues[gap.column] : gapValues.md;
      const rowGap = gap.row ? gapValues[gap.row] : gapValues.md;
      return { columnGap, rowGap };
    }
    
    const gapValue = gapValues[gap];
    return { gap: gapValue };
  };

  // Build responsive column classes
  const getResponsiveColumnClasses = () => {
    if (typeof columns !== 'object' || columns === null || Array.isArray(columns)) {
      return '';
    }

    return Object.entries(columns as Record<string, GridColumns>)
      .map(([breakpoint, cols]) => {
        const prefix = breakpoint === 'default' ? '' : `${breakpoint}:`;
        if (typeof cols === 'number') {
          return `${prefix}grid-cols-${cols}`;
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  };

  // Build grid styles
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getGridTemplateColumns(),
    gridTemplateRows: getGridTemplateRows(),
    gridTemplateAreas: templateAreas?.map(area => `"${area}"`).join(' '),
    ...getGapValue()
  };

  // Build grid classes
  const gridClasses = `
    grid
    ${typeof gap === 'string' ? gapClasses[gap] : ''}
    ${alignItemsClasses[alignItems]}
    ${justifyItemsClasses[justifyItems]}
    ${alignContentClasses[alignContent]}
    ${justifyContentClasses[justifyContent]}
    ${autoFlowClasses[autoFlow]}
    ${getResponsiveColumnClasses()}
    ${className}
  `.trim();

  // Animation variants
  const gridVariants = {
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
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const Component = animate ? motion[as as keyof typeof motion] || motion.div : as;

  return (
    <Component
      className={gridClasses}
      style={gridStyles}
      {...(animate ? {
        variants: gridVariants,
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

// Grid Item Component
export interface GridItemProps {
  children: React.ReactNode;
  colSpan?: number | 'full';
  rowSpan?: number | 'full';
  colStart?: number;
  colEnd?: number;
  rowStart?: number;
  rowEnd?: number;
  area?: string;
  alignSelf?: GridAlign;
  justifySelf?: GridAlign;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  colSpan,
  rowSpan,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  area,
  alignSelf,
  justifySelf,
  className = '',
  as = 'div'
}) => {
  // Column span classes
  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
    full: 'col-span-full'
  };

  // Row span classes
  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
    5: 'row-span-5',
    6: 'row-span-6',
    full: 'row-span-full'
  };

  // Self alignment classes
  const alignSelfClasses = {
    start: 'self-start',
    center: 'self-center',
    end: 'self-end',
    stretch: 'self-stretch'
  };

  const justifySelfClasses = {
    start: 'justify-self-start',
    center: 'justify-self-center',
    end: 'justify-self-end',
    stretch: 'justify-self-stretch'
  };

  // Build grid item styles
  const itemStyles: React.CSSProperties = {
    ...(colStart && { gridColumnStart: colStart }),
    ...(colEnd && { gridColumnEnd: colEnd }),
    ...(rowStart && { gridRowStart: rowStart }),
    ...(rowEnd && { gridRowEnd: rowEnd }),
    ...(area && { gridArea: area })
  };

  // Build grid item classes
  const itemClasses = `
    ${colSpan ? colSpanClasses[colSpan as keyof typeof colSpanClasses] : ''}
    ${rowSpan ? rowSpanClasses[rowSpan as keyof typeof rowSpanClasses] : ''}
    ${alignSelf ? alignSelfClasses[alignSelf] : ''}
    ${justifySelf ? justifySelfClasses[justifySelf] : ''}
    ${className}
  `.trim();

  const Component = as;

  return (
    <Component className={itemClasses} style={itemStyles}>
      {children}
    </Component>
  );
};

// Masonry Grid Component
export interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number | { [key: string]: number };
  gap?: GridGap;
  className?: string;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className = ''
}) => {
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12'
  };

  const getColumnClasses = () => {
    if (typeof columns === 'number') {
      return `columns-${columns}`;
    }

    // Responsive columns
    return Object.entries(columns)
      .map(([breakpoint, cols]) => {
        const prefix = breakpoint === 'default' ? '' : `${breakpoint}:`;
        return `${prefix}columns-${cols}`;
      })
      .join(' ');
  };

  return (
    <div className={`${getColumnClasses()} ${gapClasses[gap]} ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className="break-inside-avoid mb-4">
          {child}
        </div>
      ))}
    </div>
  );
};

// Auto Grid Component (automatically sizes based on content)
export interface AutoGridProps {
  children: React.ReactNode;
  minItemWidth?: string;
  maxItemWidth?: string;
  gap?: GridGap;
  autoFit?: boolean;
  className?: string;
}

export const AutoGrid: React.FC<AutoGridProps> = ({
  children,
  minItemWidth = '250px',
  maxItemWidth = '1fr',
  gap = 'md',
  autoFit = true,
  className = ''
}) => {
  const gapValues = {
    none: '0',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  };

  const gridTemplateColumns = autoFit
    ? `repeat(auto-fit, minmax(${minItemWidth}, ${maxItemWidth}))`
    : `repeat(auto-fill, minmax(${minItemWidth}, ${maxItemWidth}))`;

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns,
    gap: gapValues[gap]
  };

  return (
    <div className={className} style={gridStyles}>
      {children}
    </div>
  );
};

// Dashboard Grid Component (specialized for dashboard layouts)
export interface DashboardGridProps {
  children: React.ReactNode;
  areas: string[];
  columns?: string;
  rows?: string;
  gap?: GridGap;
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  areas,
  columns = 'repeat(12, 1fr)',
  rows = 'auto',
  gap = 'lg',
  className = ''
}) => {
  const gapValues = {
    none: '0',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: columns,
    gridTemplateRows: rows,
    gridTemplateAreas: areas.map(area => `"${area}"`).join(' '),
    gap: gapValues[gap]
  };

  return (
    <div className={`min-h-screen ${className}`} style={gridStyles}>
      {children}
    </div>
  );
};

// Hook for responsive grid columns
export const useResponsiveColumns = (baseColumns: number = 1) => {
  const [columns, setColumns] = React.useState(baseColumns);

  React.useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280) setColumns(Math.min(baseColumns * 4, 6)); // xl
      else if (width >= 1024) setColumns(Math.min(baseColumns * 3, 5)); // lg
      else if (width >= 768) setColumns(Math.min(baseColumns * 2, 4)); // md
      else if (width >= 640) setColumns(Math.min(baseColumns * 1.5, 3)); // sm
      else setColumns(1); // mobile
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [baseColumns]);

  return columns;
};

export default GridLayout;