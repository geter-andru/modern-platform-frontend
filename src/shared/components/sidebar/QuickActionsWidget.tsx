'use client';

import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
  Download,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useAuth } from '@/app/lib/auth';
import { useCompoundHover } from '../../utils/compound-hover';
import { useRouter, usePathname } from 'next/navigation';
import { StaggeredEntrance, StaggeredItem } from '../../utils/staggered-entrance';

interface QuickActionsWidgetProps {
  collapsed: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description: string;
  badge?: string;
  primary?: boolean;
}

export function QuickActionsWidget({ collapsed }: QuickActionsWidgetProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Context-aware actions based on current page
  const getQuickActions = (): QuickAction[] => {
    const basePath = pathname?.split('/')[1] || '';

    switch (basePath) {
      case 'dashboard':
        return [
          {
            id: 'start-assessment',
            label: 'Start Assessment',
            icon: Sparkles,
            href: '/assessment',
            description: 'Get buyer intelligence',
            primary: true,
          },
          {
            id: 'view-icp',
            label: 'ICP Analysis',
            icon: Users,
            href: '/icp',
            description: 'View personas',
          },
          {
            id: 'resources',
            label: 'Resources',
            icon: FileText,
            href: '/resources',
            description: 'Access materials',
          },
        ];

      case 'icp':
        return [
          {
            id: 'export-pdf',
            label: 'Export PDF',
            icon: Download,
            href: '/exports',
            description: 'Download report',
            primary: true,
          },
          {
            id: 'view-analytics',
            label: 'Analytics',
            icon: BarChart3,
            href: '/analytics',
            description: 'View insights',
          },
          {
            id: 'resources',
            label: 'Resources',
            icon: FileText,
            href: '/resources',
            description: 'Get materials',
          },
        ];

      case 'assessment':
        return [
          {
            id: 'view-icp',
            label: 'View ICP',
            icon: Users,
            href: '/icp',
            description: 'See personas',
            primary: true,
          },
          {
            id: 'export-results',
            label: 'Export',
            icon: Download,
            href: '/exports',
            description: 'Download report',
          },
          {
            id: 'resources',
            label: 'Resources',
            icon: FileText,
            href: '/resources',
            description: 'Access guides',
          },
        ];

      case 'resources':
        return [
          {
            id: 'start-assessment',
            label: 'Assessment',
            icon: Sparkles,
            href: '/assessment',
            description: 'Start analysis',
            primary: true,
          },
          {
            id: 'view-icp',
            label: 'ICP Tool',
            icon: Users,
            href: '/icp',
            description: 'View personas',
          },
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: BarChart3,
            href: '/dashboard',
            description: 'View progress',
          },
        ];

      default:
        return [
          {
            id: 'start-assessment',
            label: 'Assessment',
            icon: Sparkles,
            href: '/assessment',
            description: 'Get insights',
            primary: true,
          },
          {
            id: 'view-icp',
            label: 'ICP Tool',
            icon: Users,
            href: '/icp',
            description: 'Buyer personas',
          },
          {
            id: 'resources',
            label: 'Resources',
            icon: FileText,
            href: '/resources',
            description: 'Materials',
          },
        ];
    }
  };

  const quickActions = getQuickActions();

  if (!user) {
    return null;
  }

  if (collapsed) {
    // Compact view for collapsed sidebar - show only primary action
    const primaryAction = quickActions.find(a => a.primary) || quickActions[0];
    const ActionIcon = primaryAction.icon;

    return (
      <motion.button
        onClick={() => router.push(primaryAction.href)}
        className="w-full p-2 rounded-lg bg-[#00CED1]/10 hover:bg-[#00CED1]/20 border border-[#00CED1]/30 hover:border-[#00CED1]/50 transition-all duration-200 ease-elegant group hover-shimmer-subtle"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col items-center gap-1">
          <Zap className="w-5 h-5 text-[#00CED1]" />
          <ActionIcon className="w-4 h-4 text-[#00CED1]" />
        </div>
      </motion.button>
    );
  }

  // Expanded view
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="p-4 rounded-lg bg-surface/30 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-[#00CED1]" />
        <h3 className="body-small font-medium text-text-primary">Quick Actions</h3>
      </div>

      {/* Actions List */}
      <StaggeredEntrance delay={0.05} animation="fade">
        <div className="space-y-2">
          {quickActions.map((action) => (
            <QuickActionButton key={action.id} action={action} />
          ))}
        </div>
      </StaggeredEntrance>
    </motion.div>
  );
}

interface QuickActionButtonProps {
  action: QuickAction;
}

function QuickActionButton({ action }: QuickActionButtonProps) {
  const router = useRouter();
  const ActionIcon = action.icon;
  const buttonHover = useCompoundHover(action.primary ? 'medium' : 'subtle');

  return (
    <StaggeredItem>
      <motion.button
        onClick={() => router.push(action.href)}
        onMouseEnter={buttonHover.handleMouseEnter}
        onMouseLeave={buttonHover.handleMouseLeave}
        className={`
          w-full p-2.5 rounded-lg text-left
          transition-all duration-200 ease-elegant
          group
          ${action.primary
            ? 'bg-[#00CED1]/10 hover:bg-[#00CED1]/20 border border-[#00CED1]/30 hover:border-[#00CED1]/50 hover-shimmer-blue'
            : 'bg-background-elevated/30 hover:bg-background-elevated/50 border border-white/5 hover:border-white/10'
          }
        `}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2.5">
          <div className={`
            flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
            ${action.primary
              ? 'bg-[#00CED1]/20 group-hover:bg-[#00CED1]/30'
              : 'bg-surface/50 group-hover:bg-surface/70'
            }
            transition-colors
          `}>
            <ActionIcon className={`
              w-4 h-4
              ${action.primary ? 'text-[#00CED1]' : 'text-text-secondary group-hover:text-text-primary'}
              transition-colors
            `} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`
                body-small font-medium
                ${action.primary ? 'text-[#00CED1]' : 'text-text-primary'}
              `}>
                {action.label}
              </span>
              {action.badge && (
                <span className="body-small px-1.5 py-0.5 rounded bg-[#00CED1]/20 text-[#00CED1] border border-[#00CED1]/30">
                  {action.badge}
                </span>
              )}
            </div>
            <p className="body-small text-text-muted mt-0.5 truncate">
              {action.description}
            </p>
          </div>

          <ArrowRight className={`
            w-4 h-4 flex-shrink-0
            ${action.primary ? 'text-[#00CED1]' : 'text-text-subtle'}
            opacity-0 group-hover:opacity-100
            -translate-x-2 group-hover:translate-x-0
            transition-all duration-200
          `} />
        </div>
      </motion.button>
    </StaggeredItem>
  );
}
