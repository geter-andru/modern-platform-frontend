'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BreadcrumbNavigation, { BreadcrumbItem } from './BreadcrumbNavigation';
import FooterLayout from './FooterLayout';

/**
 * PageLayout - Enterprise-grade page layout component system
 * 
 * Features:
 * - Multiple layout variants (default, centered, sidebar, full-width)
 * - Integrated header, breadcrumb, and footer sections
 * - Responsive design with mobile optimization
 * - Loading and error states
 * - SEO optimization with meta tags
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Animation support
 * - Customizable spacing and containers
 * - Sidebar and content area management
 */

export type PageLayoutVariant = 'default' | 'centered' | 'sidebar' | 'full-width' | 'dashboard';
export type PageLayoutSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface PageLayoutProps {
  children: React.ReactNode;
  variant?: PageLayoutVariant;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: string;
  footer?: React.ReactNode;
  showFooter?: boolean;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string | React.ReactNode;
  spacing?: PageLayoutSpacing;
  maxWidth?: string;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  sidebarClassName?: string;
  animate?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
  };
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  variant = 'default',
  title,
  description,
  breadcrumbs,
  showBreadcrumbs = true,
  header,
  sidebar,
  sidebarPosition = 'left',
  sidebarWidth = '320px',
  footer,
  showFooter = true,
  actions,
  loading = false,
  error,
  spacing = 'lg',
  maxWidth = '7xl',
  className = '',
  containerClassName = '',
  contentClassName = '',
  sidebarClassName = '',
  animate = true,
  stickyHeader = false,
  stickyFooter = false,
  meta
}) => {
  // Spacing configurations
  const spacingClasses = {
    none: 'py-0',
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8',
    xl: 'py-12'
  };

  // Max width classes
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  // Layout variant configurations
  const getLayoutClasses = () => {
    switch (variant) {
      case 'centered':
        return 'flex flex-col items-center justify-center min-h-screen text-center';
      case 'full-width':
        return 'w-full';
      case 'dashboard':
        return 'min-h-screen bg-gray-900';
      case 'sidebar':
        return 'flex flex-col lg:flex-row';
      default:
        return 'flex flex-col';
    }
  };

  // Container classes
  const containerClasses = `
    ${variant === 'full-width' ? 'w-full' : `mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth as keyof typeof maxWidthClasses] || maxWidthClasses['7xl']}`}
    ${spacingClasses[spacing]}
    ${containerClassName}
  `.trim();

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const sidebarVariants = {
    initial: { opacity: 0, x: sidebarPosition === 'left' ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: sidebarPosition === 'left' ? -20 : 20 }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L3.054 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            {typeof error === 'string' ? (
              <p className="text-gray-400">{error}</p>
            ) : (
              error
            )}
          </div>
        </div>
      </div>
    );
  }

  const MotionDiv = animate ? motion.div : 'div';
  const MotionAside = animate ? motion.aside : 'aside';

  return (
    <>
      {/* Meta tags */}
      {meta && (
        <head>
          {meta.title && <title>{meta.title}</title>}
          {meta.description && <meta name="description" content={meta.description} />}
          {meta.keywords && <meta name="keywords" content={meta.keywords} />}
          {meta.canonical && <link rel="canonical" href={meta.canonical} />}
        </head>
      )}

      <div className={`${getLayoutClasses()} ${className}`}>
        {/* Sticky Header */}
        {header && (
          <header className={stickyHeader ? 'sticky top-0 z-50' : ''}>
            {header}
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1">
          {variant === 'sidebar' && sidebar ? (
            <div className={containerClasses}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar - Left */}
                {sidebarPosition === 'left' && (
                  <MotionAside
                    className={`lg:flex-shrink-0 ${sidebarClassName}`}
                    style={{ width: sidebarWidth }}
                    {...(animate ? {
                      variants: sidebarVariants,
                      initial: "initial",
                      animate: "animate",
                      exit: "exit",
                      transition: { duration: 0.3, delay: 0.1 }
                    } : {})}
                  >
                    {sidebar}
                  </MotionAside>
                )}

                {/* Content */}
                <MotionDiv
                  className={`flex-1 min-w-0 ${contentClassName}`}
                  {...(animate ? {
                    variants: pageVariants,
                    initial: "initial",
                    animate: "animate",
                    exit: "exit",
                    transition: { duration: 0.3 }
                  } : {})}
                >
                  {/* Page Header */}
                  {(title || breadcrumbs || actions) && (
                    <div className="mb-8 space-y-4">
                      {/* Breadcrumbs */}
                      {showBreadcrumbs && breadcrumbs && (
                        <BreadcrumbNavigation items={breadcrumbs} />
                      )}

                      {/* Title and Actions */}
                      {(title || actions) && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                          {title && (
                            <div>
                              <h1 className="text-3xl font-bold text-white">{title}</h1>
                              {description && (
                                <p className="mt-2 text-gray-400">{description}</p>
                              )}
                            </div>
                          )}
                          
                          {actions && (
                            <div className="flex items-center space-x-3">
                              {actions}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Page Content */}
                  {children}
                </MotionDiv>

                {/* Sidebar - Right */}
                {sidebarPosition === 'right' && (
                  <MotionAside
                    className={`lg:flex-shrink-0 ${sidebarClassName}`}
                    style={{ width: sidebarWidth }}
                    {...(animate ? {
                      variants: sidebarVariants,
                      initial: "initial",
                      animate: "animate",
                      exit: "exit",
                      transition: { duration: 0.3, delay: 0.1 }
                    } : {})}
                  >
                    {sidebar}
                  </MotionAside>
                )}
              </div>
            </div>
          ) : (
            <MotionDiv
              className={containerClasses}
              {...(animate ? {
                variants: pageVariants,
                initial: "initial",
                animate: "animate",
                exit: "exit",
                transition: { duration: 0.3 }
              } : {})}
            >
              {/* Page Header */}
              {(title || breadcrumbs || actions) && (
                <div className="mb-8 space-y-4">
                  {/* Breadcrumbs */}
                  {showBreadcrumbs && breadcrumbs && (
                    <BreadcrumbNavigation items={breadcrumbs} />
                  )}

                  {/* Title and Actions */}
                  {(title || actions) && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      {title && (
                        <div>
                          <h1 className="text-3xl font-bold text-white">{title}</h1>
                          {description && (
                            <p className="mt-2 text-gray-400">{description}</p>
                          )}
                        </div>
                      )}
                      
                      {actions && (
                        <div className="flex items-center space-x-3">
                          {actions}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Page Content */}
              <div className={contentClassName}>
                {children}
              </div>
            </MotionDiv>
          )}
        </main>

        {/* Footer */}
        {showFooter && (
          <footer className={stickyFooter ? 'sticky bottom-0 z-50' : ''}>
            {footer || <FooterLayout variant="minimal" />}
          </footer>
        )}
      </div>
    </>
  );
};

// Specialized page layouts
export interface DashboardPageLayoutProps extends Omit<PageLayoutProps, 'variant'> {
  navigation?: React.ReactNode;
  quickActions?: React.ReactNode;
}

export const DashboardPageLayout: React.FC<DashboardPageLayoutProps> = ({
  navigation,
  quickActions,
  ...props
}) => {
  return (
    <PageLayout
      {...props}
      variant="dashboard"
      showFooter={false}
      header={
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {navigation}
              {quickActions && (
                <div className="flex items-center space-x-4">
                  {quickActions}
                </div>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
};

export interface AuthPageLayoutProps extends Omit<PageLayoutProps, 'variant'> {
  logo?: React.ReactNode;
  backgroundImage?: string;
}

export const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  logo,
  backgroundImage,
  children,
  ...props
}) => {
  return (
    <PageLayout
      {...props}
      variant="centered"
      showBreadcrumbs={false}
      showFooter={false}
      maxWidth="md"
      className={`min-h-screen ${backgroundImage ? 'bg-cover bg-center' : 'bg-gray-900'}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-xl border border-gray-700">
        {logo && (
          <div className="text-center">
            {logo}
          </div>
        )}
        {children}
      </div>
    </PageLayout>
  );
};

// Hook for page layout state management
export const usePageLayout = (initialState: Partial<PageLayoutProps> = {}) => {
  const [layoutState, setLayoutState] = React.useState(initialState);

  const updateLayout = React.useCallback((updates: Partial<PageLayoutProps>) => {
    setLayoutState(prev => ({ ...prev, ...updates }));
  }, []);

  const setLoading = React.useCallback((loading: boolean) => {
    setLayoutState(prev => ({ ...prev, loading }));
  }, []);

  const setError = React.useCallback((error: string | React.ReactNode | null) => {
    setLayoutState(prev => ({ ...prev, error: error || undefined }));
  }, []);

  const setTitle = React.useCallback((title: string) => {
    setLayoutState(prev => ({ ...prev, title }));
  }, []);

  const setBreadcrumbs = React.useCallback((breadcrumbs: BreadcrumbItem[]) => {
    setLayoutState(prev => ({ ...prev, breadcrumbs }));
  }, []);

  return {
    layoutState,
    updateLayout,
    setLoading,
    setError,
    setTitle,
    setBreadcrumbs
  };
};

export default PageLayout;