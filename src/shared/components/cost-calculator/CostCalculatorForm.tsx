'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  DollarSign as CurrencyDollarIcon,
  TrendingUp as ArrowTrendingUpIcon,
  Users as UserGroupIcon,
  Clock as ClockIcon,
  Sparkles as SparklesIcon,
  BarChart3 as ChartBarIcon,
} from 'lucide-react';
import { useCostCalculation, useAICostCalculation, useTrackAction } from '@/app/lib/hooks/useAPI';

// Import design tokens for component styling
import '../../styles/design-tokens.css';

interface CostFormData {
  // Revenue Impact
  averageDealSize: number;
  monthlyDeals: number;
  conversionRate: number;
  salesCycleLength: number;
  
  // Operational Costs
  employeeCount: number;
  averageSalary: number;
  operatingCosts: number;
  inefficiencyRate: number;
  
  // Competitive Impact
  marketShare: number;
  competitorAdvantage: number;
  customerRetention: number;
  
  // Timeline
  delayMonths: number;
  implementationTime: number;
  
  // Additional Context
  industry: string;
  companySize: string;
  currentSolution: string;
  painPoints: string[];
}

interface CostCalculatorFormProps {
  customerId: string;
  onCalculationComplete: (results: any) => void;
}

const industryOptions = [
  'Technology', 'Healthcare', 'Financial Services', 'Manufacturing',
  'Retail', 'Education', 'Professional Services', 'Other'
];

const painPointOptions = [
  'Manual processes', 'Data inconsistency', 'Poor visibility',
  'Slow decision making', 'Customer churn', 'Missed opportunities',
  'Resource waste', 'Compliance issues', 'Scalability problems'
];

