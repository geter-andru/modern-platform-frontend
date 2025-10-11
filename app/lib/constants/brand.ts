// Brand constants for consistent styling across the modern-platform application
// Based on the Andru Assessment brand system

export const BRAND_COLORS = {
  // Background Colors
  background: {
    primary: 'bg-background-primary',
    secondary: 'bg-background-secondary', 
    tertiary: 'bg-background-tertiary',
    elevated: 'bg-background-elevated',
  },
  
  // Surface Colors
  surface: {
    default: 'bg-surface',
    hover: 'bg-surface-hover',
  },
  
  // Text Colors
  text: {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    muted: 'text-text-muted',
    subtle: 'text-text-subtle',
    disabled: 'text-text-disabled',
  },
  
  // Brand Colors
  brand: {
    primary: 'text-brand-primary',
    secondary: 'text-brand-secondary',
    accent: 'text-brand-accent',
  },
  
  // Brand Background Colors
  brandBg: {
    primary: 'bg-brand-primary',
    secondary: 'bg-brand-secondary',
    accent: 'bg-brand-accent',
  },
  
  // Accent Colors
  accent: {
    warning: 'text-accent-warning',
    danger: 'text-accent-danger',
    success: 'text-accent-success',
  },
  
  // Accent Background Colors
  accentBg: {
    warning: 'bg-accent-warning',
    danger: 'bg-accent-danger',
    success: 'bg-accent-success',
  },
};

export const BRAND_GRADIENTS = {
  progress: 'bg-gradient-to-br from-brand-primary to-blue-700',
  success: 'bg-gradient-to-br from-brand-secondary to-emerald-700',
  advancement: 'bg-gradient-to-br from-brand-accent to-violet-700',
  excellence: 'bg-gradient-to-br from-accent-warning to-amber-700',
};

export const BRAND_SHADOWS = {
  subtle: 'shadow-subtle',
  medium: 'shadow-medium',
  large: 'shadow-large',
  glow: 'shadow-glow',
};

export const BRAND_ANIMATIONS = {
  elegantSlideIn: 'animate-elegant-slide-in',
  sophisticatedScaleIn: 'animate-sophisticated-scale-in',
  professionalPulse: 'animate-professional-pulse',
  sophisticatedGlow: 'animate-sophisticated-glow',
};

export const BRAND_TRANSITIONS = {
  elegant: 'transition-all duration-300 ease-elegant',
  professional: 'transition-all duration-400 ease-professional',
  satisfaction: 'transition-all duration-600 ease-satisfaction',
};

export const COMPONENT_STYLES = {
  // Cards
  card: `${BRAND_COLORS.surface.default} ${BRAND_COLORS.text.primary} rounded-lg border border-gray-700`,
  cardHover: `${BRAND_COLORS.surface.hover} ${BRAND_SHADOWS.medium}`,
  
  // Buttons
  buttonPrimary: `${BRAND_COLORS.brandBg.primary} ${BRAND_COLORS.text.primary} px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors`,
  buttonSecondary: `${BRAND_COLORS.surface.default} ${BRAND_COLORS.text.secondary} px-4 py-2 rounded-lg font-medium hover:${BRAND_COLORS.surface.hover} transition-colors`,
  buttonAccent: `${BRAND_COLORS.brandBg.accent} ${BRAND_COLORS.text.primary} px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors`,
  
  // Inputs
  input: `${BRAND_COLORS.background.elevated} ${BRAND_COLORS.text.primary} border border-gray-700 rounded-lg px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20`,
  
  // Navigation
  navItem: `${BRAND_COLORS.text.muted} hover:${BRAND_COLORS.text.primary} transition-colors`,
  navItemActive: `${BRAND_COLORS.brand.primary} ${BRAND_COLORS.brandBg.primary}`,
  
  // Status Indicators
  statusSuccess: `${BRAND_COLORS.accentBg.success} ${BRAND_COLORS.text.primary} px-2 py-1 rounded-full text-sm`,
  statusWarning: `${BRAND_COLORS.accentBg.warning} ${BRAND_COLORS.text.primary} px-2 py-1 rounded-full text-sm`,
  statusDanger: `${BRAND_COLORS.accentBg.danger} ${BRAND_COLORS.text.primary} px-2 py-1 rounded-full text-sm`,
};

export const LAYOUT_CONSTANTS = {
  containerMaxWidth: 'max-w-container',
  contentMaxWidth: 'max-w-content',
  spacing: {
    xs: 'space-y-1',
    sm: 'space-y-2', 
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12',
  },
};

// Professional micro-interaction classes
export const MICRO_INTERACTIONS = {
  hover: 'hover:transform hover:-translate-y-1 hover:shadow-large transition-all duration-300 ease-elegant',
  focus: 'focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary',
  active: 'active:scale-95 transition-transform duration-150',
  glow: 'hover:shadow-glow transition-shadow duration-300',
};

// Glass effect utilities
export const GLASS_EFFECTS = {
  light: 'bg-glass-light backdrop-blur-sm border border-white/10',
  medium: 'bg-glass-medium backdrop-blur-md border border-white/20',
  dark: 'bg-glass-dark backdrop-blur-lg border border-white/5',
};
