'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Target, 
  Calculator, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Search,
  Menu,
  X,
  ClipboardCheck,
  Lock
} from 'lucide-react';

// TypeScript interfaces
interface ModernSidebarLayoutProps {
  children: React.ReactNode;
  customerId: string;
  activeRoute?: string;
}

interface CustomerData {
  customerName?: string;
  paymentStatus?: string;
  isAdmin?: boolean;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  description: string;
  isPremium?: boolean;
  iconColor: string;
  isLocked: boolean;
  lockReason?: string;
}

/**
 * ModernSidebarLayout - Professional SaaS interface with fixed sidebar navigation
 * 
 * Features:
 * - Fixed 260px left sidebar with dark background (#1a1a1a)
 * - Main content area with fluid width and proper padding
 * - CSS Grid layout: grid-template-columns: 260px 1fr
 * - Persistent sidebar across all routes
 * - Modern header with 60px height
 * - Professional dark theme color scheme
 */

const ModernSidebarLayout: React.FC<ModernSidebarLayoutProps> = ({ 
  children, 
  customerId, 
  activeRoute = 'dashboard' 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch customer data from Airtable
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerId) {
        setLoading(false);
        return;
      }

      try {
        // For now, use mock customer data since the services are not fully implemented
        // TODO: Implement proper customer data fetching when services are ready
        const mockCustomerData: CustomerData = {
          customerName: customerId === 'dru78DR9789SDF862' ? 'Geter' : 
                       customerId === 'dru9K2L7M8N4P5Q6' ? 'Alex' : 'User',
          paymentStatus: customerId === 'dru78DR9789SDF862' ? 'Completed' : 'Pending',
          isAdmin: customerId === 'dru78DR9789SDF862'
        };
        setCustomerData(mockCustomerData);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setCustomerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  // Extract first name from full customer name
  const getFirstName = (fullName?: string) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };

  // Get user first name (from Airtable or fallback)
  const getUserFirstName = () => {
    if (customerData?.customerName) {
      return getFirstName(customerData.customerName);
    }
    
    // Fallback to hardcoded names if Airtable data unavailable
    const fallbackMap: Record<string, string> = {
      'dru78DR9789SDF862': 'Geter',
      'dru9K2L7M8N4P5Q6': 'Alex'
    };
    return fallbackMap[customerId] || 'User';
  };

  // Dynamic greeting that rotates based on time and customer ID
  const getDynamicGreeting = (customerId: string) => {
    const greetings = ['Hey there', 'Hi', 'Nice to see you again'];
    const hour = new Date().getHours();
    const customerIndex = customerId ? parseInt(customerId.replace('CUST_', '')) : 1;
    
    // Create a semi-random index based on hour and customer ID for variety
    const greetingIndex = (hour + customerIndex) % greetings.length;
    return greetings[greetingIndex];
  };

  const firstName = getUserFirstName();
  const greeting = getDynamicGreeting(customerId);

  // Check if user has completed payment (access control)
  const hasCompletedPayment = () => {
    // Admin users always have access
    if (customerId === 'dru78DR9789SDF862') {
      return true;
    }
    return customerData?.paymentStatus === 'Completed';
  };

  // Navigation items with access control based on payment status
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      route: '/customer/' + customerId + '/simplified/dashboard',
      description: 'Revenue Intelligence Overview',
      isPremium: true,
      iconColor: hasCompletedPayment() ? 'text-purple-400' : 'text-gray-500',
      isLocked: !hasCompletedPayment(),
      lockReason: 'Requires payment to access full dashboard'
    },
    {
      id: 'assessment',
      label: 'Assessment Results',
      icon: ClipboardCheck,
      route: '/customer/' + customerId + '/simplified/assessment',
      description: 'Revenue Readiness Analysis',
      iconColor: 'text-cyan-400', // Always accessible for assessment takers
      isLocked: false, // Always unlocked for assessment takers
      lockReason: undefined
    },
    {
      id: 'icp',
      label: 'ICP Analysis',
      icon: Target,
      route: '/customer/' + customerId + '/simplified/icp',
      description: 'Ideal Customer Profiling',
      iconColor: hasCompletedPayment() ? 'text-blue-400' : 'text-gray-500',
      isLocked: !hasCompletedPayment(),
      lockReason: 'Upgrade to access ICP Analysis tools'
    },
    {
      id: 'financial',
      label: 'Financial Impact',
      icon: Calculator,
      route: '/customer/' + customerId + '/simplified/financial',
      description: 'ROI & Cost Analysis',
      iconColor: hasCompletedPayment() ? 'text-green-400' : 'text-gray-500',
      isLocked: !hasCompletedPayment(),
      lockReason: 'Upgrade to access Cost Calculator'
    },
    {
      id: 'resources',
      label: 'Resource Library',
      icon: FileText,
      route: '/customer/' + customerId + '/simplified/resources',
      description: 'Templates & Documentation',
      iconColor: hasCompletedPayment() ? 'text-orange-400' : 'text-gray-500',
      isLocked: !hasCompletedPayment(),
      lockReason: 'Upgrade to access Resource Library'
    }
  ];

  const sidebarWidth = sidebarCollapsed ? '72px' : '260px';

  // Handle mobile responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(false); // Always show full sidebar on mobile (when open)
        setMobileMenuOpen(false); // Close mobile menu on resize
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic components that will be imported
  const [QuickActionsGrid, setQuickActionsGrid] = useState<React.ComponentType<any> | null>(null);
  const [MilestoneTrackerWidget, setMilestoneTrackerWidget] = useState<React.ComponentType<any> | null>(null);

  // Load dynamic components
  useEffect(() => {
    const loadComponents = async () => {
      try {
        // TODO: Re-enable when QuickActionsGrid and MilestoneTrackerWidget are implemented
        // const [quickActions, milestones] = await Promise.all([
        //   import('../../simplified/cards/QuickActionsGrid'),
        //   import('../../simplified/cards/MilestoneTrackerWidget')
        // ]);
        // setQuickActionsGrid(() => quickActions.default);
        // setMilestoneTrackerWidget(() => milestones.default);
        console.log('Dynamic sidebar components disabled for build');
      } catch (error) {
        console.error('Failed to load dynamic components:', error);
      }
    };

    loadComponents();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between px-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              {loading ? (
                <div className="animate-pulse bg-gray-700 h-4 w-20 rounded mb-1"></div>
              ) : (
                <div className="text-sm font-semibold text-white">{greeting} {firstName}!</div>
              )}
              <div className="text-xs text-gray-400">H&S Revenue</div>
            </div>
          </div>

          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {customerId ? customerId.charAt(customerId.length - 1) : 'U'}
            </span>
          </div>
        </header>

        {/* Mobile Overlay Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-16 left-0 bottom-0 w-80 bg-[#1a1a1a] border-r border-gray-800 z-50 overflow-y-auto"
              >
                <nav className="p-4 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeRoute === item.id;
                    
                    return (
                      <a
                        key={item.id}
                        href={item.route}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          block px-4 py-3 rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300' 
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : item.iconColor || 'text-gray-400'}`} />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{item.label}</span>
                              {item.isPremium && (
                                <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-blue-500 rounded text-white font-medium">
                                  PRO
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Main Content */}
        <main className="p-4">
          {children}
        </main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid min-h-screen" style={{
        gridTemplateColumns: `${sidebarWidth} 1fr`,
        transition: 'grid-template-columns 0.3s ease'
      }}>
        {/* Fixed Left Sidebar */}
        <motion.aside 
          className="bg-[#1a1a1a] border-r border-gray-800 flex flex-col"
          initial={{ width: sidebarCollapsed ? 72 : 260 }}
          animate={{ width: sidebarCollapsed ? 72 : 260 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">H&S Revenue</div>
                  <div className="text-xs text-gray-400">Intelligence</div>
                </div>
              </motion.div>
            )}
            
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="py-4 space-y-4">
            {/* Dashboard - standalone */}
            {navigationItems.filter(item => item.id === 'dashboard').map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  className={`
                    mx-2 px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-all duration-200 relative
                    ${isActive 
                      ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300' 
                      : item.isLocked 
                        ? 'text-gray-500 cursor-not-allowed opacity-60' 
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white cursor-pointer'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}
                    ${item.isLocked ? 'grayscale' : ''}
                  `}
                  whileHover={item.isLocked ? {} : { scale: 1.02 }}
                  whileTap={item.isLocked ? {} : { scale: 0.98 }}
                  onClick={(e) => {
                    if (item.isLocked) {
                      e.preventDefault();
                      // You could show a tooltip or modal here
                    } else {
                      window.location.href = item.route;
                    }
                  }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : item.iconColor || 'text-gray-400'}`} />
                  
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium truncate">{item.label}</span>
                        {item.isPremium && !item.isLocked && (
                          <span className="px-1.5 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-blue-500 rounded text-white font-medium">
                            PRO
                          </span>
                        )}
                        {item.isLocked && (
                          <Lock className="w-3 h-3 text-gray-500" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {item.isLocked ? item.lockReason : item.description}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
            
            {/* Customer Intelligence Tools section */}
            {!sidebarCollapsed && (
              <div className="px-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Customer Intelligence Tools
                </h3>
              </div>
            )}
            
            <div className={sidebarCollapsed ? '' : 'space-y-1'}>
              {navigationItems.filter(item => item.id !== 'dashboard').map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    className={`
                      mx-2 px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-all duration-200 relative
                      ${isActive 
                        ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300' 
                        : item.isLocked 
                          ? 'text-gray-500 cursor-not-allowed opacity-60' 
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white cursor-pointer'
                      }
                      ${sidebarCollapsed ? 'justify-center' : ''}
                      ${item.isLocked ? 'grayscale' : ''}
                    `}
                    whileHover={item.isLocked ? {} : { scale: 1.02 }}
                    whileTap={item.isLocked ? {} : { scale: 0.98 }}
                    onClick={(e) => {
                      if (item.isLocked) {
                        e.preventDefault();
                        // You could show a tooltip or modal here
                      } else {
                        window.location.href = item.route;
                      }
                    }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : item.iconColor || 'text-gray-400'}`} />
                    
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium truncate">{item.label}</span>
                          {item.isPremium && !item.isLocked && (
                            <span className="px-1.5 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-blue-500 rounded text-white font-medium">
                              PRO
                            </span>
                          )}
                          {item.isLocked && (
                            <Lock className="w-3 h-3 text-gray-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {item.isLocked ? item.lockReason : item.description}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </nav>

          {/* Milestone Tracker Section - positioned right after navigation */}
          {!sidebarCollapsed && MilestoneTrackerWidget && (
            <div className="px-4 pb-4 border-b border-gray-800">
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Progress Tracking
                </h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <MilestoneTrackerWidget />
              </div>
            </div>
          )}

          {/* Quick Actions Section - positioned right after milestone tracker */}
          {!sidebarCollapsed && QuickActionsGrid && (
            <div className="px-4 pb-4 border-b border-gray-800">
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Quick Actions
                </h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <QuickActionsGrid className="space-y-1" />
              </div>
            </div>
          )}

          {/* Flexible spacer to push footer to bottom */}
          <div className="flex-1"></div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-800">
            {!sidebarCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">Customer {customerId}</div>
                  <div className="text-xs text-gray-400">Premium Access</div>
                </div>
                <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <button className="w-full p-2 rounded-lg hover:bg-gray-700 transition-colors flex justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex flex-col min-h-screen">
          {/* Clean Header - 60px height */}
          <header className="h-16 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between px-6">
            {/* Personalized Greeting */}
            <div className="flex items-center space-x-4">
              <div>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse bg-gray-700 h-5 w-24 rounded"></div>
                  </div>
                ) : (
                  <h1 className="text-lg font-semibold text-white">{greeting} {firstName}!</h1>
                )}
                <p className="text-xs text-gray-400">Revenue Intelligence Dashboard</p>
              </div>
            </div>

            {/* Search and Quick Actions */}
            <div className="flex items-center space-x-4 flex-1 justify-center">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search intelligence..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {customerId ? customerId.charAt(customerId.length - 1) : 'U'}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content with Fluid Width and Proper Padding */}
          <main className="flex-1 bg-[#0f0f0f] p-6">
            <div className="max-w-none mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ModernSidebarLayout;