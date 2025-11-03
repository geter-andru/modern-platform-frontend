'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search as MagnifyingGlassIcon,
  Plus as PlusIcon,
  BarChart3 as ChartBarIcon,
  Calculator as CalculatorIcon,
  TrendingUp as ArrowTrendingUpIcon,
  Download as ArrowDownTrayIcon,
  Users as UserGroupIcon,
  Clock as ClockIcon,
  Zap as BoltIcon,
  Bell as BellIcon,
  Settings as Cog6ToothIcon,
  UserCircle as UserCircleIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  FileText as DocumentTextIcon,
  PieChart as ChartPieIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
} from 'lucide-react';
// import { useTheme } from '@/src/shared/components/theme/ThemeProvider'; // TODO: Create ThemeProvider component
import { useAuth } from '@/app/lib/auth';
import { BRAND_IDENTITY } from '@/app/lib/constants/brand-identity';

interface EnterpriseNavigationV2Props {
  children: React.ReactNode;
}

interface NavigationItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  badge?: string | null;
}

// Navigation structure with sections (STYLING DATA ONLY - no logic changes)
const navigationItems: {
  main: NavigationItem[];
  salesTools: NavigationItem[];
  quickActions: NavigationItem[];
  development: NavigationItem[];
} = {
  main: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Overview and insights',
      icon: HomeIcon,
      href: '/dashboard',
      badge: null
    }
  ],
  salesTools: [
    {
      id: 'icp',
      label: 'ICP Analysis',
      description: 'AI-powered buyer persona generation',
      icon: UserGroupIcon,
      href: '/icp',
      badge: null
    },
    {
      id: 'business-case',
      label: 'Business Case',
      description: 'Data-driven value proposition builder',
      icon: ChartPieIcon,
      href: '/business-case',
      badge: null
    },
    {
      id: 'cost-calculator',
      label: 'Cost Calculator',
      description: 'ROI and total cost analysis',
      icon: CalculatorIcon,
      href: '/cost-calculator',
      badge: null
    }
  ],
  quickActions: [],
  development: [
    {
      id: 'resources',
      label: 'Resources',
      description: 'Documentation and guides',
      icon: DocumentTextIcon,
      href: '/resources',
      badge: null
    },
    {
      id: 'assessment',
      label: 'Assessment',
      description: 'Sales competency evaluation',
      icon: ChartBarIcon,
      href: '/assessment',
      badge: null
    }
  ]
};

const NavItem = ({ item, isActive, onClick }: { item: any, isActive: boolean, onClick: (id: string) => void }) => {
  const Icon = item.icon;
  
  return (
    <Link
      href={item.href}
      onClick={() => onClick(item.id)}
      className={`
        w-full group relative flex items-center px-3 py-3 rounded-lg
        transition-all duration-200 ease-out
        ${isActive 
          ? 'text-text-primary' 
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }
      `}
    >
      {/* Active state: thin underline in Electric Teal (expert requirement - NO GLOW) */}
      {isActive && (
        <div className="absolute left-0 bottom-0 right-0 h-0.5 bg-[#00CED1]" />
      )}
      
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-md 
        transition-colors duration-200
        ${isActive 
          ? 'text-text-primary' 
          : 'text-text-muted group-hover:text-text-primary'
        }
      `}>
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`
            text-sm font-medium truncate
            ${isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}
          `}>
            {item.label}
          </span>
          {item.badge && (
            <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-[#00CED1]/20 text-[#00CED1]">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs mt-0.5 truncate text-text-muted">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="px-3 py-2 mb-2">
    <h3 className="text-xs font-semibold tracking-wider uppercase text-text-muted">
      {title}
    </h3>
  </div>
);

// Flatten sections for pathname checking (STYLING DATA ACCESS ONLY - no logic changes)
const allItems = [
  ...navigationItems.main,
  ...navigationItems.salesTools,
  ...navigationItems.quickActions,
  ...navigationItems.development
];

export function EnterpriseNavigationV2({ children }: EnterpriseNavigationV2Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
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

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className={`
        bg-background-secondary border-r border-transparent flex flex-col transition-all duration-200 ease-out
        ${sidebarCollapsed ? 'w-16' : 'w-72'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-transparent">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
                <span className="text-text-primary font-bold text-sm">A</span>
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <h1 className="text-text-primary font-semibold text-sm">{BRAND_IDENTITY.SHORT_NAME}</h1>
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
            {/* MAIN Section */}
            {navigationItems.main.length > 0 && (
              <div className="space-y-1 px-2">
                {!sidebarCollapsed && <SectionHeader title="MAIN" />}
                {navigationItems.main.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={setActiveItem}
                  />
                ))}
              </div>
            )}

            {/* SALES TOOLS Section */}
            {navigationItems.salesTools.length > 0 && (
              <div className="space-y-1 px-2">
                {!sidebarCollapsed && <SectionHeader title="SALES TOOLS" />}
                {navigationItems.salesTools.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={setActiveItem}
                  />
                ))}
              </div>
            )}

            {/* QUICK ACTIONS Section */}
            {navigationItems.quickActions.length > 0 && (
              <div className="space-y-1 px-2">
                {!sidebarCollapsed && <SectionHeader title="QUICK ACTIONS" />}
                {navigationItems.quickActions.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={setActiveItem}
                  />
                ))}
              </div>
            )}

            {/* DEVELOPMENT Section */}
            {navigationItems.development.length > 0 && (
              <div className="space-y-1 px-2">
                {!sidebarCollapsed && <SectionHeader title="DEVELOPMENT" />}
                {navigationItems.development.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={setActiveItem}
                  />
                ))}
              </div>
            )}
          </nav>
        </div>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-transparent">
            <div className="flex items-center justify-between text-xs text-text-muted mb-3">
              <span>Customer ID: {user?.id ? user.id.slice(0, 8) + '...' : 'Loading...'}</span>
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
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-background-elevated border-b border-transparent px-6 py-4 relative">
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
              
              <div className="flex items-center space-x-3 pl-4 border-l border-transparent">
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