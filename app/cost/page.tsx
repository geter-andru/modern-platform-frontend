'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calculator, TrendingUp, FileText, Clock, ArrowRight, Sparkles, Target, Users, BarChart3 } from 'lucide-react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';
import { Button } from '@/src/shared/components/ui/Button';

interface CostFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'available' | 'coming-soon' | 'premium';
  href?: string;
}

const costFeatures: CostFeature[] = [
  {
    id: 'cost-calculator',
    title: 'Cost Calculator',
    description: 'Calculate implementation costs and ROI for your ICP strategy',
    icon: Calculator,
    status: 'available',
    href: '/cost/calculator'
  },
  {
    id: 'business-case',
    title: 'Business Case Builder',
    description: 'Create compelling business cases with financial projections',
    icon: FileText,
    status: 'available',
    href: '/cost/business-case'
  },
  {
    id: 'roi-analyzer',
    title: 'ROI Analyzer',
    description: 'Analyze return on investment and financial impact',
    icon: TrendingUp,
    status: 'coming-soon'
  },
  {
    id: 'budget-planner',
    title: 'Budget Planner',
    description: 'Plan and allocate budgets for ICP implementation',
    icon: Target,
    status: 'coming-soon'
  },
  {
    id: 'cost-comparison',
    title: 'Cost Comparison',
    description: 'Compare costs across different implementation approaches',
    icon: BarChart3,
    status: 'premium'
  },
  {
    id: 'team-calculator',
    title: 'Team Size Calculator',
    description: 'Calculate optimal team sizes and resource requirements',
    icon: Users,
    status: 'premium'
  }
];

export default function CostPage() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-accent-success';
      case 'coming-soon':
        return 'text-accent-warning';
      case 'premium':
        return 'text-brand-accent';
      default:
        return 'text-text-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'coming-soon':
        return 'Coming Soon';
      case 'premium':
        return 'Premium';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="bg-background-elevated shadow-sm border-b border-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-brand-accent" />
                Cost Calculator & Business Case
              </h1>
              <p className="mt-2 text-text-muted">
                Calculate costs, build business cases, and analyze ROI for your ICP implementation
              </p>
            </div>
            <div className="flex items-center gap-2 text-accent-warning">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {costFeatures.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <ModernCard 
                  className={`p-6 h-full transition-all duration-300 ${
                    hoveredFeature === feature.id ? 'shadow-lg scale-105' : ''
                  } ${
                    feature.status === 'premium' ? 'border-purple-200 dark:border-purple-800' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${
                      feature.status === 'available' ? 'bg-green-100 dark:bg-green-900/20' :
                      feature.status === 'coming-soon' ? 'bg-orange-100 dark:bg-orange-900/20' :
                      'bg-purple-100 dark:bg-purple-900/20'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        feature.status === 'available' ? 'text-green-600 dark:text-green-400' :
                        feature.status === 'coming-soon' ? 'text-orange-600 dark:text-orange-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`} />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      feature.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      feature.status === 'coming-soon' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                    }`}>
                      {getStatusText(feature.status)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {feature.description}
                  </p>

                  <div className="mt-auto">
                    {feature.status === 'available' && feature.href ? (
                      <Button 
                        className="w-full"
                        onClick={() => window.location.href = feature.href!}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : feature.status === 'premium' ? (
                      <Button 
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Premium Feature
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </ModernCard>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12">
          <ModernCard className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Calculate Your ICP Investment?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start with our cost calculator to understand the financial impact of implementing your ICP strategy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/cost/calculator'}
                  className="px-8"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Start Cost Calculator
                </Button>
                <Button 
                  onClick={() => window.location.href = '/cost/business-case'}
                  variant="outline"
                  className="px-8"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Build Business Case
                </Button>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
}