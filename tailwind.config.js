/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background Colors (Dark Theme) - Using CSS custom properties
        'background-primary': 'var(--bg-primary)',
        'background-secondary': 'var(--bg-secondary)',
        'background-tertiary': 'var(--bg-tertiary)',
        'background-elevated': 'var(--bg-elevated)',
        
        // Surface Colors
        'surface': 'var(--bg-card)',
        'surface-hover': 'var(--bg-section)',
        
        // Text Colors (Dark Theme) - Using CSS custom properties
        'text-primary': 'var(--text-heading)',
        'text-secondary': 'var(--text-body)',
        'text-muted': 'var(--text-muted)',
        'text-subtle': 'var(--text-dim)',
        'text-disabled': 'var(--text-disabled)',
        
        // Professional Brand Colors - Using CSS custom properties
        'brand-primary': 'var(--color-brand-primary)',
        'brand-secondary': 'var(--color-brand-secondary)',
        'brand-accent': 'var(--color-brand-accent)',
        
        // Accent Colors
        'accent-warning': 'var(--color-warning)',
        'accent-danger': 'var(--color-error)',
        'accent-success': 'var(--color-success)',
        
        // Interactive States
        'hover': 'var(--color-hover)',
        'focus': 'var(--color-focus)',
        'active': 'var(--color-active)',
        
        // Glass Effect Colors - Using CSS custom properties
        'glass-background': 'var(--glass-background)',
        'glass-border': 'var(--glass-border)',
        
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
        sans: ['Red Hat Display', 'Inter', 'system-ui', 'sans-serif'],  // --font-family-primary
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],            // --font-family-mono
      },
      
      fontSize: {
        'xs': ['11px', { lineHeight: '1.5' }],     // --font-size-xs
        'sm': ['13px', { lineHeight: '1.5' }],     // --font-size-sm
        'base': ['15px', { lineHeight: '1.5' }],   // --font-size-base
        'lg': ['17px', { lineHeight: '1.5' }],     // --font-size-lg
        'xl': ['19px', { lineHeight: '1.25' }],    // --font-size-xl
        '2xl': ['23px', { lineHeight: '1.25' }],   // --font-size-2xl
        '3xl': ['27px', { lineHeight: '1.25' }],   // --font-size-3xl
        '4xl': ['33px', { lineHeight: '1.25' }],   // --font-size-4xl
        '5xl': ['41px', { lineHeight: '1.25' }],   // --font-size-5xl
      },
      
      lineHeight: {
        'tight': '1.25',     // --line-height-tight
        'normal': '1.5',     // --line-height-normal
        'relaxed': '1.625',  // --line-height-relaxed
      },
      
      spacing: {
        'xs': '4px',         // --spacing-xs
        'sm': '8px',         // --spacing-sm
        'md': '12px',        // --spacing-md
        'lg': '16px',        // --spacing-lg
        'xl': '24px',        // --spacing-xl
        '2xl': '32px',       // --spacing-2xl
        '3xl': '48px',       // --spacing-3xl
        '4xl': '64px',       // --spacing-4xl
        '5xl': '96px',       // --spacing-5xl
      },
      
      maxWidth: {
        'container': '900px',   // --container-max-width
        'content': '720px',     // --content-max-width
      },
      
      borderRadius: {
        'sm': '6px',         // --border-radius-sm
        'md': '10px',        // --border-radius-md
        'lg': '16px',        // --border-radius-lg
        'xl': '24px',        // --border-radius-xl
        'full': '50%',       // --border-radius-full
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
}
