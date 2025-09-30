'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChevronRightIcon,
  Bars3Icon,
  PlusIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface EnterpriseHeaderProps {
  onMenuClick: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
}

const pathMapping: Record<string, { title: string; parent?: { title: string; href: string } }> = {
  '/dashboard': { title: 'Revenue Intelligence' },
  '/icp': { title: 'Prospect Qualification', parent: { title: 'Sales Tools', href: '/dashboard' } },
  '/cost-calculator': { title: 'Deal Value Calculator', parent: { title: 'Sales Tools', href: '/dashboard' } },
  '/analytics': { title: 'Advanced Analytics', parent: { title: 'Sales Tools', href: '/dashboard' } },
  '/exports': { title: 'Sales Materials', parent: { title: 'Sales Tools', href: '/dashboard' } },
  '/settings': { title: 'Settings' },
};

const quickActions = [
  {
    name: 'New Analysis',
    href: '/icp',
    icon: PlusIcon,
    description: 'Qualify a prospect',
    hotkey: 'N'
  },
  {
    name: 'Export Materials',
    href: '/exports',
    icon: MagnifyingGlassIcon,
    description: 'Download sales assets',
    hotkey: 'E'
  },
];

export function EnterpriseHeader({ onMenuClick, searchValue = '', onSearchChange, onSearchSubmit }: EnterpriseHeaderProps) {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [notificationCount] = useState(3);

  const currentPage = pathMapping[pathname] || { title: 'Unknown Page' };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchSubmit?.(searchValue);
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
    }
  };

  const breadcrumbs = [];
  if (currentPage.parent) {
    breadcrumbs.push(currentPage.parent);
  }
  breadcrumbs.push({ title: currentPage.title, href: pathname });

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      {/* Left Section - Menu & Breadcrumbs */}
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-gray-900">{item.title}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile page title */}
        <div className="sm:hidden">
          <h1 className="text-lg font-semibold text-gray-900">{currentPage.title}</h1>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-lg mx-4 lg:mx-8">
        <div className={`relative transition-all duration-200 ${searchFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials, customers, data..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
          />
          {searchFocused && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border">
                ↵
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="flex items-center space-x-3">
        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="hidden lg:flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Quick Actions
          </button>

          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div className="p-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    onClick={() => setShowQuickActions(false)}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <action.icon className="h-4 w-4 mr-3 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium">{action.name}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                    <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 border rounded">
                      ⌘{action.hotkey}
                    </kbd>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <BellIcon className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          className="hidden lg:flex p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </Link>

        {/* User Profile */}
        <button className="flex items-center space-x-2 p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <UserCircleIcon className="h-6 w-6 text-gray-500" />
          <span className="hidden lg:block text-sm font-medium">Sarah C.</span>
        </button>
      </div>

      {/* Click outside to close quick actions */}
      {showQuickActions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowQuickActions(false)}
        />
      )}
    </header>
  );
}