'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChartBarIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  ClockIcon,
  BoltIcon,
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChevronRightIcon,
  HomeIcon,
  DocumentTextIcon,
  ChartPieIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { useLogout } from '@/lib/hooks/useAPI';
import { useTheme } from '@/src/shared/components/theme/ThemeProvider';

interface EnterpriseNavigationV2Props {
  children: React.ReactNode;
}

const navigationItems = [
  {
    id: 'icp',
    label: 'ICP',
    icon: UserGroupIcon,
    href: '/icp'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    href: '/dashboard'
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: DocumentTextIcon,
    href: '/resources'
  },
  {
    id: 'cost-calculator',
    label: 'Cost Calculator',
    icon: CalculatorIcon,
    href: '/cost'
  },
  {
    id: 'assessment',
    label: 'Assessment',
    icon: ChartBarIcon,
    href: '/assessment'
  }
];

const NavItem = ({ item, isActive, onClick }: { item: any, isActive: boolean, onClick: (id: string) => void }) => {
  const Icon = item.icon;
  
  return (
    <Link
      href={item.href}
      onClick={() => onClick(item.id)}
      className={`
        w-full group relative flex items-center px-3 py-3 rounded-lg transition-all duration-200 ease-out
        ${isActive 
          ? 'bg-brand-primary/10 text-text-primary shadow-sm' 
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }
      `}
    >
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-200
        ${isActive 
          ? 'bg-brand-primary/20 text-text-primary' 
          : 'text-text-muted group-hover:text-text-primary group-hover:bg-surface/30'
        }
      `}>
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <span className={`
          text-sm font-medium truncate
          ${isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}
        `}>
          {item.label}
        </span>
      </div>
      
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-brand-primary rounded-full" />
      )}
    </Link>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="px-3 py-2 mb-2">
    <h3 className="text-xs font-semibold tracking-wider uppercase text-white">
      {title}
    </h3>
  </div>
);

// Use the simplified navigation items directly
const allItems = navigationItems;

export function EnterpriseNavigationV2({ children }: EnterpriseNavigationV2Props) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Set active item based on current path
  useEffect(() => {
    const currentItem = allItems.find(item => item.href === pathname);
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className={`
        bg-background-secondary border-r border-surface flex flex-col transition-all duration-200 ease-out relative
        before:absolute before:inset-0 before:bg-gradient-to-b before:from-brand-primary/5 before:to-brand-accent/5 before:pointer-events-none
        ${sidebarCollapsed ? 'w-16' : 'w-72'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-surface relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-lg opacity-50"></div>
          <div className="relative">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
                <span className="text-text-primary font-bold text-sm">H&S</span>
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <h1 className="text-text-primary font-semibold text-sm">Platform</h1>
                  <p className="text-text-muted text-xs">Revenue Intelligence</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <ChevronRightIcon 
                className={`w-3.5 h-3.5 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`}
              />
            </button>
          </div>
          </div>
          
          {!sidebarCollapsed && (
            <div className="mt-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search materials, data..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background-elevated border border-surface rounded-lg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-6">
            <div className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeItem === item.id}
                  onClick={setActiveItem}
                />
              ))}
            </div>
          </nav>
        </div>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-surface relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-primary/5"></div>
            <div className="relative">
            <div className="flex items-center justify-between text-xs text-text-muted mb-3">
              <span>Customer ID: CUST_2</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-accent-success rounded-full mr-1"></div>
                <span className="text-text-primary">Live</span>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                href="/settings"
                className="flex items-center px-3 py-2 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-hover hover:text-text-primary transition-colors"
              >
                <Cog6ToothIcon className="h-4 w-4 mr-3 text-text-muted" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-hover hover:text-text-primary transition-colors"
              >
                <UserCircleIcon className="h-4 w-4 mr-3 text-text-muted" />
                Logout
              </button>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-background-elevated border-b border-surface px-6 py-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-accent/5 to-brand-secondary/5"></div>
          <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-text-primary mr-8">Revenue Intelligence</h1>
              <div className="max-w-md w-full">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-4.5 h-4.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search materials, customers, data..."
                    className="w-full pl-10 pr-4 py-2.5 border border-surface bg-background-elevated rounded-lg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-brand-primary text-text-primary text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-medium">
                <PlusIcon className="w-4 h-4 mr-2" />
                Quick Actions
              </button>
              
              <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
                <BellIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-danger text-text-primary text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-surface">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-4 h-4 text-text-primary" />
                </div>
                <span className="text-sm font-medium text-text-primary">Sarah C.</span>
              </div>
            </div>
          </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-background-primary">
          {children}
        </main>
      </div>
    </div>
  );
}