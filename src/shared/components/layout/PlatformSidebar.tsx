import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Home, 
  BarChart3, 
  Target, 
  Users, 
  FileText, 
  Zap, 
  Settings, 
  X,
  ChevronRight,
  Lock,
  CheckCircle
} from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href: string
  path?: string
  unlocked: boolean
  requirement?: string
  status?: string
  color?: string
  name?: string
  description?: string
}

interface PlatformSidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    unlocked: true
  },
  {
    id: 'icp-analysis',
    label: 'ICP Analysis',
    icon: Target,
    href: '/icp-analysis',
    unlocked: true
  },
  {
    id: 'cost-calculator',
    label: 'Cost Calculator',
    icon: BarChart3,
    href: '/cost-calculator',
    unlocked: true
  },
  {
    id: 'business-case',
    label: 'Business Case',
    icon: FileText,
    href: '/business-case',
    unlocked: false,
    requirement: 'Complete ICP Analysis'
  },
  {
    id: 'competitive-analysis',
    label: 'Competitive Analysis',
    icon: Users,
    href: '/competitive-analysis',
    unlocked: false,
    requirement: 'Complete Cost Calculator'
  }
]

export default function PlatformSidebar({
  isOpen,
  onClose,
  className = ''
}: PlatformSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (href: string) => {
    router.push(href)
    onClose()
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${
        status === 'completed' ? 'bg-green-100 text-green-800' :
        status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    )
  }
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background-darker bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-full w-80 bg-background-secondary z-50 lg:relative lg:translate-x-0 lg:z-auto ${className}`}
      >
        <div className="flex flex-col h-full">
          
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  H&S Platform
                </h2>
                <p className="text-sm text-text-muted">
                  Revenue Intelligence
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              
              <button
                onClick={() => router.push('/dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  pathname === '/dashboard' || pathname === '/dashboard/'
                    ? 'bg-brand-primary/20 text-brand-primary'
                    : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Overview</span>
              </button>

              <div className="pt-4">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Core Tools
                </h3>
                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.path;
                    const IconComponent = item.icon;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleNavigation(item.href)}
                        disabled={item.status !== 'available'}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                          isActive
                            ? 'bg-brand-primary/20 text-brand-primary'
                            : item.status === 'available'
                            ? 'text-text-secondary hover:bg-surface-hover'
                            : 'text-text-disabled cursor-not-allowed'
                        }`}
                        whileHover={item.status === 'available' ? { scale: 1.02 } : {}}
                        whileTap={item.status === 'available' ? { scale: 0.98 } : {}}
                      >
                        <IconComponent className={`w-5 h-5 ${item.color}`} />
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.name}</span>
                            {getStatusBadge(item.status)}
                          </div>
                          <p className="text-xs text-text-muted mt-1">
                            {item.description}
                          </p>
                        </div>
                        {item.status === 'available' && (
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          <div className="p-4">
            <div className="bg-gradient-primary/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-brand-primary" />
                <span className="text-sm font-medium text-text-primary">
                  Cumulative Intelligence
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Each tool builds upon previous insights for unmatched personalization
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
