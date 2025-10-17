'use client';

import '../../styles/design-tokens.css';

import { motion } from 'framer-motion';
import {
  DollarSign as CurrencyDollarIcon,
  TrendingDown as ArrowTrendingDownIcon,
  TrendingUp as ArrowTrendingUpIcon,
  Download as ArrowDownTrayIcon,
  BarChart3 as ChartBarIcon,
  AlertTriangle as ExclamationTriangleIcon,
  Lightbulb as LightBulbIcon,
} from 'lucide-react';
import { useExportData } from '@/app/lib/hooks/useAPI';

interface CostCategory {
  name: string;
  amount: number;
  description: string;
  breakdown: Array<{
    item: string;
    value: number;
    unit: string;
  }>;
}

interface CostResults {
  totalCost: number;
  monthlyImpact: number;
  categories: CostCategory[];
  scenarios: Array<{
    name: string;
    totalCost: number;
    confidence: number;
  }>;
  recommendations: string[];
  insights: string[];
  calculatedAt: string;
  timeframe: string;
}

interface CostResultsProps {
  customerId: string;
  results?: CostResults;
}

export function CostResults({ customerId, results }: CostResultsProps) {
  const exportData = useExportData();

  const handleExport = (format: 'pdf' | 'excel') => {
    exportData.mutate({
      type: 'cost-calculator',
      data: {
        customerId,
        results,
        format,
        timestamp: new Date().toISOString(),
      },
    });
  };

  if (!results) {
    return (
      <div className="text-center py-12">
        <CurrencyDollarIcon className="h-16 w-16 text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No Calculation Results</h3>
        <p className="text-text-muted mb-6">
          Complete a cost calculation to see your financial impact analysis.
        </p>
        <button className="bg-brand-primary text-text-primary px-6 py-2 rounded-lg hover:bg-brand-primary/90">
          Start Calculation
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'lost revenue':
        return ArrowTrendingDownIcon;
      case 'operational inefficiency':
        return ChartBarIcon;
      case 'competitive disadvantage':
        return ArrowTrendingDownIcon;
      default:
        return CurrencyDollarIcon;
    }
  };

  const getCategoryColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'lost revenue':
        return 'text-accent-danger bg-accent-danger/10';
      case 'operational inefficiency':
        return 'text-accent-warning bg-accent-warning/10';
      case 'competitive disadvantage':
        return 'text-brand-accent bg-brand-accent/10';
      default:
        return 'text-brand-primary bg-brand-primary/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with export */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Cost of Inaction Analysis</h2>
          <p className="text-text-muted mt-1">
            Calculated on {new Date(results.calculatedAt).toLocaleDateString()} • {results.timeframe}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={exportData.isPending}
            className="flex items-center space-x-2 px-4 py-2 border border-surface rounded-lg hover:bg-surface-hover"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={exportData.isPending}
            className="flex items-center space-x-2 px-4 py-2 bg-brand-primary text-text-primary rounded-lg hover:bg-brand-primary/90"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Total Cost Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-8 text-text-primary"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-background-secondary bg-opacity-20 rounded-full mb-4">
            <ExclamationTriangleIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">Total Cost of Delay</h3>
          <div className="text-4xl font-bold mb-2">{formatCurrency(results.totalCost)}</div>
          <p className="text-text-primary/80">
            {formatCurrency(results.monthlyImpact)} per month during delay period
          </p>
        </div>
      </motion.div>

      {/* Cost Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.categories.map((category, index) => {
          const IconComponent = getCategoryIcon(category.name);
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background-secondary rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${getCategoryColor(category.name)}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-text-primary">{category.name}</h3>
                  <p className="text-2xl font-bold text-text-primary">{formatCurrency(category.amount)}</p>
                </div>
              </div>

              <p className="text-sm text-text-muted mb-4">{category.description}</p>

              <div className="space-y-2">
                {category.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-text-muted">{item.item}</span>
                    <span className="font-medium">
                      {typeof item.value === 'number' ? formatCurrency(item.value) : item.value} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Scenario Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-background-secondary rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-brand-primary" />
          Scenario Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.scenarios.map((scenario, index) => (
            <div key={scenario.name} className="text-center">
              <div className="bg-surface rounded-lg p-4">
                <h4 className="text-sm font-medium text-text-primary mb-2">{scenario.name}</h4>
                <div className="text-2xl font-bold text-text-primary">{formatCurrency(scenario.totalCost)}</div>
                <div className="text-sm text-text-muted mt-1">
                  {scenario.confidence}% confidence
                </div>
                <div className="mt-2 w-full bg-surface rounded-full h-2">
                  <div 
                    className="bg-brand-primary h-2 rounded-full"
                    style={{ width: `${scenario.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-background-secondary rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <LightBulbIcon className="h-5 w-5 mr-2 text-accent-warning" />
            Key Insights
          </h3>
          <ul className="space-y-3">
            {results.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start">
                <span className="w-2 h-2 bg-accent-warning rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm text-text-secondary">{insight}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-background-secondary rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-brand-secondary" />
            Recommendations
          </h3>
          <ul className="space-y-3">
            {results.recommendations.map((recommendation, idx) => (
              <li key={idx} className="flex items-start">
                <span className="w-2 h-2 bg-brand-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm text-text-secondary">{recommendation}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-xl p-6 text-center"
      >
        <h3 className="text-lg font-semibold text-text-primary mb-2">Ready to Take Action?</h3>
        <p className="text-text-muted mb-4">
          Use these insights to build a compelling business case for immediate implementation.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-brand-primary text-text-primary px-6 py-2 rounded-lg hover:bg-brand-primary/90">
            Create Business Case
          </button>
          <button className="border border-surface text-text-secondary px-6 py-2 rounded-lg hover:bg-surface-hover">
            Schedule Consultation
          </button>
        </div>
      </motion.div>
    </div>
  );
}