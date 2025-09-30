'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

interface ResourceTier {
  id: 1 | 2 | 3;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  isUnlocked: boolean;
  unlockRequirement?: string;
}

interface ResourceTierTabsProps {
  tiers: ResourceTier[];
  selectedTier: 1 | 2 | 3;
  onTierSelect: (tier: 1 | 2 | 3) => void;
}

export const ResourceTierTabs: React.FC<ResourceTierTabsProps> = ({
  tiers,
  selectedTier,
  onTierSelect
}) => {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tiers.map((tier) => {
            const isSelected = selectedTier === tier.id;
            const isUnlocked = tier.isUnlocked;
            
            return (
              <button
                key={tier.id}
                onClick={() => isUnlocked && onTierSelect(tier.id)}
                disabled={!isUnlocked}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isSelected
                    ? `${tier.color} ${tier.borderColor} border-b-2`
                    : isUnlocked
                    ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    : 'border-transparent text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <tier.icon className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${isSelected ? tier.color : isUnlocked ? 'text-gray-400 group-hover:text-gray-500' : 'text-gray-300'}
                `} />
                
                <div className="flex flex-col items-start">
                  <span className="flex items-center gap-2">
                    {tier.name}
                    {!isUnlocked && <Lock className="h-4 w-4 text-gray-400" />}
                    {isUnlocked && <Unlock className="h-4 w-4 text-green-500" />}
                  </span>
                  
                  {!isUnlocked && tier.unlockRequirement && (
                    <span className="text-xs text-gray-400 mt-1">
                      {tier.unlockRequirement}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Tier Description */}
      <div className="mt-4">
        <motion.div
          key={selectedTier}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-lg bg-gray-50 border"
        >
          <div className="flex items-center gap-3">
            {(() => {
              const tier = tiers.find(t => t.id === selectedTier);
              return tier ? (
                <>
                  <tier.icon className={`h-5 w-5 ${tier.color}`} />
                  <div>
                    <h3 className="font-medium text-gray-900">{tier.name} Resources</h3>
                    <p className="text-sm text-gray-600">{tier.description}</p>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