export function CostCalculatorForm({ customerId, onCalculationComplete }: CostCalculatorFormProps) {
  const [useAI, setUseAI] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CostFormData>({
    defaultValues: {
      conversionRate: 0.15,
      inefficiencyRate: 0.12,
      competitorAdvantage: 0.08,
      customerRetention: 0.85,
      delayMonths: 6,
      implementationTime: 3,
    }
  });

  const costCalculation = useCostCalculation();
  const aiCostCalculation = useAICostCalculation();
  const trackAction = useTrackAction();

  const onSubmit = async (data: CostFormData) => {
    try {
      const payload = {
        customerId,
        ...data,
        useAI,
        timestamp: new Date().toISOString(),
      };

      let results;
      if (useAI) {
        results = await aiCostCalculation.mutateAsync(payload);
      } else {
        results = await costCalculation.mutateAsync(payload);
      }

      // Track completion
      trackAction.mutate({
        customerId,
        action: 'cost_calculation_completed',
        metadata: {
          useAI,
          totalCost: results.data?.costOfInaction || 0,
          delayMonths: data.delayMonths
        }
      });

      if (results.data) {
        onCalculationComplete(results.data);
      }
    } catch (error) {
      console.error('Failed to calculate costs:', error);
    }
  };

  const isLoading = costCalculation.isPending || aiCostCalculation.isPending;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      trackAction.mutate({
        customerId,
        action: 'cost_form_progress',
        metadata: { step: step + 1 }
      });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ArrowTrendingUpIcon className="h-12 w-12 text-brand-secondary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Revenue Impact</h2>
              <p className="text-text-muted">How does delay affect your revenue?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Average Deal Size ($)
                </label>
                <input
                  type="number"
                  {...register('averageDealSize', { required: 'Deal size is required', min: 1 })}
                  placeholder="25000"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {errors.averageDealSize && (
                  <p className="mt-1 text-sm text-accent-danger">{errors.averageDealSize.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Monthly Deals Closed
                </label>
                <input
                  type="number"
                  {...register('monthlyDeals', { required: 'Monthly deals is required', min: 0 })}
                  placeholder="5"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {errors.monthlyDeals && (
                  <p className="mt-1 text-sm text-accent-danger">{errors.monthlyDeals.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Conversion Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="1"
                  {...register('conversionRate', { required: 'Conversion rate is required', min: 0, max: 1 })}
                  placeholder="0.15"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                <p className="text-xs text-text-muted mt-1">Enter as decimal (e.g., 0.15 for 15%)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Sales Cycle Length (days)
                </label>
                <input
                  type="number"
                  {...register('salesCycleLength', { required: 'Sales cycle length is required', min: 1 })}
                  placeholder="90"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <UserGroupIcon className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Operational Costs</h2>
              <p className="text-text-muted">What are your current operational inefficiencies?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Employee Count
                </label>
                <input
                  type="number"
                  {...register('employeeCount', { required: 'Employee count is required', min: 1 })}
                  placeholder="50"
                  className="w-full bg-background-elevated border border-surface rounded-lg px-3 py-2 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Average Annual Salary ($)
                </label>
                <input
                  type="number"
                  {...register('averageSalary', { required: 'Average salary is required', min: 1 })}
                  placeholder="75000"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Monthly Operating Costs ($)
                </label>
                <input
                  type="number"
                  {...register('operatingCosts', { required: 'Operating costs is required', min: 0 })}
                  placeholder="50000"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Inefficiency Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="1"
                  {...register('inefficiencyRate', { required: 'Inefficiency rate is required', min: 0, max: 1 })}
                  placeholder="0.12"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                <p className="text-xs text-text-muted mt-1">Percentage of time/resources wasted (as decimal)</p>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ChartBarIcon className="h-12 w-12 text-brand-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Competitive Impact</h2>
              <p className="text-text-muted">How does delay affect your market position?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Current Market Share (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="1"
                  {...register('marketShare', { min: 0, max: 1 })}
                  placeholder="0.05"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                <p className="text-xs text-text-muted mt-1">Enter as decimal (e.g., 0.05 for 5%)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Competitor Advantage Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="1"
                  {...register('competitorAdvantage', { min: 0, max: 1 })}
                  placeholder="0.08"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                <p className="text-xs text-text-muted mt-1">Rate at which competitors gain advantage</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Customer Retention Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="1"
                  {...register('customerRetention', { min: 0, max: 1 })}
                  placeholder="0.85"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                <p className="text-xs text-text-muted mt-1">Current customer retention rate</p>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ClockIcon className="h-12 w-12 text-accent-warning mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Timeline & Context</h2>
              <p className="text-text-muted">When and how will changes be implemented?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Delay Period (months)
                </label>
                <input
                  type="number"
                  {...register('delayMonths', { required: 'Delay period is required', min: 1 })}
                  placeholder="6"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                <p className="text-xs text-text-muted mt-1">How long will implementation be delayed?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Implementation Time (months)
                </label>
                <input
                  type="number"
                  {...register('implementationTime', { required: 'Implementation time is required', min: 1 })}
                  placeholder="3"
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                <p className="text-xs text-text-muted mt-1">Time needed to fully implement solution</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Industry
                </label>
                <select
                  {...register('industry', { required: 'Industry is required' })}
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  {industryOptions.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Company Size
                </label>
                <select
                  {...register('companySize', { required: 'Company size is required' })}
                  className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="startup">Startup (1-10)</option>
                  <option value="small">Small (11-50)</option>
                  <option value="medium">Medium (51-200)</option>
                  <option value="large">Large (201-1000)</option>
                  <option value="enterprise">Enterprise (1000+)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Primary Pain Points
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {painPointOptions.map((pain) => (
                  <label key={pain} className="flex items-center">
                    <input
                      type="checkbox"
                      value={pain}
                      {...register('painPoints')}
                      className="rounded border-surface text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="ml-2 text-sm text-text-secondary">{pain}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Current Solution
              </label>
              <textarea
                {...register('currentSolution')}
                rows={3}
                placeholder="Describe your current approach or tools..."
                className="w-full border border-surface bg-background-elevated text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            {/* AI Enhancement Toggle */}
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-lg p-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="rounded border-surface text-brand-primary focus:ring-brand-primary"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <SparklesIcon className="h-5 w-5 text-brand-primary mr-2" />
                    <span className="text-sm font-medium text-text-primary">
                      AI-Enhanced Analysis
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Use AI to provide deeper insights and industry-specific recommendations
                  </p>
                </div>
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-text-muted mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-brand-primary h-2 rounded-full"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-black/80 backdrop-blur-lg border border-white/10 shadow-2xl shadow-black/50 rounded-xl p-8">
        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-surface">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-2 border border-surface rounded-lg text-text-secondary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 flex items-center space-x-2"
            >
              <span>Next</span>
              <CurrencyDollarIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Calculating...' : 'Calculate Cost Impact'}</span>
              {useAI && <SparklesIcon className="h-4 w-4" />}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}