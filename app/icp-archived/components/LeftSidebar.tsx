'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  Calculator,
  FolderOpen,
  CheckSquare,
  FileText,
  BarChart3,
  TrendingUp,
  Download,
  Play
} from 'lucide-react';

interface LeftSidebarProps {
  // No props needed - uses pathname for active state
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & insights',
    href: '/dashboard'
  },
  {
    id: 'icp',
    label: 'ICP Analysis',
    icon: Target,
    description: 'Buyer intelligence tools',
    href: '/icp-v3'
  },
  {
    id: 'cost',
    label: 'Cost Calculator',
    icon: Calculator,
    description: 'ROI & pricing analysis',
    href: '/cost-calculator'
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: FolderOpen,
    description: 'Sales enablement assets',
    href: '/resources'
  },
  {
    id: 'assessment',
    label: 'Assessment',
    icon: CheckSquare,
    description: 'Skills & competency eval',
    href: '/assessment'
  },
  {
    id: 'business-case',
    label: 'Business Case',
    icon: FileText,
    description: 'Value proposition builder',
    href: '/business-case'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Performance metrics',
    href: '/analytics'
  }
];

export default function LeftSidebar({}: LeftSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#111111] border-r border-white/5 flex flex-col overflow-y-auto sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">H&S Revenue</div>
            <div className="text-xs text-gray-400">Intelligence</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Platform Tools
          </h2>
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                mx-2 px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-all duration-200
                ${isActive
                  ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{item.label}</span>
                <div className="text-xs text-gray-500 truncate mt-0.5">
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Progress Tracker Section */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Platform Progress</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Overall Completion</span>
              <span className="text-white font-medium">45%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-gray-400">3 tools completed</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              <span className="text-gray-400">2 in progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="p-4 border-t border-white/5">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Quick Actions
          </h3>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Download className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Export Data</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Play className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Start Tour</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
