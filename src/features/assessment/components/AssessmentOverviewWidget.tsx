import React from 'react'
import { ModernCard } from '@/src/shared/components/ui/ModernCard'

interface AssessmentResults {
  overallScore: number
  buyerScore: number
  techScore: number
}

interface GeneratedContent {
  buyerGap?: number
}

interface UserInfo {
  company: string
  email: string
  name?: string
  role?: string
}

interface ProductInfo {
  productName: string
  productDescription: string
  distinguishingFeature: string
  businessModel: string
  idealCustomerDescription: string
}

interface AssessmentData {
  productInfo?: ProductInfo
}

interface AssessmentOverviewWidgetProps {
  results: AssessmentResults
  generatedContent?: GeneratedContent
  userInfo: UserInfo
  assessmentData: AssessmentData
  className?: string
}

export function AssessmentOverviewWidget({ 
  results, 
  generatedContent,
  userInfo,
  assessmentData,
  className = '' 
}: AssessmentOverviewWidgetProps) {
  const getProfessionalLevel = (score: number) => {
    if (score >= 90) return 'Expert'
    if (score >= 80) return 'Advanced'
    if (score >= 70) return 'Professional'
    if (score >= 60) return 'Intermediate'
    return 'Beginner'
  }

  const getPercentile = (score: number) => {
    return Math.round(score)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <ModernCard className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-text-primary">Revenue Readiness Dashboard</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary">{results.overallScore}%</div>
            <div className="text-sm text-text-muted">Overall Revenue Readiness</div>
            <div className="text-xs text-text-subtle mt-1">Combined assessment score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-secondary">{results.buyerScore}%</div>
            <div className="text-sm text-text-muted">Customer Understanding</div>
            <div className="text-xs text-text-subtle mt-1">How well you know your buyers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-accent">{results.techScore}%</div>
            <div className="text-sm text-text-muted">Technical Value Translation</div>
            <div className="text-xs text-text-subtle mt-1">Converting features to business value</div>
          </div>
        </div>

        {generatedContent?.buyerGap !== undefined && (
          <div className="mb-6 p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-white">Buyer Understanding Gap Analysis</h3>
                <p className="text-sm text-gray-400">
                  Difference between your ideal customer description and market reality
                </p>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  generatedContent.buyerGap > 60 ? 'text-red-400' :
                  generatedContent.buyerGap > 40 ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {generatedContent.buyerGap}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {generatedContent.buyerGap > 60 ? 'Critical Gap' :
                   generatedContent.buyerGap > 40 ? 'Moderate Gap' :
                   'Well Aligned'}
                </div>
              </div>
            </div>
            {generatedContent.buyerGap > 40 && (
              <p className="text-sm text-gray-300 mt-3">
                💡 We've generated detailed ICP insights and buyer personas to help bridge this gap. 
                Review your personalized recommendations in the tabs above.
              </p>
            )}
          </div>
        )}
        
        <div className="border-t border-gray-700 pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Professional Level:</span>
            <span className="font-semibold text-blue-400">{getProfessionalLevel(results.overallScore)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Percentile:</span>
            <span className="font-semibold text-green-400">Top {100 - getPercentile(results.overallScore)}% of technical founders</span>
          </div>
        </div>
      </ModernCard>

      <ModernCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Assessment Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Company</div>
            <div className="text-white">{userInfo.company}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Email</div>
            <div className="text-white">{userInfo.email}</div>
          </div>
          {userInfo.name && (
            <div>
              <div className="text-sm text-gray-400 mb-1">Name</div>
              <div className="text-white">{userInfo.name}</div>
            </div>
          )}
          {userInfo.role && (
            <div>
              <div className="text-sm text-gray-400 mb-1">Role</div>
              <div className="text-white">{userInfo.role}</div>
            </div>
          )}
        </div>
      </ModernCard>

      {assessmentData.productInfo && (
        <ModernCard className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Product Information</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Product Name</div>
              <div className="text-white">{assessmentData.productInfo.productName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Description</div>
              <div className="text-white">{assessmentData.productInfo.productDescription}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Distinguishing Feature</div>
              <div className="text-white">{assessmentData.productInfo.distinguishingFeature}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Business Model</div>
              <div className="text-white">{assessmentData.productInfo.businessModel}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Ideal Customer Description</div>
              <div className="text-white">{assessmentData.productInfo.idealCustomerDescription}</div>
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
}

