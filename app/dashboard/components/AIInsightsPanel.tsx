'use client';

import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, TrendingUp, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AIInsightsPanelProps {
  insights?: any;
  isLoading: boolean;
  customerId?: string;
}

export function AIInsightsPanel({ insights, isLoading, customerId }: AIInsightsPanelProps) {
  const router = useRouter();

  // TODO: Get real insight from AI/backend
  const primaryInsight = {
    capability: 'Value Communication',
    action: 'Create business case for Acme Corp',
    capabilityImpact: {
      current: 52,
      predicted: 60,
      gain: 8,
      description: 'Builds systematic ROI quantification methodology'
    },
    immediateBusinessImpact: {
      description: 'Acme deal +35% close probability',
      value: '$200K ARR opportunity'
    },
    predictiveImpact: {
      description: '+4% win rate in Q2 2025',
      value: '+$280K ARR predicted'
    },
    resourceImpact: {
      description: 'Creates reusable framework (library asset)',
      value: 'VP Sales enablement tool'
    },
    estimatedTime: '30 min',
    actionUrl: '/tools/business-case'
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse">
        <div className="h-40 bg-white/10 rounded"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/30">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-purple-300 mb-1 uppercase tracking-wide">
                Build {primaryInsight.capability} Capability
              </h3>
              <h2 className="text-2xl font-bold text-white">
                {primaryInsight.action}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/50 mb-1">Est. Time</div>
              <div className="text-sm font-medium text-white">
                {primaryInsight.estimatedTime}
              </div>
            </div>
          </div>

          {/* Capability Impact */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
            <div className="text-xs text-white/50 mb-2 uppercase tracking-wide">Capability Impact:</div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-bold text-blue-400">{primaryInsight.capabilityImpact.current}%</span>
              <span className="text-white/50">→</span>
              <span className="text-lg font-bold text-green-400">{primaryInsight.capabilityImpact.predicted}%</span>
              <span className="text-sm text-green-400">(+{primaryInsight.capabilityImpact.gain}%)</span>
            </div>
            <div className="text-sm text-white/70">
              {primaryInsight.capabilityImpact.description}
            </div>
          </div>

          {/* Triple Impact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* Immediate Business Impact */}
            <div className="bg-white/5 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Immediate Impact</span>
              </div>
              <div className="text-sm font-bold text-green-400 mb-1">
                {primaryInsight.immediateBusinessImpact.description}
              </div>
              <div className="text-xs text-white/70">
                {primaryInsight.immediateBusinessImpact.value}
              </div>
            </div>

            {/* Predictive Impact */}
            <div className="bg-white/5 border border-purple-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Predictive Impact</span>
              </div>
              <div className="text-sm font-bold text-purple-400 mb-1">
                {primaryInsight.predictiveImpact.description}
              </div>
              <div className="text-xs text-white/70">
                {primaryInsight.predictiveImpact.value}
              </div>
            </div>

            {/* Resource Impact */}
            <div className="bg-white/5 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-white/60 uppercase tracking-wide">Resource Impact</span>
              </div>
              <div className="text-sm font-bold text-blue-400 mb-1">
                {primaryInsight.resourceImpact.description}
              </div>
              <div className="text-xs text-white/70">
                {primaryInsight.resourceImpact.value}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(primaryInsight.actionUrl)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-200"
          >
            <span>Build Capability: {primaryInsight.action} →</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
