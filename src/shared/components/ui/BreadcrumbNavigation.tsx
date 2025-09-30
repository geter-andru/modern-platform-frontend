'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * BreadcrumbNavigation - Hierarchical navigation trails
 * 
 * Features:
 * - Hierarchical path display
 * - Clickable navigation
 * - Responsive collapse
 * - Custom separators
 * - Icon support
 * - Mobile optimization
 * - Accessibility compliant
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isCurrentPage?: boolean;
}

export interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHomeIcon?: boolean;
  maxItems?: number;
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
  currentPageClassName?: string;
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  showHomeIcon = true,
  maxItems = 4,
  className = '',
  itemClassName = '',
  separatorClassName = '',
  currentPageClassName = ''
}) => {
  // Process items for responsive display
  const processedItems = React.useMemo(() => {
    if (items.length <= maxItems) {
      return items;
    }

    // Keep first item, last item, and show ellipsis for middle items
    const firstItem = items[0];
    const lastItems = items.slice(-2); // Keep last 2 items
    
    return [
      firstItem,
      { label: '...', href: undefined, icon: <MoreHorizontal className="w-4 h-4" /> },
      ...lastItems
    ];
  }, [items, maxItems]);

  return (
    <nav 
      className={`flex items-center space-x-1 text-sm ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center space-x-1">
        {processedItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {/* Separator */}
            {index > 0 && (
              <span 
                className={`text-gray-400 mx-2 ${separatorClassName}`}
                aria-hidden="true"
              >
                {separator}
              </span>
            )}

            {/* Breadcrumb Item */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center"
            >
              {item.href && !item.isCurrentPage ? (
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200
                    text-gray-400 hover:text-white hover:bg-gray-800
                    ${itemClassName}
                  `}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {/* Home icon for first item */}
                  {index === 0 && showHomeIcon ? (
                    <Home className="w-4 h-4" />
                  ) : (
                    item.icon
                  )}
                  
                  <span className="truncate max-w-[150px] sm:max-w-none">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span 
                  className={`
                    flex items-center gap-1.5 px-2 py-1 rounded-md
                    ${item.isCurrentPage 
                      ? `text-white bg-gray-800 ${currentPageClassName}` 
                      : 'text-gray-500 cursor-default'
                    }
                    ${itemClassName}
                  `}
                  aria-current={item.isCurrentPage ? 'page' : undefined}
                >
                  {/* Home icon for first item */}
                  {index === 0 && showHomeIcon ? (
                    <Home className="w-4 h-4" />
                  ) : (
                    item.icon
                  )}
                  
                  <span className="truncate max-w-[150px] sm:max-w-none">
                    {item.label}
                  </span>
                </span>
              )}
            </motion.div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Utility function to generate breadcrumbs from pathname
export const generateBreadcrumbsFromPath = (
  pathname: string,
  pathLabels?: Record<string, string>
): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: pathLabels?.[''] || 'Home',
      href: '/',
      icon: <Home className="w-4 h-4" />
    }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLastSegment = index === segments.length - 1;
    
    // Convert segment to readable label
    const label = pathLabels?.[segment] || 
                 segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

    breadcrumbs.push({
      label,
      href: isLastSegment ? undefined : currentPath,
      isCurrentPage: isLastSegment
    });
  });

  return breadcrumbs;
};

// Compact breadcrumb for mobile
export const CompactBreadcrumb: React.FC<{
  items: BreadcrumbItem[];
  onNavigateBack?: () => void;
  className?: string;
}> = ({ items, onNavigateBack, className = '' }) => {
  const currentItem = items[items.length - 1];
  const parentItem = items[items.length - 2];

  if (!parentItem) return null;

  return (
    <nav className={`flex items-center text-sm ${className}`}>
      <button
        onClick={onNavigateBack || (() => window.history.back())}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        aria-label={`Navigate back to ${parentItem.label}`}
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span className="truncate max-w-[120px]">{parentItem.label}</span>
      </button>
      
      <ChevronRight className="w-4 h-4 text-gray-500 mx-2" />
      
      <span className="text-white font-medium truncate">
        {currentItem.label}
      </span>
    </nav>
  );
};

// Breadcrumb with dropdown for overflow items
export const DropdownBreadcrumb: React.FC<{
  items: BreadcrumbItem[];
  maxVisibleItems?: number;
  className?: string;
}> = ({ items, maxVisibleItems = 3, className = '' }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  if (items.length <= maxVisibleItems) {
    return <BreadcrumbNavigation items={items} className={className} />;
  }

  const visibleItems = [
    items[0], // First item
    ...items.slice(-2) // Last 2 items
  ];

  const hiddenItems = items.slice(1, -2);

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`}>
      {/* First item */}
      <BreadcrumbNavigation items={[items[0]]} />
      
      {/* Separator */}
      <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
      
      {/* Dropdown for hidden items */}
      {hiddenItems.length > 0 && (
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
            aria-label="Show hidden breadcrumb items"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50 min-w-[200px]"
            >
              {hiddenItems.map((item, index) => (
                <div key={index}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2 px-3 py-2 text-gray-500">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}
      
      {/* Separator */}
      <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
      
      {/* Last 2 items */}
      <BreadcrumbNavigation 
        items={items.slice(-2)} 
        separator={<ChevronRight className="w-4 h-4" />}
        showHomeIcon={false}
      />
    </nav>
  );
};

export default BreadcrumbNavigation;