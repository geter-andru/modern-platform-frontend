import React from 'react'
import { ModernCard } from '@/src/shared/components/ui/ModernCard'

interface AssessmentRecommendationsWidgetProps {
  className?: string
}

export function AssessmentRecommendationsWidget({ 
  className = '' 
}: AssessmentRecommendationsWidgetProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <ModernCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Additional Resources</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-300">Resources Library</h4>
            <p className="text-sm text-gray-400">
              Access comprehensive guides, templates, and frameworks for revenue growth
            </p>
            <button 
              onClick={() => window.location.href = '/resources'}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Browse Resources →
            </button>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-300">Dashboard Analytics</h4>
            <p className="text-sm text-gray-400">
              Track your progress and performance metrics over time
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View Dashboard →
            </button>
          </div>
        </div>
      </ModernCard>
    </div>
  );
}

