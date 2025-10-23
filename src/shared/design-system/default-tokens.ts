/**
 * H&S Revenue Intelligence Platform - Default Design Tokens
 * Default values that map exactly to design-tokens.css
 * 
 * SURGICAL IMPLEMENTATION:
 * - Exact mapping to existing CSS variables
 * - 100% backward compatibility
 * - Zero breaking changes
 * 
 * Last Updated: 2025-10-21
 */

import { DesignTokens } from './types';

/**
 * Default Design Tokens
 * Maps exactly to design-tokens.css values
 */
export const getDefaultTokens = (): DesignTokens => ({
  typography: {
    fontFamily: {
      primary: '"Red Hat Display", sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    fontSize: {
      xs: '0.75rem',      // 12px - Metadata, labels
      sm: '0.875rem',     // 14px - Body small, captions
      base: '1rem',       // 16px - Body text
      lg: '1.125rem',     // 18px - Emphasized body
      xl: '1.25rem',      // 20px - Section headings
      '2xl': '1.5rem',    // 24px - Card headings
      '3xl': '1.875rem',  // 30px - Page headings
      '4xl': '2.25rem',   // 36px - Dashboard titles
      '5xl': '2.75rem',   // 44px - Hero headings
    },
    lineHeight: {
      tight: '1.25',      // Large headings, KPIs
      snug: '1.375',      // Subheadings
      normal: '1.5',      // Body text
      relaxed: '1.625',   // Long-form content
    },
    letterSpacing: {
      tighter: '-0.03em',  // Display headings (5xl, 4xl)
      tight: '-0.025em',   // Section headings (3xl, 2xl)
      normal: '-0.015em',  // Subheadings (xl, lg)
      wide: '0.025em',     // All caps labels
    },
  },
  colors: {
    background: {
      primary: '#000000',      // Canvas background - absolute focus
      secondary: '#0a0a0a',     // Subtle depth variation
      tertiary: '#111111',      // Section backgrounds
      elevated: '#1a1a1a',      // Elevated cards/modals
      surface: '#2a2a2a',       // Interactive surfaces
      surfaceHover: '#333333',  // Hover states
    },
    text: {
      primary: '#ffffff',       // Pure white - Headings, KPIs
      secondary: '#e5e5e5',     // Light gray - Body text
      muted: '#a3a3a3',         // Medium gray - Labels, metadata
      subtle: '#737373',        // Subtle gray - Disabled, helper text
      disabled: '#525252',      // Disabled state
    },
    brand: {
      primary: '#3b82f6',       // Blue 500 - Trust, intelligence, primary actions
      primaryDark: '#2563eb',   // Blue 600 - Hover states
      primaryLight: '#60a5fa',  // Blue 400 - Accents
      secondary: '#8b5cf6',     // Violet 500 - Innovation, premium features
      secondaryDark: '#7c3aed', // Violet 600
      secondaryLight: '#a78bfa', // Violet 400
      accent: '#10b981',        // Emerald 500 - Growth, success, positive KPIs
      accentDark: '#059669',    // Emerald 600
      accentLight: '#34d399',   // Emerald 400
    },
    semantic: {
      success: '#22c55e',       // Green 500 - Achievements, goals met
      warning: '#f59e0b',       // Amber 500 - Attention, strategic warnings
      danger: '#ef4444',        // Red 500 - Critical issues, risks
      info: '#06b6d4',          // Cyan 500 - Information, insights
    },
    interactive: {
      hover: 'rgba(59, 130, 246, 0.08)',   // Blue hover overlay
      focus: 'rgba(59, 130, 246, 0.2)',     // Focus ring
      active: 'rgba(59, 130, 246, 0.12)',  // Active state
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.05)',   // Card borders
      standard: 'rgba(255, 255, 255, 0.08)', // Input borders
      emphasis: 'rgba(255, 255, 255, 0.12)', // Dividers
      active: 'var(--color-primary)',         // Active/focus borders
    },
  },
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    secondary: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    accent: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    strategic: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
    intelligence: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    growth: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
    sophistication: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glassOverlay: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    shimmer: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
  },
  spacing: {
    '1': '0.25rem',   // 4px - Tight spacing
    '2': '0.5rem',    // 8px - Small spacing
    '3': '0.75rem',   // 12px - Medium spacing
    '4': '1rem',      // 16px - Standard spacing
    '5': '1.25rem',   // 20px - Large spacing
    '6': '1.5rem',    // 24px - Extra large spacing
    '8': '2rem',      // 32px - Section spacing
    '10': '2.5rem',   // 40px - Component spacing
    '12': '3rem',     // 48px - Layout spacing
    '16': '4rem',     // 64px - Page spacing
    '20': '5rem',     // 80px - Hero spacing
    '24': '6rem',     // 96px - Section spacing
    '32': '8rem',     // 128px - Layout spacing
    '40': '10rem',    // 160px - Page spacing
    '48': '12rem',    // 192px - Layout spacing
    '56': '14rem',    // 224px - Page spacing
    '64': '16rem',    // 256px - Layout spacing
    '72': '18rem',    // 288px - Page spacing
    '80': '20rem',    // 320px - Layout spacing
    '96': '24rem',    // 384px - Page spacing
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.2)',
    md: '0 4px 12px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.5)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.6)',
    glowPrimary: '0 0 20px rgba(59, 130, 246, 0.3)',
    glowSecondary: '0 0 20px rgba(139, 92, 246, 0.3)',
    glowAccent: '0 0 20px rgba(16, 185, 129, 0.3)',
    focus: '0 0 0 3px rgba(59, 130, 246, 0.2)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    none: 'none',
  },
  animations: {
    duration: {
      fast: '0.15s',
      normal: '0.25s',
      slow: '0.4s',
    },
    easing: {
      elegant: 'cubic-bezier(0.16, 1, 0.3, 1)',
      professional: 'cubic-bezier(0.4, 0, 0.2, 1)',
      satisfaction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    transitions: {
      fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      normal: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  glass: {
    background: {
      standard: 'rgba(255, 255, 255, 0.05)',
      subtle: 'rgba(255, 255, 255, 0.03)',
      emphasis: 'rgba(255, 255, 255, 0.08)',
    },
    border: {
      standard: 'rgba(255, 255, 255, 0.08)',
      subtle: 'rgba(255, 255, 255, 0.05)',
      emphasis: 'rgba(255, 255, 255, 0.12)',
    },
    blur: {
      sm: 'blur(8px)',
      md: 'blur(16px)',
      lg: 'blur(24px)',
    },
  },
  layout: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    content: {
      standard: '720px',
      wide: '900px',
      narrow: '600px',
    },
    zIndex: {
      dropdown: '1000',
      sticky: '1020',
      fixed: '1030',
      modal: '1040',
      popover: '1050',
      tooltip: '1060',
      toast: '1070',
    },
  },
  competency: {
    level1: '#ef4444',    // Red - Foundation
    level2: '#f59e0b',    // Amber - Basic
    level3: '#eab308',    // Yellow - Intermediate
    level4: '#22c55e',    // Green - Advanced
    level5: '#3b82f6',    // Blue - Expert
    level6: '#8b5cf6',    // Violet - Master
  },
  notification: {
    info: '#06b6d4',      // Cyan
    success: '#22c55e',   // Green
    warning: '#f59e0b',   // Amber
    error: '#ef4444',     // Red
  },
});

