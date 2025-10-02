'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface EnhancedTabNavigationProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

const EnhancedTabNavigation: React.FC<EnhancedTabNavigationProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return;
    
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`enhanced-tab-navigation ${className}`}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            className={`
              relative px-6 py-3 text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
              ${tab.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
            
            {/* Active Tab Indicator */}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                layoutId="activeTab"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="tab-content"
        >
          {activeTabContent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EnhancedTabNavigation;
