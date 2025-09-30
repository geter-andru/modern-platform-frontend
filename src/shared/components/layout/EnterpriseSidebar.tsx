'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UserGroupIcon,
  CalculatorIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  TrophyIcon,
  SparklesIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useLogout } from '@/lib/hooks/useAPI';

interface EnterpriseSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const mainNavigation = [
  { 
    name: 'Revenue Intelligence', 
    href: '/dashboard', 
    icon: HomeIcon,
    description: 'Overview and insights',
    category: 'main'
  },
  { 
    name: 'Prospect Qualification', 
    href: '/icp', 
    icon: UserGroupIcon,
    description: 'Rate companies 1-100',
    category: 'tools'
  },
  { 
    name: 'Deal Value Calculator', 
    href: '/cost-calculator', 
    icon: CalculatorIcon,
    description: 'Show cost of waiting',
    category: 'tools'
  },
  { 
    name: 'Advanced Analytics', 
    href: '/analytics', 
    icon: ChartBarIcon,
    description: 'Predictive intelligence',
    category: 'tools'
  },
  { 
    name: 'Sales Materials', 
    href: '/exports', 
    icon: ArrowDownTrayIcon,
    description: 'Ready-to-use assets',
    category: 'tools'
  },
];

const quickActions = [
  {
    name: 'New Analysis',
    href: '/icp',
    icon: PlusIcon,
    description: 'Qualify a prospect'
  },
  {
    name: 'Search Materials',
    icon: MagnifyingGlassIcon,
    action: 'search'
  },
  {
    name: 'Export Center',
    href: '/exports',
    icon: ArrowDownTrayIcon,
    description: 'Download materials'
  }
];

const progressItems = [
  {
    name: 'Professional Development',
    icon: TrophyIcon,
    progress: 73,
    description: 'Customer Analysis: Advanced'
  },
  {
    name: 'Recent Activity',
    icon: ClockIcon,
    href: '/dashboard',
    description: 'View latest actions'
  }
];

export function EnterpriseSidebar({ isOpen, onClose, collapsed = false, onToggleCollapse }: EnterpriseSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const [searchFocused, setSearchFocused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  };

  const sidebarWidth = collapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: (isOpen || isDesktop) ? 0 : '-100%',
          width: collapsed ? 64 : 256,
        }}
        className={`fixed inset-y-0 left-0 z-50 ${sidebarWidth} bg-gray-900 shadow-xl lg:static lg:translate-x-0 lg:shadow-none`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
            {!collapsed && (
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H&S</span>
                </div>
                <div className="ml-3">
                  <div className="text-white font-semibold text-lg">Platform</div>
                  <div className="text-gray-400 text-xs">Revenue Intelligence</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              {/* Collapse toggle for desktop */}
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  {collapsed ? (
                    <ChevronRightIcon className="h-5 w-5" />
                  ) : (
                    <ChevronLeftIcon className="h-5 w-5" />
                  )}
                </button>
              )}
              
              {/* Close button for mobile */}
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          {!collapsed && (
            <div className="p-4">
              <div className={`relative transition-all duration-200 ${searchFocused ? 'ring-2 ring-blue-500' : ''}`}>
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search materials, data..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {/* Main Section */}
            <div className="mb-6">
              {!collapsed && (
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main
                </div>
              )}
              {mainNavigation.filter(item => item.category === 'main').map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    {!collapsed && (
                      <div className="ml-3 flex-1">
                        <div className="text-sm">{item.name}</div>
                        <div className={`text-xs ${active ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-400'}`}>
                          {item.description}
                        </div>
                      </div>
                    )}
                    {active && !collapsed && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Tools Section */}
            <div className="mb-6">
              {!collapsed && (
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Sales Tools
                </div>
              )}
              {mainNavigation.filter(item => item.category === 'tools').map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    {!collapsed && (
                      <div className="ml-3 flex-1">
                        <div className="text-sm">{item.name}</div>
                        <div className={`text-xs ${active ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-400'}`}>
                          {item.description}
                        </div>
                      </div>
                    )}
                    {active && !collapsed && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            {!collapsed && (
              <div className="mb-6">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Quick Actions
                </div>
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => action.href && router.push(action.href)}
                    className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <action.icon className="h-4 w-4 mr-3 text-gray-400 group-hover:text-white" />
                    <span>{action.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Progress Section */}
            {!collapsed && (
              <div className="mb-6">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Development
                </div>
                {progressItems.map((item) => (
                  <div key={item.name} className="px-3 py-2">
                    <div className="flex items-center mb-2">
                      <item.icon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-300">{item.name}</span>
                    </div>
                    {item.progress && (
                      <div className="ml-6">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>{item.description}</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="bg-blue-500 h-1.5 rounded-full"
                          />
                        </div>
                      </div>
                    )}
                    {item.href && (
                      <Link
                        href={item.href}
                        className="block ml-6 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {item.description}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 p-3 space-y-1">
            <Link
              href="/settings"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
              {!collapsed && <span>Settings</span>}
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-gray-400" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}