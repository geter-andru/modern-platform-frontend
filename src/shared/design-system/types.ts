/**
 * H&S Revenue Intelligence Platform - Design System Types
 * Type-safe interfaces for the global design system
 * 
 * SURGICAL IMPLEMENTATION:
 * - Maps exactly to existing design-tokens.css
 * - 100% backward compatibility
 * - Zero breaking changes
 * 
 * Last Updated: 2025-10-21
 */

/**
 * Typography System - Professional & Executive-Level
 * Maps to design-tokens.css typography section
 */
export interface TypographyTokens {
  fontFamily: {
    primary: string;    // --font-primary
    mono: string;       // --font-mono
  };
  fontWeight: {
    normal: string;     // --font-weight-normal (400)
    medium: string;      // --font-weight-medium (500)
    semibold: string;    // --font-weight-semibold (600)
    bold: string;        // --font-weight-bold (700)
  };
  fontSize: {
    xs: string;         // --text-xs (0.75rem)
    sm: string;         // --text-sm (0.875rem)
    base: string;       // --text-base (1rem)
    lg: string;         // --text-lg (1.125rem)
    xl: string;         // --text-xl (1.25rem)
    '2xl': string;      // --text-2xl (1.5rem)
    '3xl': string;      // --text-3xl (1.875rem)
    '4xl': string;      // --text-4xl (2.25rem)
    '5xl': string;      // --text-5xl (2.75rem)
  };
  lineHeight: {
    tight: string;      // --leading-tight (1.25)
    snug: string;       // --leading-snug (1.375)
    normal: string;     // --leading-normal (1.5)
    relaxed: string;     // --leading-relaxed (1.625)
  };
  letterSpacing: {
    tighter: string;    // --tracking-tighter (-0.03em)
    tight: string;       // --tracking-tight (-0.025em)
    normal: string;      // --tracking-normal (-0.015em)
    wide: string;        // --tracking-wide (0.025em)
  };
}

/**
 * Color System - Executive Dark Theme
 * Maps to design-tokens.css color section
 */
export interface ColorTokens {
  background: {
    primary: string;     // --bg-primary (#000000)
    secondary: string;   // --bg-secondary (#0a0a0a)
    tertiary: string;    // --bg-tertiary (#111111)
    elevated: string;    // --bg-elevated (#1a1a1a)
    surface: string;     // --bg-surface (#2a2a2a)
    surfaceHover: string; // --bg-surface-hover (#333333)
  };
  text: {
    primary: string;     // --text-primary (#ffffff)
    secondary: string;    // --text-secondary (#e5e5e5)
    muted: string;        // --text-muted (#a3a3a3)
    subtle: string;       // --text-subtle (#737373)
    disabled: string;     // --text-disabled (#525252)
  };
  brand: {
    primary: string;     // --color-primary (#3b82f6)
    primaryDark: string; // --color-primary-dark (#2563eb)
    primaryLight: string; // --color-primary-light (#60a5fa)
    secondary: string;    // --color-secondary (#8b5cf6)
    secondaryDark: string; // --color-secondary-dark (#7c3aed)
    secondaryLight: string; // --color-secondary-light (#a78bfa)
    accent: string;       // --color-accent (#10b981)
    accentDark: string;   // --color-accent-dark (#059669)
    accentLight: string;  // --color-accent-light (#34d399)
  };
  semantic: {
    success: string;     // --color-success (#22c55e)
    warning: string;     // --color-warning (#f59e0b)
    danger: string;      // --color-danger (#ef4444)
    info: string;        // --color-info (#06b6d4)
  };
  interactive: {
    hover: string;       // --color-hover (rgba(59, 130, 246, 0.08))
    focus: string;       // --color-focus (rgba(59, 130, 246, 0.2))
    active: string;      // --color-active (rgba(59, 130, 246, 0.12))
  };
  border: {
    subtle: string;      // --border-subtle (rgba(255, 255, 255, 0.05))
    standard: string;    // --border-standard (rgba(255, 255, 255, 0.08))
    emphasis: string;    // --border-emphasis (rgba(255, 255, 255, 0.12))
    active: string;      // --border-active (var(--color-primary))
  };
}

/**
 * Gradient System - Professional & Strategic
 * Maps to design-tokens.css gradient section
 */
export interface GradientTokens {
  primary: string;       // --gradient-primary
  secondary: string;     // --gradient-secondary
  accent: string;         // --gradient-accent
  strategic: string;     // --gradient-strategic
  intelligence: string;  // --gradient-intelligence
  growth: string;        // --gradient-growth
  sophistication: string; // --gradient-sophistication
  glassOverlay: string;  // --gradient-glass-overlay
  shimmer: string;       // --gradient-shimmer
}

/**
 * Spacing System - 8px Grid
 * Maps to design-tokens.css spacing section
 */
export interface SpacingTokens {
  '1': string;           // --space-1 (0.25rem)
  '2': string;           // --space-2 (0.5rem)
  '3': string;           // --space-3 (0.75rem)
  '4': string;           // --space-4 (1rem)
  '5': string;           // --space-5 (1.25rem)
  '6': string;           // --space-6 (1.5rem)
  '8': string;           // --space-8 (2rem)
  '10': string;          // --space-10 (2.5rem)
  '12': string;          // --space-12 (3rem)
  '16': string;          // --space-16 (4rem)
  '20': string;          // --space-20 (5rem)
  '24': string;          // --space-24 (6rem)
  '32': string;          // --space-32 (8rem)
  '40': string;          // --space-40 (10rem)
  '48': string;          // --space-48 (12rem)
  '56': string;          // --space-56 (14rem)
  '64': string;          // --space-64 (16rem)
  '72': string;          // --space-72 (18rem)
  '80': string;          // --space-80 (20rem)
  '96': string;          // --space-96 (24rem)
}

