/**
 * H&S Revenue Intelligence Platform - Design System
 * Global design system exports
 * 
 * SURGICAL IMPLEMENTATION:
 * - Clean, organized exports
 * - Type-safe interfaces
 * - Zero breaking changes
 * 
 * Last Updated: 2025-10-21
 */

// Core types and interfaces
export type {
  DesignTokens,
  TypographyTokens,
  ColorTokens,
  GradientTokens,
  SpacingTokens,
  ShadowTokens,
  AnimationTokens,
  GlassTokens,
  LayoutTokens,
  CompetencyTokens,
  NotificationTokens,
  ThemeVariant,
  BrandVariant,
  DesignSystemContextType,
  ComponentStyleConfig,
  DesignSystemProviderProps,
} from './types';

// Default token values
export {
  getDefaultTokens,
  getCurrentTokens,
} from './default-tokens';

// Utility functions
export {
  getNestedValue,
  applyTokensToDOM,
  mergeTokens,
  validateTokens,
  getCSSVariableName,
  debounce,
  createDebouncedTokenApplier,
} from './utils';

// React components and hooks
export {
  DesignSystemProvider,
  useDesignSystem,
  useDesignTokens,
  useTheme,
  useBrand,
} from './DesignSystemProvider';

// Design system hooks
export {
  useToken,
  useTokens,
  useAllTokens,
  useUpdateTokens,
  useResetTokens,
  useCommonTokens,
  useResponsiveTokens,
  useThemeTokens,
} from './hooks';

// Higher-Order Components and utilities
export {
  withDesignSystem,
  useDesignSystemTokens,
  createCSSProperties,
  applyDesignSystemTokens,
  type DesignSystemProps,
} from './withDesignSystem';
