'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  UserGroupIcon,
  CalculatorIcon,
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

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
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={action.href}
              className="group block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {action.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
                <PlayIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Custom action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 pt-6 border-t border-gray-200"
      >
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">
            Need help getting started?
          </p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
            Take Guided Tour
          </button>
        </div>
      </motion.div>
    </div>
  );
}