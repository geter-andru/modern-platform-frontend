/**
 * Design System Hooks
 * 
 * Convenient hooks for components to access design tokens
 * without directly importing the context.
 */

import { useDesignSystem } from './DesignSystemProvider';
import { DesignTokens } from './types';

/**
 * Hook to get a specific design token value
 * @param path - Dot notation path to the token (e.g., 'colors.brand.primary')
 * @returns The token value as a string
 */
export const useToken = (path: string): string => {
  const { getToken } = useDesignSystem();
  return getToken(path);
};

/**
 * Hook to get multiple design tokens at once
 * @param paths - Array of dot notation paths
 * @returns Object with token values keyed by path
 */
export const useTokens = (paths: string[]): Record<string, string> => {
  const { getToken } = useDesignSystem();
  return paths.reduce((acc, path) => {
    acc[path] = getToken(path);
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Hook to get all design tokens
 * @returns Complete DesignTokens object
 */
export const useAllTokens = (): DesignTokens => {
  const { tokens } = useDesignSystem();
  return tokens;
};

/**
 * Hook to update design tokens
 * @returns Function to update tokens
 */
export const useUpdateTokens = () => {
  const { updateTokens } = useDesignSystem();
  return updateTokens;
};

/**
 * Hook to reset design tokens to defaults
 * @returns Function to reset tokens
 */
export const useResetTokens = () => {
  const { resetToDefaults } = useDesignSystem();
  return resetToDefaults;
};

/**
 * Hook to get common design token combinations
 * @returns Object with common token combinations
 */
export const useCommonTokens = () => {
  const { getToken } = useDesignSystem();
  
  return {
    // Background combinations
    background: {
      primary: getToken('colors.background.primary'),
      secondary: getToken('colors.background.secondary'),
      surface: getToken('colors.background.surface'),
      elevated: getToken('colors.background.elevated'),
    },
    
    // Text combinations
    text: {
      primary: getToken('colors.text.primary'),
      secondary: getToken('colors.text.secondary'),
      muted: getToken('colors.text.muted'),
      subtle: getToken('colors.text.subtle'),
    },
    
    // Brand combinations
    brand: {
      primary: getToken('colors.brand.primary'),
      secondary: getToken('colors.brand.secondary'),
      accent: getToken('colors.brand.accent'),
    },
    
    // Interactive combinations
    interactive: {
      hover: getToken('colors.interactive.hover'),
      focus: getToken('colors.interactive.focus'),
      active: getToken('colors.interactive.active'),
    },
    
    // Border combinations
    border: {
      subtle: getToken('colors.border.subtle'),
      standard: getToken('colors.border.standard'),
      emphasis: getToken('colors.border.emphasis'),
    },
    
    // Spacing combinations
    spacing: {
      xs: getToken('spacing.1'),
      sm: getToken('spacing.2'),
      md: getToken('spacing.4'),
      lg: getToken('spacing.6'),
      xl: getToken('spacing.8'),
    },
    
    // Shadow combinations
    shadow: {
      sm: getToken('shadows.sm'),
      md: getToken('shadows.md'),
      lg: getToken('shadows.lg'),
      glow: getToken('shadows.glowPrimary'),
    },
    
    // Animation combinations
    animation: {
      fast: getToken('animations.transitions.fast'),
      normal: getToken('animations.transitions.normal'),
      slow: getToken('animations.transitions.slow'),
    },
  };
};

/**
 * Hook to get responsive design tokens
 * @returns Object with responsive token values
 */
export const useResponsiveTokens = () => {
  const { getToken } = useDesignSystem();
  
  return {
    // Container sizes
    container: {
      sm: getToken('layout.container.sm'),
      md: getToken('layout.container.md'),
      lg: getToken('layout.container.lg'),
      xl: getToken('layout.container.xl'),
    },
    
    // Content widths
    content: {
      standard: getToken('layout.content.standard'),
      wide: getToken('layout.content.wide'),
      narrow: getToken('layout.content.narrow'),
    },
  };
};

/**
 * Hook to get theme-specific tokens
 * @returns Object with theme-specific token values
 */
export const useThemeTokens = () => {
  const { getToken } = useDesignSystem();
  
  return {
    // Dark theme tokens
    dark: {
      background: getToken('colors.background.primary'),
      text: getToken('colors.text.primary'),
      surface: getToken('colors.background.surface'),
    },
    
    // Light theme tokens (if implemented)
    light: {
      background: getToken('colors.background.secondary'),
      text: getToken('colors.text.secondary'),
      surface: getToken('colors.background.elevated'),
    },
  };
};
