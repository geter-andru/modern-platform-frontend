'use client';

import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

/**
 * TabComponents - Professional tab navigation system
 * 
 * Features:
 * - Horizontal and vertical tab layouts
 * - Animated tab indicator
 * - Icon support
 * - Badge/notification support
 * - Responsive design
 * - TypeScript enhanced interfaces
 * - Professional styling
 */

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  content?: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export interface TabContentProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}

export interface IntelligenceTabsProps {
  painPoints: Array<{ id: string; description: string; severity: string }>;
  initiatives: Array<{ id: string; initiative: string; priority: string }>;
  solutions: Array<{ id: string; reason: string; confidence: number }>;
  contacts: Array<{ id: string; name: string; role: string }>;
  className?: string;
}

/**
 * Core Tabs Component
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className = '',
  animated = true
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  const activeTab = controlledActiveTab || internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'pills':
        return {
          container: 'bg-gray-800 p-1 rounded-lg',
          tab: `${sizeClasses[size]} rounded-md font-medium transition-all duration-200`,
          active: 'bg-gray-700 text-white shadow-sm',
          inactive: 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
        };
      case 'underline':
        return {
          container: 'border-b border-gray-800',
          tab: `${sizeClasses[size]} border-b-2 font-medium transition-all duration-200`,
          active: 'border-blue-500 text-blue-400',
          inactive: 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
        };
      case 'vertical':
        return {
          container: 'flex flex-col space-y-1',
          tab: `${sizeClasses[size]} rounded-lg font-medium transition-all duration-200 text-left`,
          active: 'bg-blue-600 text-white',
          inactive: 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
        };
      default:
        return {
          container: 'bg-gray-900 rounded-lg',
          tab: `${sizeClasses[size]} rounded-lg font-medium transition-all duration-200`,
          active: 'bg-gray-700 text-white',
          inactive: 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <div className={`${className}`}>
      {/* Tab Navigation */}
      <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} ${variantClasses.container}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                relative flex items-center space-x-2 
                ${variantClasses.tab}
                ${isActive ? variantClasses.active : variantClasses.inactive}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {tab.badge}
                </span>
              )}

              {/* Animated indicator for underline variant */}
              {variant === 'underline' && isActive && animated && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  layoutId="tab-indicator"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Tab Content Component with animations
 */
export const TabContent: React.FC<TabContentProps> = ({
  children,
  className = '',
  animated = true
}) => {
  if (!animated) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Complete Tabbed Interface with Content
 */
export interface TabbedInterfaceProps extends TabsProps {
  contentClassName?: string;
}

export const TabbedInterface: React.FC<TabbedInterfaceProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className = '',
  contentClassName = '',
  animated = true
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  const activeTab = controlledActiveTab || internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        variant={variant}
        size={size}
        animated={animated}
      />
      
      <div className={`mt-4 ${contentClassName}`}>
        <AnimatePresence mode="wait">
          {activeTabContent && (
            <TabContent key={activeTab} animated={animated}>
              {activeTabContent}
            </TabContent>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/**
 * Intelligence Tabs - Specialized for WeeklyTargetAccounts
 */
export const IntelligenceTabs: React.FC<IntelligenceTabsProps> = ({
  painPoints,
  initiatives,
  solutions,
  contacts,
  className = ''
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const tabs: TabItem[] = [
    {
      id: 'pain-points',
      label: 'Pain Points',
      badge: painPoints.length,
      content: (
        <div className="space-y-3">
          {painPoints.map((pain) => (
            <div key={pain.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-300 flex-1">{pain.description}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getSeverityColor(pain.severity)} bg-gray-700`}>
                  {pain.severity}
                </span>
              </div>
            </div>
          ))}
          {painPoints.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No pain points identified yet
            </div>
          )}
        </div>
      )
    },
    {
      id: 'initiatives',
      label: 'Initiatives',
      badge: initiatives.length,
      content: (
        <div className="space-y-3">
          {initiatives.map((initiative) => (
            <div key={initiative.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-300 flex-1">{initiative.initiative}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getPriorityColor(initiative.priority)} bg-gray-700`}>
                  {initiative.priority}
                </span>
              </div>
            </div>
          ))}
          {initiatives.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No strategic initiatives identified yet
            </div>
          )}
        </div>
      )
    },
    {
      id: 'solutions',
      label: 'Solutions',
      badge: solutions.length,
      content: (
        <div className="space-y-3">
          {solutions.map((solution) => (
            <div key={solution.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-300 flex-1">{solution.reason}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getConfidenceColor(solution.confidence)} bg-gray-700`}>
                  {solution.confidence}% confidence
                </span>
              </div>
            </div>
          ))}
          {solutions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No solution mappings identified yet
            </div>
          )}
        </div>
      )
    },
    {
      id: 'contacts',
      label: 'Contacts',
      badge: contacts.length,
      content: (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {contact.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-400">{contact.role}</p>
                </div>
              </div>
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No key contacts identified yet
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className={className}>
      <TabbedInterface
        tabs={tabs}
        variant="pills"
        size="sm"
        contentClassName="max-h-80 overflow-y-auto"
      />
    </div>
  );
};

// Export all components
export default Tabs;