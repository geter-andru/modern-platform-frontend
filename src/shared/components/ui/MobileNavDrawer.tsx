'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  X, 
  Menu, 
  ChevronRight, 
  Home, 
  User, 
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react';

/**
 * MobileNavDrawer - Mobile-first navigation drawer
 * 
 * Features:
 * - Slide-in drawer animation
 * - Nested navigation support
 * - User profile section
 * - Touch-friendly interface
 * - Backdrop blur
 * - Gesture support
 * - Accessibility compliant
 */

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavItem[];
  action?: () => void;
  disabled?: boolean;
}

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
    initials?: string;
  };
  onUserAction?: (action: 'profile' | 'settings' | 'logout') => void;
  className?: string;
  overlayClassName?: string;
  drawerClassName?: string;
}

const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  navItems,
  userInfo,
  onUserAction,
  className = '',
  overlayClassName = '',
  drawerClassName = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Handle nested item expansion
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

  // Handle swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.touches[0].clientX;
    const distance = touchStart - touchEnd;
    
    // Close drawer on swipe left (distance > 50)
    if (distance > 50) {
      onClose();
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Navigation Item Component
  const NavItemComponent: React.FC<{
    item: NavItem;
    level?: number;
    onItemClick?: () => void;
  }> = ({ item, level = 0, onItemClick }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const paddingLeft = `${(level + 1) * 16}px`;

    const handleClick = () => {
      if (item.disabled) return;

      if (hasChildren) {
        toggleExpanded(item.id);
      } else if (item.action) {
        item.action();
        onItemClick?.();
      } else if (item.href) {
        onItemClick?.();
      }
    };

    return (
      <div>
        {item.href && !hasChildren ? (
          <Link
            href={item.href}
            onClick={onItemClick}
            className={`
              flex items-center justify-between p-4 text-white transition-colors
              ${item.disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-800 active:bg-gray-700'
              }
            `}
            style={{ paddingLeft }}
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <span className="text-gray-400">{item.icon}</span>
              )}
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        ) : (
          <button
            onClick={handleClick}
            disabled={item.disabled}
            className={`
              w-full flex items-center justify-between p-4 text-white transition-colors text-left
              ${item.disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-800 active:bg-gray-700'
              }
            `}
            style={{ paddingLeft }}
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <span className="text-gray-400">{item.icon}</span>
              )}
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            {hasChildren && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            )}
          </button>
        )}

        {/* Nested Items */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden bg-gray-800/50"
            >
              {item.children!.map(child => (
                <NavItemComponent
                  key={child.id}
                  item={child}
                  level={level + 1}
                  onItemClick={onItemClick}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`
              fixed inset-0 bg-black/50 backdrop-blur-sm z-50
              ${overlayClassName}
            `}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`
              fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-900 border-r border-gray-800 z-50
              shadow-2xl overflow-y-auto
              ${drawerClassName}
            `}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={`flex flex-col h-full ${className}`}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Navigation</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Section */}
              {userInfo && (
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    {userInfo.avatar ? (
                      <img
                        src={userInfo.avatar}
                        alt={userInfo.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {userInfo.initials || userInfo.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{userInfo.name}</p>
                      <p className="text-gray-400 text-sm">{userInfo.email}</p>
                    </div>
                  </div>

                  {/* User Actions */}
                  {onUserAction && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onUserAction('profile');
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          onUserAction('settings');
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto">
                {navItems.map(item => (
                  <NavItemComponent
                    key={item.id}
                    item={item}
                    onItemClick={onClose}
                  />
                ))}
              </div>

              {/* Footer Actions */}
              {onUserAction && (
                <div className="p-4 border-t border-gray-800">
                  <button
                    onClick={() => {
                      onUserAction('logout');
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}

              {/* Swipe Indicator */}
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-1 h-16 bg-gray-600 rounded-full opacity-30" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Hook to manage drawer state
export const useMobileNavDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

// Mobile Nav Toggle Button Component
export const MobileNavToggle: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors
        lg:hidden
        ${className}
      `}
      aria-label="Open navigation menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};

export default MobileNavDrawer;