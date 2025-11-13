'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  FileText as DocumentTextIcon,
  PieChart as ChartPieIcon,
  Menu as MenuIcon,
  X as XMarkIcon,
  ShieldCheck as ShieldCheckIcon,
} from 'lucide-react';
import { useAuth } from '@/app/lib/auth';
import { BRAND_IDENTITY } from '@/app/lib/constants/brand-identity';
import { useCompoundHover } from '../../utils/compound-hover';
import { MilestoneTrackerWidget } from '../sidebar/MilestoneTrackerWidget';
import { QuickActionsWidget } from '../sidebar/QuickActionsWidget';
import { StaggeredEntrance } from '../../utils/staggered-entrance';

/**
 * ModernSidebarLayout - Phase 2.1 Implementation
 *
 * Sidebar-first architecture with Phase 1 animation system integration:
 * - Compound hover effects on all interactive elements
 * - Staggered entrance animations for nav items
 * - Shimmer effects on hover
 * - Smooth collapse/expand with custom easing
 * - Widget slots for Phase 2.3 (milestone tracker + quick actions)
 * - Mobile-responsive hamburger menu
 *
 * ARCHITECTURAL IMPROVEMENTS:
 * ✅ Uses new AuthProvider (@/app/lib/auth)
 * ✅ Phase 1 animation system (compound hover, staggered entrance, shimmer)
 * ✅ Modern design tokens (--text-primary, --surface-hover, etc.)
 * ✅ Custom easing curves (--ease-sophisticated)
 * ✅ Widget architecture for Phase 2.3
 * ✅ Responsive mobile menu with spring animations
 */

interface ModernSidebarLayoutProps {
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

// Navigation structure - organized by sections
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

// Flatten for pathname checking
const allItems = [
  ...navigationItems.main,
  ...navigationItems.salesTools,
  ...navigationItems.quickActions,
  ...navigationItems.development
];

/**
 * NavItem - Individual navigation item with Phase 1 enhancements
 */
const NavItem = ({
  item,
  isActive,
  onClick,
  collapsed
}: {
  item: NavigationItem;
  isActive: boolean;
  onClick: (id: string) => void;
  collapsed: boolean;
}) => {
  const Icon = item.icon;
  const itemHover = useCompoundHover('subtle');

  return (
    <Link
      href={item.href}
      onClick={() => onClick(item.id)}
      onMouseEnter={itemHover.handleMouseEnter}
      onMouseLeave={itemHover.handleMouseLeave}
      className={`
        w-full group relative flex items-center px-3 py-3 rounded-lg
        transition-all duration-200
        ${collapsed ? 'justify-center' : ''}
        ${isActive
          ? 'text-text-primary bg-surface-hover/50'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }
      `}
    >
      {/* Active state: Electric Teal accent */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-[#00CED1] rounded-r-full"
          layoutId="activeIndicator"
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30
          }}
        />
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

      {!collapsed && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="ml-3 flex-1 min-w-0"
          >
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
          </motion.div>
        </AnimatePresence>
      )}
    </Link>
  );
};

/**
 * SectionHeader - Collapsible section header
 */
const SectionHeader = ({ title, collapsed }: { title: string; collapsed: boolean }) => {
  if (collapsed) return null;

  return (
    <div className="px-3 py-2 mb-2">
      <h3 className="text-xs font-semibold tracking-wider uppercase text-text-muted">
        {title}
      </h3>
    </div>
  );
};

/**
 * WidgetSlot - Placeholder for Phase 2.3 widgets
 */
const WidgetSlot = ({
  collapsed,
  children
}: {
  collapsed: boolean;
  children?: React.ReactNode;
}) => {
  if (collapsed || !children) return null;

  return (
    <div className="px-4 py-3">
      {children}
    </div>
  );
};

/**
 * ModernSidebarLayout - Main component
 */
