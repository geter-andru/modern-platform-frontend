'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users as UserGroupIcon,
  Calculator as CalculatorIcon,
  FileBarChart as DocumentChartBarIcon,
  Download as ArrowDownTrayIcon,
  Play as PlayIcon,
  BarChart3 as ChartBarIcon,
} from 'lucide-react';
import { GlassCard, GlassButton } from '../design-system';

interface QuickActionsProps {
  customerId: string;
}

const actions = [
  {
    name: 'Start ICP Analysis',
    description: 'Analyze your ideal customer profile',
    href: '/icp',
    icon: UserGroupIcon,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: 'Cost Calculator',
    description: 'Calculate cost of inaction',
    href: '/cost-calculator',
    icon: CalculatorIcon,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: 'Build Business Case',
    description: 'Create compelling proposals',
    href: '/business-case',
    icon: DocumentChartBarIcon,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    name: 'View Progress',
    description: 'Track your achievements',
    href: '/progress',
    icon: ChartBarIcon,
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    name: 'Export Reports',
    description: 'Download your analyses',
    href: '/exports',
    icon: ArrowDownTrayIcon,
    color: 'bg-indigo-500 hover:bg-indigo-600',
  },
];

export function QuickActions({ customerId }: QuickActionsProps) {
  return (
    <GlassCard className="p-8" hover glow>
      <h2 className="text-2xl font-bold text-white mb-8" style={{
        fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
        fontWeight: 'var(--font-weight-bold, 700)',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        Quick Actions
      </h2>
      
      <div className="space-y-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="group glass-card p-6 rounded-2xl cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-brand-primary to-blue-600 shadow-lg shadow-brand/30">
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand-primary transition-colors" style={{
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)',
                      fontWeight: 'var(--font-weight-semibold, 600)'
                    }}>
                      {action.name}
                    </h3>
                    <p className="text-sm text-white/70 mt-1" style={{
                      fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
                    }}>
                      {action.description}
                    </p>
                  </div>
                  <PlayIcon className="h-5 w-5 text-white/50 group-hover:text-brand-primary transition-colors" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Custom action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 pt-6 border-t border-white/10"
      >
        <div className="text-center">
          <p className="text-sm text-white/70 mb-4" style={{
            fontFamily: 'var(--font-family-primary, "Red Hat Display", sans-serif)'
          }}>
            Need help getting started?
          </p>
          <GlassButton 
            variant="primary" 
            size="md" 
            glow
            className="px-6 py-3"
          >
            Take Guided Tour
          </GlassButton>
        </div>
      </motion.div>
    </GlassCard>
  );
}