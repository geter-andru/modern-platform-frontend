/**
 * Higher-Order Component (HOC) for Design System Integration
 * 
 * Automatically applies design system tokens to components
 * without requiring manual token management.
 */

import React from 'react';
import { useCommonTokens, useToken } from './hooks';

/**
 * Props that can be passed to components wrapped with withDesignSystem
 */
export interface DesignSystemProps {
  /** Override specific design tokens */
  tokenOverrides?: Record<string, string>;
  /** Apply custom CSS classes */
  className?: string;
  /** Apply custom inline styles */
  style?: React.CSSProperties;
}

/**
 * Higher-Order Component that automatically applies design system tokens
 * @param WrappedComponent - The component to wrap
 * @returns Enhanced component with design system integration
 */
export function withDesignSystem<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithDesignSystemComponent = React.forwardRef<
    any,
    P & DesignSystemProps
  >((props, ref) => {
    const { tokenOverrides, className, style, ...restProps } = props;
    
    // Get common design tokens
    const commonTokens = useCommonTokens();
    
    // Get specific tokens if needed
    const primaryColor = useToken('colors.brand.primary');
    const backgroundColor = useToken('colors.background.primary');
    const textColor = useToken('colors.text.primary');
    
    // Merge token overrides
    const finalTokens = {
      ...commonTokens,
      ...tokenOverrides,
    };
    
    // Create enhanced props with design system integration
    const enhancedProps = {
      ...restProps,
      ref,
      className: className,
      style: {
        // Apply design system tokens as CSS custom properties
        '--ds-primary': primaryColor,
        '--ds-background': backgroundColor,
        '--ds-text': textColor,
        ...style,
      },
    };
    
    return <WrappedComponent {...(enhancedProps as P)} />;
  });

  WithDesignSystemComponent.displayName = `withDesignSystem(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithDesignSystemComponent;
}

/**
 * Hook to get design system tokens and utilities
 * @returns Object containing design tokens and utility functions
 */
export function useDesignSystemTokens() {
  const commonTokens = useCommonTokens();
  const primaryColor = useToken('colors.brand.primary');
  const backgroundColor = useToken('colors.background.primary');
  const textColor = useToken('colors.text.primary');
  
  return {
    commonTokens,
    primaryColor,
    backgroundColor,
    textColor,
  };
}

/**
 * Utility function to create CSS properties from design tokens
 * @param tokens - Design tokens object
 * @returns CSS properties object
 */
export function createCSSProperties(tokens: Record<string, any>): React.CSSProperties {
  const cssProps: React.CSSProperties = {};
  
  // Convert tokens to CSS custom properties
  Object.entries(tokens).forEach(([key, value]) => {
    if (typeof value === 'string') {
      (cssProps as any)[`--ds-${key}`] = value;
    }
  });
  
  return cssProps;
}

/**
 * Utility function to apply design system tokens to a component
 * @param component - React component
 * @param tokens - Design tokens to apply
 * @returns Enhanced component with applied tokens
 */
export function applyDesignSystemTokens<T extends React.ComponentType<any>>(
  component: T,
  tokens: Record<string, string>
): T {
  const EnhancedComponent = React.forwardRef<any, React.ComponentProps<T>>((props, ref) => {
    const { style, ...restProps } = props;
    
    const enhancedStyle = {
      ...createCSSProperties(tokens),
      ...style,
    };
    
    return React.createElement(component, {
      ...restProps,
      ref,
      style: enhancedStyle,
    });
  });

  EnhancedComponent.displayName = `applyDesignSystemTokens(${component.displayName || component.name || 'Component'})`;

  return EnhancedComponent as unknown as T;
}