/**
 * Shadow System - Executive Depth
 * Maps to design-tokens.css shadow section
 */
export interface ShadowTokens {
  xs: string;            // --shadow-xs
  sm: string;            // --shadow-sm
  md: string;            // --shadow-md
  lg: string;            // --shadow-lg
  xl: string;            // --shadow-xl
  '2xl': string;         // --shadow-2xl
  glowPrimary: string;   // --shadow-glow-primary
  glowSecondary: string; // --shadow-glow-secondary
  glowAccent: string;    // --shadow-glow-accent
  focus: string;         // --shadow-focus
  inner: string;         // --shadow-inner
  none: string;          // --shadow-none
}

/**
 * Animation System - Professional Timing
 * Maps to design-tokens.css animation section
 */
export interface AnimationTokens {
  duration: {
    fast: string;        // --duration-fast
    normal: string;      // --duration-normal
    slow: string;        // --duration-slow
  };
  easing: {
    elegant: string;     // --ease-elegant
    professional: string; // --ease-professional
    satisfaction: string; // --ease-satisfaction
  };
  transitions: {
    fast: string;        // --transition-fast
    normal: string;      // --transition-normal
    slow: string;        // --transition-slow
  };
}

/**
 * Glass Effect System - Premium Morphism
 * Maps to design-tokens.css glass section
 */
export interface GlassTokens {
  background: {
    standard: string;    // --glass-bg-standard
    subtle: string;      // --glass-bg-subtle
    emphasis: string;    // --glass-bg-emphasis
  };
  border: {
    standard: string;    // --glass-border-standard
    subtle: string;      // --glass-border-subtle
    emphasis: string;    // --glass-border-emphasis
  };
  blur: {
    sm: string;          // --glass-blur-sm
    md: string;          // --glass-blur-md
    lg: string;          // --glass-blur-lg
  };
}

/**
 * Layout System - Container & Z-Index
 * Maps to design-tokens.css layout section
 */
export interface LayoutTokens {
  container: {
    sm: string;          // --container-sm
    md: string;          // --container-md
    lg: string;          // --container-lg
    xl: string;          // --container-xl
  };
  content: {
    standard: string;    // --content-standard
    wide: string;        // --content-wide
    narrow: string;      // --content-narrow
  };
  zIndex: {
    dropdown: string;    // --z-dropdown
    sticky: string;        // --z-sticky
    fixed: string;         // --z-fixed
    modal: string;         // --z-modal
    popover: string;       // --z-popover
    tooltip: string;       // --z-tooltip
    toast: string;         // --z-toast
  };
}

/**
 * Competency System - Level-based Colors
 * Maps to design-tokens.css competency section
 */
export interface CompetencyTokens {
  level1: string;        // --competency-level-1
  level2: string;        // --competency-level-2
  level3: string;        // --competency-level-3
  level4: string;        // --competency-level-4
  level5: string;        // --competency-level-5
  level6: string;        // --competency-level-6
}

/**
 * Notification System - Severity Colors
 * Maps to design-tokens.css notification section
 */
export interface NotificationTokens {
  info: string;          // --notification-info
  success: string;       // --notification-success
  warning: string;       // --notification-warning
  error: string;         // --notification-error
}

/**
 * Complete Design System Tokens
 * Combines all token categories into a single interface
 */
export interface DesignTokens {
  typography: TypographyTokens;
  colors: ColorTokens;
  gradients: GradientTokens;
  spacing: SpacingTokens;
  shadows: ShadowTokens;
  animations: AnimationTokens;
  glass: GlassTokens;
  layout: LayoutTokens;
  competency: CompetencyTokens;
  notification: NotificationTokens;
}

/**
 * Theme Variants
 * Support for different theme modes
 */
export type ThemeVariant = 'dark' | 'light' | 'auto';

/**
 * Brand Variants
 * Support for different brand configurations
 */
export type BrandVariant = 'default' | 'enterprise' | 'premium' | 'hs';

/**
 * Design System Context Interface
 * Defines the context API for the global design system
 */
export interface DesignSystemContextType {
  tokens: DesignTokens;
  theme: ThemeVariant;
  brand: BrandVariant;
  updateTokens: (newTokens: Partial<DesignTokens>) => void;
  updateTheme: (theme: ThemeVariant) => void;
  updateBrand: (brand: BrandVariant) => void;
  getToken: (path: string) => string;
  resetToDefaults: () => void;
}

/**
 * Component Style Configuration
 * Interface for component styling with design tokens
 */
export interface ComponentStyleConfig {
  background: string;
  text: string;
  padding: string;
  radius: string;
  shadow: string;
  border?: string;
  hover?: string;
  focus?: string;
}

/**
 * Design System Provider Props
 * Props for the DesignSystemProvider component
 */
export interface DesignSystemProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeVariant;
  initialBrand?: BrandVariant;
  customTokens?: Partial<DesignTokens>;
}
