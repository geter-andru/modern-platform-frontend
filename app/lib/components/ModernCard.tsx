'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'premium';
  hover?: boolean;
}

export default function ModernCard({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true 
}: ModernCardProps) {
  const baseClasses = 'rounded-lg transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-gray-900 border border-gray-800',
    glass: 'bg-gray-900/50 backdrop-blur-sm border border-gray-700/50',
    premium: 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700'
  };

  const hoverClasses = hover ? 'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10' : '';

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function ModernCardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 border-b border-gray-800 ${className}`}>
      {children}
    </div>
  );
}

export function ModernCardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function ModernGridContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid gap-6 ${className}`}>
      {children}
    </div>
  );
}

export function ModernMetricCard({ 
  title, 
  value, 
  change, 
  trend,
  className = '' 
}: { 
  title: string; 
  value: string | number; 
  change?: string; 
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  return (
    <ModernCard className={className}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-400">{title}</h4>
          {change && trend && (
            <span className={`text-xs ${trendColors[trend]}`}>
              {change}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
      </div>
    </ModernCard>
  );
}