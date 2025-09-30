import React from 'react'
import { ModernCard } from '@/src/shared/components/ui/ModernCard'

interface AssessmentResults {
  overallScore: number
  buyerScore: number
  techScore: number
  qualification: string
}

interface AssessmentInsightsWidgetProps {
  results: AssessmentResults
  className?: string
}

export function AssessmentInsightsWidget({ 
  results, 
  className = '' 
}: AssessmentInsightsWidgetProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <ModernCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Performance Analysis</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-300 mb-3">Score Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Overall Readiness</span>
                <span className="text-white font-medium">{results.overallScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Buyer Understanding</span>
                <span className="text-white font-medium">{results.buyerScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Technical Translation</span>
                <span className="text-white font-medium">{results.techScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Qualification Level</span>
                <span className="text-white font-medium">{results.qualification}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-3">Next Steps</h4>
            <div className="space-y-2">
              {results.buyerScore < 70 && (
                <div className="text-sm text-gray-300">
                  • Focus on customer discovery and buyer persona development
                </div>
              )}
              {results.techScore < 70 && (
                <div className="text-sm text-gray-300">
                  • Improve technical value translation and ROI communication
                </div>
              )}
              {results.overallScore < 70 && (
                <div className="text-sm text-gray-300">
                  • Use platform tools to systematically improve weak areas
                </div>
              )}
              {results.overallScore >= 70 && (
                <div className="text-sm text-gray-300">
                  • Leverage advanced features and optimize existing processes
                </div>
              )}
            </div>
          </div>
        </div>
      </ModernCard>

      <ModernCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Immediate Action Items</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <div className="text-white font-medium">Complete ICP Analysis</div>
              <div className="text-sm text-gray-400">
                Use your assessment insights to create a comprehensive Ideal Customer Profile
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
            <div>
              <div className="text-white font-medium">Build Business Case</div>
              <div className="text-sm text-gray-400">
                Quantify your value proposition with financial modeling and ROI calculations
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
            <div>
              <div className="text-white font-medium">Access Resources</div>
              <div className="text-sm text-gray-400">
                Explore templates, guides, and frameworks tailored to your assessment results
              </div>
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
}

