'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  HelpCircle,
  Command,
  Plus,
  Filter
} from 'lucide-react';

/**
 * AppHeader - Advanced application header with navigation and utilities
 * 
 * Features:
 * - Global search functionality
 * - User profile dropdown
 * - Notifications center
 * - Theme toggle
 * - Command palette trigger
 * - Breadcrumb navigation
 * - Quick actions menu
 * - Responsive design
 * - Keyboard shortcuts
 */

export interface HeaderNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface HeaderUser {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  initials?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export interface AppHeaderProps {
  title?: string;
  user?: HeaderUser;
  notifications?: HeaderNotification[];
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
  onUserAction?: (action: 'profile' | 'settings' | 'logout') => void;
  onNotificationClick?: (notification: HeaderNotification) => void;
  onThemeToggle?: () => void;
  quickActions?: QuickAction[];
  showSearch?: boolean;
  showNotifications?: boolean;
  showThemeToggle?: boolean;
  showQuickActions?: boolean;
  isDarkMode?: boolean;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  user,
  notifications = [],
  onSearch,
  onToggleSidebar,
  onUserAction,
  onNotificationClick,
  onThemeToggle,
  quickActions = [],
  showSearch = true,
  showNotifications = true,
  showThemeToggle = false,
  showQuickActions = false,
  isDarkMode = true,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setShowSearchInput(true);
        setTimeout(() => searchRef.current?.focus(), 100);
      }

      // Escape to close dropdowns
      if (event.key === 'Escape') {
        setShowSearchInput(false);
        setShowUserDropdown(false);
        setShowNotificationsPanel(false);
        setShowActionsMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotificationsPanel(false);
      }
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className={`
      sticky top-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800
      ${className}
    `}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Toggle */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Title */}
          {title && (
            <h1 className="text-xl font-semibold text-white truncate">
              {title}
            </h1>
          )}
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          {showSearch && (
            <div className="relative">
              {showSearchInput || searchQuery ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search... (Cmd+K)"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onBlur={() => !searchQuery && setShowSearchInput(false)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </motion.div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="flex items-center gap-2 w-full max-w-md px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-800 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Search...</span>
                  <div className="ml-auto flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-700 text-xs rounded">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 bg-gray-700 text-xs rounded">K</kbd>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          {showQuickActions && quickActions.length > 0 && (
            <div ref={actionsRef} className="relative">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Quick actions"
              >
                <Plus className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showActionsMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2"
                  >
                    <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Quick Actions
                    </div>
                    {quickActions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => {
                          action.action();
                          setShowActionsMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        {action.icon}
                        <span className="flex-1 text-left">{action.label}</span>
                        {action.shortcut && (
                          <kbd className="px-1.5 py-0.5 bg-gray-700 text-xs rounded">
                            {action.shortcut}
                          </kbd>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Theme Toggle */}
          {showThemeToggle && onThemeToggle && (
            <button
              onClick={onThemeToggle}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {/* Notifications */}
          {showNotifications && (
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotificationsPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl"
                  >
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs text-blue-400">{unreadCount} unread</span>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <button
                            key={notification.id}
                            onClick={() => {
                              onNotificationClick?.(notification);
                              setShowNotificationsPanel(false);
                            }}
                            className={`
                              w-full px-4 py-3 text-left border-b border-gray-700 last:border-b-0
                              hover:bg-gray-700 transition-colors
                              ${!notification.read ? 'bg-blue-500/5' : ''}
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`
                                w-2 h-2 rounded-full mt-2 flex-shrink-0
                                ${!notification.read ? 'bg-blue-400' : 'bg-gray-600'}
                              `} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.timestamp.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="px-4 py-3 border-t border-gray-700">
                        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Menu */}
          {user && (
            <div ref={userDropdownRef} className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                {/* Avatar */}
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.initials || user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      {user.role && (
                        <p className="text-xs text-gray-500 mt-1">{user.role}</p>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          onUserAction?.('profile');
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          onUserAction?.('settings');
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <hr className="border-gray-700 my-2" />
                      <button
                        onClick={() => {
                          onUserAction?.('logout');
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;