export function ModernSidebarLayout({ children }: ModernSidebarLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut, isAdmin } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Dynamically add admin navigation item for admin users
  const dynamicNavigationItems = React.useMemo(() => {
    const items = { ...navigationItems };

    // Add admin item to development section if user is admin
    if (isAdmin) {
      items.development = [
        ...navigationItems.development,
        {
          id: 'admin',
          label: 'Admin',
          description: 'Founding member dashboard',
          icon: ShieldCheckIcon,
          href: '/admin/founding-members',
          badge: null
        }
      ];
    }

    return items;
  }, [isAdmin]);

  // Flatten for pathname checking
  const allDynamicItems = React.useMemo(() => [
    ...dynamicNavigationItems.main,
    ...dynamicNavigationItems.salesTools,
    ...dynamicNavigationItems.quickActions,
    ...dynamicNavigationItems.development
  ], [dynamicNavigationItems]);

  // Compound hover effects
  const collapseButtonHover = useCompoundHover('medium');
  const quickActionHover = useCompoundHover('strong');
  const settingsHover = useCompoundHover('subtle');

  // Set active item based on current path
  useEffect(() => {
    const currentItem = allDynamicItems.find(item => item.href === pathname);
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  // Sidebar animation variants
  const sidebarVariants = {
    expanded: {
      width: '288px',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] // --ease-sophisticated
      }
    },
    collapsed: {
      width: '64px',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  };

  return (
    <div className="flex h-screen bg-background-primary overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex bg-background-secondary border-r border-surface/20 flex-col"
        variants={sidebarVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        initial={false}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface/20">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <Image
                src="/images/andru-logo-v2_192x192.png"
                alt="Andru"
                width={32}
                height={32}
                className="rounded-lg shadow-medium"
              />
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3"
                >
                  <h1 className="text-text-primary font-semibold text-sm">{BRAND_IDENTITY.SHORT_NAME}</h1>
                  <p className="text-text-muted text-xs">Revenue Intelligence</p>
                </motion.div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                onMouseEnter={collapseButtonHover.handleMouseEnter}
                onMouseLeave={collapseButtonHover.handleMouseLeave}
                className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search materials, data..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background-elevated border border-surface/30 rounded-lg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all hover-shimmer-subtle"
                />
              </div>
            </motion.div>
          )}

          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              onMouseEnter={collapseButtonHover.handleMouseEnter}
              onMouseLeave={collapseButtonHover.handleMouseLeave}
              className="mt-4 p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors w-full flex justify-center"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation - With staggered entrance on mount */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="space-y-6">
            {/* MAIN Section */}
            {dynamicNavigationItems.main.length > 0 && (
              <div className="space-y-1 px-2">
                <SectionHeader title="MAIN" collapsed={sidebarCollapsed} />
                <StaggeredEntrance delay={0.05} animation="fade">
                  {dynamicNavigationItems.main.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isActive={activeItem === item.id}
                      onClick={setActiveItem}
                      collapsed={sidebarCollapsed}
                    />
                  ))}
                </StaggeredEntrance>
              </div>
            )}

            {/* SALES TOOLS Section */}
            {dynamicNavigationItems.salesTools.length > 0 && (
              <div className="space-y-1 px-2">
                <SectionHeader title="SALES TOOLS" collapsed={sidebarCollapsed} />
                <StaggeredEntrance delay={0.05} animation="fade">
                  {dynamicNavigationItems.salesTools.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isActive={activeItem === item.id}
                      onClick={setActiveItem}
                      collapsed={sidebarCollapsed}
                    />
                  ))}
                </StaggeredEntrance>
              </div>
            )}

            {/* Widget Slot 1: Milestone Tracker */}
            <WidgetSlot collapsed={sidebarCollapsed}>
              <MilestoneTrackerWidget collapsed={sidebarCollapsed} />
            </WidgetSlot>

            {/* QUICK ACTIONS Section */}
            {dynamicNavigationItems.quickActions.length > 0 && (
              <div className="space-y-1 px-2">
                <SectionHeader title="QUICK ACTIONS" collapsed={sidebarCollapsed} />
                <StaggeredEntrance delay={0.05} animation="fade">
                  {dynamicNavigationItems.quickActions.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isActive={activeItem === item.id}
                      onClick={setActiveItem}
                      collapsed={sidebarCollapsed}
                    />
                  ))}
                </StaggeredEntrance>
              </div>
            )}

            {/* DEVELOPMENT Section */}
            {dynamicNavigationItems.development.length > 0 && (
              <div className="space-y-1 px-2">
                <SectionHeader title="DEVELOPMENT" collapsed={sidebarCollapsed} />
                <StaggeredEntrance delay={0.05} animation="fade">
                  {dynamicNavigationItems.development.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isActive={activeItem === item.id}
                      onClick={setActiveItem}
                      collapsed={sidebarCollapsed}
                    />
                  ))}
                </StaggeredEntrance>
              </div>
            )}

            {/* Widget Slot 2: Quick Actions Widget */}
            <WidgetSlot collapsed={sidebarCollapsed}>
              <QuickActionsWidget collapsed={sidebarCollapsed} />
            </WidgetSlot>
          </nav>
        </div>

        {/* Footer */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-surface/20"
          >
            <div className="flex items-center justify-between text-xs text-text-muted mb-3">
              <span>Customer ID: {user?.id ? user.id.slice(0, 8) + '...' : 'Loading...'}</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-accent-success rounded-full mr-1 animate-pulse"></div>
                <span className="text-text-primary">Live</span>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                href="/settings"
                onMouseEnter={settingsHover.handleMouseEnter}
                onMouseLeave={settingsHover.handleMouseLeave}
                className="flex items-center px-3 py-2 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-hover hover:text-text-primary transition-all hover-shimmer-subtle"
              >
                <Cog6ToothIcon className="h-4 w-4 mr-3 text-text-muted" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                onMouseEnter={settingsHover.handleMouseEnter}
                onMouseLeave={settingsHover.handleMouseLeave}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-hover hover:text-text-primary transition-all hover-shimmer-subtle"
              >
                <UserCircleIcon className="h-4 w-4 mr-3 text-text-muted" />
                Logout
              </button>
            </div>
          </motion.div>
        )}

        {sidebarCollapsed && (
          <div className="p-2 border-t border-surface/20">
            <Link
              href="/settings"
              className="flex justify-center p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </Link>
          </div>
        )}
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          onMouseEnter={quickActionHover.handleMouseEnter}
          onMouseLeave={quickActionHover.handleMouseLeave}
          className="p-3 bg-background-secondary border border-surface/20 rounded-lg text-text-primary shadow-medium"
        >
          {mobileMenuOpen ? <XMarkIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-80 bg-background-secondary border-r border-surface/20 z-40 overflow-y-auto"
            >
              {/* Mobile navigation - same content as desktop */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Image
                      src="/images/andru-logo-v2_192x192.png"
                      alt="Andru"
                      width={32}
                      height={32}
                      className="rounded-lg shadow-medium"
                    />
                    <div className="ml-3">
                      <h1 className="text-text-primary font-semibold text-sm">{BRAND_IDENTITY.SHORT_NAME}</h1>
                      <p className="text-text-muted text-xs">Revenue Intelligence</p>
                    </div>
                  </div>
                </div>

                <nav className="space-y-6 mt-6">
                  {/* Render all navigation sections */}
                  {dynamicNavigationItems.main.length > 0 && (
                    <div className="space-y-1">
                      <SectionHeader title="MAIN" collapsed={false} />
                      {dynamicNavigationItems.main.map((item) => (
                        <NavItem
                          key={item.id}
                          item={item}
                          isActive={activeItem === item.id}
                          onClick={(id) => {
                            setActiveItem(id);
                            setMobileMenuOpen(false);
                          }}
                          collapsed={false}
                        />
                      ))}
                    </div>
                  )}

                  {dynamicNavigationItems.salesTools.length > 0 && (
                    <div className="space-y-1">
                      <SectionHeader title="SALES TOOLS" collapsed={false} />
                      {dynamicNavigationItems.salesTools.map((item) => (
                        <NavItem
                          key={item.id}
                          item={item}
                          isActive={activeItem === item.id}
                          onClick={(id) => {
                            setActiveItem(id);
                            setMobileMenuOpen(false);
                          }}
                          collapsed={false}
                        />
                      ))}
                    </div>
                  )}

                  {dynamicNavigationItems.development.length > 0 && (
                    <div className="space-y-1">
                      <SectionHeader title="DEVELOPMENT" collapsed={false} />
                      {dynamicNavigationItems.development.map((item) => (
                        <NavItem
                          key={item.id}
                          item={item}
                          isActive={activeItem === item.id}
                          onClick={(id) => {
                            setActiveItem(id);
                            setMobileMenuOpen(false);
                          }}
                          collapsed={false}
                        />
                      ))}
                    </div>
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-background-elevated border-b border-surface/20 px-6 py-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-accent/5 to-brand-secondary/5"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <h1 className="text-xl font-semibold text-text-primary mr-8">Revenue Intelligence</h1>
                <div className="hidden md:block max-w-md w-full">
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-4.5 h-4.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search materials, customers, data..."
                      className="w-full pl-10 pr-4 py-2.5 border border-surface/30 bg-background-elevated rounded-lg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all hover-shimmer-subtle"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onMouseEnter={quickActionHover.handleMouseEnter}
                  onMouseLeave={quickActionHover.handleMouseLeave}
                  className="hidden md:flex px-4 py-2 bg-brand-primary text-text-primary text-sm font-medium rounded-lg transition-all items-center shadow-medium hover-shimmer-blue"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Quick Actions
                </button>

                <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-danger text-text-primary text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                <button className="hidden md:block p-2 text-text-secondary hover:text-text-primary transition-colors">
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>

                <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-surface/20">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center">
                    <UserCircleIcon className="w-4 h-4 text-text-primary" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    {user?.email ? user.email.split('@')[0] : 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 bg-background-primary overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--color-surface) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--color-surface);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: var(--color-surface-hover);
        }
      `}</style>
    </div>
  );
}
