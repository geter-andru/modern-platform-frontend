'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Tabs - Advanced tab navigation component
 * 
 * Features:
 * - Multiple tab variants (default, pills, underline, cards)
 * - Scrollable tabs for overflow
 * - Closeable tabs
 * - Icon support
 * - Badge/counter support
 * - Disabled tabs
 * - Controlled and uncontrolled modes
 * - Keyboard navigation
 * - Tab content animations
 * - Responsive behavior
 */

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  closeable?: boolean;
  content?: React.ReactNode;
}

export type TabVariant = 'default' | 'pills' | 'underline' | 'cards';
export type TabSize = 'sm' | 'md' | 'lg';
export type TabOrientation = 'horizontal' | 'vertical';

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  orientation?: TabOrientation;
  scrollable?: boolean;
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  allowKeyboardNavigation?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  scrollable = false,
  className = '',
  tabListClassName = '',
  tabClassName = '',
  contentClassName = '',
  allowKeyboardNavigation = true
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    activeTab || tabs.find(tab => !tab.disabled)?.id || tabs[0]?.id
  );
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  
  const tabListRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Use controlled or uncontrolled mode
  const currentActiveTab = activeTab ?? internalActiveTab;

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      setInternalActiveTab(tabId);
      onTabChange?.(tabId);
    }
  };

  // Handle tab close
  const handleTabClose = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onTabClose?.(tabId);
  };

  // Check scroll buttons visibility
  const checkScrollButtons = () => {
    if (!scrollable || !tabListRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = tabListRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth);
  };

  // Scroll tabs
  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabListRef.current) return;

    const scrollAmount = 200;
    const newScrollLeft = direction === 'left' 
      ? tabListRef.current.scrollLeft - scrollAmount
      : tabListRef.current.scrollLeft + scrollAmount;

    tabListRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Keyboard navigation
  useEffect(() => {
    if (!allowKeyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;

      const currentIndex = tabs.findIndex(tab => tab.id === currentActiveTab);
      if (currentIndex === -1) return;

      event.preventDefault();

      let newIndex = currentIndex;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          do {
            newIndex = newIndex > 0 ? newIndex - 1 : tabs.length - 1;
          } while (tabs[newIndex]?.disabled && newIndex !== currentIndex);
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          do {
            newIndex = newIndex < tabs.length - 1 ? newIndex + 1 : 0;
          } while (tabs[newIndex]?.disabled && newIndex !== currentIndex);
          break;
        case 'Home':
          newIndex = 0;
          while (tabs[newIndex]?.disabled && newIndex < tabs.length - 1) {
            newIndex++;
          }
          break;
        case 'End':
          newIndex = tabs.length - 1;
          while (tabs[newIndex]?.disabled && newIndex > 0) {
            newIndex--;
          }
          break;
      }

      if (newIndex !== currentIndex && !tabs[newIndex]?.disabled) {
        handleTabChange(tabs[newIndex].id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tabs, currentActiveTab, allowKeyboardNavigation]);

  // Update scroll buttons on mount and scroll
  useEffect(() => {
    checkScrollButtons();
    
    const tabList = tabListRef.current;
    if (tabList) {
      tabList.addEventListener('scroll', checkScrollButtons);
      return () => tabList.removeEventListener('scroll', checkScrollButtons);
    }
  }, [tabs, scrollable]);

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollable) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [currentActiveTab, scrollable]);

  // Get variant-specific styles
  const getVariantStyles = () => {
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    switch (variant) {
      case 'pills':
        return {
          tabList: 'p-1 bg-gray-800 rounded-lg',
          tab: `${sizeStyles[size]} rounded-md transition-all duration-200`,
          activeTab: 'bg-blue-500 text-white shadow-sm',
          inactiveTab: 'text-gray-400 hover:text-white hover:bg-gray-700'
        };
      
      case 'underline':
        return {
          tabList: 'border-b border-gray-700',
          tab: `${sizeStyles[size]} border-b-2 border-transparent transition-all duration-200`,
          activeTab: 'border-blue-500 text-blue-400',
          inactiveTab: 'text-gray-400 hover:text-white hover:border-gray-500'
        };
      
      case 'cards':
        return {
          tabList: '',
          tab: `${sizeStyles[size]} border border-gray-700 transition-all duration-200`,
          activeTab: 'bg-gray-800 text-white border-gray-600',
          inactiveTab: 'text-gray-400 hover:text-white hover:bg-gray-800 bg-gray-900'
        };
      
      default:
        return {
          tabList: 'bg-gray-800/50 rounded-lg p-1',
          tab: `${sizeStyles[size]} rounded-md transition-all duration-200`,
          activeTab: 'bg-gray-700 text-white',
          inactiveTab: 'text-gray-400 hover:text-white hover:bg-gray-700/50'
        };
    }
  };

  const styles = getVariantStyles();
  const isVertical = orientation === 'vertical';
  const activeTabData = tabs.find(tab => tab.id === currentActiveTab);

  return (
    <div className={`${isVertical ? 'flex gap-6' : ''} ${className}`}>
      {/* Tab List */}
      <div className={`
        ${isVertical ? 'flex-shrink-0' : 'relative'}
        ${scrollable && !isVertical ? 'overflow-hidden' : ''}
      `}>
        {/* Scroll buttons */}
        {scrollable && !isVertical && (
          <>
            {showLeftScroll && (
              <button
                onClick={() => scrollTabs('left')}
                className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-gray-900 to-transparent px-2 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
            )}
            {showRightScroll && (
              <button
                onClick={() => scrollTabs('right')}
                className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-gray-900 to-transparent px-2 flex items-center"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </>
        )}

        {/* Tabs */}
        <div
          ref={tabListRef}
          className={`
            ${isVertical ? 'flex flex-col' : 'flex'}
            ${scrollable && !isVertical ? 'overflow-x-auto scrollbar-hide' : ''}
            ${styles.tabList}
            ${tabListClassName}
          `}
          role="tablist"
          aria-orientation={orientation}
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === currentActiveTab;
            
            return (
              <button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                className={`
                  relative flex items-center gap-2 whitespace-nowrap font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
                  ${styles.tab}
                  ${isActive ? styles.activeTab : styles.inactiveTab}
                  ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${variant === 'cards' && !isVertical
                    ? index === 0 ? 'rounded-l-lg' : index === tabs.length - 1 ? 'rounded-r-lg' : 'rounded-none'
                    : ''
                  }
                  ${tabClassName}
                `}
                onClick={() => handleTabChange(tab.id)}
                disabled={tab.disabled}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
              >
                {/* Icon */}
                {tab.icon && (
                  <span className="flex-shrink-0">
                    {tab.icon}
                  </span>
                )}

                {/* Label */}
                <span className="truncate">{tab.label}</span>

                {/* Badge */}
                {tab.badge && (
                  <span className={`
                    px-1.5 py-0.5 text-xs rounded-full flex-shrink-0
                    ${isActive ? 'bg-blue-400 text-blue-900' : 'bg-gray-600 text-gray-300'}
                  `}>
                    {tab.badge}
                  </span>
                )}

                {/* Close button */}
                {tab.closeable && (
                  <button
                    onClick={(e) => handleTabClose(tab.id, e)}
                    className="ml-1 p-0.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                    aria-label={`Close ${tab.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                {/* Active indicator for underline variant */}
                {variant === 'underline' && isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className={`flex-1 ${contentClassName}`}>
        <AnimatePresence mode="wait">
          {activeTabData?.content && (
            <motion.div
              key={currentActiveTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              role="tabpanel"
              aria-labelledby={`tab-${currentActiveTab}`}
              id={`tabpanel-${currentActiveTab}`}
              tabIndex={0}
            >
              {activeTabData.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Simple Tab Content Component (for when content is provided separately)
export interface TabContentProps {
  children: React.ReactNode;
  value: string;
  activeTab: string;
  className?: string;
}

export const TabContent: React.FC<TabContentProps> = ({
  children,
  value,
  activeTab,
  className = ''
}) => {
  if (value !== activeTab) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      id={`tabpanel-${value}`}
      tabIndex={0}
    >
      {children}
    </motion.div>
  );
};

export default Tabs;