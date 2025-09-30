'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Home,
  Settings,
  User,
  Bell,
  Search,
  Maximize2,
  Minimize2
} from 'lucide-react';

/**
 * Sidebar - Advanced sidebar navigation system
 * 
 * Features:
 * - Collapsible/expandable sidebar
 * - Nested navigation support
 * - User profile section
 * - Search functionality
 * - Badge and notification support
 * - Responsive behavior
 * - Keyboard navigation
 * - Custom branding area
 * - Multiple layout variants
 */

export interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: SidebarItem[];
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  initials?: string;
}

export interface SidebarProps {
  items: SidebarItem[];
  userProfile?: UserProfile;
  onUserAction?: (action: 'profile' | 'settings' | 'logout') => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  brandingArea?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'minimal' | 'compact';
  position?: 'left' | 'right';
  overlay?: boolean;
  showToggle?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  userProfile,
  onUserAction,
  isCollapsed = false,
  onToggle,
  showSearch = false,
  onSearch,
  brandingArea,
  className = '',
  variant = 'default',
  position = 'left',
  overlay = false,
  showToggle = true
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Filter items based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(items);
      return;
    }

    const filterItems = (itemList: SidebarItem[]): SidebarItem[] => {
      return itemList.filter(item => {
        const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase());
        const hasMatchingChildren = item.children && filterItems(item.children).length > 0;
        
        if (matchesSearch || hasMatchingChildren) {
          return {
            ...item,
            children: hasMatchingChildren ? filterItems(item.children!) : item.children
          };
        }
        
        return false;
      }).filter(Boolean) as SidebarItem[];
    };

    setFilteredItems(filterItems(items));
  }, [searchQuery, items]);

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  // Toggle expanded state
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Sidebar Item Component
  const SidebarItemComponent: React.FC<{
    item: SidebarItem;
    level?: number;
  }> = ({ item, level = 0 }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const indent = level * (isCollapsed ? 0 : 16);

    const ItemContent = () => (
      <div
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
          ${item.isActive 
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
            : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isCollapsed ? 'justify-center' : ''}
        `}
        style={{ paddingLeft: isCollapsed ? undefined : `${12 + indent}px` }}
      >
        {/* Icon */}
        {item.icon && (
          <span className={`
            flex-shrink-0 transition-colors
            ${item.isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}
          `}>
            {item.icon}
          </span>
        )}

        {/* Label and Badge */}
        {!isCollapsed && (
          <>
            <span className="flex-1 font-medium truncate">
              {item.label}
            </span>
            
            {/* Badge */}
            {item.badge && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full flex-shrink-0">
                {item.badge}
              </span>
            )}

            {/* Expand/Collapse Icon */}
            {hasChildren && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </motion.div>
            )}
          </>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
            {item.label}
            {item.badge && (
              <span className="ml-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </div>
    );

    const handleClick = () => {
      if (item.disabled) return;
      
      if (hasChildren) {
        toggleExpanded(item.id);
      }
      
      if (item.onClick) {
        item.onClick();
      }
    };

    return (
      <div>
        {item.href && !hasChildren ? (
          <Link href={item.href}>
            <ItemContent />
          </Link>
        ) : (
          <button 
            onClick={handleClick}
            disabled={item.disabled}
            className="w-full text-left"
          >
            <ItemContent />
          </button>
        )}

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {item.children!.map(child => (
                  <SidebarItemComponent
                    key={child.id}
                    item={child}
                    level={level + 1}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';
  const sidebarClasses = `
    ${sidebarWidth} bg-gray-900 border-r border-gray-800 transition-all duration-300
    ${position === 'right' ? 'border-l border-r-0' : ''}
    ${overlay ? 'fixed inset-y-0 z-40' : 'relative'}
    ${className}
  `;

  return (
    <>
      {/* Overlay backdrop for mobile */}
      {overlay && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={sidebarClasses}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`
            flex items-center gap-3 p-4 border-b border-gray-800
            ${isCollapsed ? 'justify-center' : 'justify-between'}
          `}>
            {/* Branding Area */}
            {!isCollapsed && brandingArea}
            
            {/* Toggle Button */}
            {showToggle && (
              <button
                onClick={onToggle}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Search */}
          {showSearch && !isCollapsed && (
            <div className="p-4 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {filteredItems.map(item => (
              <SidebarItemComponent key={item.id} item={item} />
            ))}
          </div>

          {/* User Profile */}
          {userProfile && (
            <div className="border-t border-gray-800 p-4">
              <div className={`
                flex items-center gap-3
                ${isCollapsed ? 'justify-center' : ''}
              `}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {userProfile.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {userProfile.initials || userProfile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info */}
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {userProfile.name}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {userProfile.role || userProfile.email}
                    </p>
                  </div>
                )}

                {/* User Actions Dropdown */}
                {onUserAction && !isCollapsed && (
                  <div className="relative group">
                    <button className="p-1 text-gray-400 hover:text-white rounded transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => onUserAction('profile')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded text-left transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        <button
                          onClick={() => onUserAction('settings')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded text-left transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <hr className="border-gray-700 my-1" />
                        <button
                          onClick={() => onUserAction('logout')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded text-left transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

// Mobile Sidebar Toggle Button
export interface MobileSidebarToggleProps {
  onClick: () => void;
  className?: string;
}

export const MobileSidebarToggle: React.FC<MobileSidebarToggleProps> = ({ 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors
        lg:hidden
        ${className}
      `}
      aria-label="Toggle navigation menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};

// Hook for sidebar state management
export const useSidebar = (defaultCollapsed = false) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggle = () => setIsCollapsed(!isCollapsed);
  const collapse = () => setIsCollapsed(true);
  const expand = () => setIsCollapsed(false);
  
  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return {
    isCollapsed,
    isMobileOpen,
    toggle,
    collapse,
    expand,
    openMobile,
    closeMobile,
    toggleMobile
  };
};

export default Sidebar;