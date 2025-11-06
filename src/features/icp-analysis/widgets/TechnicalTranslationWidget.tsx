'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { useCustomer, useCustomerICP } from '@/app/lib/hooks/useAPI';
import { useRequireAuth } from '@/app/lib/auth';
// Using alias path to match other working imports
import technicalTranslationService from '@/src/lib/services/TechnicalTranslationService';
import type { TranslationResult, BuyerPersona } from '@/src/lib/services/TechnicalTranslationService';

interface TechnicalTranslationWidgetProps {
  className?: string;
}

interface FormData {
  technicalMetric: string;
  improvement: string;
  industry: string;
  targetStakeholder: string;
}

export default function TechnicalTranslationWidget({
  className = ''
}: TechnicalTranslationWidgetProps) {
  const { user } = useRequireAuth();
  const { data: customer } = useCustomer(user?.id);
  const { data: icpData } = useCustomerICP(user?.id);

  // State management
  const [formData, setFormData] = useState<FormData>({
    technicalMetric: 'processing_speed',
    improvement: '10x faster processing',
    industry: 'healthcare',
    targetStakeholder: 'CFO'
  });
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Available options
  const technicalMetrics = [
    { id: 'processing_speed', label: 'Processing Speed' },
    { id: 'accuracy_improvement', label: 'Accuracy Improvement' },
    { id: 'cost_reduction', label: 'Cost Reduction' },
    { id: 'fraud_detection', label: 'Fraud Detection' },
    { id: 'tracking_accuracy', label: 'Tracking Accuracy' }
  ];

  const stakeholders = ['CFO', 'COO', 'CTO', 'CEO', 'CRO'];

  // Get available frameworks from service
  const frameworks = technicalTranslationService.getAvailableFrameworks();

  // Extract personas from ICP data or use fallback
  const getPersonas = (): BuyerPersona[] => {
    if (icpData?.data?.buyerPersonas && Array.isArray(icpData.data.buyerPersonas)) {
      return icpData.data.buyerPersonas.map((persona: any, index: number) => ({
        id: persona.id || `persona-${index}`,
        name: persona.name || persona.title || 'Target Customer',
        title: persona.title || 'Decision Maker',
        role: (persona.role || 'CEO') as BuyerPersona['role'],
        goals: persona.goals || ['Improve business performance'],
        painPoints: persona.pain_points || persona.painPoints || ['Operational inefficiencies'],
        values: persona.values || ['Efficiency', 'Growth'],
        decisionCriteria: persona.decision_criteria || persona.decisionCriteria || ['ROI', 'Time to value'],
        communicationStyle: persona.communication_style || persona.communicationStyle || 'Direct, results-focused'
      }));
    }

    // Fallback persona
    return [{
      id: 'fallback',
      name: customer?.data?.customerName || customer?.data?.company || 'Target Customer',
      title: 'CEO & Decision Maker',
      role: 'CEO',
      goals: ['Improve business performance', 'Drive growth'],
      painPoints: ['Operational inefficiencies', 'Limited resources'],
      values: ['Efficiency', 'Growth', 'Innovation'],
      decisionCriteria: ['ROI', 'Implementation risk', 'Business impact'],
      communicationStyle: 'Direct, results-focused'
    }];
  };

  // Generate translation on mount and when key inputs change
  useEffect(() => {
    if (formData.technicalMetric && formData.improvement) {
      generateTranslation();
    }
  }, [formData.technicalMetric, formData.improvement, formData.industry, formData.targetStakeholder]);

  // Update form field
  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Generate translation using service
  const generateTranslation = async () => {
    setIsTranslating(true);
    setError(null);

    try {
      // Brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 300));

      const personas = getPersonas();

      const result = technicalTranslationService.translateTechnicalMetric({
        technicalMetric: formData.technicalMetric,
        improvement: formData.improvement,
        industry: formData.industry,
        targetPersonas: personas,
        includeInternalStakeholders: true,
        customerContext: {
          name: customer?.data?.customerName || customer?.data?.company || 'Target Customer',
          industry: formData.industry
        }
      });

      setTranslation(result);
    } catch (err) {
      console.error('Translation error:', err);
      setError(err instanceof Error ? err.message : 'Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className={`bg-[#1a2332] border border-blue-800/30 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-blue-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">Technical Translator</h3>
          <p className="text-sm text-gray-400">Convert technical metrics into stakeholder-specific business language</p>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="space-y-4 mb-6">
        {/* Technical Metric */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Technical Metric
          </label>
          <select
            value={formData.technicalMetric}
            onChange={(e) => updateFormData('technicalMetric', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {technicalMetrics.map(metric => (
              <option key={metric.id} value={metric.id}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>

        {/* Improvement */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Improvement Description
          </label>
          <input
            type="text"
            value={formData.improvement}
            onChange={(e) => updateFormData('improvement', e.target.value)}
            placeholder="e.g., 10x faster processing"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Industry
          </label>
          <select
            value={formData.industry}
            onChange={(e) => updateFormData('industry', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {frameworks.map(framework => (
              <option key={framework.id} value={framework.id}>
                {framework.name}
              </option>
            ))}
          </select>
        </div>

        {/* Target Stakeholder */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Target Stakeholder
          </label>
          <select
            value={formData.targetStakeholder}
            onChange={(e) => updateFormData('targetStakeholder', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {stakeholders.map(stakeholder => (
              <option key={stakeholder} value={stakeholder}>
                {stakeholder}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateTranslation}
        disabled={isTranslating}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isTranslating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Translating...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Generate Translation
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Translation Results */}
      {translation && !isTranslating && (
        <div className="mt-6 space-y-4">
          {/* Business Translation */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-white">Business Translation</h4>
              <button
                onClick={() => copyToClipboard(translation.businessTranslation, 'business')}
                className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                title="Copy to clipboard"
              >
                {copiedField === 'business' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-300">{translation.businessTranslation}</p>
          </div>

          {/* Stakeholder-Specific Language */}
          {translation.targetBuyerTranslations && translation.targetBuyerTranslations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Target Buyer Translations</h4>
              {translation.targetBuyerTranslations.map((buyerTranslation, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="text-sm font-medium text-white">{buyerTranslation.persona.name}</h5>
                      <p className="text-xs text-gray-400">{buyerTranslation.persona.title}</p>
                    </div>
                  </div>

                  {/* Elevator Pitch */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-400">Elevator Pitch</span>
                      <button
                        onClick={() => copyToClipboard(buyerTranslation.directMessaging.elevator, `elevator-${index}`)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        {copiedField === `elevator-${index}` ? (
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-300">{buyerTranslation.directMessaging.elevator}</p>
                  </div>

                  {/* Email Template */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-400">Email Template</span>
                      <button
                        onClick={() => copyToClipboard(buyerTranslation.directMessaging.email, `email-${index}`)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        {copiedField === `email-${index}` ? (
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-300 whitespace-pre-wrap">{buyerTranslation.directMessaging.email}</p>
                  </div>

                  {/* Key Metrics */}
                  {buyerTranslation.directMessaging.keyMetrics && buyerTranslation.directMessaging.keyMetrics.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-400 block mb-1">Key Metrics</span>
                      <div className="flex flex-wrap gap-2">
                        {buyerTranslation.directMessaging.keyMetrics.map((metric, metricIndex) => (
                          <span key={metricIndex} className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Internal Stakeholder Translations */}
          {translation.internalStakeholderTranslations && translation.internalStakeholderTranslations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Internal Stakeholder Enablement</h4>
              {translation.internalStakeholderTranslations.map((stakeholderTranslation, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-white">{stakeholderTranslation.stakeholder}</h5>
                  </div>

                  {/* Talking Points */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-400">Talking Points</span>
                      <button
                        onClick={() => copyToClipboard(stakeholderTranslation.championEnablement.talkingPoints, `talking-${index}`)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        {copiedField === `talking-${index}` ? (
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-300">{stakeholderTranslation.championEnablement.talkingPoints}</p>
                  </div>

                  {/* Key Metrics */}
                  {stakeholderTranslation.championEnablement.keyMetrics && stakeholderTranslation.championEnablement.keyMetrics.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-400 block mb-1">Key Metrics</span>
                      <div className="flex flex-wrap gap-2">
                        {stakeholderTranslation.championEnablement.keyMetrics.map((metric, metricIndex) => (
                          <span key={metricIndex} className="px-2 py-1 bg-purple-900/20 text-purple-400 text-xs rounded">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!translation && !isTranslating && !error && (
        <div className="mt-6 text-center py-8">
          <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Click "Generate Translation" to convert your technical metrics into business language</p>
        </div>
      )}
    </div>
  );
}
