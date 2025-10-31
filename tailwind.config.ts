import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",  // ← CRITICAL FIX: Include /src directory for Tailwind scanning
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background Colors (Dark Theme - Expert Requirement)
        background: {
          primary: '#1a1a1a',      // --color-background-primary (expert: #1A1A1A, not #000000)
          secondary: '#121212',    // --color-background-secondary (expert: #121212 or #1A1A1A)
          tertiary: '#111111',     // --color-background-tertiary
          elevated: '#222222',     // --color-background-elevated
        },
        surface: {
          DEFAULT: '#2a2a2a',      // --color-surface
          hover: '#333333',        // --color-surface-hover
        },
        
        // Text Colors (Dark Theme - Expert Requirement) - Matching Design Tokens
        text: {
          primary: '#e0e0e0',      // --text-primary (expert: #E0E0E0, not #ffffff)
          secondary: '#e0e0e0',    // --text-secondary (expert: #E0E0E0 for body text)
          muted: '#a0a0a0',        // --text-muted (expert: #A0A0A0 for less important info)
          subtle: '#64748b',       // --text-dim (slate-500)
          disabled: '#475569',     // slate-600
        },
        
        // Professional Brand Colors
        brand: {
          primary: '#3b82f6',      // --color-brand-primary (blue-500)
          secondary: '#10b981',    // --color-brand-secondary (emerald-500)
          accent: '#8b5cf6',       // --color-brand-accent (violet-500)
        },
        
        // Accent Colors
        accent: {
          warning: '#f59e0b',      // --color-accent-warning (amber-500)
          danger: '#ef4444',       // --color-accent-danger (red-500)
          success: '#22c55e',      // --color-accent-success (green-500)
        },
        
        // Interactive States
        hover: 'rgba(59, 130, 246, 0.08)',   // --color-hover
        focus: 'rgba(59, 130, 246, 0.2)',    // --color-focus
        active: 'rgba(59, 130, 246, 0.12)',  // --color-active
        
        // Glass Effect Colors
        glass: {
          background: 'rgba(255, 255, 255, 0.03)',  // --glass-background
          border: 'rgba(255, 255, 255, 0.08)',      // --glass-border
        },
        
        // Legacy support for existing code
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        }
      },
      
      fontFamily: {
        sans: ['var(--font-red-hat-display)', 'Inter', 'system-ui', 'sans-serif'],  // FIXED: Use CSS variable from layout.tsx
        mono: ['var(--font-jetbrains-mono)', 'Fira Code', 'monospace'],              // FIXED: Use CSS variable from layout.tsx
      },
      
      fontSize: {
        // PHASE 4 MIGRATION: Pixel → Rem (matches design-tokens.css)
        // Migrated: 2025-10-17 (Fresh server restart)
        'xs': ['0.75rem', { lineHeight: '1.5' }],      // 12px - --text-xs
        'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px - --text-sm
        'base': ['1rem', { lineHeight: '1.5' }],       // 16px - --text-base
        'lg': ['1.125rem', { lineHeight: '1.5' }],     // 18px - --text-lg
        'xl': ['1.25rem', { lineHeight: '1.25' }],     // 20px - --text-xl
        '2xl': ['1.5rem', { lineHeight: '1.25' }],     // 24px - --text-2xl
        '3xl': ['1.875rem', { lineHeight: '1.25' }],   // 30px - --text-3xl
        '4xl': ['2.25rem', { lineHeight: '1.25' }],    // 36px - --text-4xl
        '5xl': ['2.75rem', { lineHeight: '1.25' }],    // 44px - --text-5xl
      },
      
      lineHeight: {
        'tight': '1.25',     // --line-height-tight
        'normal': '1.5',     // --line-height-normal
        'relaxed': '1.625',  // --line-height-relaxed
      },
      
      spacing: {
        // PHASE 4 MIGRATION: Pixel → Rem (matches design-tokens.css)
        // Migrated: 2025-10-17 (Fresh server restart)
        'xs': '0.25rem',     // 4px - --space-1
        'sm': '0.5rem',      // 8px - --space-2
        'md': '0.75rem',     // 12px - --space-3
        'lg': '1rem',        // 16px - --space-4
        'xl': '1.5rem',      // 24px - --space-6
        '2xl': '2rem',       // 32px - --space-8
        '3xl': '3rem',       // 48px - --space-12
        '4xl': '4rem',       // 64px - --space-16
        '5xl': '5rem',       // 80px - --space-20 (adjusted from 96px to match common scale)
      },
      
      maxWidth: {
        'container': '900px',   // --container-max-width
        'content': '720px',     // --content-max-width
      },
      
      borderRadius: {
        // PHASE 4 MIGRATION: Pixel → Rem (matches design-tokens.css)
        // Migrated: 2025-10-17 (Fresh server restart)
        'sm': '0.375rem',    // 6px - --radius-sm
        'md': '0.625rem',    // 10px - --radius-md
        'lg': '1rem',        // 16px - --radius-lg
        'xl': '1.5rem',      // 24px - --radius-xl
        'full': '50%',       // --radius-full (percentage preserved)
      },
      
      transitionDuration: {
        'fast': '150ms',     // --transition-fast (0.15s)
        'normal': '250ms',   // --transition-normal (0.25s)
        'slow': '400ms',     // --transition-slow (0.4s)
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)', // Enhanced transitions
      },
      
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.1)',      // --shadow-xs
        'sm': '0 1px 3px rgba(0, 0, 0, 0.2)',      // --shadow-sm
        'md': '0 4px 12px rgba(0, 0, 0, 0.3)',     // --shadow-md
        'lg': '0 10px 25px rgba(0, 0, 0, 0.4)',    // --shadow-lg
        'xl': '0 20px 40px rgba(0, 0, 0, 0.5)',    // --shadow-xl
      },
      
      backdropBlur: {
        'glass': '16px',     // --glass-backdrop
      },
      
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'checkmark-appear': 'checkmarkAppear 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'question-fade-in': 'questionFadeIn 0.6s ease-out forwards',
      },
      
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(24px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' }
        },
        checkmarkAppear: {
          'to': {
            opacity: '1',
            transform: 'scale(1) rotate(0deg)'
          }
        },
        questionFadeIn: {
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#e5e5e5',           // text-secondary
            '--tw-prose-body': '#e5e5e5',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-lead': '#a3a3a3',
            '--tw-prose-links': '#3b82f6',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-counters': '#737373',
            '--tw-prose-bullets': '#737373',
            '--tw-prose-hr': '#2a2a2a',
            '--tw-prose-quotes': '#e5e5e5',
            '--tw-prose-quote-borders': '#2a2a2a',
            '--tw-prose-captions': '#737373',
            '--tw-prose-code': '#ffffff',
            '--tw-prose-pre-code': '#e5e5e5',
            '--tw-prose-pre-bg': '#1a1a1a',
            '--tw-prose-th-borders': '#2a2a2a',
            '--tw-prose-td-borders': '#222222',
            h1: {
              color: '#ffffff',
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: '#ffffff',
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            h3: {
              color: '#ffffff',
              fontWeight: '600',
            },
            strong: {
              color: '#ffffff',
              fontWeight: '600',
            },
            code: {
              color: '#ffffff',
              backgroundColor: '#1a1a1a',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // Use class strategy for better control
    }),
    require('@tailwindcss/typography'),
  ],
};

export default config;
