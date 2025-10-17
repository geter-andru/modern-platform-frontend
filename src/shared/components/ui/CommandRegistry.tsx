'use client';

import React from 'react';
import { 
  Home, 
  Users, 
  BarChart3, 
  Calculator, 
  FileText, 
  Settings, 
  Search,
  Download,
  Plus,
  HelpCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRegisterCommand } from './CommandProvider';

interface CommandRegistryProps {
  children: React.ReactNode;
}

export const CommandRegistry: React.FC<CommandRegistryProps> = ({ children }) => {
  const router = useRouter();

  // Navigation Commands
  useRegisterCommand({
    id: 'nav-dashboard',
    title: 'Dashboard',
    description: 'Go to main dashboard',
    category: 'Navigation',
    keywords: ['dashboard', 'home', 'main', 'overview'],
    action: () => router.push('/dashboard'),
    shortcut: '⌘1',
    icon: Home
  });

  useRegisterCommand({
    id: 'nav-icp',
    title: 'ICP Analysis',
    description: 'Open Ideal Customer Profile tool',
    category: 'Navigation',
    keywords: ['icp', 'analysis', 'customer', 'profile', 'ideal'],
    action: () => router.push('/icp'),
    shortcut: '⌘2',
    icon: Users
  });

  useRegisterCommand({
    id: 'nav-cost-calculator',
    title: 'Cost Calculator',
    description: 'Open Cost of Inaction Calculator',
    category: 'Navigation',
    keywords: ['cost', 'calculator', 'inaction', 'roi'],
    action: () => router.push('/cost-calculator'),
    shortcut: '⌘3',
    icon: Calculator
  });

  useRegisterCommand({
    id: 'nav-business-case',
    title: 'Business Case Builder',
    description: 'Create and manage business cases',
    category: 'Navigation',
    keywords: ['business', 'case', 'builder', 'proposal'],
    action: () => router.push('/business-case'),
    shortcut: '⌘4',
    icon: FileText
  });

  useRegisterCommand({
    id: 'nav-analytics',
    title: 'Analytics',
    description: 'View analytics and reports',
    category: 'Navigation',
    keywords: ['analytics', 'reports', 'data', 'insights'],
    action: () => router.push('/analytics'),
    shortcut: '⌘5',
    icon: BarChart3
  });

  useRegisterCommand({
    id: 'nav-exports',
    title: 'Exports',
    description: 'Access export and download center',
    category: 'Navigation',
    keywords: ['exports', 'download', 'files', 'data'],
    action: () => router.push('/exports'),
    shortcut: '⌘6',
    icon: Download
  });

  // Quick Actions
  useRegisterCommand({
    id: 'action-search-customers',
    title: 'Search Customers',
    description: 'Find and view customer records',
    category: 'Quick Actions',
    keywords: ['customers', 'search', 'find', 'records', 'people'],
    action: () => {
      // TODO: Implement customer search modal
      console.log('Open customer search');
    },
    shortcut: '⌘⇧C',
    icon: Search
  });

  useRegisterCommand({
    id: 'action-create-customer',
    title: 'Create Customer',
    description: 'Add new customer record',
    category: 'Quick Actions',
    keywords: ['create', 'new', 'customer', 'add', 'record'],
    action: () => {
      // TODO: Implement customer creation modal
      console.log('Open customer creation form');
    },
    shortcut: '⌘N',
    icon: Plus
  });

  useRegisterCommand({
    id: 'action-export-data',
    title: 'Export Data',
    description: 'Export current view to CSV/Excel',
    category: 'Quick Actions',
    keywords: ['export', 'download', 'csv', 'excel', 'data'],
    action: () => {
      // TODO: Implement export functionality
      console.log('Export current data');
    },
    shortcut: '⌘E',
    icon: Download
  });

  // Settings & Help
  useRegisterCommand({
    id: 'settings',
    title: 'Settings',
    description: 'Open application settings',
    category: 'Settings',
    keywords: ['settings', 'preferences', 'config', 'options'],
    action: () => {
      // TODO: Implement settings modal
      console.log('Open settings');
    },
    shortcut: '⌘,',
    icon: Settings
  });

  useRegisterCommand({
    id: 'help',
    title: 'Help & Support',
    description: 'Get help and contact support',
    category: 'Settings',
    keywords: ['help', 'support', 'documentation', 'guide'],
    action: () => {
      // TODO: Implement help modal or redirect to docs
      console.log('Open help');
    },
    shortcut: '⌘?',
    icon: HelpCircle
  });

  return <>{children}</>;
};

export default CommandRegistry;
