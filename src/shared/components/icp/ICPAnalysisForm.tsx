'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useGenerateAIICP, useTrackAction } from '@/lib/hooks/useAPI';

interface ICPFormData {
  companySize: string;
  industry: string[];
  revenueRange: string;
  geography: string[];
  techStack: string[];
  painPoints: string[];
  currentSolution: string;
  budget: string;
  decisionMakers: string[];
  timeline: string;
  additionalContext: string;
}

interface ICPAnalysisFormProps {
  customerId: string;
  onSuccess: () => void;
}

const industryOptions = [
  'Technology', 'Healthcare', 'Financial Services', 'Manufacturing',
  'Retail', 'Education', 'Government', 'Non-profit', 'Real Estate',
  'Media & Entertainment', 'Transportation', 'Energy', 'Other'
];

const techStackOptions = [
  'Salesforce', 'HubSpot', 'Microsoft Dynamics', 'Pipedrive',
  'Zendesk', 'Slack', 'Microsoft Teams', 'AWS', 'Azure',
  'Google Cloud', 'Custom CRM', 'Legacy Systems', 'Other'
];

const painPointOptions = [
  'Lead qualification', 'Sales cycle too long', 'Low conversion rates',
  'Poor lead quality', 'Inefficient processes', 'Lack of visibility',
  'Manual tasks', 'Data silos', 'Integration challenges',
  'Scalability issues', 'Training requirements', 'Budget constraints'
];

export function ICPAnalysisForm({ customerId, onSuccess }: ICPAnalysisFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ICPFormData>();
  const generateAIICP = useGenerateAIICP();
  const trackAction = useTrackAction();

  const onSubmit = async (data: ICPFormData) => {
    try {
      await generateAIICP.mutateAsync({
        customerId,
        data: {
          ...data,
          analysisType: 'comprehensive',
          timestamp: new Date().toISOString(),
        }
      });

      // Track completion
      trackAction.mutate({
        customerId,
        action: 'icp_analysis_completed',
        metadata: { 
          step: 'form_submission',
          industries: data.industry,
          companySize: data.companySize 
        }
      });

      onSuccess();
    } catch (error) {
      console.error('Failed to generate ICP:', error);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      trackAction.mutate({
        customerId,
        action: 'icp_form_progress',
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
              <BuildingOfficeIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Profile</h2>
              <p className="text-gray-600">Tell us about your target companies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  {...register('companySize', { required: 'Company size is required' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select company size</option>
                  <option value="startup">Startup (1-10 employees)</option>
                  <option value="small">Small Business (11-50 employees)</option>
                  <option value="medium">Medium Business (51-200 employees)</option>
                  <option value="large">Large Enterprise (201-1000 employees)</option>
                  <option value="enterprise">Enterprise (1000+ employees)</option>
                </select>
                {errors.companySize && (
                  <p className="mt-1 text-sm text-red-600">{errors.companySize.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Range
                </label>
                <select
                  {...register('revenueRange', { required: 'Revenue range is required' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select revenue range</option>
                  <option value="under-1m">Under $1M</option>
                  <option value="1m-10m">$1M - $10M</option>
                  <option value="10m-50m">$10M - $50M</option>
                  <option value="50m-100m">$50M - $100M</option>
                  <option value="100m-500m">$100M - $500M</option>
                  <option value="500m-plus">$500M+</option>
                </select>
                {errors.revenueRange && (
                  <p className="mt-1 text-sm text-red-600">{errors.revenueRange.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industries (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industryOptions.map((industry) => (
                  <label key={industry} className="flex items-center">
                    <input
                      type="checkbox"
                      value={industry}
                      {...register('industry', { required: 'Select at least one industry' })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{industry}</span>
                  </label>
                ))}
              </div>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
              )}
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
              <GlobeAltIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Technology & Geography</h2>
              <p className="text-gray-600">Where and how do they operate?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geographic Markets
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'].map((region) => (
                  <label key={region} className="flex items-center">
                    <input
                      type="checkbox"
                      value={region}
                      {...register('geography')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{region}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Technology Stack
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {techStackOptions.map((tech) => (
                  <label key={tech} className="flex items-center">
                    <input
                      type="checkbox"
                      value={tech}
                      {...register('techStack')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tech}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Solution
              </label>
              <textarea
                {...register('currentSolution')}
                rows={3}
                placeholder="Describe their current approach or solution..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
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
              <UserGroupIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pain Points & Needs</h2>
              <p className="text-gray-600">What challenges are they facing?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Pain Points
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {painPointOptions.map((pain) => (
                  <label key={pain} className="flex items-center">
                    <input
                      type="checkbox"
                      value={pain}
                      {...register('painPoints')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{pain}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  {...register('budget')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="under-10k">Under $10K</option>
                  <option value="10k-50k">$10K - $50K</option>
                  <option value="50k-100k">$50K - $100K</option>
                  <option value="100k-500k">$100K - $500K</option>
                  <option value="500k-plus">$500K+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decision Timeline
                </label>
                <select
                  {...register('timeline')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (0-30 days)</option>
                  <option value="short">Short-term (1-3 months)</option>
                  <option value="medium">Medium-term (3-6 months)</option>
                  <option value="long">Long-term (6+ months)</option>
                </select>
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
              <CurrencyDollarIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Decision Makers & Context</h2>
              <p className="text-gray-600">Who makes the decisions and any additional context?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Decision Makers
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['CEO/Founder', 'CTO/Tech Lead', 'VP Sales', 'VP Marketing', 'CFO', 'Operations Manager', 'IT Manager', 'Department Head'].map((role) => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      value={role}
                      {...register('decisionMakers')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Context
              </label>
              <textarea
                {...register('additionalContext')}
                rows={4}
                placeholder="Any additional information about your ideal customers, market trends, competitive landscape, or specific requirements..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
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
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-indigo-600 h-2 rounded-full"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-8">
        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
            >
              <span>Next</span>
              <SparklesIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={generateAIICP.isPending}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <span>{generateAIICP.isPending ? 'Generating...' : 'Generate ICP Analysis'}</span>
              <SparklesIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}