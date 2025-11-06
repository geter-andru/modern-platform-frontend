'use client';

import React, { useState } from 'react';
import ModernCard from '@/app/components/ui/ModernCard';
import { Copy, ChevronDown, ChevronUp, Users, UserCheck, Download, ExternalLink } from 'lucide-react';
import type { TranslationResult, PersonaTranslation, CXOTranslation } from '@/src/lib/services/TechnicalTranslationService';

interface TechnicalTranslationPanelProps {
  technicalFeature: string;
  improvement: string;
  translations: TranslationResult;
  onCopy: (text: string, label: string) => void;
  onExportToBusinessCase?: () => void;
  className?: string;
}

export default function TechnicalTranslationPanel({ 
  technicalFeature,
  improvement,
  translations,
  onCopy,
  onExportToBusinessCase,
  className = ''
}: TechnicalTranslationPanelProps) {
  // State for expand/collapse
  const [expandedBuyers, setExpandedBuyers] = useState<Set<string>>(new Set());
  const [expandedCXOs, setExpandedCXOs] = useState<Set<string>>(new Set());

  const toggleBuyerExpansion = (personaId: string) => {
    const newExpanded = new Set(expandedBuyers);
    if (newExpanded.has(personaId)) {
      newExpanded.delete(personaId);
    } else {
      newExpanded.add(personaId);
    }
    setExpandedBuyers(newExpanded);
  };

  const toggleCXOExpansion = (stakeholder: string) => {
    const newExpanded = new Set(expandedCXOs);
    if (newExpanded.has(stakeholder)) {
      newExpanded.delete(stakeholder);
    } else {
      newExpanded.add(stakeholder);
    }
    setExpandedCXOs(newExpanded);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onCopy(text, label);
  };

  const renderPersonaCard = (translation: PersonaTranslation) => {
    const { persona, directMessaging } = translation;
    const isExpanded = expandedBuyers.has(persona.id);

    return (
      <ModernCard key={persona.id} className="mb-4">
        <div className="p-6">
          {/* Persona Header */}
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleBuyerExpansion(persona.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {persona.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{persona.name}</h3>
                <p className="text-sm text-slate-400">{persona.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                {persona.role}
              </span>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="mt-6 space-y-6">
              {/* Goals & Pain Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Goals</h4>
                  <ul className="space-y-1">
                    {persona.goals.map((goal, index) => (
                      <li key={index} className="text-sm text-slate-400">• {goal}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Pain Points</h4>
                  <ul className="space-y-1">
                    {persona.painPoints.map((pain, index) => (
                      <li key={index} className="text-sm text-slate-400">• {pain}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Direct Messaging */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-300">Direct Messaging for {persona.name}</h4>
                
                {/* Elevator Pitch */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-slate-300">Elevator Pitch</h5>
                    <button
                      onClick={() => copyToClipboard(directMessaging.elevator, `Elevator pitch for ${persona.name}`)}
                      className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{directMessaging.elevator}</p>
                </div>

                {/* Email Template */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-slate-300">Email Template</h5>
                    <button
                      onClick={() => copyToClipboard(directMessaging.email, `Email template for ${persona.name}`)}
                      className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {directMessaging.email}
                  </div>
                </div>

                {/* Pain Point Connection */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Pain Point Connection</h5>
                  <p className="text-sm text-slate-300 leading-relaxed">{directMessaging.painPointConnection}</p>
                </div>

                {/* Goal Alignment */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Goal Alignment</h5>
                  <p className="text-sm text-slate-300 leading-relaxed">{directMessaging.goalAlignment}</p>
                </div>

                {/* Key Metrics */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Key Metrics for {persona.role}</h5>
                  <div className="flex flex-wrap gap-2">
                    {directMessaging.keyMetrics.map((metric, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModernCard>
    );
  };

  const renderCXOCard = (translation: CXOTranslation) => {
    const { stakeholder, championEnablement } = translation;
    const isExpanded = expandedCXOs.has(stakeholder);

    return (
      <ModernCard key={stakeholder} className="mb-4">
        <div className="p-6">
          {/* CXO Header */}
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleCXOExpansion(stakeholder)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{stakeholder}</h3>
                <p className="text-sm text-slate-400">Champion Enablement</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                Internal Stakeholder
              </span>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="mt-6 space-y-4">
              {/* Talking Points */}
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-slate-300">Champion Talking Points</h5>
                  <button
                    onClick={() => copyToClipboard(championEnablement.talkingPoints, `Talking points for ${stakeholder}`)}
                    className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{championEnablement.talkingPoints}</p>
              </div>

              {/* Email Template */}
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-slate-300">Email Template</h5>
                  <button
                    onClick={() => copyToClipboard(championEnablement.emailTemplate, `Email template for ${stakeholder}`)}
                    className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {championEnablement.emailTemplate}
                </div>
              </div>

              {/* Objection Handling */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h5 className="text-sm font-medium text-slate-300 mb-2">Common Objections</h5>
                <div className="space-y-2">
                  {championEnablement.objectionHandling.map((objection, index) => (
                    <div key={index} className="text-sm text-slate-400">• {objection}</div>
                  ))}
                </div>
              </div>

              {/* Decision Criteria */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h5 className="text-sm font-medium text-slate-300 mb-2">Decision Criteria</h5>
                <div className="flex flex-wrap gap-2">
                  {championEnablement.decisionCriteria.map((criteria, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                      {criteria}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </ModernCard>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Technical Translation</h2>
          <p className="text-slate-400">
            {improvement} improvement in {technicalFeature}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm text-slate-400">Total Stakeholders</div>
            <div className="text-2xl font-bold text-white">{translations.stakeholderMap.totalStakeholders}</div>
          </div>
          {onExportToBusinessCase && (
            <button
              onClick={onExportToBusinessCase}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export to Business Case</span>
            </button>
          )}
        </div>
      </div>

      {/* Stakeholder Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Target Buyer Personas</h3>
          </div>
          <p className="text-sm text-slate-400 mb-2">
            Direct messaging for {translations.stakeholderMap.level1.length} buyer personas
          </p>
          <div className="flex flex-wrap gap-1">
            {translations.stakeholderMap.level1.map((name, index) => (
              <span key={index} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <UserCheck className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Internal Stakeholders</h3>
          </div>
          <p className="text-sm text-slate-400 mb-2">
            Champion enablement for {translations.stakeholderMap.level2.length} internal stakeholders
          </p>
          <div className="flex flex-wrap gap-1">
            {translations.stakeholderMap.level2.map((role, index) => (
              <span key={index} className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Level 1: Target Buyer Personas */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-400" />
          <span>For Your Target Buyer Personas</span>
        </h3>
        <p className="text-slate-400 mb-6">
          Direct messaging tailored to each persona's goals, pain points, and communication style.
        </p>
        {translations.targetBuyerTranslations.map(renderPersonaCard)}
      </div>

      {/* Level 2: Internal Stakeholders */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-green-400" />
          <span>For Their Internal Stakeholders</span>
        </h3>
        <p className="text-slate-400 mb-6">
          Champion enablement materials to help your personas build internal consensus.
        </p>
        {translations.internalStakeholderTranslations.map(renderCXOCard)}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-700">
        <div className="text-sm text-slate-400">
          Generated {new Date(translations.generatedAt).toLocaleDateString()} • 
          Industry: {translations.industry}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const allText = [
                ...translations.targetBuyerTranslations.map(t => t.directMessaging.elevator),
                ...translations.internalStakeholderTranslations.map(t => t.championEnablement.talkingPoints)
              ].join('\n\n');
              copyToClipboard(allText, 'All translations');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy All</span>
          </button>
        </div>
      </div>
    </div>
  );
}