/**
 * Get current CSS variable values from DOM
 * Used for initialization to ensure backward compatibility
 */
export const getCurrentTokens = (): DesignTokens => {
  if (typeof window === 'undefined') {
    return getDefaultTokens();
  }

  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  const getCSSVariable = (variable: string): string => {
    return computedStyle.getPropertyValue(variable).trim() || getDefaultTokens().colors.background.primary;
  };

  return {
    typography: {
      fontFamily: {
        primary: getCSSVariable('--font-primary') || getDefaultTokens().typography.fontFamily.primary,
        mono: getCSSVariable('--font-mono') || getDefaultTokens().typography.fontFamily.mono,
      },
      fontWeight: {
        normal: getCSSVariable('--font-weight-normal') || '400',
        medium: getCSSVariable('--font-weight-medium') || '500',
        semibold: getCSSVariable('--font-weight-semibold') || '600',
        bold: getCSSVariable('--font-weight-bold') || '700',
      },
      fontSize: {
        xs: getCSSVariable('--text-xs') || '0.75rem',
        sm: getCSSVariable('--text-sm') || '0.875rem',
        base: getCSSVariable('--text-base') || '1rem',
        lg: getCSSVariable('--text-lg') || '1.125rem',
        xl: getCSSVariable('--text-xl') || '1.25rem',
        '2xl': getCSSVariable('--text-2xl') || '1.5rem',
        '3xl': getCSSVariable('--text-3xl') || '1.875rem',
        '4xl': getCSSVariable('--text-4xl') || '2.25rem',
        '5xl': getCSSVariable('--text-5xl') || '2.75rem',
      },
      lineHeight: {
        tight: getCSSVariable('--leading-tight') || '1.25',
        snug: getCSSVariable('--leading-snug') || '1.375',
        normal: getCSSVariable('--leading-normal') || '1.5',
        relaxed: getCSSVariable('--leading-relaxed') || '1.625',
      },
      letterSpacing: {
        tighter: getCSSVariable('--tracking-tighter') || '-0.03em',
        tight: getCSSVariable('--tracking-tight') || '-0.025em',
        normal: getCSSVariable('--tracking-normal') || '-0.015em',
        wide: getCSSVariable('--tracking-wide') || '0.025em',
      },
    },
    colors: {
      background: {
        primary: getCSSVariable('--bg-primary') || '#000000',
        secondary: getCSSVariable('--bg-secondary') || '#0a0a0a',
        tertiary: getCSSVariable('--bg-tertiary') || '#111111',
        elevated: getCSSVariable('--bg-elevated') || '#1a1a1a',
        surface: getCSSVariable('--bg-surface') || '#2a2a2a',
        surfaceHover: getCSSVariable('--bg-surface-hover') || '#333333',
      },
      text: {
        primary: getCSSVariable('--text-primary') || '#ffffff',
        secondary: getCSSVariable('--text-secondary') || '#e5e5e5',
        muted: getCSSVariable('--text-muted') || '#a3a3a3',
        subtle: getCSSVariable('--text-subtle') || '#737373',
        disabled: getCSSVariable('--text-disabled') || '#525252',
      },
      brand: {
        primary: getCSSVariable('--color-primary') || '#3b82f6',
        primaryDark: getCSSVariable('--color-primary-dark') || '#2563eb',
        primaryLight: getCSSVariable('--color-primary-light') || '#60a5fa',
        secondary: getCSSVariable('--color-secondary') || '#8b5cf6',
        secondaryDark: getCSSVariable('--color-secondary-dark') || '#7c3aed',
        secondaryLight: getCSSVariable('--color-secondary-light') || '#a78bfa',
        accent: getCSSVariable('--color-accent') || '#10b981',
        accentDark: getCSSVariable('--color-accent-dark') || '#059669',
        accentLight: getCSSVariable('--color-accent-light') || '#34d399',
      },
      semantic: {
        success: getCSSVariable('--color-success') || '#22c55e',
        warning: getCSSVariable('--color-warning') || '#f59e0b',
        danger: getCSSVariable('--color-danger') || '#ef4444',
        info: getCSSVariable('--color-info') || '#06b6d4',
      },
      interactive: {
        hover: getCSSVariable('--color-hover') || 'rgba(59, 130, 246, 0.08)',
        focus: getCSSVariable('--color-focus') || 'rgba(59, 130, 246, 0.2)',
        active: getCSSVariable('--color-active') || 'rgba(59, 130, 246, 0.12)',
      },
      border: {
        subtle: getCSSVariable('--border-subtle') || 'rgba(255, 255, 255, 0.05)',
        standard: getCSSVariable('--border-standard') || 'rgba(255, 255, 255, 0.08)',
        emphasis: getCSSVariable('--border-emphasis') || 'rgba(255, 255, 255, 0.12)',
        active: getCSSVariable('--border-active') || 'var(--color-primary)',
      },
    },
    // ... (continuing with all other categories)
    gradients: getDefaultTokens().gradients,
    spacing: getDefaultTokens().spacing,
    shadows: getDefaultTokens().shadows,
    animations: getDefaultTokens().animations,
    glass: getDefaultTokens().glass,
    layout: getDefaultTokens().layout,
    competency: getDefaultTokens().competency,
    notification: getDefaultTokens().notification,
  };
};
