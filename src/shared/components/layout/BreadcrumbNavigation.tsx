'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * BreadcrumbNavigation - Enterprise-grade breadcrumb component system
 * 
 * Features:
 * - Automatic path-based breadcrumb generation
 * - Custom breadcrumb items support
 * - Multiple variants and styles
 * - Responsive design with mobile optimization
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Structured data support for SEO
 * - Interactive hover states
 * - Custom separators and icons
 * - Back button integration
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
  disabled?: boolean;
}

export type BreadcrumbVariant = 'default' | 'minimal' | 'pills' | 'underline';
export type BreadcrumbSize = 'sm' | 'md' | 'lg';
export type SeparatorType = 'chevron' | 'slash' | 'arrow' | 'custom';

export interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  variant?: BreadcrumbVariant;
  size?: BreadcrumbSize;
  separator?: SeparatorType;
  customSeparator?: React.ReactNode;
  showHome?: boolean;
  homeIcon?: React.ReactNode;
  homeHref?: string;
  showBack?: boolean;
  onBack?: () => void;
  maxItems?: number;
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
  autoGenerate?: boolean;
  pathMapping?: Record<string, string>;
  structuredData?: boolean;
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items: providedItems,
  variant = 'default',
  size = 'md',
  separator = 'chevron',
  customSeparator,
  showHome = true,
  homeIcon,
  homeHref = '/',
  showBack = false,
  onBack,
  maxItems = 4,
  className = '',
  itemClassName = '',
  separatorClassName = '',
  autoGenerate = false,
  pathMapping = {},
  structuredData = true
}) => {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = React.useCallback((): BreadcrumbItem[] => {
    if (!autoGenerate || !pathname) return [];

    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home if not already at home and showHome is true
    if (showHome && pathname !== '/') {
      breadcrumbs.push({
        label: 'Home',
        href: homeHref,
        icon: homeIcon || <Home className="w-4 h-4" />
      });
    }

    // Build breadcrumb for each path segment
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === paths.length - 1;
      
      // Use custom mapping if available, otherwise format path
      const label = pathMapping[path] || 
        path.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  }, [pathname, autoGenerate, showHome, homeHref, homeIcon, pathMapping]);

  // Use provided items or generate from path
  const items = providedItems || generateBreadcrumbs();

  // Truncate items if exceeding maxItems
  const truncatedItems = React.useMemo(() => {
    if (items.length <= maxItems) return items;

    const firstItem = items[0];
    const lastItems = items.slice(-2);
    
    return [
      firstItem,
      { label: '...', disabled: true },
      ...lastItems
    ];
  }, [items, maxItems]);

  // Size configurations
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Variant configurations
  const variantClasses = {
    default: 'text-gray-400',
    minimal: 'text-gray-500',
    pills: 'px-2 py-1 rounded-full bg-gray-800',
    underline: 'border-b-2 border-transparent hover:border-gray-600'
  };

  // Get separator icon
  const getSeparator = () => {
    if (customSeparator) return customSeparator;

    switch (separator) {
      case 'chevron':
        return <ChevronRight className="w-4 h-4 text-gray-600" />;
      case 'slash':
        return <span className="text-gray-600">/</span>;
      case 'arrow':
        return <span className="text-gray-600">→</span>;
      default:
        return <ChevronRight className="w-4 h-4 text-gray-600" />;
    }
  };

  // Handle back button
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  // Build breadcrumb classes
  const containerClasses = `
    flex items-center space-x-2
    ${sizeClasses[size]}
    ${className}
  `.trim();

  // Build item classes
  const getItemClasses = (item: BreadcrumbItem, index: number) => {
    const baseClasses = `
      transition-colors duration-200
      ${variantClasses[variant]}
      ${itemClassName}
    `;

    if (item.disabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed`;
    }

    if (item.current) {
      return `${baseClasses} text-white font-medium pointer-events-none`;
    }

    return `${baseClasses} hover:text-white cursor-pointer`;
  };

  // Structured data for SEO
  const structuredDataJson = React.useMemo(() => {
    if (!structuredData) return null;

    const itemListElement = items
      .filter(item => item.href)
      .map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.href
      }));

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": itemListElement
    };
  }, [items, structuredData]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Structured Data */}
      {structuredDataJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataJson) }}
        />
      )}

      <nav aria-label="Breadcrumb" className={containerClasses}>
        {/* Back button */}
        {showBack && (
          <motion.button
            onClick={handleBack}
            className="flex items-center space-x-2 px-2 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Go back</span>
          </motion.button>
        )}

        {/* Breadcrumb items */}
        <ol className="flex items-center space-x-2" role="list">
          {truncatedItems.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              {/* Separator (not for first item) */}
              {index > 0 && (
                <span className={`flex-shrink-0 ${separatorClassName}`} aria-hidden="true">
                  {getSeparator()}
                </span>
              )}

              {/* Breadcrumb item */}
              <div className="flex items-center space-x-1">
                {item.href && !item.current && !item.disabled ? (
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Link
                      href={item.href}
                      className={getItemClasses(item, index)}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <span className="flex items-center space-x-1">
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  </motion.div>
                ) : (
                  <span
                    className={getItemClasses(item, index)}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    <span className="flex items-center space-x-1">
                      {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                      <span>{item.label}</span>
                    </span>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

// Simple breadcrumb component for basic use cases
export interface SimpleBreadcrumbProps {
  items: { label: string; href?: string }[];
  className?: string;
}

export const SimpleBreadcrumb: React.FC<SimpleBreadcrumbProps> = ({
  items,
  className = ''
}) => {
  return (
    <nav className={`text-sm text-gray-400 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-gray-600" aria-hidden="true" />
            )}
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Page breadcrumb component with integrated page title
export interface PageBreadcrumbProps extends BreadcrumbNavigationProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({
  title,
  description,
  actions,
  className = '',
  ...breadcrumbProps
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Breadcrumb */}
      <BreadcrumbNavigation {...breadcrumbProps} />
      
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="mt-2 text-gray-400">{description}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// Hook for programmatic breadcrumb management
export const useBreadcrumb = (items?: BreadcrumbItem[]) => {
  const pathname = usePathname();
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<BreadcrumbItem[]>(items || []);

  const addItem = React.useCallback((item: BreadcrumbItem) => {
    setBreadcrumbItems(prev => [...prev, item]);
  }, []);

  const removeItem = React.useCallback((index: number) => {
    setBreadcrumbItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateItem = React.useCallback((index: number, updates: Partial<BreadcrumbItem>) => {
    setBreadcrumbItems(prev => prev.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    ));
  }, []);

  const reset = React.useCallback((newItems?: BreadcrumbItem[]) => {
    setBreadcrumbItems(newItems || []);
  }, []);

  // Update current item when pathname changes
  React.useEffect(() => {
    setBreadcrumbItems(prev => 
      prev.map((item, index) => ({
        ...item,
        current: index === prev.length - 1
      }))
    );
  }, [pathname]);

  return {
    items: breadcrumbItems,
    setItems: setBreadcrumbItems,
    addItem,
    removeItem,
    updateItem,
    reset
  };
};

export default BreadcrumbNavigation;